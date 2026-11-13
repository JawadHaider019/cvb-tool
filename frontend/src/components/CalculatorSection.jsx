'use client';

import React, { useState, useMemo } from 'react';
import {
  Caravan,
  Truck,
  Check,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Info,
} from 'lucide-react';
import {
  calculateInsurancePlans,
  formatEuroDE,
  formatEuroIntDE,
} from '@/lib/calculator.js';
import { RequestModal } from './RequestModal.jsx';
import { SectionHeader } from './SectionHeader.jsx';

export const CalculatorSection = ({
  section,
  config,
}) => {
  const currentYear = new Date().getFullYear();
  const [vehicleType, setVehicleType] = useState('wohnmobil');
  const [priceInput, setPriceInput] = useState('65000');
  const [baujahrInput, setBaujahrInput] = useState(
    String(currentYear - 2)
  );
  const [veruntreuung, setVeruntreuung] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const parsedPrice = useMemo(() => {
    const cleaned = priceInput.replace(/[^\d]/g, '');
    const num = Number(cleaned);
    return Number.isFinite(num) ? num : 0;
  }, [priceInput]);

  const parsedBaujahr = useMemo(() => {
    const num = Number(baujahrInput);
    if (!Number.isFinite(num) || num < 1960 || num > currentYear + 1) {
      return null;
    }
    return Math.floor(num);
  }, [baujahrInput, currentYear]);

  const isPriceValid = parsedPrice > 0;
  const isInputValid = isPriceValid && parsedBaujahr !== null;

  const calculation = useMemo(() => {
    if (!isInputValid || parsedBaujahr === null) return null;
    return calculateInsurancePlans(
      {
        vehicleType,
        kaufpreis: parsedPrice,
        baujahr: parsedBaujahr,
        veruntreuung,
        currentYear,
      },
      config
    );
  }, [
    isInputValid,
    vehicleType,
    parsedPrice,
    parsedBaujahr,
    veruntreuung,
    currentYear,
    config,
  ]);

  const yearOptions = useMemo(() => {
    const years = [];
    for (let y = currentYear + 1; y >= 1980; y--) {
      years.push(y);
    }
    return years;
  }, [currentYear]);

  const handlePriceChange = (val) => {
    const digitsOnly = val.replace(/[^\d]/g, '');
    setPriceInput(digitsOnly);
  };

  const openRequestForPlan = (plan) => {
    if (!calculation) return;
    setModalData({
      chosenPlan: plan ? plan.name : 'Individuelles Angebot',
      chosenPlanId: plan ? plan.planId : 'allgemein',
      vehicleType,
      kaufpreis: parsedPrice,
      roundedValue: calculation.roundedValue,
      baujahr: parsedBaujahr ?? currentYear,
      vehicleAge: calculation.vehicleAge,
      veruntreuung,
      calculatedPrice: plan ? plan.price : null,
      priceStatusText: plan ? plan.statusText : 'Individuelles Angebot',
    });
    setModalOpen(true);
  };

  return (
    <section
      id="rechner"
      className="py-16 sm:py-22 bg-[#F4F2E6]/65 border-y border-[#A09048]/25"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 space-y-10">
        <SectionHeader
          badge="LIVE-TARIFRECHNER 2027"
          title="Ihren passenden CVB-Tarif"
          accentWord="sofort berechnen"
          subtitle="Wählen Sie Fahrzeugart, Kaufpreis, Baujahr und Veruntreuungsschutz. Vergleichen Sie sofort alle verfügbaren CVB-Tarife in Echtzeit."
        />

        {/* 4 Calculator Inputs Card */}
        <div className="bg-white rounded-[28px] border border-[#A09048]/35 shadow-[0_18px_45px_-18px_rgba(56,72,8,0.14)] p-5 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Fahrzeugart */}
            <div className="space-y-2">
              <label className="block font-spartan font-extrabold text-sm uppercase tracking-wider text-[#384808]">
                1. Fahrzeugart
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setVehicleType('wohnmobil')}
                  className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl border-2 font-spartan font-bold text-sm transition-all cursor-pointer ${
                    vehicleType === 'wohnmobil'
                      ? 'bg-[#384808] border-[#384808] text-white shadow-md'
                      : 'bg-[#F4F2E6]/60 border-[#A09048]/30 text-[#384808] hover:border-[#384808]'
                  }`}
                >
                  <Truck size={18} />
                  <span>Wohnmobil</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVehicleType('wohnwagen')}
                  className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl border-2 font-spartan font-bold text-sm transition-all cursor-pointer ${
                    vehicleType === 'wohnwagen'
                      ? 'bg-[#384808] border-[#384808] text-white shadow-md'
                      : 'bg-[#F4F2E6]/60 border-[#A09048]/30 text-[#384808] hover:border-[#384808]'
                  }`}
                >
                  <Caravan size={18} />
                  <span>Wohnwagen</span>
                </button>
              </div>
            </div>

            {/* 2. Kaufpreis neu, brutto (Plain input field - NO slider) */}
            <div className="space-y-2">
              <label
                htmlFor="kaufpreis-input"
                className="block font-spartan font-extrabold text-sm uppercase tracking-wider text-[#384808]"
              >
                2. Kaufpreis neu, brutto (€)
              </label>
              <div className="relative">
                <input
                  id="kaufpreis-input"
                  type="text"
                  inputMode="numeric"
                  value={priceInput}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  placeholder="z. B. 65000"
                  className="w-full rounded-2xl border-2 border-[#A09048]/40 bg-white px-4 py-2.5 pr-10 text-base font-bold text-[#384808] focus:outline-none focus:border-[#384808]"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-[#889028]">
                  €
                </span>
              </div>
              {isPriceValid && calculation ? (
                <p className="text-[11px] text-[#585828]">
                  Berechnungswert (auf volle 1.000 € aufgerundet):{' '}
                  <strong className="text-[#384808]">
                    {formatEuroIntDE(calculation.roundedValue)}
                  </strong>
                </p>
              ) : (
                <p className="text-[11px] text-red-600 font-medium">
                  Bitte geben Sie einen gültigen Kaufpreis in Euro ein.
                </p>
              )}
            </div>

            {/* 3. Baujahr */}
            <div className="space-y-2">
              <label
                htmlFor="baujahr-select"
                className="block font-spartan font-extrabold text-sm uppercase tracking-wider text-[#384808]"
              >
                3. Baujahr
              </label>
              <select
                id="baujahr-select"
                value={baujahrInput}
                onChange={(e) => setBaujahrInput(e.target.value)}
                className="w-full rounded-2xl border-2 border-[#A09048]/40 bg-white px-4 py-2.5 text-base font-bold text-[#384808] focus:outline-none focus:border-[#384808] cursor-pointer"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              {calculation && (
                <p className="text-[11px] text-[#585828]">
                  Fahrzeugalter:{' '}
                  <strong className="text-[#384808]">
                    {calculation.vehicleAge}{' '}
                    {calculation.vehicleAge === 1 ? 'Jahr' : 'Jahre'}
                  </strong>
                </p>
              )}
            </div>

            {/* 4. Veruntreuungsschutz */}
            <div className="space-y-2">
              <label className="block font-spartan font-extrabold text-sm uppercase tracking-wider text-[#384808]">
                4. Veruntreuungsschutz
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setVeruntreuung(true)}
                  className={`py-3 px-3 rounded-2xl border-2 font-spartan font-bold text-sm transition-all cursor-pointer ${
                    veruntreuung
                      ? 'bg-[#384808] border-[#384808] text-white shadow-md'
                      : 'bg-[#F4F2E6]/60 border-[#A09048]/30 text-[#384808] hover:border-[#384808]'
                  }`}
                >
                  Ja (mit Schutz)
                </button>
                <button
                  type="button"
                  onClick={() => setVeruntreuung(false)}
                  className={`py-3 px-3 rounded-2xl border-2 font-spartan font-bold text-sm transition-all cursor-pointer ${
                    !veruntreuung
                      ? 'bg-[#384808] border-[#384808] text-white shadow-md'
                      : 'bg-[#F4F2E6]/60 border-[#A09048]/30 text-[#384808] hover:border-[#384808]'
                  }`}
                >
                  Nein (ohne)
                </button>
              </div>
              <p className="text-[11px] text-[#585828]">
                Bei Plus &amp; Premium bereits enthalten.
              </p>
            </div>
          </div>
        </div>

        {/* All Unavailable Banner */}
        {calculation?.allUnavailable && (
          <div className="rounded-[24px] bg-white border-2 border-[#A09048] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertTriangle
                size={24}
                className="text-[#A09048] shrink-0 mt-0.5"
              />
              <div>
                <h3 className="font-spartan font-black text-xl text-[#384808]">
                  Individuelles Angebot erforderlich
                </h3>
                <p className="text-sm text-[#585828] mt-1">
                  Für den angegebenen Fahrzeugwert ({formatEuroIntDE(parsedPrice)})
                  liegen die Standardtarife außerhalb der regulären Tabelle.
                  Senden Sie uns gerne eine Anfrage — wir erstellen Ihnen ein
                  passendes Individualangebot.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => openRequestForPlan(null)}
              className="tech-cta-primary shrink-0"
            >
              <span>Individuell anfragen</span>
              <span className="tech-ci">
                <ArrowRight size={16} />
              </span>
            </button>
          </div>
        )}

        {/* 3 Plan Result Cards */}
        {calculation && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              {calculation.plans.map((plan) => {
                const isUnavailable = !plan.available;
                return (
                  <div
                    key={plan.planId}
                    className={`relative rounded-[28px] p-6 sm:p-7 flex flex-col justify-between transition-all ${
                      plan.isRecommended
                        ? 'bg-white border-2 border-[#384808] shadow-[0_20px_50px_-15px_rgba(56,72,8,0.22)]'
                        : isUnavailable
                        ? 'bg-stone-100/90 border border-stone-300 text-stone-500 opacity-85'
                        : 'bg-white border border-[#A09048]/35 shadow-sm'
                    }`}
                  >
                    {/* Recommended Badge */}
                    {plan.isRecommended && (
                      <div className="absolute -top-3.5 left-6 inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#384808] text-white font-spartan font-extrabold text-xs uppercase tracking-wider shadow-md">
                        <Sparkles size={13} className="text-[#A09048]" />
                        <span>Empfehlung</span>
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* Plan Name & Deductible */}
                      <div className="flex items-start justify-between gap-2 pt-1">
                        <div>
                          <h3
                            className={`font-spartan text-2xl font-black ${
                              isUnavailable ? 'text-stone-600' : 'text-[#384808]'
                            }`}
                          >
                            {plan.name}
                          </h3>
                          <p className="text-xs font-semibold text-[#889028] mt-0.5">
                            Selbstbeteiligung:{' '}
                            {formatEuroIntDE(plan.deductible)}
                          </p>
                        </div>
                      </div>

                      {/* Price Display */}
                      <div className="py-4 border-y border-[#A09048]/20">
                        {plan.available && plan.price !== null ? (
                          <div>
                            <div className="font-spartan text-4xl font-black text-[#384808]">
                              {formatEuroDE(plan.price)}
                            </div>
                            <p className="text-xs text-[#585828] mt-1">
                              pro Jahr inkl. Versicherungssteuer
                            </p>
                          </div>
                        ) : (
                          <div>
                            <div className="font-spartan text-2xl font-black text-stone-600">
                              {plan.statusText || 'Preis auf Anfrage'}
                            </div>
                            <p className="text-xs text-stone-500 mt-1">
                              {plan.statusText === 'k. A.'
                                ? 'In dieser Kombination nicht verfügbar — wir beraten Sie gerne alternativ.'
                                : 'Außerhalb der Standardtabelle — individuelles Angebot auf Anfrage.'}
                            </p>
                          </div>
                        )}

                        {plan.specialNote && (
                          <div className="mt-3 flex items-start gap-2 rounded-xl bg-[#F4F2E6] border border-[#A09048]/40 p-2.5 text-xs font-semibold text-[#384808]">
                            <Info size={15} className="text-[#A09048] shrink-0 mt-0.5" />
                            <span>{plan.specialNote}</span>
                          </div>
                        )}
                      </div>

                      {/* Benefits */}
                      <ul className="space-y-2.5 text-xs sm:text-sm">
                        {plan.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check
                              size={16}
                              className={`shrink-0 mt-0.5 ${
                                isUnavailable
                                  ? 'text-stone-400'
                                  : 'text-[#889028]'
                              }`}
                            />
                            <span
                              className={
                                isUnavailable ? 'text-stone-500' : 'text-[#585828]'
                              }
                            >
                              {benefit}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Button */}
                    <div className="pt-6 mt-6 border-t border-[#A09048]/15">
                      <button
                        type="button"
                        onClick={() => openRequestForPlan(plan)}
                        className={
                          plan.isRecommended
                            ? 'tech-cta-primary w-full justify-between'
                            : 'tech-cta-ghost w-full justify-center'
                        }
                      >
                        <span>Jetzt anfragen</span>
                        {plan.isRecommended ? (
                          <span className="tech-ci">
                            <ArrowRight size={16} />
                          </span>
                        ) : (
                          <ArrowRight size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-center text-xs sm:text-sm text-[#585828] font-medium pt-2">
              {config.priceFootnote}
            </p>
          </div>
        )}
      </div>

      <RequestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        data={modalData}
      />
    </section>
  );
};

