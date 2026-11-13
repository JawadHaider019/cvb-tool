'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal.jsx';
import { SectionHeader } from './SectionHeader.jsx';

export const ContactSection = ({
  section,
  settings,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telefon, setTelefon] = useState('');
  const [nachricht, setNachricht] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [formOpenedAt] = useState(() => Date.now());

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim() || !email.trim() || !nachricht.trim() || !privacyConsent) {
      setErrorMsg('Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          honeypot,
          formOpenedAt,
          name,
          email,
          telefon,
          nachricht,
          privacyConsent,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setErrorMsg(json.error || 'Senden fehlgeschlagen.');
      } else {
        setSuccessMsg(json.message);
        setName('');
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
    <section
      id="kontakt"
      className="py-16 sm:py-22 bg-[#F4F2E6]/70 border-t border-[#A09048]/25"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        <SectionHeader
          badge={section.badge}
          title={section.title}
          accentWord="BERATUNG"
          subtitle={section.subtitle}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Contact Info */}
          <ScrollReveal direction="right" className="lg:col-span-5 space-y-5">
            <div className="tech-card-white p-6 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-[#889028] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#384808]">E-Mail</p>
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="text-[#585828] hover:text-[#384808] underline"
                  >
                    {settings.contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={18} className="text-[#889028] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#384808]">Telefon</p>
                  <p className="text-[#585828]">{settings.contactPhone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#889028] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#384808]">Anbieter</p>
                  <p className="text-[#585828]">
                    {settings.companyName}
                    <br />
                    {settings.companyAddress}
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Contact Form */}
          <div className="lg:col-span-7">
            <div className="tech-card-white p-6 sm:p-8">
              <h3 className="font-spartan text-2xl font-black text-[#384808] mb-4">
                Direkte Nachricht senden
              </h3>

              {successMsg ? (
                <div className="rounded-2xl bg-[#F4F2E6] border border-[#889028] p-6 text-center space-y-2">
                  <CheckCircle2 size={32} className="mx-auto text-[#889028]" />
                  <p className="font-bold text-[#384808]">{successMsg}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="hidden" aria-hidden="true">
                    <input
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
                        placeholder="Ihr Name"
                        className="w-full rounded-xl border border-[#A09048]/40 px-3.5 py-2.5 text-sm text-[#384808] focus:outline-none focus:border-[#384808]"
                      />
                    </div>
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

                  <div>
                    <label className="block text-xs font-bold text-[#384808] mb-1">
                      Nachricht *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={nachricht}
                      onChange={(e) => setNachricht(e.target.value)}
                      placeholder="Wie können wir Ihnen helfen?"
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
                      Ich stimme der Verarbeitung meiner Angaben gemäß der{' '}
                      <Link
                        href="/datenschutz"
                        className="underline font-semibold text-[#384808]"
                      >
                        Datenschutzerklärung
                      </Link>{' '}
                      zu. *
                    </span>
                  </label>

                  {errorMsg && (
                    <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-xs text-red-700">
                      <AlertCircle size={16} className="shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="tech-cta-primary disabled:opacity-60"
                  >
                    <span>
                      {submitting ? 'Wird gesendet...' : 'Nachricht absenden'}
                    </span>
                    <span className="tech-ci">
                      <Send size={15} />
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

