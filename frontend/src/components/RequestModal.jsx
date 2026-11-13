'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Send, CheckCircle2, AlertCircle, Shield } from 'lucide-react';
import { formatEuroDE, formatEuroIntDE } from '@/lib/calculator.js';

export const RequestModal = ({
  isOpen,
  onClose,
  data,
}) => {
  const [name, setName] = useState('');
  const [firma, setFirma] = useState('');
  const [email, setEmail] = useState('');
  const [telefon, setTelefon] = useState('');
  const [nachricht, setNachricht] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [formOpenedAt, setFormOpenedAt] = useState(Date.now());

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setFormOpenedAt(Date.now());
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [isOpen, data?.chosenPlanId]);

  if (!isOpen || !data) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Bitte geben Sie Ihren Namen ein.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }
    if (!privacyConsent) {
      setErrorMsg('Bitte stimmen Sie der Datenschutzerklärung zu.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          honeypot,
          formOpenedAt,
          name,
          firma,
          email,
          telefon,
          nachricht,
          privacyConsent,
          ...data,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setErrorMsg(
          json.error ||
            'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.'
        );
      } else {
        setSuccessMsg(json.message);
        setName('');
        setFirma('');
        setEmail('');
        setTelefon('');
        setNachricht('');
        setPrivacyConsent(false);
      }
    } catch {
      setErrorMsg('Netzwerkfehler. Bitte versuchen Sie es erneut.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="request-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#242E05]/80 backdrop-blur-md"
    >
      <div className="bg-white rounded-[24px] sm:rounded-[28px] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#A09048]/35">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm px-5 sm:px-7 py-4 border-b border-[#A09048]/20 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#384808] text-[#A09048] flex items-center justify-center">
              <Shield size={17} />
            </div>
            <div>
              <h3
                id="request-modal-title"
                className="font-spartan font-black text-lg sm:text-xl text-[#384808] leading-tight"
              >
                Versicherungsanfrage senden
              </h3>
              <p className="text-xs text-[#585828]">
                Unverbindliche Anfrage für {data.chosenPlan}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F4F2E6] text-[#585828] hover:text-[#384808] transition-colors cursor-pointer"
            aria-label="Schließen"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 sm:p-7 space-y-6">
          {/* Read-only Pre-filled Calculator Summary */}
          <div className="rounded-2xl bg-[#F4F2E6] border border-[#A09048]/35 p-4 space-y-2.5">
            <p className="font-spartan font-black text-xs uppercase tracking-wider text-[#384808]">
              Ihre berechneten Fahrzeugdaten (vorausgefüllt)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
              <div>
                <span className="block text-[11px] text-[#585828]">Tarif</span>
                <strong className="text-[#384808]">{data.chosenPlan}</strong>
              </div>
              <div>
                <span className="block text-[11px] text-[#585828]">
                  Fahrzeugart
                </span>
                <strong className="text-[#384808]">
                  {data.vehicleType === 'wohnmobil' ? 'Wohnmobil' : 'Wohnwagen'}
                </strong>
              </div>
              <div>
                <span className="block text-[11px] text-[#585828]">
                  Kaufpreis (brutto)
                </span>
                <strong className="text-[#384808]">
                  {formatEuroIntDE(data.kaufpreis)}
                </strong>
              </div>
              <div>
                <span className="block text-[11px] text-[#585828]">
                  Baujahr
                </span>
                <strong className="text-[#384808]">{data.baujahr}</strong>
              </div>
              <div>
                <span className="block text-[11px] text-[#585828]">
                  Veruntreuungsschutz
                </span>
                <strong className="text-[#384808]">
                  {data.veruntreuung ? 'Ja' : 'Nein'}
                </strong>
              </div>
              <div>
                <span className="block text-[11px] text-[#585828]">
                  Jahresbeitrag
                </span>
                <strong className="text-[#384808]">
                  {data.calculatedPrice !== null
                    ? formatEuroDE(data.calculatedPrice)
                    : data.priceStatusText || 'Preis auf Anfrage'}
                </strong>
              </div>
            </div>
          </div>

          {successMsg ? (
            <div className="rounded-2xl bg-[#384808]/5 border border-[#889028] p-6 text-center space-y-3">
              <CheckCircle2
                size={38}
                className="mx-auto text-[#889028]"
              />
              <h4 className="font-spartan font-black text-xl text-[#384808]">
                Anfrage erfolgreich gesendet!
              </h4>
              <p className="text-sm text-[#585828]">{successMsg}</p>
              <button
                onClick={onClose}
                className="tech-cta-primary mt-2 mx-auto"
              >
                <span>Fenster schließen</span>
                <span className="tech-ci">
                  <X size={16} />
                </span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot field hidden from users */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website_hp">Website</label>
                <input
                  id="website_hp"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#384808] mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ihr vollständiger Name"
                    className="w-full rounded-xl border border-[#A09048]/40 px-3.5 py-2.5 text-sm text-[#384808] focus:outline-none focus:border-[#384808]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#384808] mb-1">
                    Firma (optional)
                  </label>
                  <input
                    type="text"
                    value={firma}
                    onChange={(e) => setFirma(e.target.value)}
                    placeholder="Unternehmensname"
                    className="w-full rounded-xl border border-[#A09048]/40 px-3.5 py-2.5 text-sm text-[#384808] focus:outline-none focus:border-[#384808]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#384808] mb-1">
                    E-Mail *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ihre@email.de"
                    className="w-full rounded-xl border border-[#A09048]/40 px-3.5 py-2.5 text-sm text-[#384808] focus:outline-none focus:border-[#384808]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#384808] mb-1">
                    Telefon (optional)
                  </label>
                  <input
                    type="tel"
                    value={telefon}
                    onChange={(e) => setTelefon(e.target.value)}
                    placeholder="+49 ..."
                    className="w-full rounded-xl border border-[#A09048]/40 px-3.5 py-2.5 text-sm text-[#384808] focus:outline-none focus:border-[#384808]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#384808] mb-1">
                  Nachricht (optional)
                </label>
                <textarea
                  rows={3}
                  value={nachricht}
                  onChange={(e) => setNachricht(e.target.value)}
                  placeholder="Haben Sie weitere Hinweise zum Fahrzeug oder zur Vermietung?"
                  className="w-full rounded-xl border border-[#A09048]/40 px-3.5 py-2.5 text-sm text-[#384808] focus:outline-none focus:border-[#384808]"
                />
              </div>

              <label className="flex items-start gap-2.5 text-xs text-[#585828] cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacyConsent}
                  onChange={(e) => setPrivacyConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#384808] rounded cursor-pointer"
                  required
                />
                <span>
                  Ich stimme zu, dass meine Angaben zur Bearbeitung meiner
                  Versicherungsanfrage gespeichert und per E-Mail verarbeitet
                  werden. Weitere Informationen finden Sie in der{' '}
                  <Link
                    href="/datenschutz"
                    target="_blank"
                    className="underline font-semibold text-[#384808]"
                  >
                    Datenschutzerklärung
                  </Link>
                  . *
                </span>
              </label>

              {errorMsg && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-xs text-red-700">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="tech-cta-ghost"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="tech-cta-primary disabled:opacity-60"
                >
                  <span>
                    {submitting ? 'Wird gesendet...' : 'Jetzt verbindlich anfragen'}
                  </span>
                  <span className="tech-ci">
                    <Send size={15} />
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

