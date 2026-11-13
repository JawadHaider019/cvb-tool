import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { getDb, saveDb, recordAudit, verifyPassword, hashPassword } from './db.js';
import { isIpRateLimited, checkLoginLockout, recordFailedLogin, clearFailedLogins, signSessionToken, verifySessionToken, ADMIN_COOKIE_NAME } from './auth.js';
import { sendInsuranceEmails, sendContactEmail } from './email.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));

// Middleware to check admin authorization
function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : req.headers.cookie?.split(';')
    .find(c => c.trim().startsWith(`${ADMIN_COOKIE_NAME}=`))?.split('=')[1];

  if (!verifySessionToken(token)) {
    return res.status(401).json({ error: 'Nicht autorisiert' });
  }
  next();
}

// 1. Health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'selbstfahrervermietversicherung-backend',
    timestamp: new Date().toISOString(),
  });
});

// 2. Public Content
app.get('/api/content', (req, res) => {
  const db = getDb();
  res.json({
    sections: db.sections,
    insuranceConfig: db.insuranceConfig,
    faqs: db.faqs,
    generalSettings: db.generalSettings,
  });
});

// 3. Submit Insurance Request
app.post('/api/requests', async (req, res) => {
  const clientIp = req.headers['x-forwarded-for']?.toString().split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
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
  } = req.body;

  if (honeypot && typeof honeypot === 'string' && honeypot.trim() !== '') {
    return res.json({ success: true, message: 'Anfrage übermittelt' });
  }

  if (formOpenedAt && Date.now() - Number(formOpenedAt) < 3000) {
    return res.status(400).json({
      success: false,
      error: 'Sicherheitsprüfung: Das Formular wurde zu schnell abgesendet. Bitte versuche es erneut.',
    });
  }

  if (isIpRateLimited(clientIp, 5)) {
    return res.status(429).json({
      success: false,
      error: 'Sie haben zu viele Anfragen gesendet. Bitte versuchen Sie es in einer Stunde noch einmal.',
    });
  }

  const trimmedName = (name || '').trim();
  if (!trimmedName || trimmedName.length < 2) {
    return res.status(400).json({ success: false, error: 'Bitte geben Sie Ihren Namen ein.' });
  }

  const trimmedEmail = (email || '').trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
    return res.status(400).json({ success: false, error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' });
  }

  if (!privacyConsent) {
    return res.status(400).json({ success: false, error: 'Bitte stimmen Sie der Datenschutzerklärung zu.' });
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
    calculatedPrice: calculatedPrice !== null && calculatedPrice !== undefined ? Number(calculatedPrice) : null,
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
  recordAudit(db, 'REQUEST_CREATED', { id: newRequest.id, plan: newRequest.chosenPlan, email: newRequest.email });
  saveDb(db);

  res.json({
    success: true,
    requestId: newRequest.id,
    message: 'Vielen Dank! Ihre Versicherungsanfrage wurde erfolgreich übermittelt. Sie erhalten in Kürze eine Bestätigung per E-Mail.',
  });
});

// 4. Contact Form
app.post('/api/contact', async (req, res) => {
  const clientIp = req.headers['x-forwarded-for']?.toString().split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
  const { honeypot, formOpenedAt, name, email, telefon, nachricht, privacyConsent } = req.body;

  if (honeypot && typeof honeypot === 'string' && honeypot.trim() !== '') {
    return res.json({ success: true, message: 'Nachricht gesendet' });
  }

  if (formOpenedAt && Date.now() - Number(formOpenedAt) < 3000) {
    return res.status(400).json({ success: false, error: 'Sicherheitsprüfung: Bitte warten Sie einen Moment.' });
  }

  if (isIpRateLimited(clientIp, 5)) {
    return res.status(429).json({ success: false, error: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.' });
  }

  if (!name || String(name).trim().length < 2) {
    return res.status(400).json({ success: false, error: 'Bitte geben Sie Ihren Namen ein.' });
  }

  const trimmedEmail = String(email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return res.status(400).json({ success: false, error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' });
  }

  if (!nachricht || String(nachricht).trim().length < 5) {
    return res.status(400).json({ success: false, error: 'Bitte geben Sie eine kurze Nachricht ein.' });
  }

  if (!privacyConsent) {
    return res.status(400).json({ success: false, error: 'Bitte stimmen Sie der Datenschutzerklärung zu.' });
  }

  const db = getDb();
  const mailRes = await sendContactEmail(
    { name: String(name).trim(), email: trimmedEmail, telefon: String(telefon || '').trim(), nachricht: String(nachricht).trim() },
    db.generalSettings
  );

  if (!mailRes.success) {
    return res.status(500).json({ success: false, error: 'E-Mail-Versand fehlgeschlagen.' });
  }

  res.json({ success: true, message: 'Vielen Dank für Ihre Nachricht! Wir melden uns zeitnah bei Ihnen.' });
});

// 5. Admin Login & Logout
app.post('/api/admin/login', (req, res) => {
  const clientIp = req.headers['x-forwarded-for']?.toString().split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
  const lock = checkLoginLockout(clientIp);
  if (lock.locked) {
    return res.status(429).json({
      success: false,
      error: `Zu viele Fehlversuche. Bitte versuchen Sie es in ${Math.ceil((lock.retryAfterSeconds || 60) / 60)} Minuten erneut.`,
    });
  }

  const { password } = req.body || {};
  const db = getDb();
  if (!verifyPassword(String(password || ''), db.adminPasswordHash)) {
    recordFailedLogin(clientIp);
    return res.status(401).json({ success: false, error: 'Falsches Passwort.' });
  }

  clearFailedLogins(clientIp);
  const token = signSessionToken();
  recordAudit(db, 'ADMIN_LOGIN', { ip: clientIp });
  saveDb(db);

  res.cookie(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12 * 1000,
  });

  res.json({ success: true, token });
});

app.post('/api/admin/logout', (req, res) => {
  res.clearCookie(ADMIN_COOKIE_NAME);
  res.json({ success: true });
});

app.get('/api/admin/session', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : req.headers.cookie?.split(';')
    .find(c => c.trim().startsWith(`${ADMIN_COOKIE_NAME}=`))?.split('=')[1];
  res.json({ authenticated: verifySessionToken(token) });
});

app.get('/api/admin/data', requireAdmin, (req, res) => {
  const db = getDb();
  res.json({
    sections: db.sections,
    insuranceConfig: db.insuranceConfig,
    faqs: db.faqs,
    requests: db.requests,
    generalSettings: db.generalSettings,
    auditLog: db.auditLog.slice(0, 50),
  });
});

app.put('/api/admin/sections', requireAdmin, (req, res) => {
  const { sections } = req.body || {};
  if (!Array.isArray(sections)) return res.status(400).json({ error: 'Ungültig' });
  const db = getDb();
  db.sections = sections.map((s, idx) => ({ ...s, order: idx + 1 }));
  recordAudit(db, 'SECTIONS_UPDATED', { count: db.sections.length });
  saveDb(db);
  res.json({ success: true, sections: db.sections });
});

app.put('/api/admin/insurance-config', requireAdmin, (req, res) => {
  const { insuranceConfig } = req.body || {};
  if (!insuranceConfig?.cvbPlus || !insuranceConfig?.cvbPremium || !insuranceConfig?.cvbFlex) {
    return res.status(400).json({ error: 'Ungültige Konfiguration' });
  }
  const db = getDb();
  db.insuranceConfig = insuranceConfig;
  recordAudit(db, 'INSURANCE_CONFIG_UPDATED', { updatedAt: new Date().toISOString() });
  saveDb(db);
  res.json({ success: true, insuranceConfig: db.insuranceConfig });
});

app.put('/api/admin/faqs', requireAdmin, (req, res) => {
  const { faqs } = req.body || {};
  if (!Array.isArray(faqs)) return res.status(400).json({ error: 'Ungültig' });
  const db = getDb();
  db.faqs = faqs.map((f, i) => ({ ...f, sortOrder: i + 1 }));
  recordAudit(db, 'FAQS_UPDATED', { count: db.faqs.length });
  saveDb(db);
  res.json({ success: true, faqs: db.faqs });
});

app.patch('/api/admin/requests/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const idx = db.requests.findIndex(r => r.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Nicht gefunden' });
  if (req.body.status) db.requests[idx].status = req.body.status;
  if (typeof req.body.notes === 'string') db.requests[idx].notes = req.body.notes;
  recordAudit(db, 'REQUEST_UPDATED', { id });
  saveDb(db);
  res.json({ success: true, request: db.requests[idx] });
});

