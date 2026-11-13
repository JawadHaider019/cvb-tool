import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth.js';
import { getDb, saveDb, recordAudit } from '@/lib/db.js';

export async function PATCH(req, context) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
  }
  const { id } = await context.params;
  const body = await req.json().catch(() => null);

  const db = getDb();
  const idx = db.requests.findIndex((r) => r.id === id);
  if (idx === -1) {
    return NextResponse.json(
      { error: 'Anfrage nicht gefunden' },
      { status: 404 }
    );
  }

  if (body?.status) {
    const validStatuses = ['neu', 'in_bearbeitung', 'erledigt'];
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json({ error: 'Ungültiger Status' }, { status: 400 });
    }
    db.requests[idx].status = body.status;
  }

  if (typeof body?.notes === 'string') {
    db.requests[idx].notes = body.notes;
  }

  recordAudit(db, 'REQUEST_UPDATED', { id, status: db.requests[idx].status });
  saveDb(db);

  return NextResponse.json({ success: true, request: db.requests[idx] });
}

export async function DELETE(_req, context) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
  }
  const { id } = await context.params;
  const db = getDb();
  const before = db.requests.length;
  db.requests = db.requests.filter((r) => r.id !== id);
  if (db.requests.length === before) {
    return NextResponse.json(
      { error: 'Anfrage nicht gefunden' },
      { status: 404 }
    );
  }
  recordAudit(db, 'REQUEST_DELETED', { id });
  saveDb(db);

  return NextResponse.json({ success: true });
}

