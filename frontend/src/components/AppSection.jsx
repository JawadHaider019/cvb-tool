'use client';

import React from 'react';
import { Smartphone, Download, HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal.jsx';
import { SectionHeader } from './SectionHeader.jsx';
import { TiltCard3D } from './TiltCard3D.jsx';

export const AppSection = () => {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 84;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section id="app" className="py-16 sm:py-22 bg-[#FFFFFF] border-b border-[#A09048]/20 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-10 w-[500px] h-[500px] bg-[#A09048]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        <SectionHeader
          badge="MOBILE VERMIETER-APP"
          title="Mehr erfahren in unserer CVB Vermieter-APP"
          accentWord="VERMIETER-APP"
          subtitle="Alle Mietverträge, Übergabeprotokolle, Notfallkontakte und Policen immer griffbereit auf Deinem Smartphone."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Editorial Information & CTA Buttons */}
          <ScrollReveal className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <p className="text-base sm:text-lg text-[#384808] font-medium leading-relaxed">
                Wer mehr über den Caravan-Vermieter-Bund erfahren möchte, kann sich die CVB Vermieter-App direkt auf sein Smartphone laden.
              </p>
              <p className="text-sm sm:text-base text-[#585828] leading-relaxed">
                Als CVB-Kunde hat der Vermieter alle Informationen jederzeit griffbereit: Schadensmeldungen online einreichen, eVB-Nummern einsehen, Fahrzeugdaten verwalten und im Pannenfall sofort den richtigen Ansprechpartner kontaktieren.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                'Digitale Schadenmeldung direkt vom Unfallort',
                'Schneller Zugriff auf Versicherungsscheine & eVB',
                'Rechtssichere Checklisten für Fahrzeugübergaben',
                'Direkter Draht zu unseren Schadenexperten',
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#F4F2E6]/75 border border-[#A09048]/25 text-xs sm:text-sm font-semibold text-[#384808]"
                >
                  <CheckCircle2 size={16} className="text-[#889028] shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href="https://qrco.de/CVB-Vermieter-APP"
                target="_blank"
                rel="noopener noreferrer"
                className="tech-cta-primary"
              >
                <span>APP Downloaden</span>
                <span className="tech-ci">
                  <Download size={16} />
                </span>
              </a>

              <button
                onClick={() => scrollTo('faq')}
                className="tech-cta-ghost"
              >
                <span>Fragen?</span>
              </button>
            </div>
          </ScrollReveal>

          {/* Right Column: App Card & Store Badges */}
          <ScrollReveal direction="left" delay={0.15} className="lg:col-span-5">
            <TiltCard3D className="rounded-[32px]">
              <div className="tech-card-cream p-7 sm:p-9 rounded-[32px] border border-[#A09048]/35 shadow-2xl flex flex-col items-center text-center space-y-6">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white p-3 border border-[#A09048]/30 shadow-md flex items-center justify-center">
                  <img
                    src="/images/cvb_caravan_vermieter_bund_logo.png"
                    alt="CVB Vermieter App Icon"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#384808] text-white text-[11px] font-spartan font-bold uppercase tracking-wider">
                    Offizielle App
                  </span>
                  <h3 className="font-spartan font-black text-2xl sm:text-3xl uppercase text-[#384808]">
                    CVB – Vermieter APP
                  </h3>
                  <p className="text-xs sm:text-sm text-[#585828] max-w-sm mx-auto leading-relaxed">
                    Mit der CVB App hast Du Deinen Caravan-Vermieter-Bund direkt in der Hand – alle Tools für Vermieter auf einen Klick.
                  </p>
                </div>

                {/* App Store & Google Play Store Badges */}
                <div className="w-full pt-4 space-y-3 max-w-[280px]">
                  {/* Apple App Store */}
                  <a
                    href="https://apps.apple.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-2.5 px-5 rounded-2xl bg-[#000000] text-white hover:bg-neutral-800 transition-all shadow-md group"
                  >
                    <svg className="w-6 h-6 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.71-.93 2.73 1.01.08 2.03-.49 2.64-1.23z"/>
                    </svg>
                    <div className="text-left">
                      <span className="block text-[10px] uppercase tracking-wider text-neutral-300 leading-none">
                        Laden im
                      </span>
                      <span className="block text-sm font-semibold tracking-tight text-white leading-tight">
                        App Store
                      </span>
                    </div>
                  </a>

                  {/* Google Play Store */}
                  <a
                    href="https://play.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-2.5 px-5 rounded-2xl bg-[#000000] text-white hover:bg-neutral-800 transition-all shadow-md group"
                  >
                    <svg className="w-6 h-6 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M3.609 1.814L13.793 12 3.61 22.186a1.987 1.987 0 0 1-.61-1.464V3.278c0-.573.228-1.096.609-1.464zm11.237 11.238l2.617 2.618-12.062 6.941 9.445-9.559zm0-2.104L5.4 1.39l12.063 6.94-2.617 2.618zm1.097 1.052l3.65 2.102c.988.568.988 1.492 0 2.061l-3.65 2.102-2.434-2.434 2.434-1.831z"/>
                    </svg>
                    <div className="text-left">
                      <span className="block text-[10px] uppercase tracking-wider text-neutral-300 leading-none">
                        JETZT BEI
                      </span>
                      <span className="block text-sm font-semibold tracking-tight text-white leading-tight">
                        Google Play
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            </TiltCard3D>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

