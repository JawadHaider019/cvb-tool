'use client';

import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

export const HeroSection = ({ section }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 28, stiffness: 130, mass: 0.55 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const bgX = useTransform(smoothX, [-0.5, 0.5], [12, -12]);
  const bgY = useTransform(smoothY, [-0.5, 0.5], [8, -8]);
  const contentX = useTransform(smoothX, [-0.5, 0.5], [-4, 4]);
  const contentY = useTransform(smoothY, [-0.5, 0.5], [-3, 3]);

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
      className="relative min-h-[72vh] lg:min-h-[80vh] flex flex-col justify-center overflow-hidden bg-[#FFFFFF] text-[#384808] select-none border-b border-[#A09048]/20"
      style={{ perspective: '1200px' }}
    >
      {/* Camper Photo on Right / Background with fade */}
      <motion.div
        style={{ x: bgX, y: bgY, scale: 1.03 }}
        className="absolute inset-0 w-full h-full pointer-events-none will-change-transform z-0 overflow-hidden"
      >
        <img
          src={section?.image || '/images/luxury_camper_hero.jpg'}
          alt="Wohnmobil für die Vermietung"
          className="w-full h-full object-cover object-[75%_center] md:object-[82%_center] lg:object-[80%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/85 to-white/40 md:bg-gradient-to-r md:from-white md:via-white/95 md:via-55% md:to-white/20 lg:via-white/90 lg:via-50% lg:to-transparent pointer-events-none" />
      </motion.div>

      {/* Hero Editorial Content matching Screenshot 5 */}
      <div className="relative z-10 max-w-[1360px] w-full mx-auto px-4 sm:px-10 lg:px-12 py-14 sm:py-20">
        <motion.div
          style={{ x: contentX, y: contentY }}
          className="max-w-2xl xl:max-w-3xl will-change-transform space-y-6"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-spartan font-black text-[36px] sm:text-5xl lg:text-6xl xl:text-[64px] leading-[1.08] tracking-tight text-[#889028]"
          >
            Wohnmobil und Wohnwagen vermieten und versichern
          </motion.h1>

          <div className="space-y-4 text-sm sm:text-base text-[#4A4A28] leading-relaxed max-w-xl">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              Versicherungslösungen und Services für Vermieter und die, die es werden wollen.<br />
              Beim Caravan-Vermieter-Bund handelt es sich um ein B2B Netzwerk für ambitionierte Wohnmobilvermieter.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22 }}
            >
              Wir bieten <strong className="font-bold text-[#384808]">professionelle Lösungen</strong> bereits <strong className="font-bold text-[#384808]">ab dem 1. Wohnmobil</strong> oder Wohnwagen.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.29 }}
            >
              Für Vermieter <strong className="font-bold text-[#384808]">ab 10 Fahrzeugen</strong> haben wir eine <strong className="font-bold text-[#384808]">Flottenlösung</strong>, die besonders attraktiv ist.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-wrap items-center gap-3.5 pt-2"
          >
            <a
              href="https://caravanvermieterbund.de/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-lg bg-[#EFECE6] hover:bg-[#384808] text-[#384808] hover:text-white font-spartan font-bold text-xs sm:text-sm tracking-wide transition-all shadow-xs"
            >
              Mehr erfahren
            </a>

            <button
              onClick={() => scrollTo('faq')}
              className="px-6 py-2.5 rounded-lg bg-[#EFECE6] hover:bg-[#384808] text-[#384808] hover:text-white font-spartan font-bold text-xs sm:text-sm tracking-wide transition-all shadow-xs cursor-pointer"
            >
              Fragen?
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
