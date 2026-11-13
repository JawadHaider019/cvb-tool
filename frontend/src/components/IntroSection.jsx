'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal.jsx';
import { SectionHeader } from './SectionHeader.jsx';

export const IntroSection = ({ section }) => {
  return (
    <section id="intro" className="py-16 sm:py-22 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        <SectionHeader
          badge={section.badge}
          title={section.title}
          accentWord="IM CVB"
          subtitle={section.subtitle}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <ScrollReveal direction="right" className="lg:col-span-5 order-2 lg:order-1">
            <div className="rounded-[28px] overflow-hidden border border-[#A09048]/30 shadow-lg">
              <img
                src={section.image || '/images/hero_motorhome_handover.jpg'}
                alt={section.imageAlt || 'Fahrzeugübergabe bei Wohnmobilvermietung'}
                className="w-full h-[280px] sm:h-[360px] object-cover hover:scale-[1.03] transition-transform duration-500"
              />
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.1} className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            {section.body && (
              <p className="text-sm sm:text-base text-[#585828] leading-relaxed">
                {section.body}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                'Anerkannte Selbstfahrervermietversicherung',
                'Für Wohnmobile & Wohnwagen',
                'Flottenlösungen ab 10 Fahrzeugen',
                'eVB-Nummer für die schnelle Zulassung',
              ].map((point) => (
                <div
                  key={point}
                  className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-[#F4F2E6]/75 border border-[#A09048]/25 text-xs sm:text-sm font-semibold text-[#384808] hover:border-[#384808]/40 transition-colors"
                >
                  <CheckCircle2 size={17} className="text-[#889028] shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

