import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth.js';
import { getDb, saveDb, recordAudit } from '@/lib/db.js';

export async function PUT(req) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (!Array.isArray(body?.faqs)) {
    return NextResponse.json({ error: 'Ungültige FAQ-Daten' }, { status: 400 });
  }

  const db = getDb();
  db.faqs = body.faqs.map((f, i) => ({
    ...f,
    sortOrder: i + 1,
  }));
  recordAudit(db, 'FAQS_UPDATED', { count: db.faqs.length });
  saveDb(db);

  return NextResponse.json({ success: true, faqs: db.faqs });
}

