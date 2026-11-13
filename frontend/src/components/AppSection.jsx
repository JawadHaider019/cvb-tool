'use client';

import React from 'react';
import {
  Download,
  HelpCircle,
  Smartphone,
  ShieldCheck,
  FileText,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal.jsx';
import { SectionHeader } from './SectionHeader.jsx';
import { TiltCard3D } from './TiltCard3D.jsx';

export const AppSection = () => {
  const scrollToFaq = () => {
    const el = document.getElementById('faq');
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 84;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const appFeatures = [
    {
      icon: ShieldCheck,
      title: 'Digitale Police & eVB',
      desc: 'Versicherungsbestätigungen, Deckungskarten und eVB-Codes sekundenschnell abrufen.',
    },
    {
      icon: FileText,
      title: 'Mietverträge & Checklisten',
      desc: 'Geprüfte Mustermietverträge, Übergabeprotokolle und Schadensberichte direkt griffbereit.',
    },
    {
      icon: Clock,
      title: '24/7 Notfall & Verbund-Vorteile',
      desc: 'Direkte Notfall-Schadenmeldung, Schutzbrief-Unterstützung und exklusive CVB-Einkaufsvorteile.',
    },
  ];

  return (
    <section
      id="app"
      className="py-18 sm:py-24 bg-gradient-to-b from-[#FFFFFF] via-[#FAF9F5] to-[#FFFFFF] border-b border-[#A09048]/20 relative overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-[#889028]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-40 w-96 h-96 bg-[#A09048]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 space-y-12 sm:space-y-16">
        {/* Section Header */}
        <SectionHeader
          badge="MOBILE VERMIETER-APP"
          badgeIcon={Smartphone}
          title="Mehr erfahren in unserer"
          accentWord="CVB Vermieter-APP"
          subtitle="Wer mehr über den Caravan-Vermieter-Bund erfahren möchte, kann sich die CVB Vermieter-App auf sein Smartphone laden und hat als Kunde alle Informationen jederzeit griffbereit."
        />

        {/* Equal Height Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Equal Height Authentic Content Card */}
          <ScrollReveal className="lg:col-span-6 h-full flex flex-col">
            <TiltCard3D className="h-full rounded-[28px] sm:rounded-[36px]">
              <div className="h-full bg-[#FFFFFF] p-6 sm:p-10 lg:p-12 rounded-[28px] sm:rounded-[36px] border border-[#A09048]/30 shadow-xl flex flex-col justify-between space-y-6 sm:space-y-8">
                <div className="space-y-6">
                  {/* Editorial Statement Box matching verbatim text */}
                  <div className="p-6 rounded-[24px] bg-[#FAF9F5] border border-[#A09048]/25 space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-[#384808]/10 text-[#384808] flex items-center justify-center">
                      <Smartphone size={22} className="text-[#889028]" />
                    </div>
                    <div className="space-y-3 font-medium text-base sm:text-lg text-[#384808] leading-relaxed">
                      <p>
                        Wer mehr über den Caravan-Vermieter-Bund erfahren möchte kann sich die CVB Vermieter-App auf sein Smartphone laden.
                      </p>
                      <p className="font-semibold text-[#172002]">
                        Als CVB Kunde hat der Vermieter alle Informationen, jederzeit, griffbereit.
                      </p>
                    </div>
                  </div>

                  {/* Feature Highlights Grid */}
                  <div className="space-y-3.5">
                    {appFeatures.map((feat, idx) => {
                      const IconComponent = feat.icon;
                      return (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-white border border-[#A09048]/20 hover:border-[#889028] transition-all hover:shadow-md flex items-start gap-4 group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-[#F4F2E6] text-[#384808] group-hover:bg-[#384808] group-hover:text-[#A09048] transition-colors flex items-center justify-center shrink-0">
                            <IconComponent size={20} />
                          </div>
                          <div>
                            <h4 className="font-spartan font-bold text-sm sm:text-base text-[#172002] tracking-wide">
                              {feat.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-[#585828] mt-0.5 leading-relaxed">
                              {feat.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Primary Action Buttons verbatim: Download + Fragen */}
                <div className="pt-4 border-t border-[#A09048]/20 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4">
                  <a
                    href="https://qrco.de/CVB-Vermieter-APP"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-[#384808] hover:bg-[#2D3A06] text-white text-xs sm:text-sm font-spartan font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer group w-full sm:w-auto"
                  >
                    <Download size={16} className="text-[#A09048] group-hover:animate-bounce" />
                    <span>APP Downloaden</span>
                    <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>

                  <button
                    onClick={scrollToFaq}
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#F4F2E6] hover:bg-[#384808] text-[#384808] hover:text-white text-xs sm:text-sm font-spartan font-bold uppercase tracking-wider transition-all border border-[#A09048]/30 hover:border-[#384808] shadow-sm hover:shadow-md cursor-pointer group w-full sm:w-auto"
                  >
                    <HelpCircle size={16} className="text-[#889028] group-hover:text-white transition-colors" />
                    <span>Fragen?</span>
                  </button>
                </div>
              </div>
            </TiltCard3D>
          </ScrollReveal>

          {/* Right Column: Equal Height Large Branded QR Code Showcase Card */}
          <ScrollReveal direction="left" delay={0.15} className="lg:col-span-6 h-full flex flex-col">
            <TiltCard3D className="h-full rounded-[28px] sm:rounded-[36px]">
              <div className="h-full relative bg-gradient-to-br from-[#172002] via-[#242E05] to-[#172002] p-6 sm:p-10 lg:p-12 rounded-[28px] sm:rounded-[36px] border border-[#A09048]/40 shadow-2xl text-white overflow-hidden flex flex-col justify-between items-center text-center space-y-6 sm:space-y-8">
                {/* Decorative ambient background glows */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#889028]/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#A09048]/15 rounded-full blur-3xl pointer-events-none" />

                {/* Large Branded QR Code with Centered Logo */}
                <div className="relative z-10 my-auto flex items-center justify-center py-2 sm:py-4 max-w-full">
                  <a
                    href="https://qrco.de/CVB-Vermieter-APP"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block transition-transform duration-300 hover:scale-[1.02] cursor-pointer max-w-full"
                    title="CVB Vermieter-APP herunterladen"
                  >
                    <div className="relative p-4 sm:p-7 rounded-[24px] sm:rounded-[32px] bg-white border-2 border-[#A09048]/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] group-hover:border-[#A09048] transition-all max-w-full">
                      {/* The High-Resolution QR Code */}
                      <img
                        src="/images/cvb_app_qr_raw.svg"
                        alt="CVB Vermieter-APP QR Code"
                        className="w-44 h-44 xs:w-52 xs:h-52 sm:w-64 sm:h-64 object-contain rounded-xl max-w-full"
                      />

                      {/* Centered CVB Logo with protective rounded shield */}
                      <div className="absolute inset-0 m-auto w-13 h-13 xs:w-16 xs:h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1.5 sm:p-2 border-2 border-[#A09048] shadow-[0_6px_20px_rgba(0,0,0,0.25)] flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        <img
                          src="/images/cvb_caravan_vermieter_bund_logo.png"
                          alt="CVB Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  </a>
                </div>

                {/* Card Editorial & App Store Badges matching verbatim text */}
                <div className="relative z-10 space-y-4 max-w-md mx-auto w-full pt-4 border-t border-[#A09048]/25">
                  <div className="space-y-1.5">
                    <h3 className="font-spartan font-black text-2xl sm:text-3xl uppercase tracking-wider text-white">
                      CVB - Vermieter APP<span className="text-[#A09048]">.</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-[#F4F2E6]/85 leading-relaxed">
                      Mit der CVB App hast Du Deinen Caravan-Vermieter-Bund direkt in der Hand...
                    </p>
                  </div>

                  {/* App Store & Google Play Badges verbatim */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2 w-full sm:w-auto">
                    <a
                      href="https://apps.apple.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 py-2.5 px-5 rounded-2xl bg-[#000000] text-white hover:bg-neutral-800 transition-all border border-white/15 hover:border-[#A09048]/60 shadow-md group cursor-pointer"
                    >
                      <svg className="w-6 h-6 fill-current shrink-0 text-white" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.71-.93 2.73 1.01.08 2.03-.49 2.64-1.23z"/>
                      </svg>
                      <div className="text-left">
                        <span className="block text-[9px] uppercase tracking-wider text-neutral-300 leading-none">
                          Laden im
                        </span>
                        <span className="block text-sm font-semibold tracking-tight text-white leading-tight">
                          App Store
                        </span>
                      </div>
                    </a>

                    <a
                      href="https://play.google.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 py-2.5 px-5 rounded-2xl bg-[#000000] text-white hover:bg-neutral-800 transition-all border border-white/15 hover:border-[#A09048]/60 shadow-md group cursor-pointer"
                    >
                      <svg className="w-6 h-6 fill-current shrink-0 text-white" viewBox="0 0 24 24">
                        <path d="M3.609 1.814L13.793 12 3.61 22.186a1.987 1.987 0 0 1-.61-1.464V3.278c0-.573.228-1.096.609-1.464zm11.237 11.238l2.617 2.618-12.062 6.941 9.445-9.559zm0-2.104L5.4 1.39l12.063 6.94-2.617 2.618zm1.097 1.052l3.65 2.102c.988.568.988 1.492 0 2.061l-3.65 2.102-2.434-2.434 2.434-1.831z"/>
                      </svg>
                      <div className="text-left">
                        <span className="block text-[9px] uppercase tracking-wider text-neutral-300 leading-none">
                          JETZT BEI
                        </span>
                        <span className="block text-sm font-semibold tracking-tight text-white leading-tight">
                          Google Play
                        </span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </TiltCard3D>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
