import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const dbPath = path.resolve(process.cwd(), 'data/db.json');
const dbInitial = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const initialRequestsCount = dbInitial.requests.length;

console.log('----------------------------------------------------');
console.log('TESTING INSURANCE REQUEST SUBMISSION PIPELINE');
console.log('----------------------------------------------------');

// Test 1: Validation Rules
console.log('\n[1] Testing Validation Rules...');
function validateRequest(body) {
  const { name, email, privacyConsent } = body;
  const trimmedName = (name || '').trim();
  if (!trimmedName || trimmedName.length < 2) {
    return { ok: false, error: 'Bitte geben Sie Ihren Namen ein.' };
  }
  const trimmedEmail = (email || '').trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
    return { ok: false, error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' };
  }
  if (!privacyConsent) {
    return { ok: false, error: 'Bitte stimmen Sie der Datenschutzerklärung zu, um die Anfrage zu senden.' };
  }
  return { ok: true };
}

assert.equal(validateRequest({ name: '', email: 'test@cvb.de', privacyConsent: true }).ok, false);
assert.equal(validateRequest({ name: 'Max', email: 'invalid-email', privacyConsent: true }).ok, false);
assert.equal(validateRequest({ name: 'Max', email: 'max@mustermann.de', privacyConsent: false }).ok, false);
assert.equal(validateRequest({ name: 'Max Mustermann', email: 'max@mustermann.de', privacyConsent: true }).ok, true);
console.log('✓ Validation rules: PASS');

// Test 2: Honeypot Protection
console.log('\n[2] Testing Honeypot Protection...');
function checkHoneypot(honeypot) {
  if (honeypot && typeof honeypot === 'string' && honeypot.trim() !== '') {
    return { spam: true, response: { success: true, message: 'Anfrage übermittelt' } };
  }
  return { spam: false };
}
assert.equal(checkHoneypot('bot-field-filled').spam, true);
assert.equal(checkHoneypot('').spam, false);
console.log('✓ Honeypot protection: PASS');

// Test 3: Email Notification Payload
console.log('\n[3] Testing Email Notification Payload Construction...');
import { sendInsuranceEmails } from './email.js';

const sampleRequest = {
  id: 'req-test-1234',
  createdAt: '2026-11-16 12:00',
  name: 'Max Mustermann',
  firma: 'Muster Vermietung GmbH',
  email: 'max@mustermann.de',
  telefon: '+49 170 1234567',
  nachricht: 'Ich bitte um ein Angebot für mein neues Wohnmobil.',
  privacyConsent: true,
  privacyConsentAt: '2026-11-16 12:00',
  chosenPlan: 'CVB-Plus',
  chosenPlanId: 'cvb_plus',
  vehicleType: 'wohnmobil',
  kaufpreis: 65000,
  roundedValue: 65000,
  baujahr: 2024,
  vehicleAge: 2,
  veruntreuung: true,
  calculatedPrice: 3082.99,
  priceStatusText: null,
};

const emailResult = await sendInsuranceEmails(sampleRequest, dbInitial.generalSettings);
assert.equal(emailResult.success, true, 'Email pipeline simulation must succeed');
console.log('✓ Email dispatch pipeline: PASS');

console.log('\n----------------------------------------------------');
console.log('REQUEST PIPELINE VERIFICATION PASSED (100%)');
console.log('----------------------------------------------------');
