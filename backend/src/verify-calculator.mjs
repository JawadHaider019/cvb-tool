import assert from 'node:assert/strict';
import {
  calculateInsurancePlans,
  formatEuroDE,
  roundUpToThousand,
} from './calculator.js';
import { defaultInsuranceConfig } from './db.js';

const CURRENT_YEAR = 2026;

function getPlan(vehicleType, kaufpreis, baujahr, veruntreuung) {
  return calculateInsurancePlans(
    { vehicleType, kaufpreis, baujahr, veruntreuung, currentYear: CURRENT_YEAR },
    defaultInsuranceConfig
  );
}

console.log('=== 1. Rounding Rules ===');
assert.equal(roundUpToThousand(47500), 48000);
assert.equal(roundUpToThousand(50000), 50000);
assert.equal(roundUpToThousand(50001), 51000);
assert.equal(roundUpToThousand(15000), 15000);
console.log('Rounding OK');

console.log('=== 2. Wohnmobil 8 Checkpoints from Brief ===');
const wohnmobilCheckpoints = [
  { v: 50000, plus: 3082.99, prem: 3250.0, flexNo: 2382.0, flexYes: 2739.0 },
  { v: 60000, plus: 3082.99, prem: 3250.0, flexNo: 2672.0, flexYes: 3029.0 },
  { v: 61000, plus: 3082.99, prem: 3250.0, flexNo: 2701.0, flexYes: 3147.25 },
  { v: 71000, plus: 3082.99, prem: 3250.0, flexNo: 2991.0, flexYes: 3437.25 },
  { v: 72000, plus: 3381.44, prem: 3250.0, flexNo: 3020.0, flexYes: 3466.25 },
  { v: 75000, plus: 3381.44, prem: 3250.0, flexNo: 3107.0, flexYes: 3553.25 },
  { v: 76000, plus: 3381.44, prem: 3250.0, flexNo: 3136.0, flexYes: 'k. A.' },
  { v: 90000, plus: 3381.44, prem: 3250.0, flexNo: 3542.0, flexYes: 'k. A.' },
];

for (const cp of wohnmobilCheckpoints) {
  const withoutVer = getPlan('wohnmobil', cp.v, 2024, false);
  const withVer = getPlan('wohnmobil', cp.v, 2024, true);

  assert.equal(withoutVer.plans[0].price, cp.plus, `Wohnmobil ${cp.v} Plus`);
  assert.equal(withoutVer.plans[1].price, cp.prem, `Wohnmobil ${cp.v} Prem`);
  assert.equal(withoutVer.plans[2].price, cp.flexNo, `Wohnmobil ${cp.v} Flex No`);

  assert.equal(withVer.plans[0].price, cp.plus, `Wohnmobil ${cp.v} Plus w/ Ver`);
  assert.equal(withVer.plans[1].price, cp.prem, `Wohnmobil ${cp.v} Prem w/ Ver`);
  if (cp.flexYes === 'k. A.') {
    assert.equal(withVer.plans[2].price, null);
    assert.equal(withVer.plans[2].statusText, 'k. A.');
  } else {
    assert.equal(withVer.plans[2].price, cp.flexYes, `Wohnmobil ${cp.v} Flex Yes`);
  }
}
console.log('Wohnmobil 8 Checkpoints OK');

console.log('=== 3. Wohnwagen 8 Checkpoints from Brief ===');
const wohnwagenCheckpoints = [
  { v: 6000, plus: 1196.66, prem: 1330.0, flexNo: 973.0, flexYes: 1092.0 },
  { v: 15000, plus: 1196.66, prem: 1330.0, flexNo: 973.0, flexYes: 1092.0 },
  { v: 16000, plus: 1196.66, prem: 1330.0, flexNo: 973.0, flexYes: 1151.5 },
  { v: 20000, plus: 1196.66, prem: 1330.0, flexNo: 973.0, flexYes: 1151.5 },
  { v: 21000, plus: 1196.66, prem: 1330.0, flexNo: 1006.0, flexYes: 1184.5 },
  { v: 25000, plus: 1196.66, prem: 1330.0, flexNo: 1138.0, flexYes: 1316.5 },
  { v: 26000, plus: 1196.66, prem: 1330.0, flexNo: 1171.0, flexYes: 'Preis auf Anfrage' },
  { v: 35000, plus: 1196.66, prem: 1330.0, flexNo: 1468.0, flexYes: 'Preis auf Anfrage' },
];

