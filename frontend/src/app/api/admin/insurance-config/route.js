import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth.js';
import { getDb, saveDb, recordAudit } from '@/lib/db.js';

export async function PUT(req) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const config = body?.insuranceConfig;

  if (!config || !config.cvbPlus || !config.cvbPremium || !config.cvbFlex) {
    return NextResponse.json(
      { error: 'Ungültige Tarifkonfiguration' },
      { status: 400 }
    );
  }

  const db = getDb();
  db.insuranceConfig = config;
  recordAudit(db, 'INSURANCE_CONFIG_UPDATED', {
    updatedAt: new Date().toISOString(),
  });
  saveDb(db);

  return NextResponse.json({
    success: true,
    insuranceConfig: db.insuranceConfig,
  });
}

