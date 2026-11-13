'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, ExternalLink, Shield } from 'lucide-react';

export const Footer = ({ settings }) => {
  return (
    <footer className="relative bg-[#172002] text-white border-t border-[#A09048]/35 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[250px] bg-[#A09048]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand & Socials */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/cvb_caravan_vermieter_bund_logo.png"
                alt="Caravan Vermieter Bund Logo"
                className="h-11 w-auto object-contain bg-white/95 rounded-xl p-1.5"
              />
              <div>
                <span className="font-spartan text-xl font-black tracking-tight text-white block leading-none">
                  VERMIETVERSICHERUNG<span className="text-[#A09048]">.</span>
                </span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#A09048] uppercase mt-1 block">
                  CARAVAN-VERMIETER-BUND (CVB)
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#F4F2E6]/80 leading-relaxed max-w-md">
              Spezialisierte Selbstfahrervermietversicherung für Wohnmobile und Wohnwagen über den Caravan-Vermieter-Bund (CVB). Transparente Jahrestarife 2027, persönliche Beratung und ein fester Ansprechpartner für Vermieter.
            </p>

            {/* Social Icons matching screenshot 1 */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#A09048] text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#A09048] text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              <button
                onClick={() => alert('Cookie-Präferenzen: Es werden ausschließlich technisch notwendige Session-Cookies verwendet.')}
                className="text-[11px] text-[#A09048] hover:text-white transition-colors underline underline-offset-4 ml-2"
              >
                Cookie Einstellungen
              </button>
            </div>
          </div>

          {/* Der CVB column matching screenshot 1 */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-spartan font-black text-xs uppercase tracking-[0.18em] text-[#A09048]">
              Der CVB
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#F4F2E6]/85">
              <li>
                <a href="#intro" className="hover:text-white transition-colors">
                  Über uns
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#kontakt" className="hover:text-white transition-colors">
                  Kontakt
                </a>
              </li>
              <li>
                <a
                  href={settings.cvbWebsiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#A09048] hover:text-white transition-colors pt-1"
                >
                  <span>caravan-vermieter-bund.de</span>
                  <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>

          {/* Kleingedrucktes column matching screenshot 1 */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-spartan font-black text-xs uppercase tracking-[0.18em] text-[#A09048]">
              Kleingedrucktes
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#F4F2E6]/85">
              <li>
                <Link href="/datenschutz" className="hover:text-white transition-colors">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/impressum" className="hover:text-white transition-colors">
                  Impressum
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-[#A09048] text-white text-xs font-semibold transition-colors"
                >
                  <Shield size={12} />
                  <span>Admin-Bereich</span>
                </Link>
              </li>
            </ul>

            <div className="pt-2 text-xs text-[#F4F2E6]/70 space-y-1">
              <p className="flex items-center gap-2">
                <Mail size={13} className="text-[#A09048] shrink-0" />
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-white transition-colors">
                  {settings.contactEmail}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={13} className="text-[#A09048] shrink-0" />
                <span>{settings.contactPhone}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#F4F2E6]/60">
          <p>
            © {new Date().getFullYear()} Caravan Vermieter Bund. Alle Rechte vorbehalten.
          </p>
          <p>SelbstfahrerVermietversicherung.online</p>
        </div>
      </div>
    </footer>
  );
};
