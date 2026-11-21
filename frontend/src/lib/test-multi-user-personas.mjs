import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { calculateInsurancePlans } from './calculator.js';

const BASE_URL = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
const CURRENT_YEAR = 2026;

const frontendDbPath = path.resolve(process.cwd(), 'data/db.json');
const backendDbPath = path.resolve(process.cwd(), '../backend/data/db.json');

const originalFrontendDb = fs.readFileSync(frontendDbPath, 'utf8');
const originalBackendDb = fs.existsSync(backendDbPath)
  ? fs.readFileSync(backendDbPath, 'utf8')
  : null;

function readFrontendDb() {
  return JSON.parse(fs.readFileSync(frontendDbPath, 'utf8'));
}

async function postJson(endpoint, body, ip) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': ip,
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  return { status: res.status, json };
}

try {
  console.log('====================================================');
  console.log('MULTI-USER PERSONA END-TO-END VERIFICATION');
  console.log(`Target Server: ${BASE_URL}`);
  console.log('====================================================');

  // Fetch live config via public GET /api/content
  const contentRes = await fetch(`${BASE_URL}/api/content`);
  assert.equal(contentRes.status, 200, 'GET /api/content should return 200');
  const liveContent = await contentRes.json();
  const config = liveContent.insuranceConfig;
  const calcSection = liveContent.sections.find((s) => s.id === 'calculator');
  assert.equal(calcSection?.visible, true, 'Calculator section must be visible on site');

  const initialDb = readFrontendDb();
  const initialCount = initialDb.requests.length;

  // ------------------------------------------------------------------
  // PERSONA 1: Einsteiger mit 1 neuem Wohnmobil (67.450 € -> 68.000 €)
  // ------------------------------------------------------------------
  console.log('\n[Persona 1] Einsteiger mit 1 neuem Wohnmobil (67.450 €)...');
  const p1Calc = calculateInsurancePlans(
    {
      vehicleType: 'wohnmobil',
      kaufpreis: 67450,
      baujahr: 2025,
      veruntreuung: true,
      currentYear: CURRENT_YEAR,
    },
    config
  );
  assert.equal(p1Calc.roundedValue, 68000);
  assert.equal(p1Calc.plans[0].price, 3082.99, 'P1 CVB-Plus = 3.082,99 €');
  assert.equal(p1Calc.plans[0].isRecommended, true, 'P1 CVB-Plus must be Empfehlung');
  assert.equal(p1Calc.plans[1].price, 3250.0, 'P1 CVB-Premium = 3.250,00 €');
  assert.equal(p1Calc.plans[2].price, 3350.25, 'P1 CVB-Flex = 3.350,25 €');

  const p1Req = await postJson(
    '/api/requests',
    {
      honeypot: '',
      formOpenedAt: Date.now() - 5000,
      name: 'Anna Einsteiger',
      firma: '',
      email: 'anna.einsteiger@example.de',
      telefon: '+49 170 1111111',
      nachricht: 'Mein erstes Miet-Wohnmobil.',
      privacyConsent: true,
      chosenPlan: p1Calc.plans[0].name,
      chosenPlanId: p1Calc.plans[0].planId,
      vehicleType: 'wohnmobil',
      kaufpreis: 67450,
      roundedValue: p1Calc.roundedValue,
      baujahr: 2025,
      vehicleAge: p1Calc.vehicleAge,
      veruntreuung: true,
      calculatedPrice: p1Calc.plans[0].price,
      priceStatusText: p1Calc.plans[0].statusText,
    },
    '198.51.100.10'
  );
  assert.equal(p1Req.status, 200);
  assert.equal(p1Req.json.success, true);
  console.log('✓ Persona 1 PASSED (3.082,99 € recommended & persisted)');

  // ------------------------------------------------------------------
  // PERSONA 2: Erfahrener Vermieter mit Preisoptimierung (58.200 € -> 59.000 €)
  // ------------------------------------------------------------------
  console.log('\n[Persona 2] Erfahrener Vermieter mit Preisoptimierung (58.200 €)...');
  const p2NoVer = calculateInsurancePlans(
    {
      vehicleType: 'wohnmobil',
      kaufpreis: 58200,
      baujahr: 2023,
      veruntreuung: false,
      currentYear: CURRENT_YEAR,
    },
    config
  );
  assert.equal(p2NoVer.roundedValue, 59000);
  assert.equal(p2NoVer.plans[2].price, 2643.0, 'P2 Flex ohne Veruntreuung = 2.643,00 €');
  assert.equal(p2NoVer.plans[2].isRecommended, true, 'P2 Flex ohne Veruntreuung recommended');
  assert.equal(p2NoVer.plans[0].price, 3082.99);
  assert.equal(p2NoVer.plans[1].price, 3250.0);

  const p2WithVer = calculateInsurancePlans(
    {
      vehicleType: 'wohnmobil',
      kaufpreis: 58200,
      baujahr: 2023,
      veruntreuung: true,
      currentYear: CURRENT_YEAR,
    },
    config
  );
  assert.equal(p2WithVer.plans[2].price, 3000.0, 'P2 Flex mit Veruntreuung = 3.000,00 €');
  assert.equal(p2WithVer.plans[2].isRecommended, true, 'P2 Flex mit Veruntreuung still cheapest');
  assert.equal(p2WithVer.plans[0].price, 3082.99, 'Plus unchanged when toggling Veruntreuung');
  assert.equal(p2WithVer.plans[1].price, 3250.0, 'Premium unchanged when toggling Veruntreuung');

  const p2Req = await postJson(
    '/api/requests',
    {
      honeypot: '',
      formOpenedAt: Date.now() - 5000,
      name: 'Bernd Optimierer',
      firma: 'Alpen Camper Vermietung',
      email: 'bernd.optimierer@example.de',
      telefon: '',
      nachricht: 'Bitte Angebot für CVB-Flex mit Veruntreuung.',
      privacyConsent: true,
      chosenPlan: p2WithVer.plans[2].name,
      chosenPlanId: p2WithVer.plans[2].planId,
      vehicleType: 'wohnmobil',
      kaufpreis: 58200,
      roundedValue: p2WithVer.roundedValue,
      baujahr: 2023,
      vehicleAge: p2WithVer.vehicleAge,
      veruntreuung: true,
      calculatedPrice: p2WithVer.plans[2].price,
      priceStatusText: p2WithVer.plans[2].statusText,
    },
    '198.51.100.20'
  );
  assert.equal(p2Req.status, 200);
  assert.equal(p2Req.json.success, true);
  console.log('✓ Persona 2 PASSED (Flex toggle 2.643 € <-> 3.000 € & persisted)');

  // ------------------------------------------------------------------
  // PERSONA 3: Luxus-Wohnmobil-Vermieter (84.900 € -> 85.000 € mit Veruntreuung)
  // ------------------------------------------------------------------
  console.log('\n[Persona 3] Luxus-Wohnmobil-Vermieter (84.900 € mit Veruntreuung)...');
  const p3Calc = calculateInsurancePlans(
    {
      vehicleType: 'wohnmobil',
      kaufpreis: 84900,
      baujahr: 2026,
      veruntreuung: true,
      currentYear: CURRENT_YEAR,
    },
    config
  );
  assert.equal(p3Calc.roundedValue, 85000);
  assert.equal(p3Calc.plans[0].price, 3381.44, 'P3 Plus = 3.381,44 €');
  assert.equal(p3Calc.plans[1].price, 3250.0, 'P3 Premium = 3.250,00 €');
  assert.equal(p3Calc.plans[1].isRecommended, true, 'P3 Premium must be Empfehlung');
  assert.equal(p3Calc.plans[2].price, null, 'P3 Flex unavailable above 75k mit Veruntreuung');
  assert.equal(p3Calc.plans[2].available, false);
  assert.equal(p3Calc.plans[2].statusText, 'k. A.');

  const p3Req = await postJson(
    '/api/requests',
    {
      honeypot: '',
      formOpenedAt: Date.now() - 5000,
      name: 'Claudia Luxusflotte',
      firma: 'Luxury Liner GmbH',
      email: 'claudia@luxusliner.de',
      telefon: '+49 172 9999999',
      nachricht: '',
      privacyConsent: true,
      chosenPlan: p3Calc.plans[1].name,
      chosenPlanId: p3Calc.plans[1].planId,
      vehicleType: 'wohnmobil',
      kaufpreis: 84900,
      roundedValue: p3Calc.roundedValue,
      baujahr: 2026,
      vehicleAge: p3Calc.vehicleAge,
      veruntreuung: true,
      calculatedPrice: p3Calc.plans[1].price,
      priceStatusText: p3Calc.plans[1].statusText,
    },
    '198.51.100.30'
  );
  assert.equal(p3Req.status, 200);
  assert.equal(p3Req.json.success, true);
  console.log('✓ Persona 3 PASSED (Premium 3.250 € recommended, Flex k. A.)');

  // ------------------------------------------------------------------
  // PERSONA 4: Wohnwagen-Vermieter (18.300 € & 28.000 € mit Veruntreuung)
  // ------------------------------------------------------------------
  console.log('\n[Persona 4] Wohnwagen-Vermieter über Portale (18.300 € & 28.000 €)...');
  const p4A = calculateInsurancePlans(
    {
      vehicleType: 'wohnwagen',
      kaufpreis: 18300,
      baujahr: 2024,
      veruntreuung: true,
      currentYear: CURRENT_YEAR,
    },
    config
  );
  assert.equal(p4A.roundedValue, 19000);
  assert.equal(p4A.plans[2].price, 1151.5, 'P4A Flex uses min 20k = 1.151,50 €');
  assert.equal(p4A.plans[2].isRecommended, true, 'P4A Flex recommended');
  assert.equal(p4A.plans[0].price, 1196.66);
  assert.equal(p4A.plans[1].price, 1330.0);

  const p4B = calculateInsurancePlans(
    {
      vehicleType: 'wohnwagen',
      kaufpreis: 28000,
      baujahr: 2024,
      veruntreuung: true,
      currentYear: CURRENT_YEAR,
    },
    config
  );
  assert.equal(p4B.plans[2].price, null);
  assert.equal(p4B.plans[2].statusText, 'Preis auf Anfrage');
  assert.equal(p4B.plans[0].price, 1196.66);
  assert.equal(p4B.plans[0].isRecommended, true, 'P4B Plus recommended');

  const p4Req = await postJson(
    '/api/requests',
    {
      honeypot: '',
      formOpenedAt: Date.now() - 5000,
      name: 'Dieter Wohnwagen',
      firma: '',
      email: 'dieter.ww@example.de',
      telefon: '',
      nachricht: 'Wohnwagen 28.000 Euro.',
      privacyConsent: true,
      chosenPlan: p4B.plans[0].name,
      chosenPlanId: p4B.plans[0].planId,
      vehicleType: 'wohnwagen',
      kaufpreis: 28000,
      roundedValue: p4B.roundedValue,
      baujahr: 2024,
      vehicleAge: p4B.vehicleAge,
      veruntreuung: true,
      calculatedPrice: p4B.plans[0].price,
      priceStatusText: p4B.plans[0].statusText,
    },
    '198.51.100.40'
  );
  assert.equal(p4Req.status, 200);
  assert.equal(p4Req.json.success, true);
  console.log('✓ Persona 4 PASSED (Wohnwagen min-Kasko + >25k Preis auf Anfrage)');

  // ------------------------------------------------------------------
  // PERSONA 5: Besitzer älterer Fahrzeuge (Age 20 vs Age 21+ rule)
  // ------------------------------------------------------------------
  console.log('\n[Persona 5] Besitzer älterer Fahrzeuge (Baujahr 2006 vs 1999 & 2001)...');
  const p5A = calculateInsurancePlans(
    {
      vehicleType: 'wohnmobil',
      kaufpreis: 55000,
      baujahr: 2006,
      veruntreuung: false,
      currentYear: CURRENT_YEAR,
    },
    config
  );
  assert.equal(p5A.vehicleAge, 20);
  assert.equal(p5A.plans[2].isLiabilityOnly, false);
  assert.equal(p5A.plans[2].price, 2527.0);

  const p5B = calculateInsurancePlans(
    {
      vehicleType: 'wohnmobil',
      kaufpreis: 55000,
      baujahr: 1999,
      veruntreuung: true,
      currentYear: CURRENT_YEAR,
    },
    config
  );
  assert.equal(p5B.vehicleAge, 27);
  assert.equal(p5B.plans[2].isLiabilityOnly, true);
  assert.equal(p5B.plans[2].price, 1016.4);
  assert.equal(
    p5B.plans[2].specialNote,
    'Ab 21 Jahren Fahrzeugalter: nur Haftpflichtversicherung möglich'
  );

  const p5C = calculateInsurancePlans(
    {
      vehicleType: 'wohnwagen',
      kaufpreis: 12000,
      baujahr: 2001,
      veruntreuung: true,
      currentYear: CURRENT_YEAR,
    },
    config
  );
  assert.equal(p5C.vehicleAge, 25);
  assert.equal(p5C.plans[2].isLiabilityOnly, true);
  assert.equal(p5C.plans[2].price, 375.6);

  const p5Req = await postJson(
    '/api/requests',
    {
      honeypot: '',
      formOpenedAt: Date.now() - 5000,
      name: 'Erwin Oldtimer',
      firma: '',
      email: 'erwin.oldtimer@example.de',
      telefon: '',
      nachricht: 'Baujahr 1999 Haftpflicht.',
      privacyConsent: true,
      chosenPlan: p5B.plans[2].name,
      chosenPlanId: p5B.plans[2].planId,
      vehicleType: 'wohnmobil',
      kaufpreis: 55000,
      roundedValue: p5B.roundedValue,
      baujahr: 1999,
      vehicleAge: p5B.vehicleAge,
      veruntreuung: true,
      calculatedPrice: p5B.plans[2].price,
      priceStatusText: p5B.plans[2].statusText,
    },
    '198.51.100.50'
  );
  assert.equal(p5Req.status, 200);
  assert.equal(p5Req.json.success, true);
  console.log('✓ Persona 5 PASSED (Age 20 Kasko vs Age 21+ Liability-only)');

  // ------------------------------------------------------------------
  // PERSONA 6: Großflotten- / Sonderfahrzeug (320.000 € + /kontakt form)
  // ------------------------------------------------------------------
  console.log('\n[Persona 6] Sonderfahrzeug 320.000 € + /api/contact...');
  const p6Calc = calculateInsurancePlans(
    {
      vehicleType: 'wohnmobil',
      kaufpreis: 320000,
      baujahr: 2026,
      veruntreuung: true,
      currentYear: CURRENT_YEAR,
    },
    config
  );
  assert.equal(p6Calc.allUnavailable, true);
  assert.equal(p6Calc.plans[0].statusText, 'Preis auf Anfrage');
  assert.equal(p6Calc.plans[1].statusText, 'Preis auf Anfrage');
  assert.equal(p6Calc.plans[2].statusText, 'Preis auf Anfrage');

  const p6Req = await postJson(
    '/api/requests',
    {
      honeypot: '',
      formOpenedAt: Date.now() - 5000,
      name: 'Franz Flottenchef',
      firma: 'Flottenverbund Nord',
      email: 'flotte@nordcamper.de',
      telefon: '+49 40 555666',
      nachricht: 'Sonderfahrzeug 320.000 Euro.',
      privacyConsent: true,
      chosenPlan: 'Individuelles Angebot',
      chosenPlanId: 'allgemein',
      vehicleType: 'wohnmobil',
      kaufpreis: 320000,
      roundedValue: p6Calc.roundedValue,
      baujahr: 2026,
      vehicleAge: p6Calc.vehicleAge,
      veruntreuung: true,
      calculatedPrice: null,
      priceStatusText: 'Individuelles Angebot',
    },
    '198.51.100.60'
  );
  assert.equal(p6Req.status, 200);
  assert.equal(p6Req.json.success, true);

  const p6Contact = await postJson(
    '/api/contact',
    {
      honeypot: '',
      formOpenedAt: Date.now() - 5000,
      name: 'Franz Flottenchef',
      email: 'flotte@nordcamper.de',
      telefon: '+49 40 555666',
      nachricht: 'Allgemeine Anfrage zur Flottenlösung ab 12 Wohnmobilen.',
      privacyConsent: true,
    },
    '198.51.100.61'
  );
  assert.equal(p6Contact.status, 200);
  assert.equal(p6Contact.json.success, true);
  console.log('✓ Persona 6 PASSED (320k Individual Request + /api/contact)');

  // ------------------------------------------------------------------
  // PERSONA 7: Validation, Timing, Honeypot & Rate-Limiting
  // ------------------------------------------------------------------
  console.log('\n[Persona 7] Fehlerhafter Nutzer & Spam-Bot Schutz...');
  const p7MissingName = await postJson(
    '/api/requests',
    {
      honeypot: '',
      formOpenedAt: Date.now() - 5000,
      name: '',
      email: 'test@example.de',
      privacyConsent: true,
    },
    '198.51.100.71'
  );
  assert.equal(p7MissingName.status, 400);

  const p7BadEmail = await postJson(
    '/api/requests',
    {
      honeypot: '',
      formOpenedAt: Date.now() - 5000,
      name: 'Test Nutzer',
      email: 'keine-email',
      privacyConsent: true,
    },
    '198.51.100.72'
  );
  assert.equal(p7BadEmail.status, 400);

  const p7NoConsent = await postJson(
    '/api/requests',
    {
      honeypot: '',
      formOpenedAt: Date.now() - 5000,
      name: 'Test Nutzer',
      email: 'test@example.de',
      privacyConsent: false,
    },
    '198.51.100.73'
  );
  assert.equal(p7NoConsent.status, 400);

  const p7TooFast = await postJson(
    '/api/requests',
    {
      honeypot: '',
      formOpenedAt: Date.now() - 500,
      name: 'Fast Bot',
      email: 'fast@example.de',
      privacyConsent: true,
    },
    '198.51.100.74'
  );
  assert.equal(p7TooFast.status, 400);
  assert.match(p7TooFast.json.error, /zu schnell/i);

  const beforeHoneypotCount = readFrontendDb().requests.length;
  const p7Honeypot = await postJson(
    '/api/requests',
    {
      honeypot: 'http://spam.example',
      formOpenedAt: Date.now() - 5000,
      name: 'Spam Bot',
      email: 'spam@example.com',
      privacyConsent: true,
    },
    '198.51.100.75'
  );
  assert.equal(p7Honeypot.status, 200);
  assert.equal(p7Honeypot.json.success, true);
  assert.equal(
    readFrontendDb().requests.length,
    beforeHoneypotCount,
    'Honeypot submission must NOT persist into database'
  );

  // Use unique IP suffix per run in case script is executed multiple times against a persistent dev server
  const rateLimitIp = `198.51.99.${Math.floor(Math.random() * 200) + 10}`;
  for (let i = 1; i <= 5; i++) {
    const r = await postJson(
      '/api/requests',
      {
        honeypot: '',
        formOpenedAt: Date.now() - 5000,
        name: `Rate Limit Tester ${i}`,
        email: `rl${i}@example.de`,
        privacyConsent: true,
        chosenPlan: 'CVB-Plus',
        chosenPlanId: 'cvb_plus',
        vehicleType: 'wohnmobil',
        kaufpreis: 65000,
        roundedValue: 65000,
        baujahr: 2024,
        vehicleAge: 2,
        veruntreuung: true,
        calculatedPrice: 3082.99,
      },
      rateLimitIp
    );
    assert.equal(r.status, 200, `Request #${i} from ${rateLimitIp} must succeed`);
  }
  const p7Blocked = await postJson(
    '/api/requests',
    {
      honeypot: '',
      formOpenedAt: Date.now() - 5000,
      name: 'Rate Limit Tester 6',
      email: 'rl6@example.de',
      privacyConsent: true,
    },
    rateLimitIp
  );
  assert.equal(p7Blocked.status, 429, '6th request within 1h must return HTTP 429');
  assert.match(p7Blocked.json.error, /zu viele Anfragen/i);
  console.log('✓ Persona 7 PASSED (Validation, timing, honeypot & 429 rate-limiting)');

  // ------------------------------------------------------------------
  // PERSONA 8: Admin / Betreiber-Sicht (Inbox & Audit Integrity)
  // ------------------------------------------------------------------
  console.log('\n[Persona 8] Admin / Betreiber-Sicht (DB & Audit Integrity)...');
  const finalDb = readFrontendDb();
  const addedCount = finalDb.requests.length - initialCount;
  // Personas 1..6 (6 requests) + 5 valid rate limit requests = 11 total
  assert.equal(addedCount, 11, `Expected 11 new persisted requests, got ${addedCount}`);

  const recentRequests = finalDb.requests.slice(0, 11);
  for (const r of recentRequests) {
    assert.ok(r.id.startsWith('req-'), 'Request ID format check');
    assert.equal(r.status, 'neu', 'Initial status must be neu');
    assert.equal(r.emailSent, true, 'emailSent flag must be true');
    assert.equal(r.privacyConsent, true, 'privacyConsent flag must be true');
  }
  assert.ok(
    finalDb.auditLog.slice(0, 11).every((a) => a.action === 'REQUEST_CREATED'),
    'Audit log entries recorded for all 11 requests'
  );
  console.log('✓ Persona 8 PASSED (11/11 legitimate requests + audit trail verified)');

  console.log('\n====================================================');
  console.log('ALL 8 MULTI-USER PERSONAS PASSED (100%)');
  console.log('====================================================');
} finally {
  fs.writeFileSync(frontendDbPath, originalFrontendDb, 'utf8');
  if (originalBackendDb !== null) {
    fs.writeFileSync(backendDbPath, originalBackendDb, 'utf8');
  }
  console.log('\n[Cleanup] Restored pre-test db.json cleanly.');
}
