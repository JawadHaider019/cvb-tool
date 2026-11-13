'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight, ShieldCheck, Mail, Phone, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -84;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'versicherungen', label: 'Versicherungen' },
    { id: 'besser-vermieten', label: 'Über uns' },
    { id: 'app', label: 'Vermieter-App' },
    { id: 'faq', label: 'FAQ' },
    { id: 'kontakt', label: 'Kontakt' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#172002]/95 backdrop-blur-md border-b border-[#A09048]/35 shadow-[0_4px_24px_-4px_rgba(23,32,2,0.6)] py-2.5 sm:py-3'
            : 'bg-transparent border-b border-[#A09048]/20 py-3.5 sm:py-4'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center group select-none shrink-0"
            aria-label="Caravan-Vermieter-Bund (CVB)"
          >
            <div className="bg-white/95 backdrop-blur-md rounded-xl p-1.5 shadow-sm group-hover:scale-105 transition-transform">
              <img
                src="/images/cvb_caravan_vermieter_bund_logo.png"
                alt="Caravan-Vermieter-Bund (CVB)"
                className="h-8 sm:h-9 w-auto object-contain shrink-0"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Hauptnavigation"
            className="hidden lg:flex items-center gap-8 xl:gap-10"
          >
            {[
              { id: 'versicherungen', label: 'Versicherungen' },
              { id: 'besser-vermieten', label: 'Über uns' },
              { id: 'kontakt', label: 'Kontakt' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="group relative py-2 text-[13px] font-bold uppercase tracking-[0.08em] text-[#F4F2E6] hover:text-[#A09048] transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>{item.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#A09048] transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center">
            <button
              onClick={() => scrollToSection('versicherungen')}
              className="px-6 py-2.5 rounded-full bg-[#A09048] hover:bg-[#889028] text-[#172002] hover:text-white text-xs sm:text-[13px] font-spartan font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center gap-2.5 group cursor-pointer"
            >
              <span>Jetzt Versicherung wählen</span>
              <ArrowRight
                size={15}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>

          {/* Mobile / Tablet Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-xl border border-[#A09048]/40 text-[#F4F2E6] hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-2"
            aria-label="Menü öffnen"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Right Side Slide-Over Drawer for Tablet & Mobile */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs cursor-pointer"
            />

            {/* Right Drawer Panel */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed top-0 right-0 bottom-0 w-[320px] sm:w-[360px] max-w-[85vw] bg-[#172002] border-l border-[#A09048]/35 shadow-[-12px_0_40px_rgba(0,0,0,0.7)] flex flex-col justify-between overflow-y-auto text-white p-6 z-10"
            >
              {/* Drawer Header */}
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#A09048]/20">
                  <div className="bg-white/95 rounded-xl p-1.5 shadow-sm">
                    <img
                      src="/images/cvb_caravan_vermieter_bund_logo.png"
                      alt="Caravan-Vermieter-Bund"
                      className="h-8 w-auto object-contain"
                    />
                  </div>

                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#F4F2E6] transition-colors border border-[#A09048]/30 cursor-pointer"
                    aria-label="Menü schließen"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-1.5" aria-label="Mobile Navigation">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left font-spartan font-bold text-sm uppercase tracking-wider text-[#F4F2E6] hover:bg-white/10 hover:text-[#A09048] transition-colors group cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#A09048]" />
                        <span>{item.label}</span>
                      </span>
                      <ChevronRight
                        size={16}
                        className="text-[#A09048]/60 group-hover:text-[#A09048] group-hover:translate-x-1 transition-all"
                      />
                    </button>
                  ))}
                </nav>

                {/* Primary CTA Button */}
                <div className="pt-2">
                  <button
                    onClick={() => scrollToSection('versicherungen')}
                    className="w-full py-3.5 px-5 rounded-full bg-[#A09048] hover:bg-[#889028] text-[#172002] hover:text-white text-xs font-spartan font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-between cursor-pointer group"
                  >
                    <span>Jetzt Versicherung wählen</span>
                    <ArrowRight
                      size={15}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </div>
              </div>

              {/* Drawer Footer Info */}
              <div className="pt-6 border-t border-[#A09048]/20 space-y-4">
                <div className="space-y-2 text-xs text-[#F4F2E6]/75">
                  <a
                    href="mailto:info@caravan-vermieter-bund.de"
                    className="flex items-center gap-2 hover:text-[#A09048] transition-colors break-all"
                  >
                    <Mail size={13} className="text-[#A09048] shrink-0" />
                    <span>info@caravan-vermieter-bund.de</span>
                  </a>
                  <a
                    href="tel:+491722111189"
                    className="flex items-center gap-2 hover:text-[#A09048] transition-colors"
                  >
                    <Phone size={13} className="text-[#A09048] shrink-0" />
                    <span>+49 (0) 172 21 111 89</span>
                  </a>
                </div>

                <div className="text-[11px] text-[#F4F2E6]/50">
                  © {new Date().getFullYear()} Caravan Vermieter Bund
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
