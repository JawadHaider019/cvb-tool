'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, ExternalLink, ShieldCheck, X } from 'lucide-react';

export const Footer = () => {
  const [cookieOpen, setCookieOpen] = useState(false);

  useEffect(() => {
    if (!cookieOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setCookieOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cookieOpen]);

  return (
    <footer id="kontakt" className="relative bg-[#172002] text-white border-t border-[#A09048]/35 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[300px] bg-[#A09048]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10 items-start">
          {/* Column 1: Only ONE Logo, Description & Store Badges */}
          <div className="lg:col-span-4 space-y-5">
            {/* Exactly ONE Logo */}
            <Link href="/" className="inline-block group" aria-label="Caravan-Vermieter-Bund (CVB)">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 inline-block shadow-md group-hover:scale-105 transition-transform">
                <img
                  src="/images/cvb_caravan_vermieter_bund_logo.png"
                  alt="Caravan-Vermieter-Bund (CVB)"
                  className="h-11 sm:h-12 w-auto object-contain"
                />
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-[#F4F2E6]/80 leading-relaxed max-w-sm">
              Spezialisierte Selbstfahrervermietversicherung für Wohnmobile und Wohnwagen über den Caravan-Vermieter-Bund (CVB). Verlässlicher Schutz ab dem 1. Fahrzeug.
            </p>

            {/* App Store & Google Play Badges */}
            <div className="space-y-2 pt-1">
              <span className="block text-[11px] font-spartan font-bold uppercase tracking-wider text-[#A09048]">
                CVB Vermieter-APP herunterladen
              </span>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <a
                  href="https://apps.apple.com/de/app/cvb-vermieter-app/id6745691091"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 py-2 px-3.5 rounded-xl bg-black/70 hover:bg-black text-white transition-all border border-white/15 hover:border-[#A09048]/60 shadow-sm group cursor-pointer"
                >
                  <svg className="w-5 h-5 fill-current shrink-0 text-white" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.71-.93 2.73 1.01.08 2.03-.49 2.64-1.23z"/>
                  </svg>
                  <div className="text-left">
                    <span className="block text-[8px] uppercase tracking-wider text-neutral-300 leading-none">
                      Laden im
                    </span>
                    <span className="block text-xs font-semibold tracking-tight text-white leading-tight">
                      App Store
                    </span>
                  </div>
                </a>

                <a
                  href="https://play.google.com/store/apps/details?id=de.einfach.cvbvermieterapp.production"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 py-2 px-3.5 rounded-xl bg-black/70 hover:bg-black text-white transition-all border border-white/15 hover:border-[#A09048]/60 shadow-sm group cursor-pointer"
                >
                  <svg className="w-5 h-5 fill-current shrink-0 text-white" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.793 12 3.61 22.186a1.987 1.987 0 0 1-.61-1.464V3.278c0-.573.228-1.096.609-1.464zm11.237 11.238l2.617 2.618-12.062 6.941 9.445-9.559zm0-2.104L5.4 1.39l12.063 6.94-2.617 2.618zm1.097 1.052l3.65 2.102c.988.568.988 1.492 0 2.061l-3.65 2.102-2.434-2.434 2.434-1.831z"/>
                  </svg>
                  <div className="text-left">
                    <span className="block text-[8px] uppercase tracking-wider text-neutral-300 leading-none">
                      JETZT BEI
                    </span>
                    <span className="block text-xs font-semibold tracking-tight text-white leading-tight">
                      Google Play
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Der CVB */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="font-spartan font-black text-xs uppercase tracking-[0.18em] text-[#A09048]">
              Der CVB
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#F4F2E6]/85">
              <li>
                <a
                  href="https://caravanvermieterbund.de/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#A09048] transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Über uns</span>
                  <ExternalLink size={11} className="opacity-70" />
                </a>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="hover:text-[#A09048] transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/#besser-vermieten"
                  className="hover:text-[#A09048] transition-colors"
                >
                  CVB Mehrwerte
                </Link>
              </li>
              <li>
                <a
                  href="https://qrco.de/CVB-Vermieter-APP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#A09048] transition-colors"
                >
                  Vermieter-App
                </a>
              </li>
              <li>
                <Link
                  href="/kontakt"
                  className="hover:text-[#A09048] transition-colors font-medium text-white"
                >
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Tarife & Lösungen */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="font-spartan font-black text-xs uppercase tracking-[0.18em] text-[#A09048]">
              Versicherungen
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#F4F2E6]/85">
              <li>
                <Link
                  href="/#versicherungen"
                  className="hover:text-[#A09048] transition-colors"
                >
                  CVB-Plus Tarif
                </Link>
              </li>
              <li>
                <Link
                  href="/#versicherungen"
                  className="hover:text-[#A09048] transition-colors"
                >
                  CVB-Premium Tarif
                </Link>
              </li>
              <li>
                <Link
                  href="/#versicherungen"
                  className="hover:text-[#A09048] transition-colors"
                >
                  CVB-Flex Tarif
                </Link>
              </li>
              <li>
                <Link
                  href="/#versicherungen"
                  className="hover:text-[#A09048] transition-colors"
                >
                  Tarifübersicht & Matrix
                </Link>
              </li>
              <li>
                <Link
                  href="/#besser-vermieten"
                  className="hover:text-[#A09048] transition-colors"
                >
                  Versicherungswechsel
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Kleingedrucktes & Direkter Kontakt */}
          <div className="lg:col-span-3 space-y-4">
            <div className="space-y-3.5">
              <h4 className="font-spartan font-black text-xs uppercase tracking-[0.18em] text-[#A09048]">
                Kleingedrucktes
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#F4F2E6]/85">
                <li>
                  <Link
                    href="/datenschutz"
                    className="hover:text-[#A09048] transition-colors"
                  >
                    Datenschutz
                  </Link>
                </li>
                <li>
                  <Link
                    href="/impressum"
                    className="hover:text-[#A09048] transition-colors"
                  >
                    Impressum
                  </Link>
                </li>
              </ul>
            </div>

            {/* Direct Contact Summary */}
            <div className="pt-3 border-t border-white/10 text-xs text-[#F4F2E6]/75 space-y-2">
              <a
                href="mailto:info@caravan-vermieter-bund.de"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail size={13} className="text-[#A09048] shrink-0" />
                <span className="break-all">info@caravan-vermieter-bund.de</span>
              </a>
              <a
                href="tel:+491722111189"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone size={13} className="text-[#A09048] shrink-0" />
                <span>+49 (0) 172 21 111 89</span>
              </a>
              <p className="flex items-start gap-2 text-[11px] text-[#F4F2E6]/60 pt-0.5">
                <MapPin size={13} className="text-[#A09048] shrink-0 mt-0.5" />
                <span>Wiesenstr. 48, 41372 Niederkrüchten</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#F4F2E6]/70">
          <p>© 2026 Caravan Vermieter Bund</p>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setCookieOpen(true)}
              className="text-[#A09048] hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
            >
              Cookie Einstellungen
            </button>
            <span className="text-[#F4F2E6]/40 hidden sm:inline">|</span>
            <span className="text-[#F4F2E6]/60 hidden sm:inline">
              SelbstfahrerVermietversicherung.online
            </span>
          </div>
        </div>
      </div>

      {cookieOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-modal-title"
          onClick={() => setCookieOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172002]/80 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white text-[#384808] rounded-[24px] max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#A09048]/35 space-y-4 text-left"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#A09048]/20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#384808] text-[#A09048] flex items-center justify-center shrink-0">
                  <ShieldCheck size={16} />
                </div>
                <h3
                  id="cookie-modal-title"
                  className="font-spartan font-black text-lg text-[#384808]"
                >
                  Cookie-Einstellungen
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCookieOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#F4F2E6] text-[#585828] hover:text-[#384808] transition-colors cursor-pointer"
                aria-label="Schließen"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-[#585828] leading-relaxed">
              <p>
                Auf <strong>SelbstfahrerVermietversicherung.online</strong> werden ausschließlich technisch notwendige Cookies verwendet (z. B. für die sichere Formularverarbeitung und den geschützten Admin-Bereich).
              </p>
              <div className="p-3.5 rounded-xl bg-[#F4F2E6] border border-[#A09048]/30 flex items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-[#384808] block">
                    Technisch notwendige Cookies
                  </span>
                  <span className="text-[11px] text-[#585828]">
                    Keine Tracking-, Werbe- oder Analyse-Skripte aktiv
                  </span>
                </div>
                <span className="text-[11px] font-spartan font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#384808] text-white shrink-0">
                  Immer aktiv
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link
                href="/datenschutz"
                onClick={() => setCookieOpen(false)}
                className="text-xs font-semibold text-[#384808] underline hover:text-[#889028]"
              >
                Zur Datenschutzerklärung
              </Link>
              <button
                type="button"
                onClick={() => setCookieOpen(false)}
                className="px-5 py-2.5 rounded-full bg-[#384808] hover:bg-[#2D3A06] text-white font-spartan font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Verstanden
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
