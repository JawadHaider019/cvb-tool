import assert from 'node:assert/strict';
import {
  calculateInsurancePlans,
  formatEuroDE,
  roundUpToThousand,
} from './calculator.js';
import { defaultInsuranceConfig } from './db.js';

const CURRENT_YEAR = 2026;

function getPlan(vehicleType, kaufpreis, baujahr) {
  return calculateInsurancePlans(
    { vehicleType, kaufpreis, baujahr, currentYear: CURRENT_YEAR },
    defaultInsuranceConfig
  );
}

function getRecommendedId(res) {
  const rec = res.plans.filter((p) => p.isRecommended);
  assert.ok(rec.length <= 1, 'At most 1 plan can be recommended');
  return rec[0]?.planId ?? null;
}

console.log('=== 1. Rounding Rules ===');
assert.equal(roundUpToThousand(72300), 73000);
assert.equal(roundUpToThousand(50000), 50000);
assert.equal(roundUpToThousand(50001), 51000);
assert.equal(roundUpToThousand(15000), 15000);
console.log('Rounding OK');

console.log('=== 2. Section 8 Check Values: WOHNMOBIL <= 10 years ===');
// 45,000: Flex 2,207.65 / Plus 2,992.80 / Premium 3,250.00 -> Flex
{
  const r = getPlan('wohnmobil', 45000, 2024);
  assert.equal(r.plans[0].price, 2992.80);
  assert.equal(r.plans[1].price, 3250.00);
  assert.equal(r.plans[2].price, 2207.65);
  assert.equal(getRecommendedId(r), 'cvb_flex');
}
// 60,000: Flex 2,383.82 / Plus 3,291.54 / Premium 3,250.00 -> Flex
{
  const r = getPlan('wohnmobil', 60000, 2024);
  assert.equal(r.plans[0].price, 3291.54);
  assert.equal(r.plans[1].price, 3250.00);
  assert.equal(r.plans[2].price, 2383.82);
  assert.equal(getRecommendedId(r), 'cvb_flex');
}
// 72,000: Flex 2,595.24
{
  const r = getPlan('wohnmobil', 72000, 2024);
  assert.equal(r.plans[2].price, 2595.24);
}
// 72,300 (rounds to 73,000): Flex 2,612.85
{
  const r = getPlan('wohnmobil', 72300, 2024);
  assert.equal(r.roundedValue, 73000);
  assert.equal(r.plans[2].price, 2612.85);
}
// 85,000: Plus 3,591.42
{
  const r = getPlan('wohnmobil', 85000, 2024);
  assert.equal(r.plans[0].price, 3591.42);
}
// 100,000: Flex 3,088.53
{
  const r = getPlan('wohnmobil', 100000, 2024);
  assert.equal(r.plans[2].price, 3088.53);
}
// 102,000: Plus = Preis auf Anfrage
{
  const r = getPlan('wohnmobil', 102000, 2024);
  assert.equal(r.plans[0].price, null);
  assert.equal(r.plans[0].statusText, 'Preis auf Anfrage');
}
// 109,000: Flex 3,247.09 / Premium 3,250.00 -> Flex
{
  const r = getPlan('wohnmobil', 109000, 2024);
  assert.equal(r.plans[2].price, 3247.09);
  assert.equal(r.plans[1].price, 3250.00);
  assert.equal(getRecommendedId(r), 'cvb_flex');
}
// 110,000: Flex 3,264.71 / Premium 3,250.00 -> Premium
{
  const r = getPlan('wohnmobil', 110000, 2024);
  assert.equal(r.plans[2].price, 3264.71);
  assert.equal(r.plans[1].price, 3250.00);
  assert.equal(getRecommendedId(r), 'cvb_premium');
}
// 127,000: Premium = Preis auf Anfrage -> Flex
{
  const r = getPlan('wohnmobil', 127000, 2024);
  assert.equal(r.plans[1].price, null);
  assert.equal(r.plans[1].statusText, 'Preis auf Anfrage');
  assert.equal(getRecommendedId(r), 'cvb_flex');
}
// 150,000: Flex 3,969.41
{
  const r = getPlan('wohnmobil', 150000, 2024);
  assert.equal(r.plans[2].price, 3969.41);
  assert.equal(getRecommendedId(r), 'cvb_flex');
}
// 151,000: all = Preis auf Anfrage, no badge
{
  const r = getPlan('wohnmobil', 151000, 2024);
  assert.equal(r.allUnavailable, true);
  assert.equal(getRecommendedId(r), null);
  for (const p of r.plans) {
    assert.equal(p.statusText, 'Preis auf Anfrage');
  }
}
console.log('Wohnmobil <= 10 Check Values OK');

console.log('=== 3. Section 8 Check Values: WOHNMOBIL > 10 years ===');
// 50,000: Flex Nur Haftpflicht 1,326.77 / Plus 2,992.80 / Premium 3,250.00 -> Plus
{
  const r = getPlan('wohnmobil', 50000, 2015);
  assert.equal(r.plans[2].isLiabilityOnly, true);
  assert.equal(r.plans[2].specialNote, 'Nur Haftpflicht');
  assert.equal(r.plans[2].price, 1326.77);
  assert.equal(r.plans[0].price, 2992.80);
  assert.equal(r.plans[1].price, 3250.00);
  assert.equal(getRecommendedId(r), 'cvb_plus');
}
// 60,000: Flex Nur Haftpflicht 1,326.77 / Plus 3,291.54 / Premium 3,250.00 -> Premium
{
  const r = getPlan('wohnmobil', 60000, 2015);
  assert.equal(r.plans[2].isLiabilityOnly, true);
  assert.equal(r.plans[2].specialNote, 'Nur Haftpflicht');
  assert.equal(r.plans[2].price, 1326.77);
  assert.equal(r.plans[0].price, 3291.54);
  assert.equal(r.plans[1].price, 3250.00);
  assert.equal(getRecommendedId(r), 'cvb_premium');
}
console.log('Wohnmobil > 10 Check Values OK');

