'use client';

import React, { useState } from 'react';
import { Check, Plus, Shield, Info, ArrowRight } from 'lucide-react';
import { SectionHeader } from './SectionHeader.jsx';
import { ScrollReveal } from './ScrollReveal.jsx';

export const ComparisonTableSection = ({ onSelectPlan }) => {
  const [vehicleType, setVehicleType] = useState('wohnmobil');

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
      const el = document.getElementById('rechner');
      if (el) {
        const y = el.getBoundingClientRect().top + window.pageYOffset - 84;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="pakete" className="py-16 sm:py-22 bg-[#FFFFFF] border-b border-[#A09048]/20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 space-y-10">
        <SectionHeader
          title="Für jeden das passende Paket"
          subtitle="Maßgeschneiderte Lösungen für Deinen Bedarf"
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
              className="shrink-0 text-xs font-spartan font-bold uppercase tracking-wider px-4 py-2 rounded-full bg-white border border-[#A09048]/40 text-[#384808] hover:bg-[#384808] hover:text-white transition-colors"
            >
              Mitglied werden
            </a>
          </div>
        </ScrollReveal>

        {/* Comparison Table Card */}
        <ScrollReveal delay={0.1}>
          <div className="overflow-hidden rounded-[28px] border border-[#A09048]/30 bg-white shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#A09048]/25 bg-[#FBFBFA]">
                    <th className="p-4 sm:p-6 text-xs sm:text-sm font-spartan font-bold uppercase tracking-wider text-[#585828] w-2/5 min-w-[200px]">
                      Leistungsmerkmal
                    </th>
                    <th className="p-4 sm:p-6 text-center w-1/5 min-w-[170px] border-l border-[#A09048]/15 bg-white">
                      <div className="space-y-1">
                        <span className="font-spartan font-black text-lg sm:text-xl uppercase text-[#384808] block">
                          CVB-Plus
                        </span>
                        <span className="text-[11px] text-[#585828] block">inkl. Veruntreuung</span>
                        <div className="pt-2">
                          <span className="font-spartan font-black text-2xl sm:text-3xl text-[#384808]">208 €</span>
                          <span className="text-[11px] text-[#585828] block">pro Monat</span>
                        </div>
                        <button
                          onClick={() => handleOrder('CVB-Plus')}
                          className="mt-3 w-full py-2 px-3 rounded-full bg-[#F4F2E6] hover:bg-[#384808] text-[#384808] hover:text-white text-xs font-spartan font-bold uppercase tracking-wider transition-colors"
                        >
                          Jetzt bestellen
                        </button>
                      </div>
                    </th>
                    <th className="p-4 sm:p-6 text-center w-1/5 min-w-[170px] border-l border-[#A09048]/15 bg-[#F4F2E6]/40 relative">
                      <div className="space-y-1">
                        <span className="font-spartan font-black text-lg sm:text-xl uppercase text-[#384808] block">
                          CVB-Premium
                        </span>
                        <span className="text-[11px] text-[#585828] block">inkl. Veruntreuung</span>
                        <div className="pt-2">
                          <span className="font-spartan font-black text-2xl sm:text-3xl text-[#384808]">271 €</span>
                          <span className="text-[11px] text-[#585828] block">pro Monat</span>
                        </div>
                        <button
                          onClick={() => handleOrder('CVB-Premium')}
                          className="mt-3 w-full py-2 px-3 rounded-full bg-[#384808] hover:bg-[#2D3A06] text-white text-xs font-spartan font-bold uppercase tracking-wider transition-colors shadow-sm"
                        >
                          Jetzt bestellen
                        </button>
                      </div>
                    </th>
                    <th className="p-4 sm:p-6 text-center w-1/5 min-w-[170px] border-l border-[#A09048]/15 bg-white">
                      <div className="space-y-1">
                        <span className="font-spartan font-black text-lg sm:text-xl uppercase text-[#384808] block">
                          CVB-Flex
                        </span>
                        <span className="text-[11px] text-[#585828] block">Variabel</span>
                        <div className="pt-2">
                          <span className="font-spartan font-black text-2xl sm:text-3xl text-[#384808]">ab 166 €</span>
                          <span className="text-[11px] text-[#585828] block">pro Monat</span>
                        </div>
                        <button
                          onClick={() => handleOrder('CVB-Flex')}
                          className="mt-3 w-full py-2 px-3 rounded-full bg-[#F4F2E6] hover:bg-[#384808] text-[#384808] hover:text-white text-xs font-spartan font-bold uppercase tracking-wider transition-colors"
                        >
                          Jetzt bestellen
                        </button>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#A09048]/15 text-xs sm:text-sm">
                  {rows.map((r, idx) => (
                    <tr
                      key={idx}
                      className={r.isHighlight ? 'bg-[#F4F2E6]/60 font-semibold' : 'hover:bg-[#FBFBFA] transition-colors'}
                    >
                      <td className="p-4 sm:p-5 text-[#384808] font-medium flex items-center gap-2">
                        <span>{r.label}</span>
                        {r.tooltip && (
                          <span title={r.tooltip} className="text-[#A09048] cursor-help">
                            <Info size={13} />
                          </span>
                        )}
                      </td>
                      <td className="p-4 sm:p-5 text-center text-[#384808] border-l border-[#A09048]/15 bg-white/70">
                        {r.plus === 'Ja' ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#889028] text-white">
                            <Check size={12} strokeWidth={3} />
                          </span>
                        ) : (
                          <span>{r.plus}</span>
                        )}
                      </td>
                      <td className="p-4 sm:p-5 text-center text-[#384808] border-l border-[#A09048]/15 bg-[#F4F2E6]/30 font-medium">
                        {r.premium === 'Ja' || r.premium.startsWith('Ja') ? (
                          <span className="inline-flex items-center gap-1.5 text-[#384808]">
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#889028] text-white">
                              <Check size={12} strokeWidth={3} />
                            </span>
                            {r.premium.replace('Ja', '').trim()}
                          </span>
                        ) : (
                          <span>{r.premium}</span>
                        )}
                      </td>
                      <td className="p-4 sm:p-5 text-center text-[#384808] border-l border-[#A09048]/15 bg-white/70">
                        {r.flex === 'Ja' ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#889028] text-white">
                            <Check size={12} strokeWidth={3} />
                          </span>
                        ) : (
                          <span>{r.flex}</span>
                        )}
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

