import React from 'react';
import { getDb } from '@/lib/db.js';
import { Header } from '@/components/Header.jsx';
import { Footer } from '@/components/Footer.jsx';
import { HeroSection } from '@/components/HeroSection.jsx';
import { IntroSection } from '@/components/IntroSection.jsx';
import { BesserVermietenSection } from '@/components/BesserVermietenSection.jsx';
import { CalculatorSection } from '@/components/CalculatorSection.jsx';
import { ComparisonTableSection } from '@/components/ComparisonTableSection.jsx';
import { PlanOverviewSection } from '@/components/PlanOverviewSection.jsx';
import { TrustSection } from '@/components/TrustSection.jsx';
import { AppSection } from '@/components/AppSection.jsx';
import { FaqSection } from '@/components/FaqSection.jsx';
import { ContactSection } from '@/components/ContactSection.jsx';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const db = getDb();
  const visibleSections = [...db.sections]
    .filter((item) => item.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header tickerText={db.generalSettings.tickerText} />

      <main className="flex-1">
        {visibleSections.map((section) => {
          if (section.id === 'hero') {
            return (
              <React.Fragment key={section.id}>
                <HeroSection section={section} />
                <BesserVermietenSection />
              </React.Fragment>
            );
          }
          if (section.id === 'intro') {
            return <IntroSection key={section.id} section={section} />;
          }
          if (section.id === 'calculator') {
            return (
              <React.Fragment key={section.id}>
                <CalculatorSection
                  section={section}
                  config={db.insuranceConfig}
                />
                <ComparisonTableSection />
              </React.Fragment>
            );
          }
          if (section.id === 'plans') {
            return (
              <PlanOverviewSection
                key={section.id}
                section={section}
                config={db.insuranceConfig}
              />
            );
          }
          if (section.id === 'trust') {
            return (
              <React.Fragment key={section.id}>
                <TrustSection section={section} />
                <AppSection />
              </React.Fragment>
            );
          }
          if (section.id === 'faq') {
            return (
              <FaqSection
                key={section.id}
                section={section}
                faqs={db.faqs}
                contactEmail={db.generalSettings.contactEmail}
              />
            );
          }
          if (section.id === 'contact') {
            return (
              <ContactSection
                key={section.id}
                section={section}
                settings={db.generalSettings}
              />
            );
          }
          return null;
        })}
      </main>

      <Footer settings={db.generalSettings} />
    </div>
  );
}

