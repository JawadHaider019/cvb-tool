import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth.js';
import { getDb } from '@/lib/db.js';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
  }
  const db = getDb();
  return NextResponse.json({
    sections: db.sections,
    insuranceConfig: db.insuranceConfig,
    faqs: db.faqs,
    requests: db.requests,
    generalSettings: db.generalSettings,
    auditLog: db.auditLog.slice(0, 50),
  });
}

