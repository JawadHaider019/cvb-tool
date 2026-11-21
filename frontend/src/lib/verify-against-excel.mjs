import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { calculateInsurancePlans } from './calculator.js';

const dbPath = path.resolve(process.cwd(), 'data/db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const config = db.insuranceConfig;
const CURRENT_YEAR = 2026;

// Exact 1:1 Excel rows from Übersicht_Versicherungskosten_2027.xlsx

// 1. Wohnmobil ohne Veruntreuungsversicherung (50.000 - 90.000)
const wohnmobilOhneVeruntreuung = [
  [50000, 3082.99, 3250, 2382],
  [51000, 3082.99, 3250, 2411],
  [52000, 3082.99, 3250, 2440],
  [53000, 3082.99, 3250, 2469],
  [54000, 3082.99, 3250, 2498],
  [55000, 3082.99, 3250, 2527],
  [56000, 3082.99, 3250, 2556],
  [57000, 3082.99, 3250, 2585],
  [58000, 3082.99, 3250, 2614],
  [59000, 3082.99, 3250, 2643],
  [60000, 3082.99, 3250, 2672],
  [61000, 3082.99, 3250, 2701],
  [62000, 3082.99, 3250, 2730],
  [63000, 3082.99, 3250, 2759],
  [64000, 3082.99, 3250, 2788],
  [65000, 3082.99, 3250, 2817],
  [66000, 3082.99, 3250, 2846],
  [67000, 3082.99, 3250, 2875],
  [68000, 3082.99, 3250, 2904],
  [69000, 3082.99, 3250, 2933],
  [70000, 3082.99, 3250, 2962],
  [71000, 3082.99, 3250, 2991],
  [72000, 3381.44, 3250, 3020],
  [73000, 3381.44, 3250, 3049],
  [74000, 3381.44, 3250, 3078],
  [75000, 3381.44, 3250, 3107],
  [76000, 3381.44, 3250, 3136],
  [77000, 3381.44, 3250, 3165],
  [78000, 3381.44, 3250, 3194],
  [79000, 3381.44, 3250, 3223],
  [80000, 3381.44, 3250, 3252],
  [81000, 3381.44, 3250, 3281],
  [82000, 3381.44, 3250, 3310],
  [83000, 3381.44, 3250, 3339],
  [84000, 3381.44, 3250, 3368],
  [85000, 3381.44, 3250, 3397],
  [86000, 3381.44, 3250, 3426],
  [87000, 3381.44, 3250, 3455],
  [88000, 3381.44, 3250, 3484],
  [89000, 3381.44, 3250, 3513],
  [90000, 3381.44, 3250, 3542],
];

// 2. Wohnmobil mit Veruntreuungsversicherung (50.000 - 90.000)
const wohnmobilMitVeruntreuung = [
  [50000, 3082.99, 3250, 2739],
  [51000, 3082.99, 3250, 2768],
  [52000, 3082.99, 3250, 2797],
  [53000, 3082.99, 3250, 2826],
  [54000, 3082.99, 3250, 2855],
  [55000, 3082.99, 3250, 2884],
  [56000, 3082.99, 3250, 2913],
  [57000, 3082.99, 3250, 2942],
  [58000, 3082.99, 3250, 2971],
  [59000, 3082.99, 3250, 3000],
  [60000, 3082.99, 3250, 3029],
  [61000, 3082.99, 3250, 3147.25],
  [62000, 3082.99, 3250, 3176.25],
  [63000, 3082.99, 3250, 3205.25],
  [64000, 3082.99, 3250, 3234.25],
  [65000, 3082.99, 3250, 3263.25],
  [66000, 3082.99, 3250, 3292.25],
  [67000, 3082.99, 3250, 3321.25],
  [68000, 3082.99, 3250, 3350.25],
  [69000, 3082.99, 3250, 3379.25],
  [70000, 3082.99, 3250, 3408.25],
  [71000, 3082.99, 3250, 3437.25],
  [72000, 3381.44, 3250, 3466.25],
  [73000, 3381.44, 3250, 3495.25],
  [74000, 3381.44, 3250, 3524.25],
  [75000, 3381.44, 3250, 3553.25],
  [76000, 3381.44, 3250, 'k. A.'],
  [77000, 3381.44, 3250, 'k. A.'],
  [78000, 3381.44, 3250, 'k. A.'],
  [79000, 3381.44, 3250, 'k. A.'],
  [80000, 3381.44, 3250, 'k. A.'],
  [81000, 3381.44, 3250, 'k. A.'],
  [82000, 3381.44, 3250, 'k. A.'],
  [83000, 3381.44, 3250, 'k. A.'],
  [84000, 3381.44, 3250, 'k. A.'],
  [85000, 3381.44, 3250, 'k. A.'],
  [86000, 3381.44, 3250, 'k. A.'],
  [87000, 3381.44, 3250, 'k. A.'],
  [88000, 3381.44, 3250, 'k. A.'],
  [89000, 3381.44, 3250, 'k. A.'],
  [90000, 3381.44, 3250, 'k. A.'],
];

// 3. Wohnwagen ohne Veruntreuung (6.000 - 35.000)
const wohnwagenOhneVeruntreuung = [
  [6000, 1196.66, 1330, 973],
  [7000, 1196.66, 1330, 973],
  [8000, 1196.66, 1330, 973],
  [9000, 1196.66, 1330, 973],
  [10000, 1196.66, 1330, 973],
  [11000, 1196.66, 1330, 973],
  [12000, 1196.66, 1330, 973],
  [13000, 1196.66, 1330, 973],
  [14000, 1196.66, 1330, 973],
  [15000, 1196.66, 1330, 973],
  [16000, 1196.66, 1330, 973],
  [17000, 1196.66, 1330, 973],
  [18000, 1196.66, 1330, 973],
  [19000, 1196.66, 1330, 973],
  [20000, 1196.66, 1330, 973],
  [21000, 1196.66, 1330, 1006],
  [22000, 1196.66, 1330, 1039],
  [23000, 1196.66, 1330, 1072],
  [24000, 1196.66, 1330, 1105],
  [25000, 1196.66, 1330, 1138],
  [26000, 1196.66, 1330, 1171],
  [27000, 1196.66, 1330, 1204],
  [28000, 1196.66, 1330, 1237],
  [29000, 1196.66, 1330, 1270],
  [30000, 1196.66, 1330, 1303],
  [31000, 1196.66, 1330, 1336],
  [32000, 1196.66, 1330, 1369],
  [33000, 1196.66, 1330, 1402],
  [34000, 1196.66, 1330, 1435],
  [35000, 1196.66, 1330, 1468],
];

// 4. Wohnwagen mit Veruntreuung (6.000 - 35.000)
const wohnwagenMitVeruntreuung = [
  [6000, 1196.66, 1330, 1092],
  [7000, 1196.66, 1330, 1092],
  [8000, 1196.66, 1330, 1092],
  [9000, 1196.66, 1330, 1092],
  [10000, 1196.66, 1330, 1092],
  [11000, 1196.66, 1330, 1092],
  [12000, 1196.66, 1330, 1092],
  [13000, 1196.66, 1330, 1092],
  [14000, 1196.66, 1330, 1092],
  [15000, 1196.66, 1330, 1092],
  [16000, 1196.66, 1330, 1151.5],
  [17000, 1196.66, 1330, 1151.5],
  [18000, 1196.66, 1330, 1151.5],
  [19000, 1196.66, 1330, 1151.5],
  [20000, 1196.66, 1330, 1151.5],
  [21000, 1196.66, 1330, 1184.5],
  [22000, 1196.66, 1330, 1217.5],
  [23000, 1196.66, 1330, 1250.5],
  [24000, 1196.66, 1330, 1283.5],
  [25000, 1196.66, 1330, 1316.5],
  [26000, 1196.66, 1330, 'Auf Anfrage'],
  [27000, 1196.66, 1330, 'Auf Anfrage'],
  [28000, 1196.66, 1330, 'Auf Anfrage'],
  [29000, 1196.66, 1330, 'Auf Anfrage'],
  [30000, 1196.66, 1330, 'Auf Anfrage'],
  [31000, 1196.66, 1330, 'Auf Anfrage'],
  [32000, 1196.66, 1330, 'Auf Anfrage'],
  [33000, 1196.66, 1330, 'Auf Anfrage'],
  [34000, 1196.66, 1330, 'Auf Anfrage'],
  [35000, 1196.66, 1330, 'Auf Anfrage'],
];

function verifyTable(label, vehicleType, veruntreuung, rows) {
  let cellsChecked = 0;
  for (const [v, expPlus, expPrem, expFlex] of rows) {
    const res = calculateInsurancePlans(
      { vehicleType, kaufpreis: v, baujahr: 2024, veruntreuung, currentYear: CURRENT_YEAR },
      config
    );
    const [plus, prem, flex] = res.plans;

    assert.equal(plus.price, expPlus, `${label} V=${v} CVB-Plus mismatch`);
    assert.equal(prem.price, expPrem, `${label} V=${v} CVB-Premium mismatch`);

    if (typeof expFlex === 'number') {
      assert.equal(flex.price, expFlex, `${label} V=${v} CVB-Flex mismatch`);
    } else if (expFlex === 'k. A.') {
      assert.equal(flex.price, null, `${label} V=${v} CVB-Flex should be null`);
      assert.equal(flex.statusText, 'k. A.', `${label} V=${v} CVB-Flex statusText`);
    } else if (expFlex === 'Auf Anfrage') {
      assert.equal(flex.price, null, `${label} V=${v} CVB-Flex should be null`);
      assert.ok(
        flex.statusText && flex.statusText.toLowerCase().includes('auf anfrage'),
        `${label} V=${v} CVB-Flex statusText should indicate Auf Anfrage (got: ${flex.statusText})`
      );
    }

    cellsChecked += 3;
  }
  console.log(`✓ ${label}: ${rows.length} rows (${cellsChecked} cells) matched 100%`);
  return cellsChecked;
}

console.log('====================================================');
console.log('EXCEL SOURCE-OF-TRUTH VERIFICATION (ALL 142 ROWS)');
console.log('====================================================');

let totalCells = 0;
totalCells += verifyTable('1. Wohnmobil ohne Veruntreuung', 'wohnmobil', false, wohnmobilOhneVeruntreuung);
totalCells += verifyTable('2. Wohnmobil mit Veruntreuung', 'wohnmobil', true, wohnmobilMitVeruntreuung);
totalCells += verifyTable('3. Wohnwagen ohne Veruntreuung', 'wohnwagen', false, wohnwagenOhneVeruntreuung);
totalCells += verifyTable('4. Wohnwagen mit Veruntreuung', 'wohnwagen', true, wohnwagenMitVeruntreuung);

console.log(`\nTotal verified: 142 rows / ${totalCells} individual price cells — 0 differences!`);
