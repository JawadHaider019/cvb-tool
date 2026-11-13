'use client';

import React from 'react';
import { Check, Shield, Info, ArrowRight, Sparkles, Sliders } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal.jsx';
import { TiltCard3D } from './TiltCard3D.jsx';
import { SectionHeader } from './SectionHeader.jsx';

export const PlanOverviewSection = ({
  section,
  config,
}) => {
  const topCards = [
    {
      id: 'cvb-plus',
      name: 'CVB-Plus',
      tag: 'Der Allrounder',
      subtitle: 'Unsere meist genutzte Lösung – Der Allrounder',
      icon: Shield,
      points: [
        'Hier passt alles: Versicherungsleistung, Preis, Betreuung.',
        'Ideal für Wohnmobile und Wohnwagen.',
        'Für Wohnmobile kann ein externer Schutzbrief hinzu gebucht werden.',
        'Wer sicher, einfach und komplett abgesichert sein will, findet mit CVB-Plus für Wohnwagen und Wohnmobile die perfekte Lösung.',
      ],
      isPopular: true,
    },
    {
      id: 'cvb-premium',
      name: 'CVB-Premium',
      tag: 'Rundumschutz',
      subtitle: 'Bei der Lösung Premium ist ein Schutzbrief immer enthalten.',
      icon: Sparkles,
      points: [
        'Die Lösung für Anbieter, die den Wohnwagen auf provisionsbasierten Portalen vermarkten.',
        'Diese verlangen einen Pannenschutzbrief – dieser ist hier bereits fest enthalten.',
        'Es wird auf dem Markt sonst kein Schutzbrief für Wohnwagen angeboten, daher sollte der Vermieter, der über Portale arbeitet, diesen wählen.',
        'Auch für Wohnmobile jenseits der 110.000 € kann diese Lösung besonders wirtschaftlich werden.',
      ],
      isPopular: false,
    },
    {
      id: 'cvb-flex',
      name: 'CVB-Flex',
      tag: 'Maximale Flexibilität',
      subtitle: 'Die Lösung für erfahrene Vermieter.',
      icon: Sliders,
      points: [
        'Wer sein Geschäftsmodell und die Schadenshäufigkeit bereits gut kennt und weiß, dass er kaum Versicherungsschäden abwickelt, kann mit CVB-Flex seinen Tarif preislich optimieren.',
        'Ein Selbstbehalt in Höhe von 2.500,- € je Schaden verringert den Versicherungspreis erheblich.',
        'CVB-Flex ist flexibel beim Selbstbehalt (TK und VK) sowie bei der Wahl, ob mit oder ohne Veruntreuungsversicherung abgesichert werden soll.',
      ],
      isPopular: false,
    },
  ];

  const infoCards = [
    {
      title: 'CVB-Plus Informationen',
      badge: 'Basisdaten Plus',
      items: [
        'Es kann ein externer Schutzbrief für Wohnmobile hinzu gebucht werden.',
        'Der Versicherungspreis wird halbjährlich bezahlt.',
        'Saisonkennzeichen sind möglich.',
        'Versicherungsschutz in ganz Europa.',
        'eVB kann sofort zur Verfügung gestellt werden.',
      ],
    },
    {
      title: 'CVB-Premium Informationen',
      badge: 'Basisdaten Premium',
      items: [
        'Hier ist der Schutzbrief immer enthalten.',
        'Ideal für Wohnwagenvermieter, die auf Portale einstellen.',
        'Zahlweise halbjährlich.',
        'Perfekte Lösung für Fahrzeuge bis 150.000 €.',
        'eVB braucht 3–5 Tage Vorlauf.',
      ],
    },
    {
      title: 'CVB-Flex Informationen',
      badge: 'Basisdaten Flex',
      items: [
        'Der Tarif für erfahrene Vermieter.',
        'Selbstbehalte: 2.500 / 500 € oder 2.500 / 1.500 € möglich.',
        'Zahlweise monatlich ohne Zuschlag möglich.',
        'Tarif mit oder ohne Veruntreuungsversicherung wählbar.',
        'Nur für Fahrzeuge bis 10 Jahre möglich.',
        'eVB-Vorlauf: 2 Werktage.',
      ],
    },
  ];

  return (
    <section id="loesungen" className="py-16 sm:py-22 bg-[#FBFBFA] border-b border-[#A09048]/20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 space-y-12">
        <SectionHeader
          title="Die CVB-Lösungen im Detail"
          subtitle="Kurzvorstellung der einzelnen CVB-Lösungen"
        />

        {/* Row 1: The 3 Main Solution Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {topCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <ScrollReveal key={card.id} delay={idx * 0.1}>
                <TiltCard3D className="h-full rounded-[28px]">
                  <div
                    className={`p-6 sm:p-8 flex flex-col justify-between h-full rounded-[28px] border transition-all ${
                      card.isPopular
                        ? 'bg-white border-[#384808]/40 shadow-xl ring-2 ring-[#889028]/25'
                        : 'bg-white border-[#A09048]/30 shadow-md hover:shadow-lg'
                    }`}
                  >
                    <div className="space-y-5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="w-11 h-11 rounded-2xl bg-[#384808] text-[#A09048] flex items-center justify-center shrink-0">
                          <Icon size={20} />
                        </div>
                        <span className="px-3 py-1 rounded-full bg-[#F4F2E6] border border-[#A09048]/30 text-xs font-spartan font-bold uppercase tracking-wider text-[#384808]">
                          {card.tag}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-spartan text-2xl sm:text-3xl font-black uppercase text-[#384808]">
                          {card.name}
                        </h3>
                        <p className="text-xs sm:text-sm font-semibold text-[#889028] mt-1">
                          {card.subtitle}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#A09048]/20 space-y-3">
                        {card.points.map((p, pIdx) => (
                          <div key={pIdx} className="flex items-start gap-2.5">
                            <span className="w-4 h-4 rounded-full bg-[#889028] text-white flex items-center justify-center shrink-0 mt-0.5">
                              <Check size={10} strokeWidth={3} />
                            </span>
                            <span className="text-xs sm:text-sm text-[#585828] leading-relaxed">
                              {p}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-[#A09048]/20">
                      <a
                        href="#rechner"
                        className={`w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full text-xs font-spartan font-bold uppercase tracking-wider transition-all ${
                          card.isPopular
                            ? 'bg-[#384808] text-white hover:bg-[#2D3A06]'
                            : 'bg-[#F4F2E6] text-[#384808] hover:bg-[#384808] hover:text-white'
                        }`}
                      >
                        <span>Im Rechner berechnen</span>
                        <ArrowRight size={14} />
                      </a>
                    </div>
                  </div>
                </TiltCard3D>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Row 2: The 3 Information Specification Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 pt-4">
          {infoCards.map((info, idx) => (
            <ScrollReveal key={info.title} delay={0.15 + idx * 0.1}>
              <div className="p-6 sm:p-7 rounded-[26px] bg-[#F4F2E6]/75 border border-[#A09048]/35 flex flex-col justify-between h-full">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#889028] bg-white/80 px-2.5 py-1 rounded-full border border-[#A09048]/25">
                      {info.badge}
                    </span>
                  </div>

                  <h4 className="font-spartan font-black text-lg sm:text-xl uppercase text-[#384808]">
                    {info.title}
                  </h4>

                  <ul className="space-y-2.5 text-xs sm:text-sm pt-2 border-t border-[#A09048]/25">
                    {info.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#384808] shrink-0 mt-2" />
                        <span className="text-[#384808] font-medium leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
