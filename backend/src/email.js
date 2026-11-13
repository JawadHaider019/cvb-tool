import nodemailer from 'nodemailer';
import { formatEuroDE, formatEuroIntDE } from '@/lib/calculator.js';

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);

  if (!host || !user) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendInsuranceEmails(request, settings) {
  const transporter = createTransporter();
  const senderAddress =
    process.env.SMTP_FROM || 'no-reply@selbstfahrervermietversicherung.online';
  const fromHeader = `"${settings.senderName || 'SelbstfahrerVermietversicherung.online'}" <${senderAddress}>`;

  const vehicleLabel =
    request.vehicleType === 'wohnmobil' ? 'Wohnmobil' : 'Wohnwagen';
  const priceDisplay =
    request.calculatedPrice !== null
      ? `${formatEuroDE(request.calculatedPrice)} (Jahresbeitrag inkl. Versicherungssteuer)`
      : request.priceStatusText || 'Preis auf Anfrage';

  const adminSubject = `Neue Versicherungsanfrage: ${request.chosenPlan} – ${request.name} (${vehicleLabel})`;

  const adminText = [
    `Neue Versicherungsanfrage über ${settings.senderName}`,
    ``,
    `--- Gewählter Tarif & Berechnung ---`,
    `Tarif: ${request.chosenPlan}`,
    `Berechneter Preis: ${priceDisplay}`,
    `Fahrzeugart: ${vehicleLabel}`,
    `Kaufpreis neu, brutto: ${formatEuroIntDE(request.kaufpreis)}`,
    `Gerundeter Fahrzeugwert (V): ${formatEuroIntDE(request.roundedValue)}`,
    `Baujahr: ${request.baujahr} (Fahrzeugalter: ${request.vehicleAge} Jahre)`,
    `Veruntreuungsschutz: ${request.veruntreuung ? 'Ja' : 'Nein'}`,
    ``,
    `--- Kontaktdaten des Interessenten ---`,
    `Name: ${request.name}`,
    `Firma: ${request.firma || '-'}`,
    `E-Mail: ${request.email}`,
    `Telefon: ${request.telefon || '-'}`,
    `Nachricht: ${request.nachricht || '-'}`,
    ``,
    `Datenschutz bestätigt: Ja (${request.privacyConsentAt})`,
    `Eingegangen am: ${request.createdAt}`,
    `Anfrage-ID: ${request.id}`,
  ].join('\n');

  const visitorSubject = `Ihre Versicherungsanfrage bei ${settings.senderName}`;
  const visitorText = [
    `Guten Tag ${request.name},`,
    ``,
    `vielen Dank für Ihre Versicherungsanfrage über SelbstfahrerVermietversicherung.online.`,
    `Wir haben Ihre Anfrage zu folgendem Tarif erhalten und melden uns kurzfristig persönlich bei Ihnen:`,
    ``,
    `Tarif: ${request.chosenPlan}`,
    `Fahrzeugart: ${vehicleLabel}`,
    `Kaufpreis (brutto): ${formatEuroIntDE(request.kaufpreis)}`,
    `Baujahr: ${request.baujahr}`,
    `Veruntreuungsschutz: ${request.veruntreuung ? 'Ja' : 'Nein'}`,
    `Kalkulierter Jahresbeitrag: ${priceDisplay}`,
    ``,
    `Bei Rückfragen erreichen Sie uns jederzeit unter ${settings.contactEmail} oder ${settings.contactPhone}.`,
    ``,
    `Mit freundlichen Grüßen`,
    `Ihr Team von SelbstfahrerVermietversicherung.online`,
    `Caravan-Vermieter-Bund (CVB)`,
  ].join('\n');

  if (!transporter) {
    console.log(
      `[SMTP Simulation] E-Mail an ${settings.recipientEmail} | Betreff: ${adminSubject}`
    );
    console.log(adminText);
    console.log(
      `[SMTP Simulation] Bestätigung an ${request.email} | Betreff: ${visitorSubject}`
    );
    return { success: true };
  }

  try {
    await transporter.sendMail({
      from: fromHeader,
      to: settings.recipientEmail,
      replyTo: request.email,
      subject: adminSubject,
      text: adminText,
    });

    await transporter.sendMail({
      from: fromHeader,
      to: request.email,
      subject: visitorSubject,
      text: visitorText,
    });

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unbekannter E-Mail-Fehler';
    console.error('[SMTP Error]', message);
    return { success: false, error: message };
  }
}

export async function sendContactEmail(payload, settings) {
  const transporter = createTransporter();
  const senderAddress =
    process.env.SMTP_FROM || 'no-reply@selbstfahrervermietversicherung.online';
  const fromHeader = `"${settings.senderName || 'SelbstfahrerVermietversicherung.online'}" <${senderAddress}>`;

  const subject = `Neue Kontaktanfrage von ${payload.name}`;
  const text = [
    `Neue allgemeine Kontaktanfrage über ${settings.senderName}`,
    ``,
    `Name: ${payload.name}`,
    `E-Mail: ${payload.email}`,
    `Telefon: ${payload.telefon || '-'}`,
    ``,
    `Nachricht:`,
    payload.nachricht,
  ].join('\n');

  if (!transporter) {
    console.log(`[SMTP Simulation] Kontakt-E-Mail an ${settings.recipientEmail}`);
    console.log(text);
    return { success: true };
  }

  try {
    await transporter.sendMail({
      from: fromHeader,
      to: settings.recipientEmail,
      replyTo: payload.email,
      subject,
      text,
    });
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unbekannter E-Mail-Fehler';
    return { success: false, error: message };
  }
}

