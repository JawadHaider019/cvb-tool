'use client';

import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  CalendarCheck2,
  PhoneCall,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Tag,
  Users,
  Repeat
} from 'lucide-react';
import { SectionHeader } from './SectionHeader.jsx';
import { ScrollReveal } from './ScrollReveal.jsx';
import { TiltCard3D } from './TiltCard3D.jsx';

export const BesserVermietenSection = () => {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 84;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section id="besser-vermieten" className="py-16 sm:py-22 bg-[#FFFFFF] border-b border-[#A09048]/20 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-[#A09048]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 space-y-12 relative z-10">
        <SectionHeader
          badge="CVB MEHRWERTE // KONZEPT"
          title="Besser Vermieten mit dem CVB"
          accentWord="MIT DEM CVB"
          subtitle="Mit den Angeboten des Caravan-Vermieter-Bund optimierst Du Deine Wohnmobilvermietung oder startest direkt mit den passenden Lösungen."
        />

        {/* 4 Bento Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Card 1: Sehr gut versichert (Col 6) */}
          <ScrollReveal delay={0.05} className="lg:col-span-6">
            <TiltCard3D className="h-full rounded-[28px]">
              <div className="tech-card-cream p-7 sm:p-9 h-full flex flex-col justify-between space-y-6 rounded-[28px] border border-[#A09048]/30">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#384808] text-[#A09048] flex items-center justify-center">
                    <ShieldCheck size={24} />
                  </div>
                  <h3 className="font-spartan font-black text-2xl uppercase text-[#384808]">
                    Sehr gut versichert
                  </h3>
                  <p className="text-sm text-[#585828] leading-relaxed">
                    Mit unseren CVB-Rahmenverträgen ist immer die passende Absicherung für Dein Geschäftsmodell dabei.
                    Egal für was Du Dich entscheidest, es ist immer die passende Selbstfahrervermietversicherung für Deine Vermietung.
                  </p>
                  
                  <div className="pt-2">
                    <span className="text-xs font-spartan font-bold uppercase tracking-wider text-[#384808] block mb-2">
                      Wähle zwischen unseren 3 Tarifen:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {['CVB-Plus', 'CVB-Premium', 'CVB-Flex'].map((plan) => (
                        <span
                          key={plan}
                          className="px-3.5 py-1.5 rounded-full bg-white border border-[#A09048]/40 text-xs font-spartan font-bold uppercase tracking-wider text-[#384808] shadow-xs"
                        >
                          {plan}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#A09048]/20">
                  <button
                    onClick={() => scrollTo('rechner')}
                    className="inline-flex items-center gap-2 text-xs font-spartan font-bold uppercase tracking-wider text-[#384808] hover:text-[#889028] transition-colors"
                  >
                    <span>Tarif jetzt vergleichen & berechnen</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </TiltCard3D>
          </ScrollReveal>

          {/* Card 2: Ab sofort flexibel vermieten (Col 6) */}
          <ScrollReveal delay={0.1} className="lg:col-span-6">
            <TiltCard3D className="h-full rounded-[28px]">
              <div className="tech-card-white p-7 sm:p-9 h-full flex flex-col justify-between space-y-6 rounded-[28px] border border-[#A09048]/30">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#889028] text-white flex items-center justify-center">
                    <TrendingUp size={24} />
                  </div>
                  <h3 className="font-spartan font-black text-2xl uppercase text-[#384808]">
                    Ab sofort flexibel vermieten
                  </h3>
                  <p className="text-sm text-[#585828] leading-relaxed">
                    Mit der eigenen Versicherung kannst Du frei und unabhängig vermieten: mit oder ohne Vermittlungsportale, Kleinanzeigen, Social Media, in der Nachbarschaft usw.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    {['Flexibel', 'Sicher', 'Erfolgreich', 'Wirtschaftlich'].map((pill) => (
                      <div
                        key={pill}
                        className="py-2 px-2 text-center rounded-xl bg-[#F4F2E6] border border-[#A09048]/25 text-xs font-spartan font-bold uppercase text-[#384808]"
                      >
                        {pill}
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-[#585828] leading-relaxed pt-2">
                    Dein Fahrzeug ist optimal eingedeckt, weitere Absicherungen bucht der Mieter einfach selber.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#A09048]/20">
                  <button
                    onClick={() => scrollTo('pakete')}
                    className="inline-flex items-center gap-2 text-xs font-spartan font-bold uppercase tracking-wider text-[#384808] hover:text-[#889028] transition-colors"
                  >
                    <span>Zu den Paketpreisen</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </TiltCard3D>
          </ScrollReveal>

          {/* Card 3: Vorteile der CVB Zusammenarbeit (Col 7) */}
          <ScrollReveal delay={0.15} className="lg:col-span-7">
            <div className="p-7 sm:p-9 rounded-[28px] bg-[#F4F2E6]/80 border border-[#A09048]/30 space-y-5 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#889028]" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#889028]">
                    EXKLUSIVES B2B-NETZWERK
                  </span>
                </div>

                <h3 className="font-spartan font-black text-2xl uppercase text-[#384808]">
                  Vorteile der CVB Zusammenarbeit
                </h3>

                <p className="text-sm text-[#585828] leading-relaxed">
                  Durch die Zusammenarbeit mit dem CVB erhältst Du Zugang zu unterschiedlichen, auf Deine Bedürfnisse passenden Versicherungslösungen. Somit bekommst Du endlich die gewünschte Selbstfahrerversicherung ab dem ersten Wagen zum wirtschaftlichen Preis.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    { title: 'Beratung', desc: 'Fachkundige Unterstützung von Spezialisten' },
                    { title: 'Unterstützung', desc: 'Feste Betreuung von Zulassung bis Schadenfall' },
                    { title: 'Mietvertragsvorlagen', desc: 'Rechtssichere Vorlagen, Checklisten usw.' },
                    { title: 'Einkaufsvorteile', desc: 'Sonderkonditionen für Fahrzeuge & Zubehör' },
                    { title: 'Vermieter-Austausch', desc: 'Regelmäßiger Austausch der Vermieter untereinander' },
                    { title: 'Und vieles mehr', desc: 'Digitales Vermietoffice & Vorab-Einweisungen' },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white border border-[#A09048]/25 shadow-2xs space-y-0.5"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-[#889028] shrink-0" />
                        <span className="font-spartan font-bold text-xs uppercase text-[#384808]">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#585828] pl-6 leading-tight">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 4: Versicherungswechsel & Stichtag 30.11. (Col 5) */}
          <ScrollReveal delay={0.2} className="lg:col-span-5">
            <div className="p-7 sm:p-9 rounded-[28px] bg-[#242E05] text-white border border-[#A09048]/35 shadow-xl space-y-6 h-full flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#A09048]/20 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#F4F2E6] text-xs font-spartan font-bold uppercase tracking-wider">
                  <Repeat size={13} className="text-[#A09048]" />
                  <span>Einfacher Wechsel</span>
                </div>

                <h3 className="font-spartan font-black text-2xl uppercase text-white">
                  Versicherungswechsel
                </h3>

                <p className="text-sm text-[#F4F2E6]/85 leading-relaxed">
                  Mit unseren Lösungen wechselst Du die Versicherung sehr einfach und sicher.
                  Somit ist sicher gestellt, dass Dein Fahrzeug immer optimal versichert ist, auch wenn es sich in der Ruhephase befindet.
                </p>

                {/* Stichtag Banner */}
                <div className="p-4 rounded-2xl bg-[#A09048]/20 border border-[#A09048]/40 space-y-1">
                  <div className="flex items-center gap-2 text-[#A09048] font-spartan font-bold text-xs uppercase tracking-wider">
                    <CalendarCheck2 size={15} />
                    <span>Wichtiger Stichtag</span>
                  </div>
                  <p className="text-xs text-white font-medium leading-relaxed">
                    Jetzt Versicherung bis zum <strong className="text-[#A09048] font-bold">30.11.</strong> des Jahres kündigen und zum <strong className="text-[#A09048] font-bold">01.01.</strong> des Jahres optimiert starten.
                  </p>
                </div>
              </div>

              {/* Consultation callout */}
              <div className="pt-4 border-t border-white/10 relative z-10 space-y-3">
                <h4 className="font-spartan font-bold text-sm uppercase text-white">
                  Wir beraten Dich gerne
                </h4>
                <p className="text-xs text-[#F4F2E6]/80 leading-relaxed">
                  Damit Dein Geschäftsmodell ein voller Erfolg wird. Mit unserer Erfahrung und der von mehreren hundert angeschlossenen Vermietern erhältst Du das Know-How, was Dich vom Wettbewerb unterscheidet.
                </p>
                <button
                  onClick={() => scrollTo('kontakt')}
                  className="w-full py-2.5 px-4 rounded-full bg-[#A09048] hover:bg-[#889028] text-[#172002] hover:text-white font-spartan font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <PhoneCall size={14} />
                  <span>Nimm Kontakt mit uns auf</span>
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Ablauf und Informationen (Process Guide from old website) */}
        <ScrollReveal delay={0.25}>
          <div className="p-6 sm:p-8 rounded-[28px] bg-[#F4F2E6] border border-[#A09048]/30 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#A09048]/20">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#889028] block">
                  SCHRITT FÜR SCHRITT
                </span>
                <h4 className="font-spartan font-black text-xl sm:text-2xl uppercase text-[#384808]">
                  Ablauf und Informationen
                </h4>
              </div>
              <span className="text-xs font-semibold text-[#585828]">
                Einfach & unkompliziert zur passenden Police
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-white border border-[#A09048]/20 space-y-2">
                <span className="w-7 h-7 rounded-full bg-[#384808] text-white flex items-center justify-center font-mono font-bold text-xs">
                  1
                </span>
                <h5 className="font-spartan font-bold text-sm uppercase text-[#384808]">
                  Tarif auswählen
                </h5>
                <p className="text-xs text-[#585828] leading-relaxed">
                  Du wählst aus der Tabelle oder dem Rechner den Tarif aus, der am besten zu Deinem Fahrzeug und Deinem Vermietkonzept passt.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#A09048]/20 space-y-2">
                <span className="w-7 h-7 rounded-full bg-[#384808] text-white flex items-center justify-center font-mono font-bold text-xs">
                  2
                </span>
                <h5 className="font-spartan font-bold text-sm uppercase text-[#384808]">
                  Bereits CVB-Kunde?
                </h5>
                <p className="text-xs text-[#585828] leading-relaxed">
                  Dann melde Dich einfach mit Deinen Zugangsdaten an und folge den hinterlegten Schritten zur sofortigen Deckung und eVB-Bereitstellung.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#A09048]/20 space-y-2">
                <span className="w-7 h-7 rounded-full bg-[#384808] text-white flex items-center justify-center font-mono font-bold text-xs">
                  3
                </span>
                <h5 className="font-spartan font-bold text-sm uppercase text-[#384808]">
                  Neukunde beim CVB?
                </h5>
                <p className="text-xs text-[#585828] leading-relaxed">
                  Dann entscheide Dich für die kostenlosen Informationen und wir nehmen, wenn gewünscht, direkt persönlichen Kontakt mit Dir auf.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

