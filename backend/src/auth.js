import crypto from 'crypto';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE_NAME = 'cvb_admin_session';

const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  'cvb-selbstfahrer-session-secret-change-in-prod-2027';

// In-memory rate limiting & brute-force protection
const ipRequestsMap = new Map();
const adminFailedAttemptsMap = new Map();

export function isIpRateLimited(ip, maxPerHour = 5) {
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;
  const timestamps = (ipRequestsMap.get(ip) || []).filter(
    (t) => t > oneHourAgo
  );

  if (timestamps.length >= maxPerHour) {
    ipRequestsMap.set(ip, timestamps);
    return true;
  }

  timestamps.push(now);
  ipRequestsMap.set(ip, timestamps);
  return false;
}

export function checkLoginLockout(ip) {
  const entry = adminFailedAttemptsMap.get(ip);
  if (!entry || !entry.lockUntil) return { locked: false };
  const now = Date.now();
  if (now < entry.lockUntil) {
    return {
      locked: true,
      retryAfterSeconds: Math.ceil((entry.lockUntil - now) / 1000),
    };
  }
  adminFailedAttemptsMap.delete(ip);
  return { locked: false };
}

export function recordFailedLogin(ip) {
  const entry = adminFailedAttemptsMap.get(ip) || { count: 0, lockUntil: null };
  entry.count += 1;
  if (entry.count >= 5) {
    entry.lockUntil = Date.now() + 15 * 60 * 1000; // 15 min lock
  }
  adminFailedAttemptsMap.set(ip, entry);
}

export function clearFailedLogins(ip) {
  adminFailedAttemptsMap.delete(ip);
}

export function signSessionToken() {
  const expiresAt = Date.now() + 1000 * 60 * 60 * 12; // 12 hours
  const payload = `${expiresAt}.${crypto.randomBytes(16).toString('hex')}`;
  const sig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('hex');
  return `${payload}.${sig}`;
}

export function verifySessionToken(token) {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [expiresAtStr, nonce, sig] = parts;
  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  const payload = `${expiresAtStr}.${nonce}`;
  const expectedSig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('hex');

  const sigBuf = Buffer.from(sig, 'hex');
  const expectedBuf = Buffer.from(expectedSig, 'hex');
  if (sigBuf.length !== expectedBuf.length) return false;
  return crypto.timingSafeEqual(sigBuf, expectedBuf);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

