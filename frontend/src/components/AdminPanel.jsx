'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Inbox,
  FileEdit,
  DollarSign,
  HelpCircle,
  Settings,
  LogOut,
  ExternalLink,
  Search,
  Download,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Save,
  Plus,
  Shield,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { formatEuroDE, formatEuroIntDE } from '@/lib/calculator.js';

export const AdminPanel = ({ initialAuthenticated }) => {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [loadingData, setLoadingData] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [requests, setRequests] = useState([]);
  const [sections, setSections] = useState([]);
  const [insuranceConfig, setInsuranceConfig] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [settings, setSettings] = useState(null);

  // Requests filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Password change
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');

  const notify = (msg, isError = false) => {
    if (isError) {
      setErrorMessage(msg);
      setSaveMessage(null);
    } else {
      setSaveMessage(msg);
      setErrorMessage(null);
    }
    setTimeout(() => {
      setSaveMessage(null);
      setErrorMessage(null);
    }, 4500);
  };

  const fetchAdminData = useCallback(async () => {
    setLoadingData(true);
    try {
      const res = await fetch('/api/admin/data', { cache: 'no-store' });
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      const data = await res.json();
      setRequests(data.requests || []);
      setSections(data.sections || []);
      setInsuranceConfig(data.insuranceConfig || null);
      setFaqs(data.faqs || []);
      setSettings(data.generalSettings || null);
    } catch {
      notify('Fehler beim Laden der Admin-Daten.', true);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchAdminData();
    }
  }, [authenticated, fetchAdminData]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setLoginError(json.error || 'Anmeldung fehlgeschlagen.');
      } else {
        setPassword('');
        setAuthenticated(true);
      }
    } catch {
      setLoginError('Netzwerkfehler bei der Anmeldung.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthenticated(false);
  };

  // --- Requests Actions ---
  const handleRequestUpdate = async (id, patch) => {
    const res = await fetch(`/api/admin/requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      const json = await res.json();
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? json.request : r))
      );
      notify('Anfrage aktualisiert.');
    } else {
      notify('Aktualisierung fehlgeschlagen.', true);
    }
  };

  const handleRequestDelete = async (id) => {
    if (!confirm('Anfrage wirklich unwiderruflich löschen?')) return;
    const res = await fetch(`/api/admin/requests/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setRequests((prev) => prev.filter((r) => r.id !== id));
      notify('Anfrage gelöscht.');
    } else {
      notify('Löschen fehlgeschlagen.', true);
    }
  };

  // --- Sections Actions ---
  const moveSection = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    const copy = [...sections];
    const [moved] = copy.splice(index, 1);
    copy.splice(target, 0, moved);
    setSections(copy.map((s, i) => ({ ...s, order: i + 1 })));
  };

  const saveSections = async () => {
    const res = await fetch('/api/admin/sections', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sections }),
    });
    if (res.ok) {
      notify('Startseiten-Sektionen gespeichert und sofort live!');
    } else {
      notify('Fehler beim Speichern der Sektionen.', true);
    }
  };

  // --- Insurance Config Actions ---
  const saveInsuranceConfig = async () => {
    if (!insuranceConfig) return;
    const res = await fetch('/api/admin/insurance-config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ insuranceConfig }),
    });
    if (res.ok) {
      notify('Preise & Tarifregeln gespeichert und sofort im Rechner aktiv!');
    } else {
      notify('Fehler beim Speichern der Tarifkonfiguration.', true);
    }
  };

  // --- FAQs Actions ---
  const saveFaqs = async () => {
    const res = await fetch('/api/admin/faqs', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ faqs }),
    });
    if (res.ok) {
      notify('FAQs gespeichert!');
    } else {
      notify('Fehler beim Speichern der FAQs.', true);
    }
  };

  // --- Settings Actions ---
  const saveSettings = async () => {
    if (!settings) return;
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        generalSettings: settings,
        currentPassword: newPw ? currentPw : undefined,
        newPassword: newPw || undefined,
      }),
    });
    const json = await res.json();
    if (res.ok) {
      setCurrentPw('');
      setNewPw('');
      notify('Einstellungen gespeichert!');
    } else {
      notify(json.error || 'Fehler beim Speichern.', true);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#F4F2E6] flex items-center justify-center p-4">
        <div className="bg-white rounded-[28px] border border-[#A09048]/35 shadow-xl max-w-md w-full p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#384808] text-[#A09048] flex items-center justify-center">
              <Shield size={20} />
            </div>
            <div>
              <h1 className="font-spartan text-2xl font-black text-[#384808]">
                CVB Admin-Login
              </h1>
              <p className="text-xs text-[#585828]">
                SelbstfahrerVermietversicherung.online
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#384808] mb-1">
                Admin-Passwort
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Passwort eingeben"
                className="w-full rounded-xl border border-[#A09048]/40 px-4 py-3 text-sm text-[#384808] focus:outline-none focus:border-[#384808]"
              />
            </div>

            {loginError && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
                <AlertCircle size={15} />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="tech-cta-primary w-full justify-center"
            >
              <span>{loginLoading ? 'Prüfe...' : 'Anmelden'}</span>
            </button>
          </form>

          <div className="text-center">
            <Link
              href="/"
              className="text-xs font-semibold text-[#585828] hover:text-[#384808] underline"
            >
              Zurück zur Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredRequests = requests.filter((r) => {
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.chosenPlan.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const navItems = [
    { id: 'dashboard', label: 'Übersicht', icon: LayoutDashboard },
    { id: 'requests', label: `Anfragen (${requests.length})`, icon: Inbox },
    { id: 'sections', label: 'Startseite & Sektionen', icon: FileEdit },
    { id: 'prices', label: 'Preise & Tarifregeln', icon: DollarSign },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'settings', label: 'Einstellungen', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F4F2E6]/50 flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-[#384808] text-white px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 border-b border-[#A09048]/35">
        <div className="flex items-center gap-3">
          <Shield size={20} className="text-[#A09048]" />
          <div>
            <span className="font-spartan font-black text-lg block leading-none">
              CVB Admin-Bereich
            </span>
            <span className="text-[11px] text-[#F4F2E6]/75">
              SelbstfahrerVermietversicherung.online
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold transition-colors"
          >
            <span>Website ansehen</span>
            <ExternalLink size={13} />
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#A09048] hover:bg-[#889028] text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut size={13} />
            <span>Abmelden</span>
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-spartan font-bold text-sm transition-all cursor-pointer ${
                  active
                    ? 'bg-[#384808] text-white shadow-md'
                    : 'bg-white text-[#384808] border border-[#A09048]/25 hover:bg-[#F4F2E6]'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Tab Body */}
        <section className="lg:col-span-9 space-y-5">
          {saveMessage && (
            <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-300 px-4 py-3 text-sm font-semibold text-emerald-800">
              <CheckCircle2 size={18} />
              <span>{saveMessage}</span>
            </div>
          )}
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-2xl bg-red-50 border border-red-300 px-4 py-3 text-sm font-semibold text-red-800">
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          {loadingData ? (
            <div className="bg-white rounded-[24px] p-8 text-center text-sm text-[#585828]">
              Lade Daten...
            </div>
          ) : (
            <>
              {/* 1. DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl border border-[#A09048]/30 p-5">
                      <p className="text-xs font-bold uppercase text-[#889028]">
                        Anfragen gesamt
                      </p>
                      <p className="font-spartan text-4xl font-black text-[#384808] mt-1">
                        {requests.length}
                      </p>
                    </div>
                    <div className="bg-white rounded-2xl border border-[#A09048]/30 p-5">
                      <p className="text-xs font-bold uppercase text-[#889028]">
                        Neue Anfragen
                      </p>
                      <p className="font-spartan text-4xl font-black text-[#384808] mt-1">
                        {requests.filter((r) => r.status === 'neu').length}
                      </p>
                    </div>
                    <div className="bg-white rounded-2xl border border-[#A09048]/30 p-5">
                      <p className="text-xs font-bold uppercase text-[#889028]">
                        Aktive Sektionen
                      </p>
                      <p className="font-spartan text-4xl font-black text-[#384808] mt-1">
                        {sections.filter((s) => s.visible).length} /{' '}
                        {sections.length}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-[#A09048]/30 p-6 space-y-2">
                    <h2 className="font-spartan font-black text-xl text-[#384808]">
                      Schnellzugriff
                    </h2>
                    <p className="text-sm text-[#585828]">
                      Alle Preis- und Textänderungen werden sofort auf der
                      Live-Website übernommen. Nutzen Sie „Preise &amp;
                      Tarifregeln“ für jährliche Tarifanpassungen.
                    </p>
                  </div>
                </div>
              )}

              {/* 2. ANFRAGEN INBOX */}
              {activeTab === 'requests' && (
                <div className="bg-white rounded-[24px] border border-[#A09048]/30 p-6 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="font-spartan text-2xl font-black text-[#384808]">
                      Anfragen-Posteingang
                    </h2>
                    <a
                      href="/api/admin/requests/export"
                      className="tech-cta-ghost"
                    >
                      <Download size={16} />
                      <span>CSV-Export</span>
                    </a>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <div className="relative flex-1 min-w-[220px]">
                      <Search
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#889028]"
                      />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Nach Name, E-Mail oder Tarif suchen..."
                        className="w-full rounded-xl border border-[#A09048]/40 pl-9 pr-3 py-2 text-sm text-[#384808]"
                      />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(e) =>
                        setStatusFilter(e.target.value)
                      }
                      className="rounded-xl border border-[#A09048]/40 px-3 py-2 text-sm text-[#384808]"
                    >
                      <option value="all">Alle Status</option>
                      <option value="neu">Neu</option>
                      <option value="in_bearbeitung">In Bearbeitung</option>
                      <option value="erledigt">Erledigt</option>
                    </select>
                  </div>

                  {filteredRequests.length === 0 ? (
                    <p className="text-sm text-[#585828] py-8 text-center">
                      Keine passenden Anfragen vorhanden.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {filteredRequests.map((req) => (
                        <div
                          key={req.id}
                          className="rounded-2xl border border-[#A09048]/30 bg-[#F4F2E6]/40 p-4 space-y-3"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <span className="text-xs font-bold text-[#889028]">
                                {req.createdAt} · {req.id}
                              </span>
                              <h3 className="font-spartan font-black text-lg text-[#384808]">
                                {req.name}{' '}
                                {req.firma ? `(${req.firma})` : ''}
                              </h3>
                              <p className="text-xs text-[#585828]">
                                {req.email}
                                {req.telefon ? ` · ${req.telefon}` : ''}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <select
                                value={req.status}
                                onChange={(e) =>
                                  handleRequestUpdate(req.id, {
                                    status: e.target.value,
                                  })
                                }
                                className="rounded-xl border border-[#A09048]/40 bg-white px-3 py-1.5 text-xs font-bold text-[#384808]"
                              >
                                <option value="neu">Neu</option>
                                <option value="in_bearbeitung">
                                  In Bearbeitung
                                </option>
                                <option value="erledigt">Erledigt</option>
                              </select>
                              <button
                                onClick={() => handleRequestDelete(req.id)}
                                className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                                title="Löschen"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 rounded-xl bg-white p-3 text-xs border border-[#A09048]/20">
                            <div>
                              <span className="block text-[10px] text-[#585828]">
                                Tarif
                              </span>
                              <strong className="text-[#384808]">
                                {req.chosenPlan}
                              </strong>
                            </div>
                            <div>
                              <span className="block text-[10px] text-[#585828]">
                                Fahrzeug
                              </span>
                              <strong className="text-[#384808]">
                                {req.vehicleType === 'wohnmobil'
                                  ? 'Wohnmobil'
                                  : 'Wohnwagen'}
                              </strong>
                            </div>
                            <div>
                              <span className="block text-[10px] text-[#585828]">
                                Kaufpreis (V)
                              </span>
                              <strong className="text-[#384808]">
                                {formatEuroIntDE(req.kaufpreis)} (
                                {formatEuroIntDE(req.roundedValue)})
                              </strong>
                            </div>
                            <div>
                              <span className="block text-[10px] text-[#585828]">
                                Baujahr / Veruntreuung
                              </span>
                              <strong className="text-[#384808]">
                                {req.baujahr} /{' '}
                                {req.veruntreuung ? 'Ja' : 'Nein'}
                              </strong>
                            </div>
                            <div>
                              <span className="block text-[10px] text-[#585828]">
                                Preis
                              </span>
                              <strong className="text-[#384808]">
                                {req.calculatedPrice !== null
                                  ? formatEuroDE(req.calculatedPrice)
                                  : req.priceStatusText || 'Auf Anfrage'}
                              </strong>
                            </div>
                          </div>

                          {req.nachricht && (
                            <p className="text-xs text-[#585828] bg-white rounded-xl p-2.5 border border-[#A09048]/15">
                              <strong>Nachricht:</strong> {req.nachricht}
                            </p>
                          )}

                          <div className="flex gap-2">
                            <input
                              type="text"
                              defaultValue={req.notes}
                              placeholder="Interne Notiz hinzufügen..."
                              onBlur={(e) => {
                                if (e.target.value !== req.notes) {
                                  handleRequestUpdate(req.id, {
                                    notes: e.target.value,
                                  });
                                }
                              }}
                              className="flex-1 rounded-xl border border-[#A09048]/30 bg-white px-3 py-1.5 text-xs text-[#384808]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 3. STARTSEITE & SEKTIONEN */}
              {activeTab === 'sections' && (
                <div className="bg-white rounded-[24px] border border-[#A09048]/30 p-6 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="font-spartan text-2xl font-black text-[#384808]">
                        Startseiten-Inhalte &amp; Reihenfolge
                      </h2>
                      <p className="text-xs text-[#585828]">
                        Sektionen ein-/ausblenden, verschieben und Texte sowie
                        Bild-URLs bearbeiten.
                      </p>
                    </div>
                    <button onClick={saveSections} className="tech-cta-primary">
                      <Save size={16} />
                      <span>Änderungen speichern</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {sections.map((sec, idx) => (
                      <div
                        key={sec.id}
                        className="rounded-2xl border border-[#A09048]/30 p-4 space-y-3 bg-[#F4F2E6]/30"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#384808] text-white text-xs font-bold">
                              #{idx + 1}
                            </span>
                            <h3 className="font-spartan font-black text-base text-[#384808]">
                              {sec.label}
                            </h3>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => moveSection(idx, -1)}
                              disabled={idx === 0}
                              className="p-1.5 rounded-lg border border-[#A09048]/30 bg-white disabled:opacity-40 cursor-pointer"
                              title="Nach oben"
                            >
                              <ArrowUp size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveSection(idx, 1)}
                              disabled={idx === sections.length - 1}
                              className="p-1.5 rounded-lg border border-[#A09048]/30 bg-white disabled:opacity-40 cursor-pointer"
                              title="Nach unten"
                            >
                              <ArrowDown size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setSections((prev) =>
                                  prev.map((s, i) =>
                                    i === idx ? { ...s, visible: !s.visible } : s
                                  )
                                )
                              }
                              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                                sec.visible
                                  ? 'bg-[#889028] text-white'
                                  : 'bg-stone-200 text-stone-600'
                              }`}
                            >
                              {sec.visible ? (
                                <>
                                  <Eye size={14} />
                                  <span>Sichtbar</span>
                                </>
                              ) : (
                                <>
                                  <EyeOff size={14} />
                                  <span>Ausgeblendet</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-[#384808] mb-1">
                              Überschrift
                            </label>
                            <input
                              type="text"
                              value={sec.title}
                              onChange={(e) =>
                                setSections((prev) =>
                                  prev.map((s, i) =>
                                    i === idx
                                      ? { ...s, title: e.target.value }
                                      : s
                                  )
                                )
                              }
                              className="w-full rounded-xl border border-[#A09048]/35 bg-white px-3 py-2 text-xs text-[#384808]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-[#384808] mb-1">
                              Badge-Text
                            </label>
                            <input
                              type="text"
                              value={sec.badge || ''}
                              onChange={(e) =>
                                setSections((prev) =>
                                  prev.map((s, i) =>
                                    i === idx
                                      ? { ...s, badge: e.target.value }
                                      : s
                                  )
                                )
                              }
                              className="w-full rounded-xl border border-[#A09048]/35 bg-white px-3 py-2 text-xs text-[#384808]"
                            />
                          </div>
                        </div>

                        {sec.subtitle !== undefined && (
                          <div>
                            <label className="block text-[11px] font-bold text-[#384808] mb-1">
                              Untertitel
                            </label>
                            <textarea
                              rows={2}
                              value={sec.subtitle}
                              onChange={(e) =>
                                setSections((prev) =>
                                  prev.map((s, i) =>
                                    i === idx
                                      ? { ...s, subtitle: e.target.value }
                                      : s
                                  )
                                )
                              }
                              className="w-full rounded-xl border border-[#A09048]/35 bg-white px-3 py-2 text-xs text-[#384808]"
                            />
                          </div>
                        )}

                        {sec.body !== undefined && (
                          <div>
                            <label className="block text-[11px] font-bold text-[#384808] mb-1">
                              Fließtext
                            </label>
                            <textarea
                              rows={3}
                              value={sec.body}
                              onChange={(e) =>
                                setSections((prev) =>
                                  prev.map((s, i) =>
                                    i === idx
                                      ? { ...s, body: e.target.value }
                                      : s
                                  )
                                )
                              }
                              className="w-full rounded-xl border border-[#A09048]/35 bg-white px-3 py-2 text-xs text-[#384808]"
                            />
                          </div>
                        )}

                        {sec.image !== undefined && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-[#384808] mb-1">
                                Bild-Pfad / URL
                              </label>
                              <input
                                type="text"
                                value={sec.image}
                                onChange={(e) =>
                                  setSections((prev) =>
                                    prev.map((s, i) =>
                                      i === idx
                                        ? { ...s, image: e.target.value }
                                        : s
                                    )
                                  )
                                }
                                className="w-full rounded-xl border border-[#A09048]/35 bg-white px-3 py-2 text-xs text-[#384808]"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-[#384808] mb-1">
                                Bild Alt-Text (SEO)
                              </label>
                              <input
                                type="text"
                                value={sec.imageAlt || ''}
                                onChange={(e) =>
                                  setSections((prev) =>
                                    prev.map((s, i) =>
                                      i === idx
                                        ? { ...s, imageAlt: e.target.value }
                                        : s
                                    )
                                  )
                                }
                                className="w-full rounded-xl border border-[#A09048]/35 bg-white px-3 py-2 text-xs text-[#384808]"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. PREISE & TARIFREGELN */}
              {activeTab === 'prices' && insuranceConfig && (
                <div className="bg-white rounded-[24px] border border-[#A09048]/30 p-6 space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="font-spartan text-2xl font-black text-[#384808]">
                        Preise, Parameter &amp; Tarif-Vorteile
                      </h2>
                      <p className="text-xs text-[#585828]">
                        Alle Werte des Live-Rechners stammen direkt aus dieser
                        Konfiguration.
                      </p>
                    </div>
                    <button
                      onClick={saveInsuranceConfig}
                      className="tech-cta-primary"
                    >
                      <Save size={16} />
                      <span>Tarife speichern</span>
                    </button>
                  </div>

                  {/* CVB-Plus */}
                  <div className="rounded-2xl border border-[#A09048]/30 bg-[#F4F2E6]/40 p-5 space-y-4">
                    <h3 className="font-spartan font-black text-lg text-[#384808]">
                      CVB-Plus
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <label className="space-y-1">
                        <span className="font-bold text-[#384808]">
                          Selbstbeteiligung (€)
                        </span>
                        <input
                          type="number"
                          value={insuranceConfig.cvbPlus.deductible}
                          onChange={(e) =>
                            setInsuranceConfig({
                              ...insuranceConfig,
                              cvbPlus: {
                                ...insuranceConfig.cvbPlus,
                                deductible: Number(e.target.value),
                              },
                            })
                          }
                          className="w-full rounded-xl border bg-white px-3 py-2"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="font-bold text-[#384808]">
                          Womo Preis Stufe 1 (€)
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          value={insuranceConfig.cvbPlus.wohnmobil.priceStep1}
                          onChange={(e) =>
                            setInsuranceConfig({
                              ...insuranceConfig,
                              cvbPlus: {
                                ...insuranceConfig.cvbPlus,
                                wohnmobil: {
                                  ...insuranceConfig.cvbPlus.wohnmobil,
                                  priceStep1: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full rounded-xl border bg-white px-3 py-2"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="font-bold text-[#384808]">
                          Womo Schwelle V (€)
                        </span>
                        <input
                          type="number"
                          step="1000"
                          value={insuranceConfig.cvbPlus.wohnmobil.thresholdV}
                          onChange={(e) =>
                            setInsuranceConfig({
                              ...insuranceConfig,
                              cvbPlus: {
                                ...insuranceConfig.cvbPlus,
                                wohnmobil: {
                                  ...insuranceConfig.cvbPlus.wohnmobil,
                                  thresholdV: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full rounded-xl border bg-white px-3 py-2"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="font-bold text-[#384808]">
                          Womo Preis Stufe 2 (€)
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          value={insuranceConfig.cvbPlus.wohnmobil.priceStep2}
                          onChange={(e) =>
                            setInsuranceConfig({
                              ...insuranceConfig,
                              cvbPlus: {
                                ...insuranceConfig.cvbPlus,
                                wohnmobil: {
                                  ...insuranceConfig.cvbPlus.wohnmobil,
                                  priceStep2: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full rounded-xl border bg-white px-3 py-2"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="font-bold text-[#384808]">
                          Womo Min V (€)
                        </span>
                        <input
                          type="number"
                          step="1000"
                          value={insuranceConfig.cvbPlus.wohnmobil.minV}
                          onChange={(e) =>
                            setInsuranceConfig({
                              ...insuranceConfig,
                              cvbPlus: {
                                ...insuranceConfig.cvbPlus,
                                wohnmobil: {
                                  ...insuranceConfig.cvbPlus.wohnmobil,
                                  minV: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full rounded-xl border bg-white px-3 py-2"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="font-bold text-[#384808]">
                          Womo Max V (€)
                        </span>
                        <input
                          type="number"
                          step="1000"
                          value={insuranceConfig.cvbPlus.wohnmobil.maxV}
                          onChange={(e) =>
                            setInsuranceConfig({
                              ...insuranceConfig,
                              cvbPlus: {
                                ...insuranceConfig.cvbPlus,
                                wohnmobil: {
                                  ...insuranceConfig.cvbPlus.wohnmobil,
                                  maxV: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full rounded-xl border bg-white px-3 py-2"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="font-bold text-[#384808]">
                          Wohnwagen Preis (€)
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          value={insuranceConfig.cvbPlus.wohnwagen.price}
                          onChange={(e) =>
                            setInsuranceConfig({
                              ...insuranceConfig,
                              cvbPlus: {
                                ...insuranceConfig.cvbPlus,
                                wohnwagen: {
                                  ...insuranceConfig.cvbPlus.wohnwagen,
                                  price: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full rounded-xl border bg-white px-3 py-2"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="font-bold text-[#384808]">
                          Wohnwagen Max V (€)
                        </span>
                        <input
                          type="number"
                          step="1000"
                          value={insuranceConfig.cvbPlus.wohnwagen.maxV}
                          onChange={(e) =>
                            setInsuranceConfig({
                              ...insuranceConfig,
                              cvbPlus: {
                                ...insuranceConfig.cvbPlus,
                                wohnwagen: {
                                  ...insuranceConfig.cvbPlus.wohnwagen,
                                  maxV: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full rounded-xl border bg-white px-3 py-2"
                        />
                      </label>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-[#384808] mb-1">
                        Leistungs-Stichpunkte (eine Zeile pro Punkt)
                      </span>
                      <textarea
                        rows={4}
                        value={insuranceConfig.cvbPlus.benefits.join('\n')}
                        onChange={(e) =>
                          setInsuranceConfig({
                            ...insuranceConfig,
                            cvbPlus: {
                              ...insuranceConfig.cvbPlus,
                              benefits: e.target.value
                                .split('\n')
                                .filter((l) => l.trim() !== ''),
                            },
                          })
                        }
                        className="w-full rounded-xl border bg-white p-2.5 text-xs"
                      />
                    </div>
                  </div>

                  {/* CVB-Premium */}
                  <div className="rounded-2xl border border-[#A09048]/30 bg-[#F4F2E6]/40 p-5 space-y-4">
                    <h3 className="font-spartan font-black text-lg text-[#384808]">
                      CVB-Premium
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <label className="space-y-1">
                        <span className="font-bold text-[#384808]">
                          Selbstbeteiligung (€)
                        </span>
                        <input
                          type="number"
                          value={insuranceConfig.cvbPremium.deductible}
                          onChange={(e) =>
                            setInsuranceConfig({
                              ...insuranceConfig,
                              cvbPremium: {
                                ...insuranceConfig.cvbPremium,
                                deductible: Number(e.target.value),
                              },
                            })
                          }
                          className="w-full rounded-xl border bg-white px-3 py-2"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="font-bold text-[#384808]">
                          Wohnmobil Preis (€)
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          value={insuranceConfig.cvbPremium.wohnmobil.price}
                          onChange={(e) =>
                            setInsuranceConfig({
                              ...insuranceConfig,
                              cvbPremium: {
                                ...insuranceConfig.cvbPremium,
                                wohnmobil: {
                                  ...insuranceConfig.cvbPremium.wohnmobil,
                                  price: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full rounded-xl border bg-white px-3 py-2"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="font-bold text-[#384808]">
                          Wohnwagen Preis (€)
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          value={insuranceConfig.cvbPremium.wohnwagen.price}
                          onChange={(e) =>
                            setInsuranceConfig({
                              ...insuranceConfig,
                              cvbPremium: {
                                ...insuranceConfig.cvbPremium,
                                wohnwagen: {
                                  ...insuranceConfig.cvbPremium.wohnwagen,
                                  price: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full rounded-xl border bg-white px-3 py-2"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="font-bold text-[#384808]">
                          Max. Bruttowert (€)
                        </span>
                        <input
                          type="number"
                          step="1000"
                          value={insuranceConfig.cvbPremium.maxGrossValue}
                          onChange={(e) =>
                            setInsuranceConfig({
                              ...insuranceConfig,
                              cvbPremium: {
                                ...insuranceConfig.cvbPremium,
                                maxGrossValue: Number(e.target.value),
                              },
                            })
                          }
                          className="w-full rounded-xl border bg-white px-3 py-2"
                        />
                      </label>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-[#384808] mb-1">
                        Leistungs-Stichpunkte (eine Zeile pro Punkt)
                      </span>
                      <textarea
                        rows={4}
                        value={insuranceConfig.cvbPremium.benefits.join('\n')}
                        onChange={(e) =>
                          setInsuranceConfig({
                            ...insuranceConfig,
                            cvbPremium: {
                              ...insuranceConfig.cvbPremium,
                              benefits: e.target.value
                                .split('\n')
                                .filter((l) => l.trim() !== ''),
                            },
                          })
                        }
                        className="w-full rounded-xl border bg-white p-2.5 text-xs"
                      />
                    </div>
                  </div>

                  {/* CVB-Flex */}
                  <div className="rounded-2xl border border-[#A09048]/30 bg-[#F4F2E6]/40 p-5 space-y-4">
                    <h3 className="font-spartan font-black text-lg text-[#384808]">
                      CVB-Flex (Formel-Parameter)
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <label className="space-y-1">
                        <span className="font-bold text-[#384808]">
                          Selbstbeteiligung (€)
                        </span>
                        <input
                          type="number"
                          value={insuranceConfig.cvbFlex.deductible}
                          onChange={(e) =>
                            setInsuranceConfig({
                              ...insuranceConfig,
                              cvbFlex: {
                                ...insuranceConfig.cvbFlex,
                                deductible: Number(e.target.value),
                              },
                            })
                          }
                          className="w-full rounded-xl border bg-white px-3 py-2"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="font-bold text-[#384808]">
                          Max. Kasko-Alter (Jahre)
                        </span>
                        <input
                          type="number"
                          value={insuranceConfig.cvbFlex.maxKaskoAge}
                          onChange={(e) =>
                            setInsuranceConfig({
                              ...insuranceConfig,
                              cvbFlex: {
                                ...insuranceConfig.cvbFlex,
                                maxKaskoAge: Number(e.target.value),
                              },
                            })
                          }
                          className="w-full rounded-xl border bg-white px-3 py-2"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="font-bold text-[#384808]">
                          21+ Haftpflicht-Zuschlag (%)
                        </span>
                        <input
                          type="number"
                          value={
                            insuranceConfig.cvbFlex.wohnmobil
                              .liabilityOnlySurchargePercent
                          }
                          onChange={(e) => {
                            const pct = Number(e.target.value);
                            setInsuranceConfig({
                              ...insuranceConfig,
                              cvbFlex: {
                                ...insuranceConfig.cvbFlex,
                                wohnmobil: {
                                  ...insuranceConfig.cvbFlex.wohnmobil,
                                  liabilityOnlySurchargePercent: pct,
                                },
                                wohnwagen: {
                                  ...insuranceConfig.cvbFlex.wohnwagen,
                                  liabilityOnlySurchargePercent: pct,
                                },
                              },
                            });
                          }}
                          className="w-full rounded-xl border bg-white px-3 py-2"
                        />
                      </label>
                    </div>

                    {/* Flex Wohnmobil */}
                    <div className="pt-2 border-t border-[#A09048]/20">
                      <p className="text-xs font-black text-[#384808] mb-2">
                        Wohnmobil-Parameter
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <label className="space-y-1">
                          <span>Haftpflicht (€)</span>
                          <input
                            type="number"
                            step="0.01"
                            value={insuranceConfig.cvbFlex.wohnmobil.haftpflicht}
                            onChange={(e) =>
                              setInsuranceConfig({
                                ...insuranceConfig,
                                cvbFlex: {
                                  ...insuranceConfig.cvbFlex,
                                  wohnmobil: {
                                    ...insuranceConfig.cvbFlex.wohnmobil,
                                    haftpflicht: Number(e.target.value),
                                  },
                                },
                              })
                            }
                            className="w-full rounded-xl border bg-white px-3 py-1.5"
                          />
                        </label>
                        <label className="space-y-1">
                          <span>Kasko-Satz (%)</span>
                          <input
                            type="number"
                            step="0.1"
                            value={
                              insuranceConfig.cvbFlex.wohnmobil.kaskoRatePercent
                            }
                            onChange={(e) =>
                              setInsuranceConfig({
                                ...insuranceConfig,
                                cvbFlex: {
                                  ...insuranceConfig.cvbFlex,
                                  wohnmobil: {
                                    ...insuranceConfig.cvbFlex.wohnmobil,
                                    kaskoRatePercent: Number(e.target.value),
                                  },
                                },
                              })
                            }
                            className="w-full rounded-xl border bg-white px-3 py-1.5"
                          />
                        </label>
                        <label className="space-y-1">
                          <span>Schutzbrief (€)</span>
                          <input
                            type="number"
                            step="0.01"
                            value={insuranceConfig.cvbFlex.wohnmobil.schutzbrief}
                            onChange={(e) =>
                              setInsuranceConfig({
                                ...insuranceConfig,
                                cvbFlex: {
                                  ...insuranceConfig.cvbFlex,
                                  wohnmobil: {
                                    ...insuranceConfig.cvbFlex.wohnmobil,
                                    schutzbrief: Number(e.target.value),
                                  },
                                },
                              })
                            }
                            className="w-full rounded-xl border bg-white px-3 py-1.5"
                          />
                        </label>
                        <label className="space-y-1">
                          <span>Veruntreuung bis 60k (€)</span>
                          <input
                            type="number"
                            step="0.01"
                            value={
                              insuranceConfig.cvbFlex.wohnmobil
                                .veruntreuungStep1Surcharge
                            }
                            onChange={(e) =>
                              setInsuranceConfig({
                                ...insuranceConfig,
                                cvbFlex: {
                                  ...insuranceConfig.cvbFlex,
                                  wohnmobil: {
                                    ...insuranceConfig.cvbFlex.wohnmobil,
                                    veruntreuungStep1Surcharge: Number(
                                      e.target.value
                                    ),
                                  },
                                },
                              })
                            }
                            className="w-full rounded-xl border bg-white px-3 py-1.5"
                          />
                        </label>
                        <label className="space-y-1">
                          <span>Veruntreuung 61k–75k (€)</span>
                          <input
                            type="number"
                            step="0.01"
                            value={
                              insuranceConfig.cvbFlex.wohnmobil
                                .veruntreuungStep2Surcharge
                            }
                            onChange={(e) =>
                              setInsuranceConfig({
                                ...insuranceConfig,
                                cvbFlex: {
                                  ...insuranceConfig.cvbFlex,
                                  wohnmobil: {
                                    ...insuranceConfig.cvbFlex.wohnmobil,
                                    veruntreuungStep2Surcharge: Number(
                                      e.target.value
                                    ),
                                  },
                                },
                              })
                            }
                            className="w-full rounded-xl border bg-white px-3 py-1.5"
                          />
                        </label>
                        <label className="space-y-1">
                          <span>Veruntreuung Max V (€)</span>
                          <input
                            type="number"
                            step="1000"
                            value={
                              insuranceConfig.cvbFlex.wohnmobil
                                .veruntreuungStep2MaxV
                            }
                            onChange={(e) =>
                              setInsuranceConfig({
                                ...insuranceConfig,
                                cvbFlex: {
                                  ...insuranceConfig.cvbFlex,
                                  wohnmobil: {
                                    ...insuranceConfig.cvbFlex.wohnmobil,
                                    veruntreuungStep2MaxV: Number(
                                      e.target.value
                                    ),
                                  },
                                },
                              })
                            }
                            className="w-full rounded-xl border bg-white px-3 py-1.5"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Flex Wohnwagen */}
                    <div className="pt-2 border-t border-[#A09048]/20">
                      <p className="text-xs font-black text-[#384808] mb-2">
                        Wohnwagen-Parameter
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <label className="space-y-1">
                          <span>Haftpflicht (€)</span>
                          <input
                            type="number"
                            step="0.01"
                            value={insuranceConfig.cvbFlex.wohnwagen.haftpflicht}
                            onChange={(e) =>
                              setInsuranceConfig({
                                ...insuranceConfig,
                                cvbFlex: {
                                  ...insuranceConfig.cvbFlex,
                                  wohnwagen: {
                                    ...insuranceConfig.cvbFlex.wohnwagen,
                                    haftpflicht: Number(e.target.value),
                                  },
                                },
                              })
                            }
                            className="w-full rounded-xl border bg-white px-3 py-1.5"
                          />
                        </label>
                        <label className="space-y-1">
                          <span>Kasko-Satz (%)</span>
                          <input
                            type="number"
                            step="0.1"
                            value={
                              insuranceConfig.cvbFlex.wohnwagen.kaskoRatePercent
                            }
                            onChange={(e) =>
                              setInsuranceConfig({
                                ...insuranceConfig,
                                cvbFlex: {
                                  ...insuranceConfig.cvbFlex,
                                  wohnwagen: {
                                    ...insuranceConfig.cvbFlex.wohnwagen,
                                    kaskoRatePercent: Number(e.target.value),
                                  },
                                },
                              })
                            }
                            className="w-full rounded-xl border bg-white px-3 py-1.5"
                          />
                        </label>
                        <label className="space-y-1">
                          <span>Veruntreuung bis 15k (€)</span>
                          <input
                            type="number"
                            step="0.01"
                            value={
                              insuranceConfig.cvbFlex.wohnwagen
                                .veruntreuungStep1Surcharge
                            }
                            onChange={(e) =>
                              setInsuranceConfig({
                                ...insuranceConfig,
                                cvbFlex: {
                                  ...insuranceConfig.cvbFlex,
                                  wohnwagen: {
                                    ...insuranceConfig.cvbFlex.wohnwagen,
                                    veruntreuungStep1Surcharge: Number(
                                      e.target.value
                                    ),
                                  },
                                },
                              })
                            }
                            className="w-full rounded-xl border bg-white px-3 py-1.5"
                          />
                        </label>
                        <label className="space-y-1">
                          <span>Veruntreuung 16k–25k (€)</span>
                          <input
                            type="number"
                            step="0.01"
                            value={
                              insuranceConfig.cvbFlex.wohnwagen
                                .veruntreuungStep2Surcharge
                            }
                            onChange={(e) =>
                              setInsuranceConfig({
                                ...insuranceConfig,
                                cvbFlex: {
                                  ...insuranceConfig.cvbFlex,
                                  wohnwagen: {
                                    ...insuranceConfig.cvbFlex.wohnwagen,
                                    veruntreuungStep2Surcharge: Number(
                                      e.target.value
                                    ),
                                  },
                                },
                              })
                            }
                            className="w-full rounded-xl border bg-white px-3 py-1.5"
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <span className="block text-xs font-bold text-[#384808] mb-1">
                        Leistungs-Stichpunkte (eine Zeile pro Punkt)
                      </span>
                      <textarea
                        rows={4}
                        value={insuranceConfig.cvbFlex.benefits.join('\n')}
                        onChange={(e) =>
                          setInsuranceConfig({
                            ...insuranceConfig,
                            cvbFlex: {
                              ...insuranceConfig.cvbFlex,
                              benefits: e.target.value
                                .split('\n')
                                .filter((l) => l.trim() !== ''),
                            },
                          })
                        }
                        className="w-full rounded-xl border bg-white p-2.5 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 5. FAQ */}
              {activeTab === 'faq' && (
                <div className="bg-white rounded-[24px] border border-[#A09048]/30 p-6 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="font-spartan text-2xl font-black text-[#384808]">
                      Häufige Fragen (FAQ)
                    </h2>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setFaqs((prev) => [
                            ...prev,
                            {
                              id: `faq-${Date.now()}`,
                              question: 'Neue Frage',
                              answer: 'Antwort hier eingeben...',
                              sortOrder: prev.length + 1,
                              visible: true,
                            },
                          ])
                        }
                        className="tech-cta-ghost"
                      >
                        <Plus size={16} />
                        <span>Frage hinzufügen</span>
                      </button>
                      <button onClick={saveFaqs} className="tech-cta-primary">
                        <Save size={16} />
                        <span>FAQs speichern</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {faqs.map((faq, idx) => (
                      <div
                        key={faq.id}
                        className="rounded-2xl border border-[#A09048]/30 bg-[#F4F2E6]/35 p-4 space-y-2.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) =>
                              setFaqs((prev) =>
                                prev.map((f, i) =>
                                  i === idx
                                    ? { ...f, question: e.target.value }
                                    : f
                                )
                              )
                            }
                            className="flex-1 rounded-xl border bg-white px-3 py-2 text-sm font-bold text-[#384808]"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFaqs((prev) =>
                                prev.filter((_, i) => i !== idx)
                              )
                            }
                            className="p-2 rounded-xl border border-red-200 text-red-600 bg-white cursor-pointer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={faq.answer}
                          onChange={(e) =>
                            setFaqs((prev) =>
                              prev.map((f, i) =>
                                i === idx ? { ...f, answer: e.target.value } : f
                              )
                            )
                          }
                          className="w-full rounded-xl border bg-white px-3 py-2 text-xs text-[#585828]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. EINSTELLUNGEN */}
              {activeTab === 'settings' && settings && (
                <div className="bg-white rounded-[24px] border border-[#A09048]/30 p-6 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="font-spartan text-2xl font-black text-[#384808]">
                      Allgemeine Einstellungen &amp; Passwort
                    </h2>
                    <button onClick={saveSettings} className="tech-cta-primary">
                      <Save size={16} />
                      <span>Einstellungen speichern</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <label className="space-y-1">
                      <span className="font-bold text-[#384808]">
                        Empfänger-E-Mail für Anfragen
                      </span>
                      <input
                        type="email"
                        value={settings.recipientEmail}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            recipientEmail: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border px-3 py-2.5 text-sm"
                      />
                    </label>
                    <label className="space-y-1">
                      <span className="font-bold text-[#384808]">
                        Absendername (E-Mails)
                      </span>
                      <input
                        type="text"
                        value={settings.senderName}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            senderName: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border px-3 py-2.5 text-sm"
                      />
                    </label>
                    <label className="space-y-1">
                      <span className="font-bold text-[#384808]">
                        Kontakt-E-Mail (Website)
                      </span>
                      <input
                        type="email"
                        value={settings.contactEmail}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            contactEmail: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border px-3 py-2.5 text-sm"
                      />
                    </label>
                    <label className="space-y-1">
                      <span className="font-bold text-[#384808]">
                        Kontakt-Telefon (Website)
                      </span>
                      <input
                        type="text"
                        value={settings.contactPhone}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            contactPhone: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border px-3 py-2.5 text-sm"
                      />
                    </label>
                  </div>

                  <label className="block space-y-1 text-xs">
                    <span className="font-bold text-[#384808]">
                      Laufband-Text (oben im Header)
                    </span>
                    <input
                      type="text"
                      value={settings.tickerText}
                      onChange={(e) =>
                        setSettings({ ...settings, tickerText: e.target.value })
                      }
                      className="w-full rounded-xl border px-3 py-2.5 text-sm"
                    />
                  </label>

                  <div className="pt-4 border-t border-[#A09048]/25 space-y-3">
                    <h3 className="font-spartan font-black text-base text-[#384808]">
                      Admin-Passwort ändern (optional)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <label className="space-y-1">
                        <span className="font-bold text-[#384808]">
                          Aktuelles Passwort
                        </span>
                        <input
                          type="password"
                          value={currentPw}
                          onChange={(e) => setCurrentPw(e.target.value)}
                          className="w-full rounded-xl border px-3 py-2.5 text-sm"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="font-bold text-[#384808]">
                          Neues Passwort (mind. 8 Zeichen)
                        </span>
                        <input
                          type="password"
                          value={newPw}
                          onChange={(e) => setNewPw(e.target.value)}
                          className="w-full rounded-xl border px-3 py-2.5 text-sm"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

