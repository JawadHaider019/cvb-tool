'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal.jsx';

export const SectionHeader = ({
  badge,
  icon: Icon = ShieldCheck,
  title,
  accentWord,
  subtitle,
}) => {
  return (
    <ScrollReveal>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-end mb-10 sm:mb-14 pb-6 sm:pb-8 border-b border-[#A09048]/20">
        <div className="lg:col-span-7 xl:col-span-8">
          {badge && (
            <div className="tech-tag mb-4">
              <Icon size={14} className="text-[#889028] shrink-0" strokeWidth={2.4} />
              <span>{badge}</span>
            </div>
          )}

          <h2 className="font-spartan text-[26px] xs:text-[28px] sm:text-5xl lg:text-[54px] font-black uppercase text-[#384808] leading-[1.08] sm:leading-[1.02] tracking-tight break-words">
            {title}
            {accentWord ? (
              <>
                {' '}
                <span className="text-[#889028]">
                  {accentWord}
                  <span className="text-[#A09048]">.</span>
                </span>
              </>
            ) : (
              <span className="text-[#A09048]">.</span>
            )}
          </h2>
        </div>

        {subtitle && (
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-end">
            <p className="text-sm sm:text-base text-[#585828] font-normal leading-relaxed">
              {subtitle}
            </p>
          </div>
        )}
      </div>
    </ScrollReveal>
  );
};
