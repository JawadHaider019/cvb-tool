import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth.js';
import { getDb, saveDb, recordAudit } from '@/lib/db.js';

export async function PUT(req) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (!Array.isArray(body?.sections)) {
    return NextResponse.json({ error: 'Ungültige Sektionsdaten' }, { status: 400 });
  }

  const db = getDb();
  db.sections = body.sections.map((s, idx) => ({
    ...s,
    order: idx + 1,
  }));
  recordAudit(db, 'SECTIONS_UPDATED', { count: db.sections.length });
  saveDb(db);

  return NextResponse.json({ success: true, sections: db.sections });
}

