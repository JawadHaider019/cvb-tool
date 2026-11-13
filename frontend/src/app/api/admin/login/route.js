import { NextResponse } from 'next/server';
import { getDb, saveDb, recordAudit, verifyPassword } from '@/lib/db.js';
import {
  ADMIN_COOKIE_NAME,
  checkLoginLockout,
  clearFailedLogins,
  recordFailedLogin,
  signSessionToken,
} from '@/lib/auth.js';

export async function POST(req) {
  const clientIp =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';

  const lock = checkLoginLockout(clientIp);
  if (lock.locked) {
    return NextResponse.json(
      {
        success: false,
        error: `Zu viele Fehlversuche. Bitte versuchen Sie es in ${Math.ceil(
          (lock.retryAfterSeconds || 60) / 60
        )} Minuten erneut.`,
      },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const password = String(body?.password || '');

  const db = getDb();
  if (!verifyPassword(password, db.adminPasswordHash)) {
    recordFailedLogin(clientIp);
    return NextResponse.json(
      { success: false, error: 'Falsches Passwort.' },
      { status: 401 }
    );
  }

  clearFailedLogins(clientIp);
  const token = signSessionToken();
  recordAudit(db, 'ADMIN_LOGIN', { ip: clientIp });
  saveDb(db);

  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  });
  return res;
}

