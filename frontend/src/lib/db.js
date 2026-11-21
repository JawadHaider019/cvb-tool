import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password, storedHash) {
  const [salt, key] = (storedHash || '').split(':');
  if (!salt || !key) return false;
  const keyBuf = Buffer.from(key, 'hex');
  const derivedBuf = crypto.scryptSync(password, salt, 64);
  if (keyBuf.length !== derivedBuf.length) return false;
  return crypto.timingSafeEqual(keyBuf, derivedBuf);
}

export const defaultInsuranceConfig = {
  wohnwagenActive: true,
  priceHintText:
    'Listenneupreis laut Hersteller, ohne Rabatte, inkl. fest eingebautem Sonderzubehör. Vorsteuerabzugsberechtigte Vermieter geben den Nettopreis an, Kleinunternehmer den Bruttopreis.',
  cvbPlus: {
    name: 'CVB-Plus',
    deductibleVK: 1500,
    deductibleTK: 1500,
    wohnmobil: {
      steps: [
        { maxV: 59000, price: 2992.8 },
        { maxV: 84000, price: 3291.54 },
        { maxV: 101000, price: 3591.42 },
      ],
    },
    wohnwagen: {
      steps: [{ maxV: 50000, price: 1196.66 }],
    },
    benefits: [
      'Kfz-Haftpflicht: 100 Mio. € pauschal für Personen-, Sach- und Vermögensschäden, bei Personenschäden max. 15 Mio. € je geschädigte Person',
      'Vollkasko inkl. Teilkasko, Selbstbeteiligung 1.500 € je Schadenfall',
      'GAP-Deckung: für geleaste und kreditfinanzierte Fahrzeuge als beitragsfreie Zusatzleistung eingeschlossen',
      'Unterschlagung mitversichert, wenn bei der Fahrzeugübergabe nachweisbar: 1. Identitätsprüfung (Kopie Vorder- und Rückseite von Personalausweis oder Reisepass und Führerschein), 2. bargeldlose Zahlung (Kreditkarte, EC-Karte oder Banküberweisung)',
      'Zubehör mitversichert: verbundene Vorzelte, Markisen, Fahrradträger, Gasanlagen, Klimaanlagen und Satellitenschüsseln, sofern die bei Antragstellung angegebenen Gesamtwerte nicht überschritten werden',
    ],
  },
  cvbPremium: {
    name: 'CVB-Premium',
    deductibleVK: 1500,
    deductibleTK: 1500,
    wohnmobil: {
      maxV: 126000,
      price: 3250.0,
    },
    wohnwagen: {
      maxV: 50000,
      price: 1330.0,
    },
    benefits: [
      'Kfz-Haftpflicht für Wohnmobile/Wohnwagen bis 150.000 € brutto: 100 Mio. € pauschal für Personen-, Sach- und Vermögensschäden, bei Personenschäden max. 15 Mio. € je geschädigte Person',
      'Vollkasko inkl. Teilkasko, Selbstbeteiligung 1.500 € je Schadenfall. Für Unterschlagung: 20 % des vertraglichen Erstattungswertes, mindestens 5.000 €',
      'Unterschlagung mitversichert, wenn bei der Fahrzeugübergabe nachweisbar: 1. Identitätsprüfung (Kopie Vorder- und Rückseite von Personalausweis oder Reisepass und Führerschein, Anlage von Kopien), 2. bargeldlose Zahlung (Kreditkarte, EC-Karte oder Banküberweisung), bevorzugt Banküberweisung, Kontoinhaber und Mieter identisch',
      'Zubehör mitversichert: verbundene Vorzelte, Markisen, Fahrradträger, Gasanlagen, Klimaanlagen und Satellitenschüsseln, sofern die bei Antragstellung angegebenen Gesamtwerte nicht überschritten werden (Sonderausstattungen bis max. 10.000 €)',
    ],
  },
  cvbFlex: {
    name: 'CVB-Flex',
    maxKaskoAge: 10,
    liabilityOnlyLabel: 'Nur Haftpflicht',
    wohnmobil: {
      deductibleVK: 2500,
      deductibleTK: 1500,
      minV: 50000,
      maxV: 150000,
      baseFixed: 1206.15,
      perThousandRate: 13.927,
      factor1: 1.15,
      factor2: 1.1,
      liabilityOnlyPrice: 1326.77,
      benefits: [
        'Kfz-Haftpflicht: 100 Mio. € pauschal, max. 15 Mio. € je versicherte Person',
        'Vollkasko 2.500 € / Teilkasko 1.500 € Selbstbeteiligung',
        'Veruntreuung inklusive',
        'Kasko für Fahrzeuge bis 10 Jahre',
        'Hagelschäden: 3.000 € Selbstbeteiligung je Schaden',
        'Saisonkennzeichen möglich (monatsweise Berechnung, Mindestprämie für 6 Monate)',
        'Optional: Schutzbrief 89,90 €/Jahr, Rechtsschutz 108 €/Jahr, SB-Reduzierer für Mieter',
      ],
    },
    wohnwagen: {
      deductibleVK: 1500,
      deductibleTK: 500,
      minV: 18000,
      maxV: 100000,
      baseFixed: 50.0,
      perThousandRate: 34.5,
      factor1: 1,
      factor2: 1,
      liabilityOnlyPrice: 100.0,
      benefits: [
        'Kfz-Haftpflicht: 100 Mio. € pauschal, max. 15 Mio. € je geschädigte Person',
        'Vollkasko 1.500 € / Teilkasko 500 € Selbstbeteiligung',
        'Veruntreuung inklusive',
        'Kasko für Fahrzeuge bis 10 Jahre',
        'Glasschäden: 500 € Selbstbeteiligung, Erstattung max. 3.000 €',
        'Hagelschäden: 3.000 € Selbstbeteiligung je Schaden',
        'Saisonkennzeichen möglich (monatsweise Berechnung, Mindestprämie für 6 Monate)',
        'Optional: Rechtsschutz 53,35 €/Jahr',
      ],
    },
  },
  priceFootnote: 'Alle Preise sind Jahresbeiträge inkl. Versicherungssteuer.',
};

