import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { calculateInsurancePlans, roundCents } from './calculator.js';

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
  console.log('10-USER POINT-OF-VIEW (POV) LIVE TEST SUITE');
  console.log(`Target Server: ${BASE_URL}`);
  console.log('====================================================');

  const contentRes = await fetch(`${BASE_URL}/api/content`);
  assert.equal(contentRes.status, 200, 'GET /api/content must return 200');
  const liveContent = await contentRes.json();
  const config = liveContent.insuranceConfig;
  const faqs = liveContent.faqs;

  const homeHtml = await (await fetch(`${BASE_URL}/`)).text();
  const initialCount = readFrontendDb().requests.length;

  // Run-unique IP prefix in 198.51.x.x so repeated runs don't hit prior-run rate-limit window
  const runOctet = Math.floor(Math.random() * 150) + 50;

  // ------------------------------------------------------------------
  // USER 1: Lukas M. — Erstvermieter (54.800 €, Wohnmobil, Veruntreuung Ja/Nein)
  // ------------------------------------------------------------------
  console.log('\n[User 1 - Lukas M.] Erstvermieter mit Kastenwagen (54.800 €)...');
  assert.ok(
    faqs.some((f) => f.question.includes('privat angemeldet') && f.visible),
    'FAQ about switching from private registration must be visible'
  );
  assert.ok(
    faqs.some((f) => f.question.includes('Warum kostet der CVB Geld') && f.visible),
    'FAQ about CVB membership fee must be visible'
  );

  const u1Ver = calculateInsurancePlans(
    { vehicleType: 'wohnmobil', kaufpreis: 54800, baujahr: 2024, veruntreuung: true, currentYear: CURRENT_YEAR },
    config
  );
  assert.equal(u1Ver.roundedValue, 55000);
  assert.equal(u1Ver.plans[0].price, 3082.99);
  assert.equal(u1Ver.plans[1].price, 3250.0);
  assert.equal(u1Ver.plans[2].price, 2884.0);
  assert.equal(u1Ver.plans[2].isRecommended, true);

  const u1NoVer = calculateInsurancePlans(
    { vehicleType: 'wohnmobil', kaufpreis: 54800, baujahr: 2024, veruntreuung: false, currentYear: CURRENT_YEAR },
    config
  );
  assert.equal(u1NoVer.plans[2].price, 2527.0);
  assert.equal(u1NoVer.plans[2].isRecommended, true);

  const u1Req = await postJson(
    '/api/requests',
    {
      honeypot: '',
      formOpenedAt: Date.now() - 5000,
      name: 'Lukas M.',
      firma: '',
      email: 'lukas.m@example.de',
      telefon: '+49 171 1000001',
      nachricht: 'Erstes Fahrzeug, möchte Rundumschutz CVB-Plus.',
      privacyConsent: true,
      chosenPlan: u1Ver.plans[0].name,
      chosenPlanId: u1Ver.plans[0].planId,
      vehicleType: 'wohnmobil',
      kaufpreis: 54800,
      roundedValue: u1Ver.roundedValue,
      baujahr: 2024,
      vehicleAge: u1Ver.vehicleAge,
      veruntreuung: true,
      calculatedPrice: u1Ver.plans[0].price,
    },
    `198.51.${runOctet}.1`
  );
  assert.equal(u1Req.status, 200);
  console.log('✓ User 1 (Lukas M.) PASSED');

  // ------------------------------------------------------------------
  // USER 2: Sarah K. — Einsteigerin Threshold Jump (71.000 € vs 71.200 € -> 72.000 €)
  // ------------------------------------------------------------------
  console.log('\n[User 2 - Sarah K.] Schwellenwert-Sprung 71.000 € vs 71.200 €...');
  const u2At71k = calculateInsurancePlans(
    { vehicleType: 'wohnmobil', kaufpreis: 71000, baujahr: 2025, veruntreuung: true, currentYear: CURRENT_YEAR },
    config
  );
  assert.equal(u2At71k.plans[0].price, 3082.99);
  assert.equal(u2At71k.plans[0].isRecommended, true);

  const u2At71200 = calculateInsurancePlans(
    { vehicleType: 'wohnmobil', kaufpreis: 71200, baujahr: 2025, veruntreuung: true, currentYear: CURRENT_YEAR },
    config
  );
  assert.equal(u2At71200.roundedValue, 72000);
  assert.equal(u2At71200.plans[0].price, 3381.44);
  assert.equal(u2At71200.plans[1].price, 3250.0);
  assert.equal(u2At71200.plans[1].isRecommended, true, 'At 72k Premium becomes cheaper than Plus & Flex');
  assert.equal(u2At71200.plans[2].price, 3466.25);

  const u2Req = await postJson(
    '/api/requests',
    {
      honeypot: '',
      formOpenedAt: Date.now() - 5000,
      name: 'Sarah K.',
      firma: '',
      email: 'sarah.k@example.de',
      telefon: '',
      nachricht: 'Wohnmobil 71.200 Euro brutto.',
      privacyConsent: true,
      chosenPlan: u2At71200.plans[1].name,
      chosenPlanId: u2At71200.plans[1].planId,
      vehicleType: 'wohnmobil',
      kaufpreis: 71200,
      roundedValue: u2At71200.roundedValue,
      baujahr: 2025,
      vehicleAge: u2At71200.vehicleAge,
      veruntreuung: true,
      calculatedPrice: u2At71200.plans[1].price,
    },
    `198.51.${runOctet}.2`
  );
  assert.equal(u2Req.status, 200);
  console.log('✓ User 2 (Sarah K.) PASSED');

  // ------------------------------------------------------------------
  // USER 3: Markus W. — Wohnwagen Portal-Vermieter (19.400 € -> 20.000 €)
  // ------------------------------------------------------------------
  console.log('\n[User 3 - Markus W.] Wohnwagen Portal-Vermieter (19.400 €)...');
  assert.ok(homeHtml.includes('Pannenschutzbrief'), 'Plan overview mentions Pannenschutzbrief for caravans');
  const u3Calc = calculateInsurancePlans(
    { vehicleType: 'wohnwagen', kaufpreis: 19400, baujahr: 2023, veruntreuung: true, currentYear: CURRENT_YEAR },
    config
  );
  assert.equal(u3Calc.roundedValue, 20000);
  assert.equal(u3Calc.plans[0].price, 1196.66);
  assert.equal(u3Calc.plans[1].price, 1330.0);
  assert.equal(u3Calc.plans[2].price, 1151.5);
  assert.equal(u3Calc.plans[2].isRecommended, true);

  const u3Req = await postJson(
    '/api/requests',
    {
      honeypot: '',
      formOpenedAt: Date.now() - 5000,
      name: 'Markus W.',
      firma: 'Caravan Verleih Süd',
      email: 'markus.w@example.de',
      telefon: '',
      nachricht: 'Vermietung über Portal, brauche Schutzbrief über CVB-Premium.',
      privacyConsent: true,
      chosenPlan: u3Calc.plans[1].name,
      chosenPlanId: u3Calc.plans[1].planId,
      vehicleType: 'wohnwagen',
      kaufpreis: 19400,
      roundedValue: u3Calc.roundedValue,
      baujahr: 2023,
      vehicleAge: u3Calc.vehicleAge,
      veruntreuung: true,
      calculatedPrice: u3Calc.plans[1].price,
    },
    `198.51.${runOctet}.3`
  );
  assert.equal(u3Req.status, 200);
  console.log('✓ User 3 (Markus W.) PASSED');

  // ------------------------------------------------------------------
  // USER 4: Petra H. — Premium-Wohnwagen (29.500 € -> 30.000 €)
  // ------------------------------------------------------------------
  console.log('\n[User 4 - Petra H.] Wohnwagen-Vermieterin (29.500 €)...');
  const u4Ver = calculateInsurancePlans(
    { vehicleType: 'wohnwagen', kaufpreis: 29500, baujahr: 2025, veruntreuung: true, currentYear: CURRENT_YEAR },
    config
  );
  assert.equal(u4Ver.roundedValue, 30000);
  assert.equal(u4Ver.plans[0].price, 1196.66);
  assert.equal(u4Ver.plans[0].isRecommended, true);
  assert.equal(u4Ver.plans[2].price, null);
  assert.equal(u4Ver.plans[2].statusText, 'Preis auf Anfrage');

  const u4NoVer = calculateInsurancePlans(
    { vehicleType: 'wohnwagen', kaufpreis: 29500, baujahr: 2025, veruntreuung: false, currentYear: CURRENT_YEAR },
    config
  );
  assert.equal(u4NoVer.plans[2].price, 1303.0);
  assert.equal(u4NoVer.plans[0].isRecommended, true);

  const u4Req = await postJson(
    '/api/requests',
    {
      honeypot: '',
      formOpenedAt: Date.now() - 5000,
      name: 'Petra H.',
      firma: '',
      email: 'petra.h@example.de',
      telefon: '+49 175 4000004',
      nachricht: '',
      privacyConsent: true,
      chosenPlan: u4Ver.plans[0].name,
      chosenPlanId: u4Ver.plans[0].planId,
      vehicleType: 'wohnwagen',
      kaufpreis: 29500,
      roundedValue: u4Ver.roundedValue,
      baujahr: 2025,
      vehicleAge: u4Ver.vehicleAge,
      veruntreuung: true,
      calculatedPrice: u4Ver.plans[0].price,
    },
    `198.51.${runOctet}.4`
  );
  assert.equal(u4Req.status, 200);
  console.log('✓ User 4 (Petra H.) PASSED');

  // ------------------------------------------------------------------
  // USER 5: Thomas B. — Gewerblicher Optimierer (5 Wohnmobile, 60.000 €, ohne Veruntreuung)
  // ------------------------------------------------------------------
  console.log('\n[User 5 - Thomas B.] Kostenoptimierer (60.000 €, Veruntreuung Nein)...');
  const u5Calc = calculateInsurancePlans(
    { vehicleType: 'wohnmobil', kaufpreis: 60000, baujahr: 2023, veruntreuung: false, currentYear: CURRENT_YEAR },
    config
  );
  assert.equal(u5Calc.plans[2].price, 2672.0);
  assert.equal(u5Calc.plans[2].isRecommended, true);
  const perVehicleSaving = roundCents(u5Calc.plans[0].price - u5Calc.plans[2].price);
  assert.equal(perVehicleSaving, 410.99);
  assert.equal(roundCents(perVehicleSaving * 5), 2054.95);

  const u5Req = await postJson(
    '/api/requests',
    {
      honeypot: '',
      formOpenedAt: Date.now() - 5000,
      name: 'Thomas B.',
      firma: 'Bauer Mobilvermietung GmbH',
      email: 'thomas.b@example.de',
      telefon: '+49 89 5000005',
      nachricht: '5 baugleiche Fahrzeuge, monatliche Zahlweise gewünscht.',
      privacyConsent: true,
      chosenPlan: u5Calc.plans[2].name,
      chosenPlanId: u5Calc.plans[2].planId,
      vehicleType: 'wohnmobil',
      kaufpreis: 60000,
      roundedValue: u5Calc.roundedValue,
      baujahr: 2023,
      vehicleAge: u5Calc.vehicleAge,
      veruntreuung: false,
      calculatedPrice: u5Calc.plans[2].price,
    },
    `198.51.${runOctet}.5`
  );
  assert.equal(u5Req.status, 200);
  console.log('✓ User 5 (Thomas B.) PASSED');

  // ------------------------------------------------------------------
  // USER 6: Stefan R. — Luxus-Camper (88.000 €, Veruntreuung Ja & Nein)
  // ------------------------------------------------------------------
  console.log('\n[User 6 - Stefan R.] Luxus-Camper Vermieter (88.000 €)...');
  const u6Ver = calculateInsurancePlans(
    { vehicleType: 'wohnmobil', kaufpreis: 88000, baujahr: 2026, veruntreuung: true, currentYear: CURRENT_YEAR },
    config
  );
  assert.equal(u6Ver.plans[0].price, 3381.44);
  assert.equal(u6Ver.plans[1].price, 3250.0);
  assert.equal(u6Ver.plans[1].isRecommended, true);
  assert.equal(u6Ver.plans[2].statusText, 'k. A.');

  const u6NoVer = calculateInsurancePlans(
    { vehicleType: 'wohnmobil', kaufpreis: 88000, baujahr: 2026, veruntreuung: false, currentYear: CURRENT_YEAR },
    config
  );
  assert.equal(u6NoVer.plans[2].price, 3484.0);
  assert.equal(u6NoVer.plans[1].isRecommended, true, 'At 88k Premium (3.250 €) beats Flex even without Veruntreuung (3.484 €)');

  const u6Req = await postJson(
    '/api/requests',
    {
      honeypot: '',
      formOpenedAt: Date.now() - 5000,
      name: 'Stefan R.',
      firma: 'Premium Reisemobile R.',
      email: 'stefan.r@example.de',
      telefon: '',
      nachricht: '4 Luxus-Wohnmobile à 88.000 €.',
      privacyConsent: true,
      chosenPlan: u6Ver.plans[1].name,
      chosenPlanId: u6Ver.plans[1].planId,
      vehicleType: 'wohnmobil',
      kaufpreis: 88000,
      roundedValue: u6Ver.roundedValue,
      baujahr: 2026,
      vehicleAge: u6Ver.vehicleAge,
      veruntreuung: true,
      calculatedPrice: u6Ver.plans[1].price,
    },
    `198.51.${runOctet}.6`
  );
  assert.equal(u6Req.status, 200);
  console.log('✓ User 6 (Stefan R.) PASSED');

  // ------------------------------------------------------------------
  // USER 7: Hannes G. — Youngtimer / Kult-Camper (Baujahr 2006 vs 2001)
  // ------------------------------------------------------------------
  console.log('\n[User 7 - Hannes G.] Ältere Kult-Camper (2006 vs 2001)...');
  const u7_2006 = calculateInsurancePlans(
    { vehicleType: 'wohnmobil', kaufpreis: 50000, baujahr: 2006, veruntreuung: false, currentYear: CURRENT_YEAR },
    config
  );
  assert.equal(u7_2006.vehicleAge, 20);
  assert.equal(u7_2006.plans[2].isLiabilityOnly, false);
  assert.equal(u7_2006.plans[2].price, 2382.0);

  const u7_2001 = calculateInsurancePlans(
    { vehicleType: 'wohnmobil', kaufpreis: 50000, baujahr: 2001, veruntreuung: false, currentYear: CURRENT_YEAR },
    config
  );
  assert.equal(u7_2001.vehicleAge, 25);
  assert.equal(u7_2001.plans[2].isLiabilityOnly, true);
  assert.equal(u7_2001.plans[2].price, 1016.4);
  assert.equal(u7_2001.plans[2].specialNote, 'Ab 21 Jahren Fahrzeugalter: nur Haftpflichtversicherung möglich');

  const u7Req = await postJson(
    '/api/requests',
    {
      honeypot: '',
      formOpenedAt: Date.now() - 5000,
      name: 'Hannes G.',
      firma: '',
      email: 'hannes.g@example.de',
      telefon: '',
      nachricht: 'Oldtimer-Camper Baujahr 2001 Haftpflicht.',
      privacyConsent: true,
      chosenPlan: u7_2001.plans[2].name,
      chosenPlanId: u7_2001.plans[2].planId,
      vehicleType: 'wohnmobil',
      kaufpreis: 50000,
      roundedValue: u7_2001.roundedValue,
      baujahr: 2001,
      vehicleAge: u7_2001.vehicleAge,
      veruntreuung: false,
      calculatedPrice: u7_2001.plans[2].price,
    },
    `198.51.${runOctet}.7`
  );
  assert.equal(u7Req.status, 200);
  console.log('✓ User 7 (Hannes G.) PASSED');

  // ------------------------------------------------------------------
  // USER 8: Dr. Christian V. — Großflotte (14 Fahrzeuge) & 280.000 € Liner
  // ------------------------------------------------------------------
  console.log('\n[User 8 - Dr. Christian V.] Flottenbetreiber (14 Fzg & 280.000 € Liner)...');
  assert.ok(
    faqs.some((f) => f.question.includes('mehr als 10 Fahrzeuge') && f.visible),
    'FAQ for >10 vehicles fleet must be visible'
  );
  const u8Calc = calculateInsurancePlans(
    { vehicleType: 'wohnmobil', kaufpreis: 280000, baujahr: 2026, veruntreuung: true, currentYear: CURRENT_YEAR },
    config
  );
  assert.equal(u8Calc.allUnavailable, true);
  assert.equal(u8Calc.plans[0].statusText, 'Preis auf Anfrage');
  assert.equal(u8Calc.plans[1].statusText, 'Preis auf Anfrage');
  assert.equal(u8Calc.plans[2].statusText, 'Preis auf Anfrage');

  const u8Req = await postJson(
    '/api/requests',
    {
      honeypot: '',
      formOpenedAt: Date.now() - 5000,
      name: 'Dr. Christian V.',
      firma: 'Alpine Liner Fleet AG',
      email: 'christian.v@example.de',
      telefon: '+49 800 888888',
      nachricht: 'Individuelles Flottenangebot für 14 Fahrzeuge inkl. 280.000 € Liner.',
      privacyConsent: true,
      chosenPlan: 'Individuelles Angebot',
      chosenPlanId: 'allgemein',
      vehicleType: 'wohnmobil',
      kaufpreis: 280000,
      roundedValue: u8Calc.roundedValue,
      baujahr: 2026,
      vehicleAge: u8Calc.vehicleAge,
      veruntreuung: true,
      calculatedPrice: null,
      priceStatusText: 'Individuelles Angebot',
    },
    `198.51.${runOctet}.8`
  );
  assert.equal(u8Req.status, 200);

  const u8Contact = await postJson(
    '/api/contact',
    {
      honeypot: '',
      formOpenedAt: Date.now() - 5000,
      name: 'Dr. Christian V.',
      email: 'christian.v@example.de',
      telefon: '+49 800 888888',
      nachricht: 'Rückrufbitte bezüglich CVB Flotten-Rahmenvertrag > 10 Fahrzeuge.',
      privacyConsent: true,
    },
    `198.51.${runOctet}.80`
  );
  assert.equal(u8Contact.status, 200);
  console.log('✓ User 8 (Dr. Christian V.) PASSED');

  // ------------------------------------------------------------------
  // USER 9: Nina T. — Smartphone-Nutzerin, Wechsel vor 30.11. & App Store Links
  // ------------------------------------------------------------------
  console.log('\n[User 9 - Nina T.] Smartphone-Wechslerin (30.11 Stichtag, App-Links, 63.500 €)...');
  assert.ok(homeHtml.includes('30.11 des Jahres kündigen'), 'Stichtag 30.11 notice visible');
  assert.ok(homeHtml.includes('01.01. des Jahres optimiert starten'), '01.01. start notice visible');
  assert.ok(
    homeHtml.includes('https://apps.apple.com/de/app/cvb-vermieter-app/id6745691091'),
    'Official Apple App Store URL present'
  );
  assert.ok(
    homeHtml.includes('https://play.google.com/store/apps/details?id=de.einfach.cvbvermieterapp.production'),
    'Official Google Play Store URL present'
  );

  const u9Calc = calculateInsurancePlans(
    { vehicleType: 'wohnmobil', kaufpreis: 63500, baujahr: 2024, veruntreuung: true, currentYear: CURRENT_YEAR },
    config
  );
  assert.equal(u9Calc.roundedValue, 64000);
  assert.equal(u9Calc.plans[0].price, 3082.99);
  assert.equal(u9Calc.plans[0].isRecommended, true, 'At 64k Plus (3.082,99 €) beats Flex (3.234,25 €) & Premium (3.250 €)');
  assert.equal(u9Calc.plans[2].price, 3234.25);

  const u9Req = await postJson(
    '/api/requests',
    {
      honeypot: '',
      formOpenedAt: Date.now() - 5000,
      name: 'Nina T.',
      firma: '',
      email: 'nina.t@example.de',
      telefon: '+49 160 9000009',
      nachricht: 'Wechsel zum 01.01. gewünscht.',
      privacyConsent: true,
      chosenPlan: u9Calc.plans[0].name,
      chosenPlanId: u9Calc.plans[0].planId,
      vehicleType: 'wohnmobil',
      kaufpreis: 63500,
      roundedValue: u9Calc.roundedValue,
      baujahr: 2024,
      vehicleAge: u9Calc.vehicleAge,
      veruntreuung: true,
      calculatedPrice: u9Calc.plans[0].price,
    },
    `198.51.${runOctet}.9`
  );
  assert.equal(u9Req.status, 200);
  console.log('✓ User 9 (Nina T.) PASSED');

  // ------------------------------------------------------------------
  // USER 10: Martin S. — Compliance-, Datenschutz- & Security-Prüfer
  // ------------------------------------------------------------------
  console.log('\n[User 10 - Martin S.] Versicherungsmakler & Compliance-Prüfer...');
  const impressumHtml = await (await fetch(`${BASE_URL}/impressum`)).text();
  const datenschutzHtml = await (await fetch(`${BASE_URL}/datenschutz`)).text();
  assert.ok(impressumHtml.includes('DS-Caravaning GmbH'), 'Impressum must contain DS-Caravaning GmbH');
  assert.ok(datenschutzHtml.includes('Datenschutzerklärung'), 'Datenschutz page must render');

  // Check static comparison table teaser numbers vs 2027 live calculator
  assert.ok(homeHtml.includes('ab 2.993,09'), 'Comparison matrix retains verbatim static annual teaser');
  assert.ok(homeHtml.includes('Jahresbeiträge inkl. Versicherungssteuer'), 'Calculator includes statutory insurance tax note');

  // Validation + Bot + Rate Limit tests
  const u10BadEmail = await postJson(
    '/api/requests',
    { honeypot: '', formOpenedAt: Date.now() - 5000, name: 'Martin S.', email: 'bad', privacyConsent: true },
    `198.51.${runOctet}.10`
  );
  assert.equal(u10BadEmail.status, 400);

  const u10NoConsent = await postJson(
    '/api/requests',
    { honeypot: '', formOpenedAt: Date.now() - 5000, name: 'Martin S.', email: 'martin@audit.de', privacyConsent: false },
    `198.51.${runOctet}.11`
  );
  assert.equal(u10NoConsent.status, 400);

  const u10Fast = await postJson(
    '/api/requests',
    { honeypot: '', formOpenedAt: Date.now() - 300, name: 'Martin S.', email: 'martin@audit.de', privacyConsent: true },
    `198.51.${runOctet}.12`
  );
  assert.equal(u10Fast.status, 400);

  const beforeHp = readFrontendDb().requests.length;
  const u10Hp = await postJson(
    '/api/requests',
    { honeypot: 'http://spam.invalid', formOpenedAt: Date.now() - 5000, name: 'Bot', email: 'bot@spam.de', privacyConsent: true },
    `198.51.${runOctet}.13`
  );
  assert.equal(u10Hp.status, 200);
  assert.equal(readFrontendDb().requests.length, beforeHp);

  for (let i = 1; i <= 5; i++) {
    const r = await postJson(
      '/api/requests',
      {
        honeypot: '',
        formOpenedAt: Date.now() - 5000,
        name: `Audit Burst ${i}`,
        email: `audit${i}@example.de`,
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
      `198.51.${runOctet}.99`
    );
    assert.equal(r.status, 200);
  }
  const u10Blocked = await postJson(
    '/api/requests',
    { honeypot: '', formOpenedAt: Date.now() - 5000, name: 'Audit Burst 6', email: 'audit6@example.de', privacyConsent: true },
    `198.51.${runOctet}.99`
  );
  assert.equal(u10Blocked.status, 429);

  // Verify Users 1..9 (9 requests) + 5 Audit Burst requests = 14 new legitimate requests
  const finalDb = readFrontendDb();
  assert.equal(finalDb.requests.length - initialCount, 14);
  console.log('✓ User 10 (Martin S.) PASSED');

  console.log('\n====================================================');
  console.log('ALL 10 USER POV JOURNEYS PASSED 100%');
  console.log('====================================================');
} finally {
  fs.writeFileSync(frontendDbPath, originalFrontendDb, 'utf8');
  if (originalBackendDb !== null) {
    fs.writeFileSync(backendDbPath, originalBackendDb, 'utf8');
  }
  console.log('\n[Cleanup] Restored pre-test db.json cleanly.');
}
