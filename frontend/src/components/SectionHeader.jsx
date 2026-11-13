'use client';

import React from 'react';
import { ScrollReveal } from './ScrollReveal.jsx';

export const SectionHeader = ({
  badge,
  title,
  subtitle,
}) => {
  return (
    <ScrollReveal>
      <div className="mb-10 sm:mb-14 space-y-2">
        <h2 className="font-spartan text-3xl sm:text-4xl lg:text-[46px] font-black tracking-tight text-[#889028] leading-[1.1]">
          {title}
        </h2>
        {subtitle && (
          <p className="text-base sm:text-lg text-[#384808] font-normal leading-relaxed max-w-3xl">
            {subtitle}
          </p>
        )}
      </div>
    </ScrollReveal>
  );
};
