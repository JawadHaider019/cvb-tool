import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db.js';
import { isIpRateLimited } from '@/lib/auth.js';
import { sendContactEmail } from '@/lib/email.js';

export async function POST(req) {
  const clientIp =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json(
      { success: false, error: 'Ungültige Anfrage-Daten.' },
      { status: 400 }
    );
  }

  const { honeypot, formOpenedAt, name, email, telefon, nachricht, privacyConsent } =
    body;

  if (honeypot && typeof honeypot === 'string' && honeypot.trim() !== '') {
    return NextResponse.json({ success: true, message: 'Nachricht gesendet' });
  }

  if (formOpenedAt && Date.now() - Number(formOpenedAt) < 3000) {
    return NextResponse.json(
      {
        success: false,
        error: 'Sicherheitsprüfung: Bitte warten Sie einen Moment.',
      },
      { status: 400 }
    );
  }

  if (isIpRateLimited(clientIp, 5)) {
    return NextResponse.json(
      {
        success: false,
        error: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.',
      },
      { status: 429 }
    );
  }

  if (!name || String(name).trim().length < 2) {
    return NextResponse.json(
      { success: false, error: 'Bitte geben Sie Ihren Namen ein.' },
      { status: 400 }
    );
  }

  const trimmedEmail = String(email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return NextResponse.json(
      { success: false, error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' },
      { status: 400 }
    );
  }

  if (!nachricht || String(nachricht).trim().length < 5) {
    return NextResponse.json(
      { success: false, error: 'Bitte geben Sie eine kurze Nachricht ein.' },
      { status: 400 }
    );
  }

  if (!privacyConsent) {
    return NextResponse.json(
      { success: false, error: 'Bitte stimmen Sie der Datenschutzerklärung zu.' },
      { status: 400 }
    );
  }

  const db = getDb();
  const res = await sendContactEmail(
    {
      name: String(name).trim(),
      email: trimmedEmail,
      telefon: String(telefon || '').trim(),
      nachricht: String(nachricht).trim(),
    },
    db.generalSettings
  );

  if (!res.success) {
    return NextResponse.json(
      {
        success: false,
        error: 'E-Mail-Versand fehlgeschlagen. Bitte versuchen Sie es später erneut.',
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Vielen Dank für Ihre Nachricht! Wir melden uns zeitnah bei Ihnen.',
  });
}

