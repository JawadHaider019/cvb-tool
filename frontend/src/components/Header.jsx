'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight, Calculator } from 'lucide-react';

export const Header = ({ tickerText }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b transition-all duration-300 ${
        isScrolled
          ? 'border-[#A09048]/35 shadow-[0_4px_24px_-4px_rgba(56,72,8,0.08)] py-2.5 sm:py-3'
          : 'border-[#A09048]/25 shadow-xs py-3 sm:py-4'
      }`}
    >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-10 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center group select-none shrink-0"
            aria-label="Caravan-Vermieter-Bund (CVB)"
          >
            <img
              src="/images/cvb_caravan_vermieter_bund_logo.png"
              alt="Caravan-Vermieter-Bund (CVB)"
              className="h-10 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform shrink-0"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Hauptnavigation"
            className="hidden lg:flex items-center gap-8 xl:gap-10"
          >
            {[
              { id: 'pakete', label: 'Versicherungen' },
              { id: 'besser-vermieten', label: 'Über uns' },
              { id: 'kontakt', label: 'Kontakt' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="group relative py-2 text-[13px] font-bold uppercase tracking-[0.08em] text-[#585828] hover:text-[#384808] transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>{item.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#A09048] transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>

          {/* Desktop CTA matching Screenshot 5 */}
          <div className="hidden lg:flex items-center">
            <button
              onClick={() => scrollToSection('rechner')}
              className="px-6 py-2.5 rounded-full bg-[#384808] hover:bg-[#242E05] text-white text-xs sm:text-[13px] font-spartan font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center gap-2.5 group cursor-pointer"
            >
              <span>Jetzt Versicherung wählen</span>
              <ArrowRight
                size={15}
                className="text-[#A09048] group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-xl border border-[#A09048]/35 text-[#384808] hover:bg-[#F4F2E6] transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Menü schließen' : 'Menü öffnen'}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-[#A09048]/25 px-4 py-5 space-y-3 shadow-lg">
            {[
              { id: 'pakete', label: 'Versicherungen' },
              { id: 'besser-vermieten', label: 'Über uns' },
              { id: 'kontakt', label: 'Kontakt' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-left px-3 py-2.5 rounded-xl font-spartan font-bold text-sm uppercase tracking-wider text-[#384808] hover:bg-[#F4F2E6] cursor-pointer"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('rechner')}
              className="w-full py-3 px-5 rounded-full bg-[#384808] hover:bg-[#242E05] text-white text-xs font-spartan font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-between mt-3"
            >
              <span>Jetzt Versicherung wählen</span>
              <ArrowRight size={15} className="text-[#A09048]" />
            </button>
          </div>
        )}
      </header>
  );
};

