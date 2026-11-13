import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth.js';
import { getDb, saveDb, recordAudit, hashPassword, verifyPassword } from '@/lib/db.js';

export async function PUT(req) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const db = getDb();

  if (body?.generalSettings) {
    db.generalSettings = {
      ...db.generalSettings,
      ...body.generalSettings,
    };
    recordAudit(db, 'SETTINGS_UPDATED', {
      recipientEmail: db.generalSettings.recipientEmail,
    });
  }

  if (body?.newPassword) {
    const currentPassword = String(body.currentPassword || '');
    const newPassword = String(body.newPassword || '');
    if (!verifyPassword(currentPassword, db.adminPasswordHash)) {
      return NextResponse.json(
        { error: 'Das aktuelle Passwort ist nicht korrekt.' },
        { status: 400 }
      );
    }
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Das neue Passwort muss mindestens 8 Zeichen lang sein.' },
        { status: 400 }
      );
    }
    db.adminPasswordHash = hashPassword(newPassword);
    recordAudit(db, 'ADMIN_PASSWORD_CHANGED', {});
  }

  saveDb(db);
  return NextResponse.json({
    success: true,
    generalSettings: db.generalSettings,
  });
}

