'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowLeft, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Header } from '@/components/Header.jsx';
import { Footer } from '@/components/Footer.jsx';

export default function KontaktPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    agreed: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="bg-[#172002]">
        <Header />
      </div>

      <main className="flex-1 py-14 sm:py-20 bg-gradient-to-b from-[#FAF9F5] to-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-spartan font-bold uppercase tracking-wider text-[#384808] hover:text-[#889028] transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            <span>Zurück zur Startseite</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Contact Information */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-spartan font-bold uppercase tracking-[0.2em] text-[#889028] block">
                  KONTAKT & BERATUNG
                </span>
                <h1 className="font-spartan font-black text-3xl sm:text-4xl uppercase text-[#172002]">
                  Caravan-Vermieter-Bund<span className="text-[#A09048]">.</span>
                </h1>
                <p className="text-sm text-[#585828] leading-relaxed pt-1">
                  Haben Sie Fragen zu unseren Versicherungslösungen oder wünschen Sie eine persönliche Beratung? Wir sind gerne für Sie da.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="p-5 rounded-2xl bg-white border border-[#A09048]/30 shadow-xs flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#384808]/10 text-[#384808] flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-[#889028]" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-[#A09048]">
                      E-Mail
                    </span>
                    <a
                      href="mailto:info@caravan-vermieter-bund.de"
                      className="text-sm font-semibold text-[#172002] hover:text-[#889028] transition-colors break-all"
                    >
                      info@caravan-vermieter-bund.de
                    </a>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#A09048]/30 shadow-xs flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#384808]/10 text-[#384808] flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-[#889028]" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-[#A09048]">
                      Telefon
                    </span>
                    <a
                      href="tel:+491722111189"
                      className="text-sm font-semibold text-[#172002] hover:text-[#889028] transition-colors"
                    >
                      +49 (0) 172 21 111 89
                    </a>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#A09048]/30 shadow-xs flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#384808]/10 text-[#384808] flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-[#889028]" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-[#A09048]">
                      Anbieter & Anschrift
                    </span>
                    <p className="text-sm font-semibold text-[#172002]">
                      Caravan-Vermieter-Bund (CVB)
                    </p>
                    <p className="text-xs text-[#585828]">
                      DS-Caravaning GmbH · Wiesenstr. 48 · 41372 Niederkrüchten
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Message Form */}
            <div className="lg:col-span-7">
              <div className="p-6 sm:p-10 rounded-[28px] sm:rounded-[32px] bg-white border border-[#A09048]/30 shadow-xl">
                {submitted ? (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#889028]/15 text-[#384808] mx-auto flex items-center justify-center">
                      <CheckCircle2 size={32} className="text-[#889028]" />
                    </div>
                    <h3 className="font-spartan font-black text-2xl uppercase text-[#172002]">
                      Vielen Dank für Ihre Nachricht!
                    </h3>
                    <p className="text-sm text-[#585828] max-w-md mx-auto">
                      Wir haben Ihre Anfrage erhalten und melden uns zeitnah persönlich bei Ihnen.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="font-spartan font-black text-xl sm:text-2xl uppercase text-[#172002] pb-2 border-b border-[#A09048]/20">
                      Direkte Nachricht senden
                    </h3>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#384808] mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#A09048]/30 focus:border-[#889028] focus:ring-1 focus:ring-[#889028] outline-none text-sm text-[#172002]"
                        placeholder="Ihr vollständiger Name"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#384808] mb-1">
                          E-Mail *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-[#A09048]/30 focus:border-[#889028] focus:ring-1 focus:ring-[#889028] outline-none text-sm text-[#172002]"
                          placeholder="ihre@email.de"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#384808] mb-1">
                          Telefon (optional)
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-[#A09048]/30 focus:border-[#889028] focus:ring-1 focus:ring-[#889028] outline-none text-sm text-[#172002]"
                          placeholder="+49 ..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#384808] mb-1">
                        Nachricht *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#A09048]/30 focus:border-[#889028] focus:ring-1 focus:ring-[#889028] outline-none text-sm text-[#172002]"
                        placeholder="Wie können wir Ihnen helfen?"
                      />
                    </div>

                    <div className="pt-2">
                      <label className="flex items-start gap-3 cursor-pointer text-xs text-[#585828]">
                        <input
                          type="checkbox"
                          required
                          checked={formData.agreed}
                          onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                          className="mt-0.5 rounded text-[#889028] focus:ring-[#889028]"
                        />
                        <span>
                          Ich stimme der Verarbeitung meiner Angaben gemäß der{' '}
                          <Link href="/datenschutz" className="underline text-[#384808] hover:text-[#889028]">
                            Datenschutzerklärung
                          </Link>{' '}
                          zu. *
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 px-6 rounded-full bg-[#384808] hover:bg-[#2D3A06] text-white font-spartan font-bold uppercase text-xs tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-4"
                    >
                      <Send size={15} />
                      <span>{submitting ? 'Wird gesendet...' : 'Nachricht absenden'}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

