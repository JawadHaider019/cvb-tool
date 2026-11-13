import React from 'react';
import { isAdminAuthenticated } from '@/lib/auth.js';
import { AdminPanel } from '@/components/AdminPanel.jsx';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin-Bereich | SelbstfahrerVermietversicherung.online',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();
  return <AdminPanel initialAuthenticated={authenticated} />;
}

