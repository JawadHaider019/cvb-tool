'use client';

import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

export const HeroSection = ({ section }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 28, stiffness: 130, mass: 0.55 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const bgX = useTransform(smoothX, [-0.5, 0.5], [16, -16]);
  const bgY = useTransform(smoothY, [-0.5, 0.5], [10, -10]);
  const contentX = useTransform(smoothX, [-0.5, 0.5], [-6, 6]);
  const contentY = useTransform(smoothY, [-0.5, 0.5], [-4, 4]);

  const handleMouseMove = (e) => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: coarse)').matches
    ) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 84;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="top"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[75vh] lg:min-h-[84vh] flex flex-col justify-between overflow-hidden bg-[#FFFFFF] text-[#384808] pt-4 sm:pt-8 select-none border-b border-[#A09048]/20"
      style={{ perspective: '1200px' }}
    >
      {/* Atmospheric Ambient Glow */}
      <div className="absolute top-1/3 -left-20 w-[450px] h-[450px] rounded-full bg-[#A09048]/10 blur-[110px] pointer-events-none z-0" />

      {/* Full-bleed Parallax Hero Background Photo */}
      <motion.div
        style={{ x: bgX, y: bgY, scale: 1.04 }}
        className="absolute inset-0 w-full h-full pointer-events-none will-change-transform z-0 overflow-hidden"
      >
        <img
          src={section.image || '/images/luxury_camper_hero.jpg'}
          alt={
            section.imageAlt ||
            'Wohnmobil für die Selbstfahrervermietung am See'
          }
          className="w-full h-full object-cover object-[68%_center] md:object-[80%_center] lg:object-[75%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/85 via-60% to-white/30 md:bg-gradient-to-r md:from-white md:via-white/90 md:via-55% md:to-white/35 lg:via-white/85 lg:via-48% lg:to-white/15 xl:via-white/80 xl:via-38% xl:to-transparent pointer-events-none" />
      </motion.div>

      {/* Hero Editorial Content */}
      <div className="relative z-10 max-w-[1360px] w-full mx-auto px-4 sm:px-10 lg:px-12 flex-1 flex flex-col justify-center py-10 sm:py-14 lg:py-16">
        <motion.div
          style={{ x: contentX, y: contentY }}
          className="max-w-4xl will-change-transform"
        >
          {section.badge && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 mb-5 rounded-full bg-white/80 backdrop-blur-xl border border-[#A09048]/30 shadow-[0_4px_20px_rgba(56,72,8,0.06)] text-[11px] sm:text-xs font-bold text-[#384808] max-w-full"
            >
              <span className="w-2 h-2 rounded-full bg-[#889028] animate-pulse shrink-0" />
              <span className="leading-snug uppercase tracking-wider">
                {section.badge}
              </span>
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="font-spartan font-black uppercase text-[38px] sm:text-5xl lg:text-6xl xl:text-[68px] leading-[0.98] tracking-[-0.025em] mb-6 text-[#384808]"
          >
            <span className="block text-[#384808]">
              Wohnmobil und Wohnwagen vermieten und versichern
              <span className="text-[#A09048]">.</span>
            </span>
            <span className="block text-[24px] sm:text-3xl lg:text-[38px] xl:text-[44px] font-bold tracking-tight mt-3 text-[#384808] leading-[1.08]">
              <span className="relative inline-block text-[#A09048]">
                TARIFE 2027
                <svg
                  className="absolute left-0 -bottom-2 sm:-bottom-2.5 w-full h-2.5 sm:h-3 overflow-visible pointer-events-none"
                  viewBox="0 0 400 24"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 17C90 5 250 3 394 12"
                    fill="none"
                    stroke="#384808"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{' '}
              <span className="text-[#384808] block sm:inline mt-2 sm:mt-0">
                SOFORT BERECHNEN
              </span>
            </span>
          </motion.h1>

          <div className="space-y-3 max-w-2xl mb-6">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="text-sm sm:text-base text-[#585828] font-normal leading-relaxed"
            >
              Versicherungslösungen und Services für Vermieter und die, die es werden wollen.
              Beim Caravan-Vermieter-Bund handelt es sich um ein B2B Netzwerk für ambitionierte Wohnmobilvermieter.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.32 }}
              className="text-xs sm:text-sm text-[#384808] font-semibold leading-relaxed"
            >
              Wir bieten professionelle Lösungen bereits ab dem 1. Wohnmobil oder Wohnwagen.
              Für Vermieter ab 10 Fahrzeugen haben wir eine Flottenlösung, die besonders attraktiv ist.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.38 }}
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm font-semibold text-[#384808] mb-7 sm:mb-9"
          >
            {[
              'Bereits ab dem 1. Fahrzeug',
              'Wohnmobil & Wohnwagen',
              'Jahresbeiträge inkl. Versicherungssteuer',
            ].map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#384808] text-white flex items-center justify-center shrink-0">
                  <Check size={10} strokeWidth={3} />
                </span>
                <span>{item}</span>
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-wrap items-center gap-4"
          >
            <button
              onClick={() => scrollTo('rechner')}
              className="tech-cta-primary animate-cta-pulse"
            >
              <span>{section.ctaText || 'Tarif jetzt berechnen'}</span>
              <span className="tech-ci">
                <ArrowRight size={17} />
              </span>
            </button>

            <a
              href="https://caravanvermieterbund.de/"
              target="_blank"
              rel="noopener noreferrer"
              className="tech-cta-ghost"
            >
              <span>Mehr erfahren</span>
            </a>

            <button
              onClick={() => scrollTo('faq')}
              className="tech-cta-ghost"
            >
              <span>Fragen?</span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