export function createDefaultDatabase() {
  const defaultPassword = process.env.ADMIN_INITIAL_PASSWORD || 'cvb-versicherung-2027';

  return {
    sections: [
      {
        id: 'hero',
        label: 'Hero-Bereich',
        visible: true,
        order: 1,
        badge: 'CARAVAN-VERMIETER-BUND // SELBSTFAHRERVERMIETVERSICHERUNG',
        title: 'Wohnmobil und Wohnwagen vermieten und versichern',
        subtitle:
          'Spezialisierte Selbstfahrervermietversicherung für gewerbliche und ambitionierte Vermieter — bereits ab dem 1. Fahrzeug. Berechnen Sie jetzt Ihren Jahrestarif 2027.',
        ctaText: 'Tarif jetzt berechnen',
        secondaryCtaText: 'Fragen & Beratung',
        image: '/images/luxury_camper_hero.jpg',
        imageAlt: 'Wohnmobil für die Vermietung am See bei Sonnenuntergang',
      },
      {
        id: 'intro',
        label: 'Überblick & Service (Intro)',
        visible: true,
        order: 2,
        badge: 'FÜR WOHNMOBIL- UND WOHNWAGEN-VERMIETER',
        title: 'Versicherungslösungen für Selbstfahrervermietung',
        subtitle:
          'Beim Caravan-Vermieter-Bund (CVB) erhalten Sie rechtssichere, praxiserprobte Versicherungskonzepte speziell für Mietfahrzeuge.',
        body: 'Ob Einzelvermieter mit einem Wohnmobil oder wachsende Flotte: Herkömmliche Privat-Policen schließen die gewerbliche Selbstfahrervermietung aus. Mit unseren Rahmenverträgen CVB-Plus, CVB-Premium und CVB-Flex sichern Sie Haftpflicht, Vollkasko, Teilkasko und Veruntreuung transparent und zuverlässig ab — bereits ab dem 1. Wohnmobil oder Wohnwagen. Für Vermieter ab 10 Fahrzeugen bieten wir zudem individuelle Flottenlösungen an.',
        image: '/images/hero_motorhome_handover.jpg',
        imageAlt: 'Übergabe eines gemieteten Wohnmobils',
      },
      {
        id: 'calculator',
        label: 'Versicherungs-Preisrechner',
        visible: true,
        order: 3,
        badge: 'LIVE-TARIFRECHNER 2027',
        title: 'Ihren passenden CVB-Tarif sofort berechnen',
        subtitle:
          'Wählen Sie Fahrzeugart, Kaufpreis und Baujahr. Sie sehen sofort alle verfügbaren Tarife im direkten Vergleich.',
      },
      {
        id: 'plans',
        label: 'Die CVB-Lösungen im Detail',
        visible: true,
        order: 4,
        badge: 'TARIFÜBERSICHT',
        title: 'Die CVB-Lösungen im Detail',
        subtitle:
          'Drei abgestimmte Konzepte für unterschiedliche Anforderungen — vom bewährten Allrounder bis zum flexiblen Tarif für erfahrene Vermieter.',
      },
      {
        id: 'trust',
        label: 'Vorteile & Vertrauen (CVB)',
        visible: true,
        order: 5,
        badge: 'WARUM ÜBER DEN CVB VERSICHERN?',
        title: 'Ein Ansprechpartner, klare Regeln, speziell für Vermieter',
        subtitle:
          'Als B2B-Netzwerk für professionelle Wohnmobil- und Caravan-Vermieter kennen wir die Praxis der Fahrzeugvermietung bis ins Detail.',
        image: '/images/luxury_motorhome_alps.jpg',
        imageAlt: 'Wohnmobil in den Alpen',
        items: [
          {
            title: 'Speziell für Selbstfahrervermietfahrzeuge',
            text: 'Keine Grauzonen wie bei privaten Kfz-Policen — alle Tarife sind ausdrücklich für die gewerbliche und private Vermietung an Selbstfahrer konzipiert.',
          },
          {
            title: 'Persönliche Beratung & ein Ansprechpartner',
            text: 'Von der Fahrzeugzulassung über die eVB-Nummer bis zum Schadenfall steht Ihnen ein spezialisiertes Team direkt zur Seite.',
          },
          {
            title: 'Ab dem 1. Fahrzeug bis zur Flotte',
            text: 'Einstieg bereits mit einem einzelnen Wohnmobil oder Wohnwagen möglich — mit klaren Jahresbeiträgen ohne versteckte Überraschungen.',
          },
          {
            title: 'Unterschlagung & Zubehör abgesichert',
            text: 'Je nach Tarif ist das Veruntreuungsrisiko bei ordnungsgemäßer Übergabe sowie typisches Campingzubehör bereits mitversichert.',
          },
        ],
      },
      {
        id: 'faq',
        label: 'Häufige Fragen (FAQ)',
        visible: true,
        order: 6,
        badge: 'FAQ',
        title: 'Häufige Fragen zur Vermietversicherung',
        subtitle:
          'Antworten auf die wichtigsten Fragen rund um Wechsel, Zulassung, Wohnwagen und Flottenlösungen.',
      },
      {
        id: 'contact',
        label: 'Kontakt & Persönliche Anfrage',
        visible: true,
        order: 7,
        badge: 'KONTAKT',
        title: 'Fragen oder individuelles Fahrzeug außerhalb der Tabelle?',
        subtitle:
          'Senden Sie uns direkt Ihre Anfrage — wir melden uns zeitnah persönlich bei Ihnen.',
      },
    ],
    insuranceConfig: defaultInsuranceConfig,
    faqs: [
      {
        id: 'faq-1',
        question: 'Wie wird gewechselt, wenn der Wagen bereits angemeldet ist?',
        answer:
          'Ein Versicherungswechsel bei bereits zugelassenen Fahrzeugen ist unkompliziert möglich. Wir prüfen gemeinsam den Kündigungszeitpunkt Ihres bestehenden Vertrags und stellen Ihnen rechtzeitig die neue eVB-Nummer für die Umstellung als Selbstfahrervermietfahrzeug zur Verfügung.',
        sortOrder: 1,
        visible: true,
      },
      {
        id: 'faq-2',
        question:
          'Unser Fahrzeug ist privat angemeldet, kann ich zu einer Vermieter-Versicherung wechseln?',
        answer:
          'Ja. Sobald das Fahrzeug vermietet wird, ist eine klassische Privatversicherung in der Regel nicht mehr ausreichend. Wir unterstützen Sie beim sauberen Übergang in eine anerkannte Selbstfahrervermietversicherung über den CVB.',
        sortOrder: 2,
        visible: true,
      },
      {
        id: 'faq-3',
        question: 'Finde ich als Wohnwagenvermieter auch eine Lösung?',
        answer:
          'Ja, alle drei CVB-Tarife (CVB-Plus, CVB-Premium und CVB-Flex) bieten spezielle Konditionen für vermietete Wohnwagen. Wählen Sie im Rechner oben einfach „Wohnwagen“ aus.',
        sortOrder: 3,
        visible: true,
      },
      {
        id: 'faq-4',
        question: 'Wir haben mehr als 10 Fahrzeuge, gibt es dafür Flottenlösungen?',
        answer:
          'Ja! Für Vermieter ab 10 Fahrzeugen bieten wir über den Caravan-Vermieter-Bund attraktive Flottenlösungen an. Nutzen Sie einfach unser Anfrageformular für ein individuelles Angebot.',
        sortOrder: 4,
        visible: true,
      },
      {
        id: 'faq-5',
        question: 'Was ist beim Versicherungswechsel zu beachten?',
        answer:
          'Achten Sie auf die Kündigungsfristen Ihres bisherigen Versicherers sowie auf die korrekte Eintragung als Selbstfahrervermietfahrzeug bei der Zulassungsstelle. Bei Fragen begleiten wir Sie Schritt für Schritt.',
        sortOrder: 5,
        visible: true,
      },
    ],
    requests: [],
    generalSettings: {
      recipientEmail: 'Versicherungsanfrage@caravan-vermieter-bund.de',
      senderName: 'SelbstfahrerVermietversicherung.online',
      contactEmail: 'info@caravan-vermieter-bund.de',
      contactPhone: '+49 (0) 172 21 111 89',
      companyName: 'Caravan-Vermieter-Bund (CVB) / DS-Caravaning GmbH',
      companyAddress: 'Wiesenstr. 48, 41372 Niederkrüchten',
      cvbWebsiteUrl: 'https://caravan-vermieter-bund.de',
      pageTitle:
        'SelbstfahrerVermietversicherung.online | CVB Versicherungsrechner für Wohnmobil & Wohnwagen',
      pageDescription:
        'Selbstfahrervermietversicherung für Wohnmobile und Wohnwagen vom Caravan-Vermieter-Bund (CVB). Jetzt CVB-Plus, CVB-Premium und CVB-Flex 2027 live berechnen und unverbindlich anfragen.',
      tickerText:
        'OFFIZIELLE SELBSTFAHRERVERMIETVERSICHERUNG DES CARAVAN-VERMIETER-BUND (CVB) · TARIFE 2027 LIVE BERECHNEN · WOHNMOBIL & WOHNWAGEN AB DEM 1. FAHRZEUG · PERSÖNLICHE BERATUNG',
    },
    adminPasswordHash: hashPassword(defaultPassword),
    versionHistory: {},
    auditLog: [],
  };
}

export function getDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const initial = createDefaultDatabase();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    const fallback = createDefaultDatabase();
    fs.writeFileSync(DB_FILE, JSON.stringify(fallback, null, 2), 'utf-8');
    return fallback;
  }
}

export function saveDb(db) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

export function recordAudit(db, action, details) {
  db.auditLog.unshift({
    timestamp: new Date().toISOString(),
    action,
    details,
  });
  if (db.auditLog.length > 200) {
    db.auditLog = db.auditLog.slice(0, 200);
  }
}

