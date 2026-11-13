import React from 'react';
import { getDb } from '@/lib/db.js';
import { Header } from '@/components/Header.jsx';
import { Footer } from '@/components/Footer.jsx';
import { HeroSection } from '@/components/HeroSection.jsx';
import { BesserVermietenSection } from '@/components/BesserVermietenSection.jsx';
import { PlanOverviewSection } from '@/components/PlanOverviewSection.jsx';
import { ComparisonTableSection } from '@/components/ComparisonTableSection.jsx';
import { CalculatorSection } from '@/components/CalculatorSection.jsx';
import { AppSection } from '@/components/AppSection.jsx';
import { FaqSection } from '@/components/FaqSection.jsx';
import { ContactSection } from '@/components/ContactSection.jsx';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const db = getDb();

  const heroSection = db.sections.find((s) => s.id === 'hero');
  const calcSection = db.sections.find((s) => s.id === 'calculator') || {};
  const contactSection = db.sections.find((s) => s.id === 'contact') || {};

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        {/* 1. Unified Hero + Navbar in Same Container with Dark Olive Overlay */}
        <HeroSection section={heroSection} />

        {/* 2. Besser Vermieten mit dem CVB + Ablauf und Informationen */}
        <BesserVermietenSection />

        {/* 3. Die CVB-Lösungen im Detail (6 Cards) matching Screenshot 2 */}
        <PlanOverviewSection config={db.insuranceConfig} />

        {/* 4. Für jeden das passende Paket (Comparison Matrix) matching Screenshot 3 */}
        <ComparisonTableSection />

        {/* 5. Live-Tarifrechner 2027 (Ausgeblendet auf Kundenwunsch) */}
        {calcSection?.visible && (
          <CalculatorSection
            section={calcSection}
            config={db.insuranceConfig}
          />
        )}

        {/* 6. CVB Vermieter-APP matching Screenshot 4 */}
        <AppSection />

        {/* 7. FAQ matching Screenshot 1 */}
        <FaqSection
          faqs={db.faqs}
          contactEmail={db.generalSettings.contactEmail}
        />

        {/* 8. Kontakt (Ausgeblendet auf Kundenwunsch) */}
        {contactSection?.visible && (
          <ContactSection
            section={contactSection}
            settings={db.generalSettings}
          />
        )}
      </main>

      {/* 9. Footer matching Screenshot 1 */}
      <Footer settings={db.generalSettings} />
    </div>
  );
}
