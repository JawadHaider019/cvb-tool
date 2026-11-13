import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db.js';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = getDb();
  return NextResponse.json({
    sections: db.sections,
    insuranceConfig: db.insuranceConfig,
    faqs: db.faqs,
    generalSettings: db.generalSettings,
  });
}

