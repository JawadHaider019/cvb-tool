import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  calculateInsurancePlans,
  formatEuroDE,
  formatEuroIntDE,
  roundUpToThousand,
} from './calculator.js';
import { sendInsuranceEmails } from './email.js';

const dbPath = path.resolve(process.cwd(), 'data/db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const config = db.insuranceConfig;
const settings = db.generalSettings;
const CURRENT_YEAR = 2026;

function calc(vehicleType, kaufpreis, baujahr, customConfig = config) {
  return calculateInsurancePlans(
    { vehicleType, kaufpreis, baujahr, currentYear: CURRENT_YEAR },
    customConfig
  );
}

function recId(res) {
  const rec = res.plans.filter((p) => p.isRecommended);
  assert.ok(rec.length <= 1, 'At most 1 plan can carry Empfehlung');
  return rec[0]?.planId ?? null;
}

console.log('================================================================');
console.log('20-USER DEEP SPECIFICATION & EXCEL AUDIT SUITE (2027 TARIFFS)');
console.log('================================================================');

// USER 1
console.log('\n[User 01 - Kevin B.] Compact Wohnmobil 45.000 € (below 50k min)...');
{
  const r = calc('wohnmobil', 45000, 2025);
  assert.equal(r.roundedValue, 45000);
  assert.equal(r.plans[0].price, 2992.80);
  assert.equal(r.plans[1].price, 3250.00);
  assert.equal(r.plans[2].price, 2207.65);
  assert.equal(recId(r), 'cvb_flex');
  console.log('✓ User 01 PASSED');
}

// USER 2
console.log('[User 02 - Julia R.] Wohnmobil 59.000 € vs 59.001 € -> 60.000 €...');
{
  const r59 = calc('wohnmobil', 59000, 2024);
  assert.equal(r59.plans[0].price, 2992.80);
  const r60 = calc('wohnmobil', 59001, 2024);
  assert.equal(r60.roundedValue, 60000);
  assert.equal(r60.plans[0].price, 3291.54);
  assert.equal(r60.plans[1].price, 3250.00);
  assert.equal(r60.plans[2].price, 2383.82);
  assert.equal(recId(r60), 'cvb_flex');
  console.log('✓ User 02 PASSED');
}

// USER 3
console.log('[User 03 - Patrick L.] Wohnmobil 72.000 € & 72.300 € -> 73.000 €...');
{
  const r72 = calc('wohnmobil', 72000, 2024);
  assert.equal(r72.plans[2].price, 2595.24);
  const r73 = calc('wohnmobil', 72300, 2024);
  assert.equal(r73.roundedValue, 73000);
  assert.equal(r73.plans[2].price, 2612.85);
  console.log('✓ User 03 PASSED');
}

// USER 4
console.log('[User 04 - Sabine M.] Wohnmobil Plus tier 84.000 € vs 84.500 € -> 85.000 €...');
{
  const r84 = calc('wohnmobil', 84000, 2023);
  assert.equal(r84.plans[0].price, 3291.54);
  const r85 = calc('wohnmobil', 84500, 2023);
  assert.equal(r85.roundedValue, 85000);
  assert.equal(r85.plans[0].price, 3591.42);
  assert.equal(r85.plans[2].price, 2824.27);
  assert.equal(recId(r85), 'cvb_flex');
  console.log('✓ User 04 PASSED');
}

// USER 5
console.log('[User 05 - Tobias K.] Wohnmobil Plus max 101.000 € vs 102.000 €...');
{
  const r101 = calc('wohnmobil', 101000, 2025);
  assert.equal(r101.plans[0].price, 3591.42);
  const r102 = calc('wohnmobil', 102000, 2025);
  assert.equal(r102.plans[0].price, null);
  assert.equal(r102.plans[0].statusText, 'Preis auf Anfrage');
  assert.equal(r102.plans[2].price, 3123.77);
  assert.equal(recId(r102), 'cvb_flex');
  console.log('✓ User 05 PASSED');
}

// USER 6
console.log('[User 06 - Elena S.] Wohnmobil Empfehlung flip 109.000 € vs 110.000 €...');
{
  const r109 = calc('wohnmobil', 109000, 2026);
  assert.equal(r109.plans[2].price, 3247.09);
  assert.equal(r109.plans[1].price, 3250.00);
  assert.equal(recId(r109), 'cvb_flex');

  const r110 = calc('wohnmobil', 110000, 2026);
  assert.equal(r110.plans[2].price, 3264.71);
  assert.equal(r110.plans[1].price, 3250.00);
  assert.equal(recId(r110), 'cvb_premium');
  console.log('✓ User 06 PASSED');
}

// USER 7
console.log('[User 07 - Henrik W.] Wohnmobil Premium max 126.000 € vs 127.000 €...');
{
  const r126 = calc('wohnmobil', 126000, 2025);
  assert.equal(r126.plans[1].price, 3250.00);
  assert.equal(recId(r126), 'cvb_premium');

  const r127 = calc('wohnmobil', 127000, 2025);
  assert.equal(r127.plans[1].price, null);
  assert.equal(r127.plans[1].statusText, 'Preis auf Anfrage');
  assert.equal(r127.plans[2].price, 3564.21);
  assert.equal(recId(r127), 'cvb_flex');
  console.log('✓ User 07 PASSED');
}

// USER 8
console.log('[User 08 - Vanessa D.] Wohnmobil Flex max 150.000 € vs 151.000 €...');
{
  const r150 = calc('wohnmobil', 150000, 2026);
  assert.equal(r150.plans[2].price, 3969.41);
  assert.equal(recId(r150), 'cvb_flex');

  const r151 = calc('wohnmobil', 151000, 2026);
  assert.equal(r151.allUnavailable, true);
  assert.equal(recId(r151), null);
  for (const p of r151.plans) {
    assert.equal(p.statusText, 'Preis auf Anfrage');
  }
  console.log('✓ User 08 PASSED');
}

// USER 9
console.log('[User 09 - Dieter P.] Wohnmobil Age 10 (2016) vs Age 11 (2015) at 50k...');
{
  const age10 = calc('wohnmobil', 50000, 2016);
  assert.equal(age10.vehicleAge, 10);
  assert.equal(age10.plans[2].isLiabilityOnly, false);
  assert.equal(age10.plans[2].price, 2207.65);
  assert.equal(recId(age10), 'cvb_flex');

  const age11 = calc('wohnmobil', 50000, 2015);
  assert.equal(age11.vehicleAge, 11);
  assert.equal(age11.plans[2].isLiabilityOnly, true);
  assert.equal(age11.plans[2].specialNote, 'Nur Haftpflicht');
  assert.equal(age11.plans[2].price, 1326.77);
  assert.equal(recId(age11), 'cvb_plus');
  console.log('✓ User 09 PASSED');
}

// USER 10
console.log('[User 10 - Monika F.] Wohnmobil Age 14 (2012) at 60k -> Premium...');
{
  const r = calc('wohnmobil', 60000, 2012);
  assert.equal(r.plans[2].isLiabilityOnly, true);
  assert.equal(r.plans[2].price, 1326.77);
  assert.equal(r.plans[0].price, 3291.54);
  assert.equal(r.plans[1].price, 3250.00);
  assert.equal(recId(r), 'cvb_premium');
  console.log('✓ User 10 PASSED');
}

// USER 11
console.log('[User 11 - Tim H.] Small Wohnwagen 15.000 € (below 18k min)...');
{
  const r = calc('wohnwagen', 15000, 2024);
  assert.equal(r.plans[2].price, 671.00);
  assert.equal(r.plans[0].price, 1196.66);
  assert.equal(r.plans[1].price, 1330.00);
  assert.equal(recId(r), 'cvb_flex');
  assert.equal(r.plans[2].deductibleVK, 1500);
  assert.equal(r.plans[2].deductibleTK, 500);
  assert.ok(r.plans[2].benefits.some((b) => b.includes('Glasschäden: 500 €')));
  assert.ok(r.plans[2].benefits.some((b) => b.includes('Rechtsschutz 53,35 €/Jahr')));
  console.log('✓ User 11 PASSED');
}

// USER 12
console.log('[User 12 - Laura N.] Proposal Wohnwagen 24.100 € -> 25.000 € (Col F 912.50)...');
{
  const r = calc('wohnwagen', 24100, 2026);
  assert.equal(r.roundedValue, 25000);
  assert.equal(r.plans[2].price, 912.50);
  assert.notEqual(r.plans[2].price, 1041.88, 'Must NOT use Col C (1041.88)');
  assert.equal(recId(r), 'cvb_flex');
  console.log('✓ User 12 PASSED');
}

// USER 13
console.log('[User 13 - Jens A.] Wohnwagen Empfehlung flip 33.000 € vs 34.000 €...');
{
  const r33 = calc('wohnwagen', 33000, 2024);
  assert.equal(r33.plans[2].price, 1188.50);
  assert.equal(r33.plans[0].price, 1196.66);
  assert.equal(recId(r33), 'cvb_flex');

  const r34 = calc('wohnwagen', 34000, 2024);
  assert.equal(r34.plans[2].price, 1223.00);
  assert.equal(r34.plans[0].price, 1196.66);
  assert.equal(recId(r34), 'cvb_plus');
  console.log('✓ User 13 PASSED');
}

// USER 14
console.log('[User 14 - Katrin Z.] Wohnwagen Plus/Prem limit 50.000 € vs 51.000 €...');
{
  const r50 = calc('wohnwagen', 50000, 2025);
  assert.equal(r50.plans[2].price, 1775.00);
  assert.equal(r50.plans[0].price, 1196.66);
  assert.equal(r50.plans[1].price, 1330.00);
  assert.equal(recId(r50), 'cvb_plus');

  const r51 = calc('wohnwagen', 51000, 2025);
  assert.equal(r51.plans[0].statusText, 'Preis auf Anfrage');
  assert.equal(r51.plans[1].statusText, 'Preis auf Anfrage');
  assert.equal(r51.plans[2].price, 1809.50);
  assert.equal(recId(r51), 'cvb_flex');
  console.log('✓ User 14 PASSED');
}

// USER 15
console.log('[User 15 - Oliver G.] Wohnwagen Flex max 100.000 € vs 101.000 €...');
{
  const r100 = calc('wohnwagen', 100000, 2026);
  assert.equal(r100.plans[2].price, 3500.00);
  assert.equal(recId(r100), 'cvb_flex');

  const r101 = calc('wohnwagen', 101000, 2026);
  assert.equal(r101.allUnavailable, true);
  assert.equal(recId(r101), null);
  console.log('✓ User 15 PASSED');
}

// USER 16
console.log('[User 16 - Werner E.] Older Wohnwagen 30.000 € (Baujahr 2015, Age 11)...');
{
  const r = calc('wohnwagen', 30000, 2015);
  assert.equal(r.plans[2].isLiabilityOnly, true);
  assert.equal(r.plans[2].specialNote, 'Nur Haftpflicht');
  assert.equal(r.plans[2].price, 100.00);
  assert.equal(r.plans[0].price, 1196.66);
  assert.equal(r.plans[1].price, 1330.00);
  assert.equal(recId(r), 'cvb_plus');
  console.log('✓ User 16 PASSED');
}

// USER 17
console.log('[User 17 - Sandra V.] Brand compliance (zero Horbach) & verbatim benefits...');
{
  const srcFiles = [
    'src/components/CalculatorSection.jsx',
    'src/components/RequestModal.jsx',
    'src/components/PlanOverviewSection.jsx',
    'src/components/ComparisonTableSection.jsx',
    'src/lib/calculator.js',
    'src/lib/db.js',
    'src/lib/email.js',
    'data/db.json',
  ];
  for (const rel of srcFiles) {
    const content = fs.readFileSync(path.resolve(process.cwd(), rel), 'utf8');
    assert.equal(
      content.toLowerCase().includes('horbach'),
      false,
      `Partner name Horbach must NEVER appear in ${rel}`
    );
  }
  assert.equal(config.cvbPlus.benefits.length, 5);
  assert.equal(config.cvbPremium.benefits.length, 4);
  assert.equal(config.cvbFlex.wohnmobil.benefits.length, 7);
  assert.equal(config.cvbFlex.wohnwagen.benefits.length, 8);
  assert.equal(
    config.priceFootnote,
    'Alle Preise sind Jahresbeiträge inkl. Versicherungssteuer.'
  );
  console.log('✓ User 17 PASSED');
}

// USER 18
console.log('[User 18 - Florian R.] No net/gross conversion & email sonderzubehoer payload...');
{
  // Exact value entered (no /1.19 or *1.19 conversion)
  const r = calc('wohnmobil', 70000, 2024);
  assert.equal(r.roundedValue, 70000);
  assert.equal(r.plans[2].price, 2560.00);

  const emailRes = await sendInsuranceEmails(
    {
      id: 'req-u18-test',
      createdAt: '2026-11-19 15:20',
      name: 'Florian R.',
      firma: 'Richter Reisemobile',
      email: 'florian.r@example.de',
      telefon: '+49 170 181818',
      sonderzubehoer: 'Solaranlage 220W, Thule Markise, DuoControl CS',
      nachricht: 'Bitte um Antragsunterlagen.',
      privacyConsentAt: '2026-11-19 15:20',
      chosenPlan: 'CVB-Flex',
      vehicleType: 'wohnmobil',
      kaufpreis: 70000,
      roundedValue: 70000,
      baujahr: 2024,
      vehicleAge: 2,
      calculatedPrice: 2560.00,
      priceStatusText: null,
    },
    settings
  );
  assert.equal(emailRes.success, true);
  assert.equal(
    settings.recipientEmail,
    'Versicherungsanfrage@caravan-vermieter-bund.de'
  );
  console.log('✓ User 18 PASSED');
}

// USER 19
console.log('[User 19 - Admin View] Config-driven dynamic overrides (zero hardcoding)...');
{
  const customCfg = structuredClone(config);
  customCfg.wohnwagenActive = false;
  const wwOff = calc('wohnwagen', 25000, 2024, customCfg);
  assert.equal(wwOff.allUnavailable, true);
  assert.equal(wwOff.plans[2].statusText, 'Preis auf Anfrage');

  customCfg.cvbPremium.wohnmobil.price = 3400.00;
  const wmCustom = calc('wohnmobil', 110000, 2024, customCfg);
  assert.equal(wmCustom.plans[1].price, 3400.00);
  assert.equal(recId(wmCustom), 'cvb_flex', 'With Premium at 3400, Flex 3264.71 wins');
  console.log('✓ User 19 PASSED');
}

// USER 20
console.log('[User 20 - Martin S.] Full Excel Sweep (101 Wohnmobil + 83 Wohnwagen rows = 552 cells)...');
{
  let cells = 0;
  for (let v = 50000; v <= 150000; v += 1000) {
    const r = calc('wohnmobil', v, 2024);
    const expFlex = Math.round(((1206.15 + v * 13.927 / 1000 * 1.15) * 1.1 + Number.EPSILON) * 100) / 100;
    const expPlus = v <= 59000 ? 2992.80 : v <= 84000 ? 3291.54 : v <= 101000 ? 3591.42 : null;
    const expPrem = v <= 126000 ? 3250.00 : null;
    assert.equal(r.plans[0].price, expPlus, `WM Plus V=${v}`);
    assert.equal(r.plans[1].price, expPrem, `WM Prem V=${v}`);
    assert.equal(r.plans[2].price, expFlex, `WM Flex V=${v}`);
    cells += 3;
  }
  for (let v = 18000; v <= 100000; v += 1000) {
    const r = calc('wohnwagen', v, 2024);
    const expFlex = Math.round((50 + v * 34.5 / 1000 + Number.EPSILON) * 100) / 100;
    const expPlus = v <= 50000 ? 1196.66 : null;
    const expPrem = v <= 50000 ? 1330.00 : null;
    assert.equal(r.plans[0].price, expPlus, `WW Plus V=${v}`);
    assert.equal(r.plans[1].price, expPrem, `WW Prem V=${v}`);
    assert.equal(r.plans[2].price, expFlex, `WW Flex V=${v}`);
    cells += 3;
  }
  assert.equal(cells, 552);
  console.log(`✓ User 20 PASSED (${cells}/552 Excel cells verified with 0 differences)`);
}

console.log('\n================================================================');
console.log('ALL 20 DEEP TEST USERS PASSED 100%');
console.log('================================================================');