console.log('=== 4. Section 8 Check Values: WOHNWAGEN <= 10 years ===');
// 15,000: Flex 671.00 / Plus 1,196.66 / Premium 1,330.00 -> Flex
{
  const r = getPlan('wohnwagen', 15000, 2024);
  assert.equal(r.plans[2].price, 671.00);
  assert.equal(r.plans[0].price, 1196.66);
  assert.equal(r.plans[1].price, 1330.00);
  assert.equal(getRecommendedId(r), 'cvb_flex');
  assert.equal(r.plans[2].deductibleVK, 1500);
  assert.equal(r.plans[2].deductibleTK, 500);
  assert.ok(r.plans[2].benefits.some((b) => b.includes('Rechtsschutz 53,35')));
}
// 25,000: Flex 912.50 -> Flex
{
  const r = getPlan('wohnwagen', 25000, 2024);
  assert.equal(r.plans[2].price, 912.50);
  assert.equal(getRecommendedId(r), 'cvb_flex');
}
// 33,000: Flex 1,188.50 -> Flex
{
  const r = getPlan('wohnwagen', 33000, 2024);
  assert.equal(r.plans[2].price, 1188.50);
  assert.equal(getRecommendedId(r), 'cvb_flex');
}
// 34,000: Flex 1,223.00 / Plus 1,196.66 -> Plus
{
  const r = getPlan('wohnwagen', 34000, 2024);
  assert.equal(r.plans[2].price, 1223.00);
  assert.equal(r.plans[0].price, 1196.66);
  assert.equal(getRecommendedId(r), 'cvb_plus');
}
// 50,000: Flex 1,775.00 / Plus 1,196.66 / Premium 1,330.00 -> Plus
{
  const r = getPlan('wohnwagen', 50000, 2024);
  assert.equal(r.plans[2].price, 1775.00);
  assert.equal(r.plans[0].price, 1196.66);
  assert.equal(r.plans[1].price, 1330.00);
  assert.equal(getRecommendedId(r), 'cvb_plus');
}
// 51,000: Flex 1,809.50 / Plus and Premium = Preis auf Anfrage -> Flex
{
  const r = getPlan('wohnwagen', 51000, 2024);
  assert.equal(r.plans[2].price, 1809.50);
  assert.equal(r.plans[0].price, null);
  assert.equal(r.plans[0].statusText, 'Preis auf Anfrage');
  assert.equal(r.plans[1].price, null);
  assert.equal(r.plans[1].statusText, 'Preis auf Anfrage');
  assert.equal(getRecommendedId(r), 'cvb_flex');
}
// 100,000: Flex 3,500.00
{
  const r = getPlan('wohnwagen', 100000, 2024);
  assert.equal(r.plans[2].price, 3500.00);
  assert.equal(getRecommendedId(r), 'cvb_flex');
}
// 101,000: all = Preis auf Anfrage, no badge
{
  const r = getPlan('wohnwagen', 101000, 2024);
  assert.equal(r.allUnavailable, true);
  assert.equal(getRecommendedId(r), null);
  for (const p of r.plans) {
    assert.equal(p.statusText, 'Preis auf Anfrage');
  }
}
console.log('Wohnwagen <= 10 Check Values OK');

console.log('=== 5. Section 8 Check Values: WOHNWAGEN > 10 years ===');
// 30,000: Flex Nur Haftpflicht 100.00 / Plus 1,196.66 / Premium 1,330.00 -> Plus
{
  const r = getPlan('wohnwagen', 30000, 2015);
  assert.equal(r.plans[2].isLiabilityOnly, true);
  assert.equal(r.plans[2].specialNote, 'Nur Haftpflicht');
  assert.equal(r.plans[2].price, 100.00);
  assert.equal(r.plans[0].price, 1196.66);
  assert.equal(r.plans[1].price, 1330.00);
  assert.equal(getRecommendedId(r), 'cvb_plus');
}
console.log('Wohnwagen > 10 Check Values OK');

console.log('=== 6. Full Excel Sweep (Wohnmobil 50k–150k [101 rows] + Wohnwagen 18k–100k [83 rows]) ===');
for (let v = 50000; v <= 150000; v += 1000) {
  const r = getPlan('wohnmobil', v, 2024);
  const expFlex = Math.round(((1206.15 + v * 13.927 / 1000 * 1.15) * 1.1 + Number.EPSILON) * 100) / 100;
  assert.equal(r.plans[2].price, expFlex, `WM Flex V=${v}`);
}
for (let v = 18000; v <= 100000; v += 1000) {
  const r = getPlan('wohnwagen', v, 2024);
  const expFlex = Math.round((50 + v * 34.5 / 1000 + Number.EPSILON) * 100) / 100;
  assert.equal(r.plans[2].price, expFlex, `WW Flex V=${v}`);
}
console.log('Full 184-row Excel Sweep OK');

console.log('=== 7. Formatting ===');
assert.equal(formatEuroDE(671.00).replace(/\u00a0/g, ' '), '671,00 €');
assert.equal(formatEuroDE(2207.65).replace(/\u00a0/g, ' '), '2.207,65 €');
console.log('All Final 2027 Tariff Verification Checks PASSED!');
