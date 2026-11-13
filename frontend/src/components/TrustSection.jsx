'use client';

import React from 'react';
import { Award, Headphones, ShieldCheck, Layers } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal.jsx';
import { TiltCard3D } from './TiltCard3D.jsx';
import { SectionHeader } from './SectionHeader.jsx';

const icons = [ShieldCheck, Headphones, Layers, Award];

export const TrustSection = ({ section }) => {
  const items = section.items || [];

  return (
    <section
      id="vorteile"
      className="py-16 sm:py-22 bg-[#F4F2E6]/50 border-t border-[#A09048]/20"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        <SectionHeader
          badge={section.badge}
          title={section.title}
          accentWord="FÜR VERMIETER"
          subtitle={section.subtitle}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item, idx) => {
              const Icon = icons[idx % icons.length];
              return (
                <ScrollReveal key={idx} delay={idx * 0.08}>
                  <TiltCard3D className="h-full rounded-[28px]">
                    <div className="tech-card-white p-5 space-y-2.5 h-full">
                      <div className="w-10 h-10 rounded-2xl bg-[#384808] text-[#A09048] flex items-center justify-center">
                        <Icon size={19} />
                      </div>
                      <h3 className="font-spartan font-bold text-lg uppercase text-[#384808]">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#585828] leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  </TiltCard3D>
                </ScrollReveal>
              );
            })}
          </div>

          <ScrollReveal direction="left" delay={0.15} className="lg:col-span-5">
            <div className="rounded-[28px] overflow-hidden border border-[#A09048]/30 shadow-xl">
              <img
                src={section.image || '/images/luxury_motorhome_alps.jpg'}
                alt={section.imageAlt || 'Wohnmobil in den Alpen'}
                className="w-full h-[320px] sm:h-[420px] object-cover hover:scale-[1.03] transition-transform duration-500"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

