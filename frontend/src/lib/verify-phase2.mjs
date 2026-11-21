import assert from 'node:assert/strict';
import {
  calculateInsurancePlans,
  formatEuroDE,
  formatEuroIntDE,
  roundUpToThousand,
} from './calculator.js';
import fs from 'node:fs';
import path from 'node:path';

// Read database configuration
const dbPath = path.resolve(process.cwd(), 'data/db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const config = db.insuranceConfig;

console.log('----------------------------------------------------');
console.log('PHASE 2 COMPREHENSIVE VERIFICATION SUITE');
console.log('----------------------------------------------------');

const CURRENT_YEAR = 2026;

function runCalc(vehicleType, kaufpreis, baujahr, veruntreuung) {
  return calculateInsurancePlans(
    { vehicleType, kaufpreis, baujahr, veruntreuung, currentYear: CURRENT_YEAR },
    config
  );
}

// 1. ROUNDING RULE
console.log('\n[1] Testing Rounding Rules...');
assert.equal(roundUpToThousand(47500), 48000, '47,500 should round up to 48,000');
assert.equal(roundUpToThousand(50000), 50000, '50,000 stays 50,000');
assert.equal(roundUpToThousand(50001), 51000, '50,001 should round up to 51,000');
assert.equal(roundUpToThousand(15000), 15000, '15,000 stays 15,000');
assert.equal(roundUpToThousand(6001), 7000, '6,001 should round up to 7,000');
console.log('✓ Rounding rules: PASS');

// 2. WOHNMOBIL 8 CHECKPOINTS FROM BRIEF (PAGE 5)
console.log('\n[2] Testing Wohnmobil 8 Checkpoints from Brief...');
const wmCheckpoints = [
  { v: 50000, plus: 3082.99, prem: 3250.0, flexNo: 2382.0, flexYes: 2739.0 },
  { v: 60000, plus: 3082.99, prem: 3250.0, flexNo: 2672.0, flexYes: 3029.0 },
  { v: 61000, plus: 3082.99, prem: 3250.0, flexNo: 2701.0, flexYes: 3147.25 },
  { v: 71000, plus: 3082.99, prem: 3250.0, flexNo: 2991.0, flexYes: 3437.25 },
  { v: 72000, plus: 3381.44, prem: 3250.0, flexNo: 3020.0, flexYes: 3466.25 },
  { v: 75000, plus: 3381.44, prem: 3250.0, flexNo: 3107.0, flexYes: 3553.25 },
  { v: 76000, plus: 3381.44, prem: 3250.0, flexNo: 3136.0, flexYes: 'k. A.' },
  { v: 90000, plus: 3381.44, prem: 3250.0, flexNo: 3542.0, flexYes: 'k. A.' },
];

for (const cp of wmCheckpoints) {
  const withoutVer = runCalc('wohnmobil', cp.v, 2024, false);
  const withVer = runCalc('wohnmobil', cp.v, 2024, true);

  assert.equal(withoutVer.plans[0].price, cp.plus, `Wohnmobil ${cp.v} Plus without Veruntreuung`);
  assert.equal(withoutVer.plans[1].price, cp.prem, `Wohnmobil ${cp.v} Premium without Veruntreuung`);
  assert.equal(withoutVer.plans[2].price, cp.flexNo, `Wohnmobil ${cp.v} Flex without Veruntreuung`);

  assert.equal(withVer.plans[0].price, cp.plus, `Wohnmobil ${cp.v} Plus with Veruntreuung`);
  assert.equal(withVer.plans[1].price, cp.prem, `Wohnmobil ${cp.v} Premium with Veruntreuung`);
  if (cp.flexYes === 'k. A.') {
    assert.equal(withVer.plans[2].price, null, `Wohnmobil ${cp.v} Flex with Veruntreuung price should be null`);
    assert.equal(withVer.plans[2].statusText, 'k. A.', `Wohnmobil ${cp.v} Flex with Veruntreuung status`);
  } else {
    assert.equal(withVer.plans[2].price, cp.flexYes, `Wohnmobil ${cp.v} Flex with Veruntreuung price`);
  }
}
console.log('✓ Wohnmobil 8 checkpoints: PASS (All values identical to Excel table)');

// 3. WOHNWAGEN 8 CHECKPOINTS FROM BRIEF (PAGE 6)
console.log('\n[3] Testing Wohnwagen 8 Checkpoints from Brief...');
const wwCheckpoints = [
  { v: 6000, plus: 1196.66, prem: 1330.0, flexNo: 973.0, flexYes: 1092.0 },
  { v: 15000, plus: 1196.66, prem: 1330.0, flexNo: 973.0, flexYes: 1092.0 },
  { v: 16000, plus: 1196.66, prem: 1330.0, flexNo: 973.0, flexYes: 1151.5 },
  { v: 20000, plus: 1196.66, prem: 1330.0, flexNo: 973.0, flexYes: 1151.5 },
  { v: 21000, plus: 1196.66, prem: 1330.0, flexNo: 1006.0, flexYes: 1184.5 },
  { v: 25000, plus: 1196.66, prem: 1330.0, flexNo: 1138.0, flexYes: 1316.5 },
  { v: 26000, plus: 1196.66, prem: 1330.0, flexNo: 1171.0, flexYes: 'Preis auf Anfrage' },
  { v: 35000, plus: 1196.66, prem: 1330.0, flexNo: 1468.0, flexYes: 'Preis auf Anfrage' },
];

for (const cp of wwCheckpoints) {
  const withoutVer = runCalc('wohnwagen', cp.v, 2024, false);
  const withVer = runCalc('wohnwagen', cp.v, 2024, true);

  assert.equal(withoutVer.plans[0].price, cp.plus, `Wohnwagen ${cp.v} Plus without Veruntreuung`);
  assert.equal(withoutVer.plans[1].price, cp.prem, `Wohnwagen ${cp.v} Premium without Veruntreuung`);
  assert.equal(withoutVer.plans[2].price, cp.flexNo, `Wohnwagen ${cp.v} Flex without Veruntreuung`);

  assert.equal(withVer.plans[0].price, cp.plus, `Wohnwagen ${cp.v} Plus with Veruntreuung`);
  assert.equal(withVer.plans[1].price, cp.prem, `Wohnwagen ${cp.v} Premium with Veruntreuung`);

  if (cp.flexYes === 'Preis auf Anfrage') {
    assert.equal(withVer.plans[2].price, null, `Wohnwagen ${cp.v} Flex with Veruntreuung price should be null`);
    assert.equal(withVer.plans[2].statusText, 'Preis auf Anfrage', `Wohnwagen ${cp.v} Flex with Veruntreuung status`);
  } else {
    assert.equal(withVer.plans[2].price, cp.flexYes, `Wohnwagen ${cp.v} Flex with Veruntreuung price`);
  }
}
console.log('✓ Wohnwagen 8 checkpoints: PASS (All values identical to Excel table)');

// 4. FULL ROW-BY-ROW EXCEL VERIFICATION SWEEP & DYNAMIC RECOMMENDATION BADGE
console.log('\n[4] Sweeping EVERY 1.000 € row (Wohnmobil 50k–90k & Wohnwagen 6k–35k, with/without Veruntreuung)...');
for (let v = 50000; v <= 90000; v += 1000) {
  for (const ver of [false, true]) {
    const res = runCalc('wohnmobil', v, 2024, ver);
    const expectedPlus = v >= 72000 ? 3381.44 : 3082.99;
    const expectedPrem = 3250;
    const baseFlex = 847 + (v * 2.9) / 100 + 85;
    let expectedFlex = null;
    if (!ver) {
      expectedFlex = Math.round((baseFlex + Number.EPSILON) * 100) / 100;
    } else if (v <= 60000) {
      expectedFlex = Math.round((baseFlex + 357 + Number.EPSILON) * 100) / 100;
    } else if (v <= 75000) {
      expectedFlex = Math.round((baseFlex + 446.25 + Number.EPSILON) * 100) / 100;
    }
    assert.equal(res.plans[0].price, expectedPlus, `WM ${v} ver=${ver} Plus`);
    assert.equal(res.plans[1].price, expectedPrem, `WM ${v} ver=${ver} Prem`);
    assert.equal(res.plans[2].price, expectedFlex, `WM ${v} ver=${ver} Flex`);
    if (ver && v > 75000) {
      assert.equal(res.plans[2].statusText, 'k. A.');
    }

    const recommended = res.plans.filter((p) => p.isRecommended);
    assert.equal(recommended.length, 1, `Exactly 1 plan must be marked Empfehlung for Wohnmobil ${v} ver=${ver}`);
    const minPrice = Math.min(...res.plans.filter((p) => p.price !== null).map((p) => p.price));
    assert.equal(recommended[0].price, minPrice, `Recommended plan must be cheapest for Wohnmobil ${v} ver=${ver}`);
  }
}

for (let v = 6000; v <= 35000; v += 1000) {
  for (const ver of [false, true]) {
    const res = runCalc('wohnwagen', v, 2024, ver);
    const expectedPlus = 1196.66;
    const expectedPrem = 1330;
    const baseFlex = 313 + (Math.max(v, 20000) * 3.3) / 100;
    let expectedFlex = null;
    if (!ver) {
      expectedFlex = Math.round((baseFlex + Number.EPSILON) * 100) / 100;
    } else if (v <= 15000) {
      expectedFlex = Math.round((baseFlex + 119 + Number.EPSILON) * 100) / 100;
    } else if (v <= 25000) {
      expectedFlex = Math.round((baseFlex + 178.5 + Number.EPSILON) * 100) / 100;
    }
    assert.equal(res.plans[0].price, expectedPlus, `WW ${v} ver=${ver} Plus`);
    assert.equal(res.plans[1].price, expectedPrem, `WW ${v} ver=${ver} Prem`);
    assert.equal(res.plans[2].price, expectedFlex, `WW ${v} ver=${ver} Flex`);
    if (ver && v > 25000) {
      assert.equal(res.plans[2].statusText, 'Preis auf Anfrage');
    }

    const recommended = res.plans.filter((p) => p.isRecommended);
    assert.equal(recommended.length, 1, `Exactly 1 plan must be marked Empfehlung for Wohnwagen ${v} ver=${ver}`);
    const minPrice = Math.min(...res.plans.filter((p) => p.price !== null).map((p) => p.price));
    assert.equal(recommended[0].price, minPrice, `Recommended plan must be cheapest for Wohnwagen ${v} ver=${ver}`);
  }
}
console.log('✓ Full row-by-row sweep (82 WM + 60 WW scenarios = 142 checks) & dynamic Empfehlung: PASS');

// 5. VEHICLE AGE BOUNDARIES (AGE 20 VS AGE 21)
console.log('\n[5] Testing Vehicle Age 20 vs 21+ Boundary...');
const age20Wm = runCalc('wohnmobil', 65000, 2006, false); // 2026 - 2006 = 20 -> Kasko normal
assert.equal(age20Wm.plans[2].isLiabilityOnly, false, 'Age 20 still gets Kasko');
assert.equal(age20Wm.plans[2].price, 2817, 'Age 20 Wohnmobil 65k Flex ohne Ver = 847 + 1885 + 85 = 2817');

const oldWm = runCalc('wohnmobil', 65000, 2005, true); // Age 21
assert.equal(oldWm.plans[2].isLiabilityOnly, true, 'Flex should be liability-only for vehicle age >= 21');
assert.equal(oldWm.plans[2].price, 1016.4, 'Flex liability-only price for Wohnmobil must be 1,016.40 €');
assert.equal(oldWm.plans[2].specialNote, 'Ab 21 Jahren Fahrzeugalter: nur Haftpflichtversicherung möglich');

const oldWw = runCalc('wohnwagen', 15000, 2000, true); // Age 26
assert.equal(oldWw.plans[2].isLiabilityOnly, true, 'Flex should be liability-only for vehicle age >= 21');
assert.equal(oldWw.plans[2].price, 375.6, 'Flex liability-only price for Wohnwagen must be 375.60 €');
console.log('✓ Vehicle Age 20 / 21+ boundary rule: PASS');

// 6. OUTSIDE RANGES (BELOW MIN, ABOVE 90K/150K/250K)
console.log('\n[6] Testing Outside Ranges & Boundaries...');
const belowMinWm = runCalc('wohnmobil', 30000, 2024, false); // Below Plus/Prem min 50k; Flex applies min 50k Kasko basis
assert.equal(belowMinWm.plans[0].statusText, 'Preis auf Anfrage');
assert.equal(belowMinWm.plans[1].statusText, 'Preis auf Anfrage');
assert.equal(belowMinWm.plans[2].price, 2382, 'Flex uses minimum V 50,000 for Wohnmobil under 50k');

const over250k = runCalc('wohnmobil', 250001, 2024, false);
assert.equal(over250k.allUnavailable, true, 'Should mark allUnavailable when rounded V = 251,000 > 250,000');
assert.equal(over250k.plans[0].statusText, 'Preis auf Anfrage');
assert.equal(over250k.plans[1].statusText, 'Preis auf Anfrage');
assert.equal(over250k.plans[2].statusText, 'Preis auf Anfrage');
console.log('✓ Outside ranges handling: PASS');

// 7. FORMATTING DISPLAY
console.log('\n[7] Testing Number Formatting...');
assert.equal(formatEuroIntDE(50000), '50.000 €');
assert.equal(formatEuroDE(3082.99).replace(/\u00a0/g, ' '), '3.082,99 €');
assert.equal(formatEuroDE(1016.4).replace(/\u00a0/g, ' '), '1.016,40 €');
console.log('✓ Formatting: PASS');

console.log('\n----------------------------------------------------');
console.log('ALL PHASE 2 UNIT & DOMAIN RULES PASSED (100%)');
console.log('----------------------------------------------------');
