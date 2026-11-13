'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Header } from './Header.jsx';

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
      className="relative min-h-[92vh] lg:min-h-screen flex flex-col justify-between overflow-hidden bg-[#172002] text-white select-none border-b border-[#A09048]/30"
      style={{ perspective: '1200px' }}
    >
      {/* Ambient Glow */}
      <div className="absolute top-1/4 -left-20 w-[550px] h-[550px] rounded-full bg-[#A09048]/15 blur-[130px] pointer-events-none z-0" />

      {/* Full-bleed Parallax Hero Background Photo showing behind Navbar & Hero */}
      <motion.div
        style={{ x: bgX, y: bgY, scale: 1.05 }}
        className="absolute inset-0 w-full h-full pointer-events-none will-change-transform z-0 overflow-hidden"
      >
        <img
          src={section?.image || '/images/luxury_motorhome_alps.jpg'}
          alt="Modernes Wohnmobil für die Selbstfahrervermietung"
          className="w-full h-full object-cover object-[72%_center] md:object-[82%_center] lg:object-[78%_center]"
        />
        {/* Dark Olive Lighter Overlay - lets the scenic background shine through vividly */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#172002]/75 via-[#242E05]/50 via-55% to-[#172002]/15 md:to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#172002]/45 via-transparent to-[#172002]/65 pointer-events-none" />
      </motion.div>

      {/* 1. Integrated Navbar Sharing the Same Hero Container */}
      <Header />

      {/* 2. Hero Editorial Content */}
      <div className="relative z-10 max-w-[1400px] w-full mx-auto px-4 sm:px-8 lg:px-12 flex-1 flex flex-col justify-center py-12 sm:py-20 lg:py-24">
        <motion.div
          style={{ x: contentX, y: contentY }}
          className="max-w-3xl xl:max-w-4xl will-change-transform"
        >

          {/* Spartan Black Headline with Hand-Drawn Gold Swoosh Accent */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="font-spartan font-black uppercase text-[28px] xs:text-[34px] sm:text-5xl lg:text-6xl xl:text-[72px] leading-[0.98] sm:leading-[0.96] tracking-[-0.025em] mb-6 text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] break-words"
          >
            <span className="block text-white">
              Wohnmobil und Wohnwagen
            </span>
            <span className="block text-[22px] xs:text-[28px] sm:text-4xl lg:text-5xl xl:text-6xl font-black mt-2 text-white leading-[1.05] break-words">
              vermieten{' '}
              <span className="relative inline-block text-[#A09048]">
                und versichern
                <svg
                  className="absolute left-0 -bottom-2 sm:-bottom-3 w-full h-2.5 sm:h-3.5 overflow-visible pointer-events-none"
                  viewBox="0 0 400 24"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 17C90 5 250 3 394 12"
                    fill="none"
                    stroke="#A09048"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-[#889028]">.</span>
              </span>
            </span>
          </motion.h1>

          {/* Editorial Content - 100% exact text */}
          <div className="space-y-3 max-w-2xl sm:max-w-3xl mb-8">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="text-base sm:text-lg text-[#F4F2E6]/90 font-normal leading-relaxed"
            >
              Versicherungslösungen und Services für Vermieter und die, die es werden wollen.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.28 }}
              className="text-base sm:text-lg text-[#F4F2E6]/90 font-normal leading-relaxed"
            >
              Beim Caravan-Vermieter-Bund handelt es sich um ein B2B Netzwerk für ambitionierte Wohnmobilvermieter.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.32 }}
              className="text-sm sm:text-base text-white font-semibold leading-relaxed pt-1"
            >
              Wir bieten professionelle Lösungen bereits ab dem 1. Wohnmobil oder Wohnwagen.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="text-sm sm:text-base text-white font-semibold leading-relaxed"
            >
              Für Vermieter ab 10 Fahrzeugen haben wir eine Flottenlösung, die besonders attraktiv ist.
            </motion.p>
          </div>

          {/* Action CTAs - 100% exact links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 w-full sm:w-auto"
          >
            <a
              href="https://caravanvermieterbund.de/"
              target="_blank"
              rel="noopener noreferrer"
              className="tech-cta-primary group animate-cta-pulse cursor-pointer shadow-xl hover:shadow-2xl"
            >
              <span>Mehr erfahren</span>
              <span className="tech-ci">
                <ArrowRight size={17} />
              </span>
            </a>

            <button
              onClick={() => scrollTo('faq')}
              className="tech-cta-ghost cursor-pointer bg-white/10 hover:bg-white/20 text-white border border-[#A09048]/40 shadow-xs"
            >
              <span>Fragen?</span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
