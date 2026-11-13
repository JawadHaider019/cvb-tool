import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getDb, saveDb, recordAudit } from '@/lib/db.js';
import { isIpRateLimited } from '@/lib/auth.js';
import { sendInsuranceEmails } from '@/lib/email.js';

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

  const {
    honeypot,
    formOpenedAt,
    name,
    firma,
    email,
    telefon,
    nachricht,
    privacyConsent,
    chosenPlan,
    chosenPlanId,
    vehicleType,
    kaufpreis,
    roundedValue,
    baujahr,
    vehicleAge,
    veruntreuung,
    calculatedPrice,
    priceStatusText,
  } = body;

  // 1. Honeypot check
  if (honeypot && typeof honeypot === 'string' && honeypot.trim() !== '') {
    return NextResponse.json({
      success: true,
      message: 'Anfrage übermittelt',
    });
  }

  // 2. Minimum form fill time (3s)
  if (formOpenedAt && Date.now() - Number(formOpenedAt) < 3000) {
    return NextResponse.json(
      {
        success: false,
        error:
          'Sicherheitsprüfung: Das Formular wurde zu schnell abgesendet. Bitte versuche es erneut.',
      },
      { status: 400 }
    );
  }

  // 3. IP rate limit (max 5/hour)
  if (isIpRateLimited(clientIp, 5)) {
    return NextResponse.json(
      {
        success: false,
        error:
          'Sie haben zu viele Anfragen gesendet. Bitte versuchen Sie es in einer Stunde noch einmal.',
      },
      { status: 429 }
    );
  }

  // 4. Validation
  const trimmedName = (name || '').trim();
  if (!trimmedName || trimmedName.length < 2) {
    return NextResponse.json(
      { success: false, error: 'Bitte geben Sie Ihren Namen ein.' },
      { status: 400 }
    );
  }

  const trimmedEmail = (email || '').trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
    return NextResponse.json(
      {
        success: false,
        error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
      },
      { status: 400 }
    );
  }

  if (!privacyConsent) {
    return NextResponse.json(
      {
        success: false,
        error:
          'Bitte stimmen Sie der Datenschutzerklärung zu, um die Anfrage zu senden.',
      },
      { status: 400 }
    );
  }

  const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
  const newRequest = {
    id: `req-${crypto.randomBytes(4).toString('hex')}`,
    createdAt: nowStr,
    status: 'neu',
    notes: '',
    name: trimmedName,
    firma: (firma || '').trim(),
    email: trimmedEmail,
    telefon: (telefon || '').trim(),
    nachricht: (nachricht || '').trim(),
    privacyConsent: true,
    privacyConsentAt: nowStr,
    chosenPlan: String(chosenPlan || 'Individuelle Anfrage'),
    chosenPlanId: chosenPlanId || 'allgemein',
    vehicleType: vehicleType === 'wohnwagen' ? 'wohnwagen' : 'wohnmobil',
    kaufpreis: Number(kaufpreis) || 0,
    roundedValue: Number(roundedValue) || 0,
    baujahr: Number(baujahr) || new Date().getFullYear(),
    vehicleAge: Number(vehicleAge) || 0,
    veruntreuung: Boolean(veruntreuung),
    calculatedPrice:
      calculatedPrice !== null && calculatedPrice !== undefined
        ? Number(calculatedPrice)
        : null,
    priceStatusText: priceStatusText ? String(priceStatusText) : null,
    emailSent: false,
  };

  const db = getDb();
  const emailRes = await sendInsuranceEmails(newRequest, db.generalSettings);
  newRequest.emailSent = emailRes.success;
  if (!emailRes.success) {
    newRequest.emailError = emailRes.error;
  }

  db.requests.unshift(newRequest);
  recordAudit(db, 'REQUEST_CREATED', {
    id: newRequest.id,
    plan: newRequest.chosenPlan,
    email: newRequest.email,
  });
  saveDb(db);

  return NextResponse.json({
    success: true,
    requestId: newRequest.id,
    message:
      'Vielen Dank! Ihre Versicherungsanfrage wurde erfolgreich übermittelt. Sie erhalten in Kürze eine Bestätigung per E-Mail.',
  });
}