for (const cp of wohnwagenCheckpoints) {
  const withoutVer = getPlan('wohnwagen', cp.v, 2024, false);
  const withVer = getPlan('wohnwagen', cp.v, 2024, true);

  assert.equal(withoutVer.plans[0].price, cp.plus, `Wohnwagen ${cp.v} Plus`);
  assert.equal(withoutVer.plans[1].price, cp.prem, `Wohnwagen ${cp.v} Prem`);
  assert.equal(withoutVer.plans[2].price, cp.flexNo, `Wohnwagen ${cp.v} Flex No`);

  if (cp.flexYes === 'Preis auf Anfrage') {
    assert.equal(withVer.plans[2].price, null);
    assert.equal(withVer.plans[2].statusText, 'Preis auf Anfrage');
  } else {
    assert.equal(withVer.plans[2].price, cp.flexYes, `Wohnwagen ${cp.v} Flex Yes`);
  }
}
console.log('Wohnwagen 8 Checkpoints OK');

console.log('=== 4. Full Range Sweep (Wohnmobil 50k-90k, Wohnwagen 6k-35k) ===');
for (let v = 50000; v <= 90000; v += 1000) {
  const res = getPlan('wohnmobil', v, 2024, true);
  const recommended = res.plans.filter((p) => p.isRecommended);
  assert.equal(recommended.length, 1, `Exactly 1 recommended for Wohnmobil ${v}`);
  const minPrice = Math.min(
    ...res.plans.filter((p) => p.price !== null).map((p) => p.price)
  );
  assert.equal(recommended[0].price, minPrice);
}
for (let v = 6000; v <= 35000; v += 1000) {
  const res = getPlan('wohnwagen', v, 2024, false);
  const recommended = res.plans.filter((p) => p.isRecommended);
  assert.equal(recommended.length, 1, `Exactly 1 recommended for Wohnwagen ${v}`);
  const minPrice = Math.min(
    ...res.plans.filter((p) => p.price !== null).map((p) => p.price)
  );
  assert.equal(recommended[0].price, minPrice);
}
console.log('Full Range Sweep OK');

console.log('=== 5. Age 21+ Liability-Only Rule ===');
const oldWohnmobil = getPlan('wohnmobil', 55000, 2005, true); // age 21
assert.equal(oldWohnmobil.plans[2].isLiabilityOnly, true);
assert.equal(oldWohnmobil.plans[2].price, 1016.4);
assert.equal(
  oldWohnmobil.plans[2].specialNote,
  'Ab 21 Jahren Fahrzeugalter: nur Haftpflichtversicherung möglich'
);

const oldWohnwagen = getPlan('wohnwagen', 15000, 2000, true); // age 26
assert.equal(oldWohnwagen.plans[2].isLiabilityOnly, true);
assert.equal(oldWohnwagen.plans[2].price, 375.6);
console.log('Age 21+ Rule OK');

console.log('=== 6. Outside Ranges & Formatting ===');
const outside = getPlan('wohnmobil', 300000, 2024, false);
assert.equal(outside.allUnavailable, true);
assert.equal(outside.plans[0].statusText, 'Preis auf Anfrage');
assert.equal(outside.plans[1].statusText, 'Preis auf Anfrage');
assert.equal(outside.plans[2].statusText, 'Preis auf Anfrage');
assert.equal(formatEuroDE(3082.99), '3.082,99\u00a0€'.replace('\u00a0', ' '));
console.log('All backend calculator verification checks PASSED!');