app.delete('/api/admin/requests/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  db.requests = db.requests.filter(r => r.id !== id);
  recordAudit(db, 'REQUEST_DELETED', { id });
  saveDb(db);
  res.json({ success: true });
});

app.get('/api/admin/requests/export', requireAdmin, (req, res) => {
  const db = getDb();
  const headers = ['ID','Datum','Status','Tarif','Preis','Name','Email','Telefon','Fahrzeug','Kaufpreis'];
  const rows = db.requests.map(r => [
    r.id, r.createdAt, r.status, r.chosenPlan, r.calculatedPrice || '', r.name, r.email, r.telefon || '', r.vehicleType, r.kaufpreis
  ]);
  const csv = '\uFEFF' + [headers, ...rows].map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(';')).join('\r\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="versicherungsanfragen.csv"');
  res.send(csv);
});

app.put('/api/admin/settings', requireAdmin, (req, res) => {
  const db = getDb();
  if (req.body.generalSettings) {
    db.generalSettings = { ...db.generalSettings, ...req.body.generalSettings };
  }
  if (req.body.newPassword) {
    if (!verifyPassword(req.body.currentPassword, db.adminPasswordHash)) {
      return res.status(400).json({ error: 'Aktuelles Passwort falsch' });
    }
    db.adminPasswordHash = hashPassword(req.body.newPassword);
  }
  saveDb(db);
  res.json({ success: true, generalSettings: db.generalSettings });
});

app.listen(PORT, () => {
  console.log(`Backend läuft auf http://localhost:${PORT}`);
});

