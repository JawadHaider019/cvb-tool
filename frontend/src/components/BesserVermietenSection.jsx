'use client';

import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  CalendarCheck2,
  PhoneCall,
  ArrowRight,
  TrendingUp,
  Repeat,
  Sparkles,
  Sliders,
  KeyRound,
  UserPlus,
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
    <section
      id="besser-vermieten"
      className="py-18 sm:py-24 lg:py-28 bg-[#FBFBFA] border-b border-[#A09048]/25 relative overflow-hidden text-[#384808]"
    >
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-[#A09048]/8 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 space-y-12 sm:space-y-16 relative z-10">
        {/* Section Header: Clean professional badge */}
        <SectionHeader
          badge="CVB MEHRWERTE & KONZEPT"
          title="Besser Vermieten"
          accentWord="mit dem CVB"
          subtitle="Mit den Angeboten des Caravan-Vermieter-Bund optimierst Du Deine Wohnmobilvermietung oder startest direkt mit den passenden Lösungen."
        />

        {/* 4 Feature Bento Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Card 1: Sehr gut versichert (Col 6 on desktop, full width on tablet/mobile) */}
          <ScrollReveal delay={0.05} className="col-span-1 lg:col-span-6">
            <TiltCard3D className="h-full rounded-[28px] sm:rounded-[32px]">
              <div className="bg-white p-6 sm:p-10 h-full flex flex-col justify-between space-y-6 rounded-[28px] sm:rounded-[32px] border border-[#A09048]/30 shadow-[0_12px_40px_-15px_rgba(56,72,8,0.08)]">
                <div className="space-y-5">
                  <div className="w-13 h-13 rounded-2xl bg-[#384808] text-[#A09048] flex items-center justify-center shadow-sm">
                    <ShieldCheck size={26} strokeWidth={2.2} />
                  </div>

                  <h3 className="font-spartan font-black text-2xl sm:text-3xl uppercase text-[#384808] tracking-tight">
                    Sehr gut versichert
                  </h3>

                  <p className="text-sm sm:text-base text-[#585828] leading-relaxed">
                    Mit unseren CVB-Rahmenverträgen ist immer die passende Absicherung für Dein Geschäftsmodell dabei.
                  </p>

                  <div className="pt-2">
                    <span className="text-xs font-spartan font-bold uppercase tracking-wider text-[#384808] block mb-3">
                      Wähle zwischen
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {['CVB-Plus', 'CVB-Premium', 'CVB-Flex'].map((plan) => (
                        <button
                          key={plan}
                          onClick={() => scrollTo('versicherungen')}
                          className="px-4 py-2 rounded-xl bg-[#F4F2E6] hover:bg-[#384808] hover:text-white border border-[#A09048]/30 text-xs font-spartan font-bold uppercase tracking-wider text-[#384808] shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#889028]" />
                          <span>{plan}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#585828] leading-relaxed pt-2">
                    Egal für was Du Dich entscheidest, es ist immer die passende Selbstfahrervermietversicherung für Deine Vermietung.
                  </p>
                </div>

                <div className="pt-5 border-t border-[#A09048]/20">
                  <button
                    onClick={() => scrollTo('versicherungen')}
                    className="inline-flex items-center gap-2 text-xs font-spartan font-bold uppercase tracking-wider text-[#384808] hover:text-[#889028] transition-colors group cursor-pointer"
                  >
                    <span>Tarif jetzt vergleichen & berechnen</span>
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </TiltCard3D>
          </ScrollReveal>

          {/* Card 2: Ab sofort flexibel vermieten (Col 6 on desktop, full width on tablet/mobile) */}
          <ScrollReveal delay={0.1} className="col-span-1 lg:col-span-6">
            <TiltCard3D className="h-full rounded-[28px] sm:rounded-[32px]">
              <div className="bg-white p-6 sm:p-10 h-full flex flex-col justify-between space-y-6 rounded-[28px] sm:rounded-[32px] border border-[#A09048]/30 shadow-[0_12px_40px_-15px_rgba(56,72,8,0.08)]">
                <div className="space-y-5">
                  <div className="w-13 h-13 rounded-2xl bg-[#889028] text-white flex items-center justify-center shadow-sm">
                    <TrendingUp size={26} strokeWidth={2.2} />
                  </div>

                  <h3 className="font-spartan font-black text-2xl sm:text-3xl uppercase text-[#384808] tracking-tight">
                    Ab sofort flexibel vermieten
                  </h3>

                  <p className="text-sm sm:text-base text-[#585828] leading-relaxed">
                    Mit der eigenen Versicherung kannst Du
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    {['flexibel', 'sicher', 'erfolgreich', 'wirtschaftlich'].map((pill) => (
                      <div
                        key={pill}
                        className="py-2.5 px-2 text-center rounded-xl bg-[#F4F2E6] border border-[#A09048]/30 text-xs font-spartan font-bold uppercase text-[#384808] shadow-2xs flex items-center justify-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#889028] shrink-0" />
                        <span className="tracking-tight">{pill}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-[#585828] leading-relaxed pt-1">
                    vermieten. Mit oder ohne Portale, Kleinanzeigen, social Media, in der Nachbarschaft usw.
                  </p>
                  <p className="text-xs sm:text-sm text-[#384808] font-semibold leading-relaxed">
                    Dein Fahrzeug ist optimal eingedeckt, weitere Absicherungen bucht der Mieter einfach selber.
                  </p>
                </div>

                <div className="pt-5 border-t border-[#A09048]/20">
                  <button
                    onClick={() => scrollTo('versicherungen')}
                    className="inline-flex items-center gap-2 text-xs font-spartan font-bold uppercase tracking-wider text-[#384808] hover:text-[#889028] transition-colors group cursor-pointer"
                  >
                    <span>Zu den Paketpreisen</span>
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </TiltCard3D>
          </ScrollReveal>

          {/* Card 3: Vorteile der CVB Zusammenarbeit (Col 7 on desktop, full width on tablet/mobile) */}
          <ScrollReveal delay={0.15} className="col-span-1 lg:col-span-7">
            <TiltCard3D className="h-full rounded-[28px] sm:rounded-[32px]">
              <div className="p-6 sm:p-10 rounded-[28px] sm:rounded-[32px] bg-white border border-[#A09048]/30 shadow-[0_12px_40px_-15px_rgba(56,72,8,0.08)] hover:border-[#889028] transition-all space-y-6 h-full flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4F2E6] border border-[#A09048]/35 text-xs font-spartan font-bold uppercase tracking-wider text-[#384808]">
                    <Sparkles size={13} className="text-[#889028]" />
                    <span>Deine CVB Mehrwerte</span>
                  </div>

                  <h3 className="font-spartan font-black text-2xl sm:text-3xl uppercase text-[#384808] tracking-tight">
                    Vorteile der CVB Zusammenarbeit
                  </h3>

                  <p className="text-sm sm:text-base text-[#585828] leading-relaxed">
                    Durch die Zusammenarbeit mit dem CVB erhältst Du Zugang zu unterschiedlichen, auf Deine Bedürfnisse passende Versicherungslösungen.
                  </p>
                  <p className="text-sm text-[#384808] font-bold leading-relaxed">
                    Somit bekommst Du endlich die gewünschte Selbstfahrerversicherung ab dem ersten Wagen, das zum wirtschaftlichen Preis.
                  </p>

                  <div className="pt-3 space-y-3">
                    <span className="text-xs font-spartan font-bold uppercase tracking-wider text-[#384808] block">
                      Weiterhin erhältst Du vom CVB
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        'Beratung',
                        'Unterstützung',
                        'Mietvertragsvorlagen, Checklisten usw',
                        'Einkaufsvorteile Fahrzeuge und Zubehör',
                        'Austausch der Vermieter untereinander',
                        'und vieles mehr.',
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-[#F9F8F3] hover:bg-white border border-[#A09048]/25 hover:border-[#889028] shadow-2xs hover:shadow-sm flex items-center gap-3 transition-all hover:-translate-y-0.5 cursor-default group/item"
                        >
                          <div className="w-6 h-6 rounded-lg bg-[#889028]/15 group-hover/item:bg-[#384808] text-[#889028] group-hover/item:text-white flex items-center justify-center shrink-0 transition-colors">
                            <CheckCircle2 size={15} strokeWidth={2.5} />
                          </div>
                          <span className="font-spartan font-bold text-xs uppercase tracking-wider text-[#384808] group-hover/item:text-[#242E05] transition-colors leading-snug">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-5 border-t border-[#A09048]/20">
                  <button
                    onClick={() => scrollTo('versicherungen')}
                    className="inline-flex items-center gap-2 text-xs font-spartan font-bold uppercase tracking-wider text-[#384808] hover:text-[#889028] transition-colors group/btn cursor-pointer"
                  >
                    <span>Alle CVB-Vorteile entdecken</span>
                    <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </TiltCard3D>
          </ScrollReveal>

          {/* Card 4: Versicherungswechsel & Wir beraten Dich gerne (Col 5 on desktop, full width on tablet/mobile) */}
          <ScrollReveal delay={0.2} className="col-span-1 lg:col-span-5">
            <TiltCard3D className="h-full rounded-[28px] sm:rounded-[32px]">
              <div className="p-6 sm:p-10 rounded-[28px] sm:rounded-[32px] bg-gradient-to-br from-[#1E2704] via-[#172002] to-[#0D1201] text-white border border-[#A09048]/40 shadow-2xl hover:border-[#A09048] transition-all space-y-6 h-full flex flex-col justify-between relative overflow-hidden group">
                <div className="space-y-4 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#F4F2E6] text-xs font-spartan font-bold uppercase tracking-wider border border-[#A09048]/30">
                    <Repeat size={13} className="text-[#A09048]" />
                    <span>Einfacher Wechsel</span>
                  </div>

                  <h3 className="font-spartan font-black text-2xl sm:text-3xl uppercase text-white tracking-tight break-words">
                    Versicherungswechsel
                  </h3>

                  <p className="text-sm text-[#F4F2E6]/90 leading-relaxed">
                    Mit unseren Lösungen wechselst Du die Versicherung sehr einfach und sicher.
                  </p>
                  <p className="text-xs sm:text-sm text-[#F4F2E6]/80 leading-relaxed">
                    Somit Ist sicher gestellt, dass Dein Fahrzeug immer optimal versichert ist, auch wenn es sich in der Ruhephase befindet.
                  </p>

                  {/* Stichtag Banner */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#A09048]/20 border border-[#A09048]/40 space-y-1.5 backdrop-blur-sm group-hover:bg-[#A09048]/25 transition-colors">
                    <div className="flex items-center gap-2 text-[#A09048] font-spartan font-bold text-xs uppercase tracking-wider">
                      <CalendarCheck2 size={15} />
                      <span>Wichtiger Stichtag</span>
                    </div>
                    <p className="text-xs sm:text-[13px] text-white font-medium leading-relaxed">
                      Jetzt Versicherung bis zum <strong className="text-[#A09048] font-bold">30.11 des Jahres kündigen</strong> und zum <strong className="text-[#A09048] font-bold">01.01. des Jahres optimiert starten</strong>.
                    </p>
                  </div>
                </div>

                {/* Wir beraten Dich gerne */}
                <div className="pt-5 border-t border-white/10 relative z-10 space-y-3">
                  <h4 className="font-spartan font-bold text-sm uppercase text-[#A09048] tracking-wider">
                    Wir beraten Dich gerne
                  </h4>
                  <p className="text-xs sm:text-sm text-[#F4F2E6]/85 leading-relaxed">
                    Damit Dein Geschäftsmodell ein voller Erfolg wird. Mit unserer Erfahrung und die der, mehreren hundert angeschlossenen Vermietern, erhältst Du das KnowHow was Dich vom Wettbewerb, unterscheiden wird.
                  </p>
                  <button
                    onClick={() => scrollTo('kontakt')}
                    className="w-full py-3.5 px-5 rounded-full bg-[#A09048] hover:bg-[#889028] text-[#172002] hover:text-white font-spartan font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer mt-2 group/cta"
                  >
                    <PhoneCall size={14} className="group-hover/cta:scale-110 transition-transform" />
                    <span>Nimm Kontakt mit uns auf.</span>
                  </button>
                </div>
              </div>
            </TiltCard3D>
          </ScrollReveal>
        </div>

        {/* Ablauf und Informationen (Redesigned as 3 Standalone High-End Bento Cards) */}
        <div className="space-y-8 pt-4">
          <ScrollReveal delay={0.22}>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#A09048]/20">
              <div>
                <div className="tech-tag mb-3">
                  <Sliders size={13} className="text-[#889028] shrink-0" strokeWidth={2.4} />
                  <span className="font-spartan font-bold text-xs uppercase tracking-wider text-[#384808]">
                    SCHRITT FÜR SCHRITT
                  </span>
                </div>
                <h3 className="font-spartan font-black text-2xl sm:text-4xl uppercase text-[#384808] tracking-tight">
                  Ablauf und{' '}
                  <span className="text-[#889028]">
                    Informationen<span className="text-[#A09048]">.</span>
                  </span>
                </h3>
              </div>

              <button
                onClick={() => scrollTo('versicherungen')}
                className="tech-cta-primary text-xs sm:text-sm self-start sm:self-auto cursor-pointer shadow-md hover:shadow-lg"
              >
                <span>Zur Tariftabelle</span>
                <span className="tech-ci">
                  <ArrowRight size={15} />
                </span>
              </button>
            </div>
          </ScrollReveal>

          {/* 3 High-End Process Bento Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Step 1 */}
            <ScrollReveal delay={0.08}>
              <TiltCard3D className="h-full rounded-[28px] sm:rounded-[32px]">
                <div className="relative bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-9 border border-[#A09048]/30 shadow-[0_12px_40px_-15px_rgba(56,72,8,0.08)] hover:border-[#889028] transition-all flex flex-col justify-between h-full group overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#384808] via-[#889028] to-[#A09048]" />

                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="w-13 h-13 rounded-2xl bg-[#384808] text-[#A09048] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                        <Sliders size={24} strokeWidth={2.2} />
                      </div>
                      <span className="font-spartan font-black text-4xl leading-none text-[#384808]/15 group-hover:text-[#A09048]/45 transition-colors select-none">
                        01
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      <span className="text-[11px] font-spartan font-bold uppercase tracking-wider text-[#889028] block">
                        Schritt 01
                      </span>
                      <p className="text-sm sm:text-base text-[#384808] font-semibold leading-relaxed">
                        Du wählst aus der unten stehenden Tabelle den Tarif aus, der zu Dir passt.
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#A09048]/15 mt-6">
                    <button
                      onClick={() => scrollTo('versicherungen')}
                      className="inline-flex items-center gap-2 text-xs font-spartan font-bold uppercase tracking-wider text-[#384808] hover:text-[#889028] transition-colors group/btn cursor-pointer"
                    >
                      <span>Tarif auswählen</span>
                      <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </TiltCard3D>
            </ScrollReveal>

            {/* Step 2 */}
            <ScrollReveal delay={0.16}>
              <TiltCard3D className="h-full rounded-[28px] sm:rounded-[32px]">
                <div className="relative bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-9 border border-[#A09048]/30 shadow-[0_12px_40px_-15px_rgba(56,72,8,0.08)] hover:border-[#889028] transition-all flex flex-col justify-between h-full group overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#384808] via-[#889028] to-[#A09048]" />

                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="w-13 h-13 rounded-2xl bg-[#889028] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                        <KeyRound size={24} strokeWidth={2.2} />
                      </div>
                      <span className="font-spartan font-black text-4xl leading-none text-[#384808]/15 group-hover:text-[#A09048]/45 transition-colors select-none">
                        02
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      <span className="text-[11px] font-spartan font-bold uppercase tracking-wider text-[#889028] block">
                        Schritt 02
                      </span>
                      <p className="text-sm sm:text-base text-[#384808] font-semibold leading-relaxed">
                        Du bist bereits Kunde? Dann melde dich mit den Zugangsdaten an und folge den Informationen.
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#A09048]/15 mt-6">
                    <a
                      href="https://caravanvermieterbund.de/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-spartan font-bold uppercase tracking-wider text-[#384808] hover:text-[#889028] transition-colors group/btn"
                    >
                      <span>Kunden-Login</span>
                      <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </TiltCard3D>
            </ScrollReveal>

            {/* Step 3 */}
            <ScrollReveal delay={0.24}>
              <TiltCard3D className="h-full rounded-[28px] sm:rounded-[32px]">
                <div className="relative bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-9 border border-[#A09048]/30 shadow-[0_12px_40px_-15px_rgba(56,72,8,0.08)] hover:border-[#889028] transition-all flex flex-col justify-between h-full group overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#384808] via-[#889028] to-[#A09048]" />

                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="w-13 h-13 rounded-2xl bg-[#384808] text-[#A09048] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                        <UserPlus size={24} strokeWidth={2.2} />
                      </div>
                      <span className="font-spartan font-black text-4xl leading-none text-[#384808]/15 group-hover:text-[#A09048]/45 transition-colors select-none">
                        03
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      <span className="text-[11px] font-spartan font-bold uppercase tracking-wider text-[#889028] block">
                        Schritt 03
                      </span>
                      <p className="text-sm sm:text-base text-[#384808] font-semibold leading-relaxed">
                        Du bist Neukunde, dann entscheiden Dich für die kostenlosen Informationen und wir nehmen, wenn gewünscht, mit Dir Kontakt auf
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#A09048]/15 mt-6">
                    <button
                      onClick={() => scrollTo('kontakt')}
                      className="inline-flex items-center gap-2 text-xs font-spartan font-bold uppercase tracking-wider text-[#384808] hover:text-[#889028] transition-colors group/btn cursor-pointer"
                    >
                      <span>Kontakt aufnehmen</span>
                      <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </TiltCard3D>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};
