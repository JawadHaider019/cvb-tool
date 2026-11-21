/**
 * Round to exact 2 decimal places using integer-cent arithmetic to prevent float drift.
 * @param {number} value
 * @returns {number}
 */
export function roundCents(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Round UP purchase price to the next full 1,000 € step (e.g. 72,300 -> 73,000).
 * @param {number} price
 * @returns {number}
 */
export function roundUpToThousand(price) {
  if (!Number.isFinite(price) || price <= 0) return 0;
  return Math.ceil(price / 1000) * 1000;
}

/**
 * Format a numeric Euro amount in German style: 2.207,65 €
 * @param {number} value
 * @returns {string}
 */
export function formatEuroDE(value) {
  return (
    value.toLocaleString('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + ' €'
  );
}

/**
 * Format an integer Euro amount in German style without decimals: 50.000 €
 * @param {number} value
 * @returns {string}
 */
export function formatEuroIntDE(value) {
  return value.toLocaleString('de-DE', { maximumFractionDigits: 0 }) + ' €';
}

/**
 * Helper to look up a price from sorted tier steps [{ maxV, price }].
 * Returns null if roundedValue > last step's maxV.
 */
function lookupStepPrice(roundedValue, steps) {
  if (!Array.isArray(steps) || steps.length === 0 || roundedValue <= 0) {
    return null;
  }
  const sorted = [...steps].sort((a, b) => a.maxV - b.maxV);
  for (const step of sorted) {
    if (roundedValue <= step.maxV) {
      return step.price;
    }
  }
  return null;
}

/**
 * Pure deterministic insurance calculator engine (2027 Tariffs).
 * Every price, rate, threshold, deductible, and rule is read from `config` (nothing hard-coded).
 * @param {object} input
 * @param {object} config
 * @returns {object}
 */
export function calculateInsurancePlans(input, config) {
  const currentYear = input.currentYear ?? new Date().getFullYear();
  const roundedValue = roundUpToThousand(input.kaufpreis);
  const vehicleAge = Math.max(0, currentYear - input.baujahr);
  const isWohnmobil = input.vehicleType === 'wohnmobil';

  const plusCfg = config.cvbPlus;
  const premCfg = config.cvbPremium;
  const flexCfg = config.cvbFlex;

  // If Wohnwagen is selected and Wohnwagen prices are not active yet -> all plans "Preis auf Anfrage"
  if (!isWohnmobil && !config.wohnwagenActive) {
    const unavailablePlans = [
      {
        planId: 'cvb_plus',
        name: plusCfg.name,
        available: false,
        statusText: 'Preis auf Anfrage',
        price: null,
        deductibleVK: plusCfg.deductibleVK,
        deductibleTK: plusCfg.deductibleTK,
        isRecommended: false,
        isLiabilityOnly: false,
        specialNote: null,
        benefits: plusCfg.benefits,
      },
      {
        planId: 'cvb_premium',
        name: premCfg.name,
        available: false,
        statusText: 'Preis auf Anfrage',
        price: null,
        deductibleVK: premCfg.deductibleVK,
        deductibleTK: premCfg.deductibleTK,
        isRecommended: false,
        isLiabilityOnly: false,
        specialNote: null,
        benefits: premCfg.benefits,
      },
      {
        planId: 'cvb_flex',
        name: flexCfg.name,
        available: false,
        statusText: 'Preis auf Anfrage',
        price: null,
        deductibleVK: flexCfg.wohnwagen?.deductibleVK ?? 1500,
        deductibleTK: flexCfg.wohnwagen?.deductibleTK ?? 500,
        isRecommended: false,
        isLiabilityOnly: false,
        specialNote: null,
        benefits: flexCfg.wohnwagen?.benefits ?? [],
      },
    ];

    return {
      roundedValue,
      vehicleAge,
      plans: unavailablePlans,
      allUnavailable: true,
    };
  }

  const vehicleKey = isWohnmobil ? 'wohnmobil' : 'wohnwagen';

  // 1. CVB-Plus
  const plusVehicle = plusCfg[vehicleKey];
  const plusRawPrice = lookupStepPrice(roundedValue, plusVehicle?.steps);
  const plusPrice = plusRawPrice !== null ? roundCents(plusRawPrice) : null;

  const plusResult = {
    planId: 'cvb_plus',
    name: plusCfg.name,
    available: plusPrice !== null,
    statusText: plusPrice !== null ? null : 'Preis auf Anfrage',
    price: plusPrice,
    deductibleVK: plusCfg.deductibleVK,
    deductibleTK: plusCfg.deductibleTK,
    isRecommended: false,
    isLiabilityOnly: false,
    specialNote: null,
    benefits: plusCfg.benefits,
  };

  // 2. CVB-Premium
  const premVehicle = premCfg[vehicleKey];
  let premPrice = null;
  if (
    roundedValue > 0 &&
    premVehicle &&
    roundedValue <= premVehicle.maxV &&
    premVehicle.price > 0
  ) {
    premPrice = roundCents(premVehicle.price);
  }

  const premResult = {
    planId: 'cvb_premium',
    name: premCfg.name,
    available: premPrice !== null,
    statusText: premPrice !== null ? null : 'Preis auf Anfrage',
    price: premPrice,
    deductibleVK: premCfg.deductibleVK,
    deductibleTK: premCfg.deductibleTK,
    isRecommended: false,
    isLiabilityOnly: false,
    specialNote: null,
    benefits: premCfg.benefits,
  };

  // 3. CVB-Flex
  const flexVehicle = flexCfg[vehicleKey];
  let flexPrice = null;
  let flexStatus = 'Preis auf Anfrage';
  let isLiabilityOnly = false;
  let specialNote = null;

  if (roundedValue > 0 && flexVehicle) {
    if (vehicleAge > flexCfg.maxKaskoAge) {
      // Older than 10 years: only liability ("Nur Haftpflicht") for configured liabilityOnlyPrice
      isLiabilityOnly = true;
      specialNote = flexCfg.liabilityOnlyLabel || 'Nur Haftpflicht';
      flexPrice = roundCents(flexVehicle.liabilityOnlyPrice);
      flexStatus = null;
    } else if (roundedValue <= flexVehicle.maxV) {
      // Formula: (baseFixed + max(V, minV) * perThousandRate / 1000 * factor1) * factor2
      const effectiveV = Math.max(roundedValue, flexVehicle.minV);
      const rawFlex =
        (flexVehicle.baseFixed +
          ((effectiveV * flexVehicle.perThousandRate) / 1000) *
            flexVehicle.factor1) *
        flexVehicle.factor2;
      flexPrice = roundCents(rawFlex);
      flexStatus = null;
    }
  }

  const flexResult = {
    planId: 'cvb_flex',
    name: flexCfg.name,
    available: flexPrice !== null,
    statusText: flexStatus,
    price: flexPrice,
    deductibleVK: flexVehicle?.deductibleVK ?? flexCfg.deductibleVK,
    deductibleTK: flexVehicle?.deductibleTK ?? flexCfg.deductibleTK,
    isRecommended: false,
    isLiabilityOnly,
    specialNote,
    benefits: flexVehicle?.benefits ?? flexCfg.benefits,
  };

  const plans = [plusResult, premResult, flexResult];

  // Dynamically mark the cheapest available priced plan as "Empfehlung".
  // Exception: Flex "Nur Haftpflicht" (vehicle older than maxKaskoAge) does NOT get the badge.
  const recommendablePlans = plans.filter(
    (p) => p.available && p.price !== null && !p.isLiabilityOnly
  );
  if (recommendablePlans.length > 0) {
    const cheapest = recommendablePlans.reduce((min, curr) =>
      curr.price < min.price ? curr : min
    );
    cheapest.isRecommended = true;
  }

  const anyAvailable = plans.some((p) => p.available && p.price !== null);

  return {
    roundedValue,
    vehicleAge,
    plans,
    allUnavailable: !anyAvailable,
  };
}
