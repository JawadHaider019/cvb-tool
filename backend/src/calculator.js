/**
 * Round to exact 2 decimal places using integer-cent arithmetic to prevent float drift.
 * @param {number} value
 * @returns {number}
 */
export function roundCents(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Round UP purchase price to the next full 1,000 € step (e.g. 47,500 -> 48,000).
 * @param {number} price
 * @returns {number}
 */
export function roundUpToThousand(price) {
  if (!Number.isFinite(price) || price <= 0) return 0;
  return Math.ceil(price / 1000) * 1000;
}

/**
 * Format a numeric Euro amount in German style: 3.082,99 €
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
 * Pure deterministic insurance calculator engine.
 * Every price, rate, threshold, and rule is read from `config` (nothing hard-coded).
 * @param {object} input
 * @param {object} config
 * @returns {object}
 */
export function calculateInsurancePlans(input, config) {
  const currentYear = input.currentYear ?? new Date().getFullYear();
  const roundedValue = roundUpToThousand(input.kaufpreis);
  const vehicleAge = Math.max(0, currentYear - input.baujahr);
  const isWohnmobil = input.vehicleType === 'wohnmobil';

  // 1. CVB-Plus
  const plusCfg = config.cvbPlus;
  let plusPrice = null;
  let plusStatus = 'Preis auf Anfrage';

  if (isWohnmobil) {
    if (
      roundedValue >= plusCfg.wohnmobil.minV &&
      roundedValue <= plusCfg.wohnmobil.maxV
    ) {
      plusPrice =
        roundedValue >= plusCfg.wohnmobil.thresholdV
          ? plusCfg.wohnmobil.priceStep2
          : plusCfg.wohnmobil.priceStep1;
      plusStatus = null;
    }
  } else {
    if (
      roundedValue >= plusCfg.wohnwagen.minV &&
      roundedValue <= plusCfg.wohnwagen.maxV
    ) {
      plusPrice = plusCfg.wohnwagen.price;
      plusStatus = null;
    }
  }

  const plusResult = {
    planId: 'cvb_plus',
    name: plusCfg.name,
    available: plusPrice !== null,
    statusText: plusStatus,
    price: plusPrice !== null ? roundCents(plusPrice) : null,
    deductible: plusCfg.deductible,
    isRecommended: false,
    isLiabilityOnly: false,
    specialNote: null,
    benefits: plusCfg.benefits,
  };

  // 2. CVB-Premium
  const premCfg = config.cvbPremium;
  let premPrice = null;
  let premStatus = 'Preis auf Anfrage';

  if (roundedValue > 0 && roundedValue <= premCfg.maxGrossValue) {
    if (isWohnmobil) {
      if (
        roundedValue >= premCfg.wohnmobil.minV &&
        roundedValue <= premCfg.wohnmobil.maxV
      ) {
        premPrice = premCfg.wohnmobil.price;
        premStatus = null;
      }
    } else {
      if (
        roundedValue >= premCfg.wohnwagen.minV &&
        roundedValue <= premCfg.wohnwagen.maxV
      ) {
        premPrice = premCfg.wohnwagen.price;
        premStatus = null;
      }
    }
  }

  const premResult = {
    planId: 'cvb_premium',
    name: premCfg.name,
    available: premPrice !== null,
    statusText: premStatus,
    price: premPrice !== null ? roundCents(premPrice) : null,
    deductible: premCfg.deductible,
    isRecommended: false,
    isLiabilityOnly: false,
    specialNote: null,
    benefits: premCfg.benefits,
  };

  // 3. CVB-Flex
  const flexCfg = config.cvbFlex;
  const flexVehicle = isWohnmobil ? flexCfg.wohnmobil : flexCfg.wohnwagen;
  let flexPrice = null;
  let flexStatus = null;
  let isLiabilityOnly = false;
  let specialNote = null;

  if (roundedValue <= 0 || roundedValue > flexVehicle.maxInsuredValue) {
    flexPrice = null;
    flexStatus = 'Preis auf Anfrage';
  } else if (vehicleAge > flexCfg.maxKaskoAge) {
    // Age 21+: only liability insurance (Haftpflicht + 20% surcharge), no Schutzbrief, no Kasko, no Veruntreuung
    isLiabilityOnly = true;
    specialNote = flexCfg.liabilityOnlyLabel;
    flexPrice = roundCents(
      flexVehicle.haftpflicht * (1 + flexVehicle.liabilityOnlySurchargePercent / 100)
    );
    flexStatus = null;
  } else {
    // Age <= 20: Kasko + Haftpflicht + optional Schutzbrief
    const kaskoBasis = Math.max(roundedValue, flexVehicle.minVForKasko);
    const kaskoAmount = (kaskoBasis * flexVehicle.kaskoRatePercent) / 100;
    const schutzbriefAmount = flexVehicle.hasSchutzbrief
      ? flexVehicle.schutzbrief
      : 0;
    const baseFlex = flexVehicle.haftpflicht + kaskoAmount + schutzbriefAmount;

    if (!input.veruntreuung) {
      flexPrice = roundCents(baseFlex);
      flexStatus = null;
    } else {
      if (roundedValue <= flexVehicle.veruntreuungStep1MaxV) {
        flexPrice = roundCents(baseFlex + flexVehicle.veruntreuungStep1Surcharge);
        flexStatus = null;
      } else if (roundedValue <= flexVehicle.veruntreuungStep2MaxV) {
        flexPrice = roundCents(baseFlex + flexVehicle.veruntreuungStep2Surcharge);
        flexStatus = null;
      } else {
        flexPrice = null;
        flexStatus = flexVehicle.aboveVeruntreuungStatus;
      }
    }
  }

  const flexResult = {
    planId: 'cvb_flex',
    name: flexCfg.name,
    available: flexPrice !== null,
    statusText: flexStatus,
    price: flexPrice,
    deductible: flexCfg.deductible,
    isRecommended: false,
    isLiabilityOnly,
    specialNote,
    benefits: flexCfg.benefits,
  };

  const plans = [plusResult, premResult, flexResult];

  // Dynamically mark the cheapest available priced plan as "Empfehlung"
  const pricedPlans = plans.filter((p) => p.available && p.price !== null);
  if (pricedPlans.length > 0) {
    const cheapest = pricedPlans.reduce((min, curr) =>
      curr.price < min.price ? curr : min
    );
    cheapest.isRecommended = true;
  }

  return {
    roundedValue,
    vehicleAge,
    plans,
    allUnavailable: pricedPlans.length === 0,
  };
}

