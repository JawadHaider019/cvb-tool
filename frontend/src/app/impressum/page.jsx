import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export const metadata = {
  title: 'Impressum | SelbstfahrerVermietversicherung.online',
  description:
    'Impressum und Anbieterkennzeichnung gemäß § 5 DDG der DS-Caravaning GmbH / Caravan-Vermieter-Bund.',
};

export default function ImpressumPage() {
  return (
    <main className="min-h-screen bg-[#F4F2E6]/50 py-12 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-[28px] border border-[#A09048]/30 shadow-sm p-6 sm:p-10 space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#384808] hover:text-[#889028]"
        >
          <ArrowLeft size={16} />
          <span>Zurück zur Startseite</span>
        </Link>

        <div className="flex items-center gap-3 pb-4 border-b border-[#A09048]/25">
          <div className="w-10 h-10 rounded-full bg-[#384808] text-[#A09048] flex items-center justify-center">
            <Shield size={18} />
          </div>
          <h1 className="font-spartan text-3xl font-black text-[#384808]">
            Impressum
          </h1>
        </div>

        <div className="space-y-5 text-sm text-[#585828] leading-relaxed">
          <section>
            <h2 className="font-spartan font-bold text-lg text-[#384808] mb-1">
              Angaben gemäß § 5 DDG
            </h2>
            <p>
              <strong>DS-Caravaning GmbH</strong>
              <br />
              Wiesenstr. 48
              <br />
              41372 Niederkrüchten
              <br />
              Handelsregister: HRB 1923
              <br />
              Registergericht: Amtsgericht Mönchengladbach
              <br />
              Vertreten durch: Detlef Scheer
            </p>
          </section>

          <section>
            <h2 className="font-spartan font-bold text-lg text-[#384808] mb-1">
              Kontakt
            </h2>
            <p>
              Telefon: +49 (0) 172 21 111 89
              <br />
              E-Mail: info@caravan-vermieter-bund.de
            </p>
          </section>

          <section>
            <h2 className="font-spartan font-bold text-lg text-[#384808] mb-1">
              Umsatzsteuer-ID
            </h2>
            <p>
              Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
              <br />
              USt-ID.: DE312370961
            </p>
          </section>

          <section>
            <h2 className="font-spartan font-bold text-lg text-[#384808] mb-1">
              Streitschlichtung
            </h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur
              Online-Streitbeilegung (OS) bereit:{' '}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-[#384808]"
              >
                https://ec.europa.eu/consumers/odr
              </a>
              . Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
            <p className="mt-2">
              Wir sind nicht bereit oder verpflichtet, an
              Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
              teilzunehmen.
            </p>
          </section>

          <section>
            <h2 className="font-spartan font-bold text-lg text-[#384808] mb-1">
              Haftung für Inhalte
            </h2>
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene
              Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
              verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter
              jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
              Informationen zu überwachen oder nach Umständen zu forschen, die
              auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
            <p className="mt-2">
              Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
              Informationen nach den allgemeinen Gesetzen bleiben hiervon
              unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem
              Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich.
              Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir
              diese Inhalte umgehend entfernen.
            </p>
          </section>

          <section>
            <h2 className="font-spartan font-bold text-lg text-[#384808] mb-1">
              Haftung für Links
            </h2>
            <p>
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren
              Inhalte wir keinen Einfluss haben. Deshalb können wir für diese
              fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
              verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber
              der Seiten verantwortlich. Die verlinkten Seiten wurden zum
              Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft.
              Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht
              erkennbar.
            </p>
            <p className="mt-2">
              Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist
              jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht
              zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir
              derartige Links umgehend entfernen.
            </p>
          </section>

          <section>
            <h2 className="font-spartan font-bold text-lg text-[#384808] mb-1">
              Urheberrecht
            </h2>
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
              diesen Seiten unterliegen dem deutschen Urheberrecht. Die
              Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
              Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
              schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              Downloads und Kopien dieser Seite sind nur für den privaten, nicht
              kommerziellen Gebrauch gestattet.
            </p>
            <p className="mt-2">
              Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt
              wurden, werden die Urheberrechte Dritter beachtet. Insbesondere
              werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie
              trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten
              wir um einen entsprechenden Hinweis. Bei Bekanntwerden von
              Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

