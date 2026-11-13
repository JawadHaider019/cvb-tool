'use client';

import React, { useState } from 'react';
import { Check, Info, ArrowRight, ChevronLeft, ChevronRight, Sliders } from 'lucide-react';
import { SectionHeader } from './SectionHeader.jsx';
import { ScrollReveal } from './ScrollReveal.jsx';

export const ComparisonTableSection = ({ onSelectPlan }) => {
  const [activePlanIdx, setActivePlanIdx] = useState(0);

  const plans = [
    {
      id: 'plus',
      name: 'CVB-Plus',
      subtitle: 'inkl. Veruntreuung',
      price: '208 €',
      priceSub: 'pro Monat',
      popular: false,
      btnClass: 'bg-[#F4F2E6] hover:bg-[#384808] text-[#384808] hover:text-white',
    },
    {
      id: 'premium',
      name: 'CVB-Premium',
      subtitle: 'inkl. Veruntreuung',
      price: '271 €',
      priceSub: 'pro Monat',
      popular: true,
      btnClass: 'bg-[#384808] hover:bg-[#2D3A06] text-white shadow-sm',
    },
    {
      id: 'flex',
      name: 'CVB-Flex',
      subtitle: 'Variabel',
      price: 'ab 166 €',
      priceSub: 'pro Monat',
      popular: false,
      btnClass: 'bg-[#F4F2E6] hover:bg-[#384808] text-[#384808] hover:text-white',
    },
  ];

  const rows = [
    {
      label: 'Möglich ab Anzahl Fahrzeuge',
      tooltip: 'Mindestanzahl an Fahrzeugen für diesen Tarif',
      plus: '1',
      premium: '1',
      flex: '1',
    },
    {
      label: 'Haftpflichtdeckung',
      tooltip: 'Pauschale Deckungssumme für Personen- und Sachschäden',
      plus: '100 Mio Sach / 15 Mio Person',
      premium: '100 Mio Sach / 15 Mio Person',
      flex: '100 Mio Sach / 15 Mio Person',
    },
    {
      label: 'Voll- / Teilkasko Selbstbehalt',
      tooltip: 'Selbstbeteiligung im Kaskofall',
      plus: '1.500 € / Schadensfall',
      premium: '1.500 € / Schadensfall',
      flex: 'flex bis 2.500 €',
    },
    {
      label: 'Europäischer Schutzbrief',
      tooltip: 'Pannen- und Unfallhilfe europaweit',
      plus: '89,90 € / Fahrzeug',
      premium: 'Ja',
      flex: '89,90 € / Fahrzeug',
    },
    {
      label: 'Veruntreuungsversicherung',
      tooltip: 'Schutz gegen Unterschlagung bei Vermietung',
      plus: 'Ja',
      premium: 'Ja',
      flex: 'wahlweise',
    },
    {
      label: 'Saisonkennzeichen möglich',
      tooltip: 'Zulassung mit Saisonkennzeichen',
      plus: 'Ja',
      premium: 'Ja',
      flex: 'ja',
    },
    {
      label: 'Flexible Zahlung / ggf mit Zuschlag',
      tooltip: 'Zahlungsweise der Prämie',
      plus: 'halbjährlich',
      premium: 'halbjährlich',
      flex: 'monatlich mögl.',
    },
    {
      label: 'Möglichkeit zum eigenen Flottenvertrag im CVB Rahmenvertrag',
      tooltip: 'Eigener Rahmenvertrag für größere Fuhrparks',
      plus: '> 10 Fahrzeugen',
      premium: '> 10 Fahrzeugen',
      flex: '> 10 Fahrzeuge',
    },
    {
      label: 'SB Reduzierung durch Zusatzversicherung möglich',
      tooltip: 'Optionale Absicherung des Selbstbehalts über Partner',
      plus: 'ja',
      premium: 'Ja',
      flex: 'ja',
    },
    {
      label: 'Angabe Jahrespreis',
      tooltip: 'Typischer jährlicher Richtwert inklusive Versicherungssteuer',
      plus: 'ab 2.494,24 €',
      premium: '3.250,00 €',
      flex: '2.000,00 €',
      isHighlight: true,
    },
  ];

  const handleOrder = (planName) => {
    if (onSelectPlan) {
      onSelectPlan(planName);
    } else {
      const el = document.getElementById('rechner') || document.getElementById('kontakt');
      if (el) {
        const y = el.getBoundingClientRect().top + window.pageYOffset - 84;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  const nextPlan = () => {
    setActivePlanIdx((prev) => (prev + 1) % plans.length);
  };

  const prevPlan = () => {
    setActivePlanIdx((prev) => (prev - 1 + plans.length) % plans.length);
  };

  const activePlan = plans[activePlanIdx];

  const renderValue = (val) => {
    if (val === 'Ja' || val === 'ja') {
      return (
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#889028] text-white shrink-0">
          <Check size={12} strokeWidth={3} />
        </span>
      );
    }
    if (typeof val === 'string' && val.startsWith('Ja') && val.length > 2) {
      return (
        <span className="inline-flex items-center gap-1.5 text-[#384808]">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#889028] text-white shrink-0">
            <Check size={12} strokeWidth={3} />
          </span>
          <span>{val.replace('Ja', '').trim()}</span>
        </span>
      );
    }
    return <span>{val}</span>;
  };

  return (
    <section id="versicherungen" className="py-16 sm:py-22 bg-[#FFFFFF] border-b border-[#A09048]/20 relative">
      <div id="pakete" className="absolute -top-24 left-0 pointer-events-none" />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 space-y-8 sm:space-y-10">
        <SectionHeader
          badge="PREISE AB DEM 1. FAHRZEUG"
          title="Für jeden das passende"
          accentWord="Paket"
          subtitle="Maßgeschneiderte Lösungen für Deinen Bedarf: Transparente Konditionen ab dem 1. Fahrzeug mit verlässlichen Jahresbeiträgen."
        />

        {/* Member notice banner matching screenshot */}
        <ScrollReveal>
          <div className="p-5 sm:p-6 rounded-2xl bg-[#F4F2E6] border border-[#A09048]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="font-spartan font-black text-xs uppercase tracking-widest text-[#889028]">
                WOHNMOBIL
              </span>
              <p className="text-xs sm:text-sm text-[#384808] font-medium leading-relaxed">
                Unsere Lösungen und Versicherungen stehen ausschließlich unseren CVB-Kunden zur Verfügung.
                Für nur <strong className="font-bold text-[#384808]">249,- € netto / Fahrzeug</strong> im Kalenderjahr, wirst Du Kunde beim CVB.
              </p>
            </div>
            <a
              href="#kontakt"
              className="shrink-0 text-xs font-spartan font-bold uppercase tracking-wider px-5 py-2.5 rounded-full bg-white border border-[#A09048]/40 text-[#384808] hover:bg-[#384808] hover:text-white transition-colors shadow-2xs"
            >
              Mitglied werden
            </a>
          </div>
        </ScrollReveal>

        {/* 1. TABLET & MOBILE VIEW (< 1024px): 2-Column with Tabs & Arrow Switcher (NO Horizontal Scroll!) */}
        <div className="lg:hidden space-y-4">
          {/* Plan Tabs Switcher */}
          <div className="flex items-center justify-between gap-2 p-1.5 rounded-2xl bg-[#F4F2E6] border border-[#A09048]/30">
            {plans.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setActivePlanIdx(idx)}
                className={`flex-1 py-2.5 px-2 rounded-xl text-center font-spartan font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activePlanIdx === idx
                    ? 'bg-[#384808] text-white shadow-md'
                    : 'text-[#384808] hover:bg-white/60'
                }`}
              >
                <span>{p.name}</span>
              </button>
            ))}
          </div>

          {/* 2-Column Mobile/Tablet Comparison Card */}
          <div className="overflow-hidden rounded-[26px] border border-[#A09048]/30 bg-white shadow-xl">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="border-b border-[#A09048]/25 bg-[#FBFBFA]">
                  {/* Left Column Header */}
                  <th className="p-4 sm:p-5 text-xs font-spartan font-bold uppercase tracking-wider text-[#585828] w-[46%] sm:w-[48%] align-top">
                    Leistungsmerkmal
                  </th>

                  {/* Right Column Header (Active Plan with Arrows) */}
                  <th className="p-4 sm:p-5 text-center w-[54%] sm:w-[52%] border-l border-[#A09048]/20 bg-white align-top">
                    <div className="space-y-1.5">
                      {/* Arrow Navigation Row */}
                      <div className="flex items-center justify-between gap-1">
                        <button
                          onClick={prevPlan}
                          className="p-1 rounded-lg hover:bg-[#F4F2E6] text-[#384808] transition-colors cursor-pointer"
                          aria-label="Vorheriger Tarif"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <span className="font-spartan font-black text-base sm:text-lg uppercase text-[#384808] truncate">
                          {activePlan.name}
                        </span>
                        <button
                          onClick={nextPlan}
                          className="p-1 rounded-lg hover:bg-[#F4F2E6] text-[#384808] transition-colors cursor-pointer"
                          aria-label="Nächster Tarif"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>

                      <span className="text-[10px] sm:text-[11px] text-[#585828] block">
                        {activePlan.subtitle}
                      </span>

                      <div className="pt-1">
                        <span className="font-spartan font-black text-xl sm:text-2xl text-[#384808] block leading-tight">
                          {activePlan.price}
                        </span>
                        <span className="text-[10px] text-[#585828] block">
                          {activePlan.priceSub}
                        </span>
                      </div>

                      <button
                        onClick={() => handleOrder(activePlan.name)}
                        className={`mt-2 w-full py-2 px-3 rounded-full text-xs font-spartan font-bold uppercase tracking-wider transition-colors cursor-pointer ${activePlan.btnClass}`}
                      >
                        Jetzt bestellen
                      </button>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#A09048]/15 text-xs sm:text-[13px]">
                {rows.map((r, idx) => {
                  const val = r[activePlan.id];
                  return (
                    <tr
                      key={idx}
                      className={r.isHighlight ? 'bg-[#F4F2E6]/70 font-semibold' : idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF9F5]'}
                    >
                      <td className="p-3.5 sm:p-4 text-[#384808] font-medium leading-relaxed align-middle">
                        <div className="flex items-center gap-1.5">
                          <span>{r.label}</span>
                          {r.tooltip && (
                            <span title={r.tooltip} className="text-[#A09048] shrink-0">
                              <Info size={12} />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5 sm:p-4 text-center text-[#384808] border-l border-[#A09048]/20 font-medium align-middle">
                        <div className="flex items-center justify-center">
                          {renderValue(val)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. DESKTOP VIEW (>= 1024px): Full 4-Column Matrix matching original desktop UI */}
        <ScrollReveal delay={0.1} className="hidden lg:block">
          <div className="overflow-hidden rounded-[28px] border border-[#A09048]/30 bg-white shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#A09048]/25 bg-[#FBFBFA]">
                    <th className="p-6 text-sm font-spartan font-bold uppercase tracking-wider text-[#585828] w-2/5 min-w-[200px]">
                      Leistungsmerkmal
                    </th>
                    <th className="p-6 text-center w-1/5 min-w-[170px] border-l border-[#A09048]/15 bg-white">
                      <div className="space-y-1">
                        <span className="font-spartan font-black text-xl uppercase text-[#384808] block">
                          CVB-Plus
                        </span>
                        <span className="text-[11px] text-[#585828] block">inkl. Veruntreuung</span>
                        <div className="pt-2">
                          <span className="font-spartan font-black text-3xl text-[#384808]">208 €</span>
                          <span className="text-[11px] text-[#585828] block">pro Monat</span>
                        </div>
                        <button
                          onClick={() => handleOrder('CVB-Plus')}
                          className="mt-3 w-full py-2 px-3 rounded-full bg-[#F4F2E6] hover:bg-[#384808] text-[#384808] hover:text-white text-xs font-spartan font-bold uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          Jetzt bestellen
                        </button>
                      </div>
                    </th>
                    <th className="p-6 text-center w-1/5 min-w-[170px] border-l border-[#A09048]/15 bg-[#F4F2E6]/40 relative">
                      <div className="space-y-1">
                        <span className="font-spartan font-black text-xl uppercase text-[#384808] block">
                          CVB-Premium
                        </span>
                        <span className="text-[11px] text-[#585828] block">inkl. Veruntreuung</span>
                        <div className="pt-2">
                          <span className="font-spartan font-black text-3xl text-[#384808]">271 €</span>
                          <span className="text-[11px] text-[#585828] block">pro Monat</span>
                        </div>
                        <button
                          onClick={() => handleOrder('CVB-Premium')}
                          className="mt-3 w-full py-2 px-3 rounded-full bg-[#384808] hover:bg-[#2D3A06] text-white text-xs font-spartan font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                        >
                          Jetzt bestellen
                        </button>
                      </div>
                    </th>
                    <th className="p-6 text-center w-1/5 min-w-[170px] border-l border-[#A09048]/15 bg-white">
                      <div className="space-y-1">
                        <span className="font-spartan font-black text-xl uppercase text-[#384808] block">
                          CVB-Flex
                        </span>
                        <span className="text-[11px] text-[#585828] block">Variabel</span>
                        <div className="pt-2">
                          <span className="font-spartan font-black text-3xl text-[#384808]">ab 166 €</span>
                          <span className="text-[11px] text-[#585828] block">pro Monat</span>
                        </div>
                        <button
                          onClick={() => handleOrder('CVB-Flex')}
                          className="mt-3 w-full py-2 px-3 rounded-full bg-[#F4F2E6] hover:bg-[#384808] text-[#384808] hover:text-white text-xs font-spartan font-bold uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          Jetzt bestellen
                        </button>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#A09048]/15 text-sm">
                  {rows.map((r, idx) => (
                    <tr
                      key={idx}
                      className={r.isHighlight ? 'bg-[#F4F2E6]/60 font-semibold' : 'hover:bg-[#FBFBFA] transition-colors'}
                    >
                      <td className="p-5 text-[#384808] font-medium flex items-center gap-2">
                        <span>{r.label}</span>
                        {r.tooltip && (
                          <span title={r.tooltip} className="text-[#A09048] cursor-help">
                            <Info size={13} />
                          </span>
                        )}
                      </td>
                      <td className="p-5 text-center text-[#384808] border-l border-[#A09048]/15 bg-white/70">
                        {renderValue(r.plus)}
                      </td>
                      <td className="p-5 text-center text-[#384808] border-l border-[#A09048]/15 bg-[#F4F2E6]/30 font-medium">
                        {renderValue(r.premium)}
                      </td>
                      <td className="p-5 text-center text-[#384808] border-l border-[#A09048]/15 bg-white/70">
                        {renderValue(r.flex)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
