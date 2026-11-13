import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth.js';
import { getDb } from '@/lib/db.js';

export const dynamic = 'force-dynamic';

function csvEscape(val) {
  const str = String(val ?? '').replace(/"/g, '""');
  return `"${str}"`;
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
  }
  const db = getDb();
  const headers = [
    'ID',
    'Datum',
    'Status',
    'Tarif',
    'Preis (EUR)',
    'Preisstatus',
    'Fahrzeugart',
    'Kaufpreis (EUR)',
    'Gerundet V (EUR)',
    'Baujahr',
    'Alter',
    'Veruntreuung',
    'Name',
    'Firma',
    'E-Mail',
    'Telefon',
    'Nachricht',
    'Notizen',
  ];

  const rows = db.requests.map((r) => [
    r.id,
    r.createdAt,
    r.status,
    r.chosenPlan,
    r.calculatedPrice !== null ? r.calculatedPrice.toFixed(2).replace('.', ',') : '',
    r.priceStatusText || '',
    r.vehicleType === 'wohnmobil' ? 'Wohnmobil' : 'Wohnwagen',
    r.kaufpreis,
    r.roundedValue,
    r.baujahr,
    r.vehicleAge,
    r.veruntreuung ? 'Ja' : 'Nein',
    r.name,
    r.firma,
    r.email,
    r.telefon,
    r.nachricht,
    r.notes,
  ]);

  const csvContent =
    '\uFEFF' +
    [headers, ...rows].map((row) => row.map(csvEscape).join(';')).join('\r\n');

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="versicherungsanfragen.csv"',
    },
  });
}

