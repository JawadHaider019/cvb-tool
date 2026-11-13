import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export const metadata = {
  title: 'Datenschutzerklärung | SelbstfahrerVermietversicherung.online',
  description:
    'Datenschutzerklärung der DS-Caravaning GmbH für SelbstfahrerVermietversicherung.online.',
};

export default function DatenschutzPage() {
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
            Datenschutzerklärung
          </h1>
        </div>

        <div className="space-y-5 text-sm text-[#585828] leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-spartan font-bold text-lg text-[#384808]">
              1. Datenschutz auf einen Blick
            </h2>
            <h3 className="font-bold text-[#384808]">Allgemeine Hinweise</h3>
            <p>
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was
              mit Ihren personenbezogenen Daten passiert, wenn Sie unsere
              Website besuchen. Personenbezogene Daten sind alle Daten, mit
              denen Sie persönlich identifiziert werden können. Ausführliche
              Informationen zum Thema Datenschutz entnehmen Sie unserer unter
              diesem Text aufgeführten Datenschutzerklärung.
            </p>
            <h3 className="font-bold text-[#384808] pt-1">
              Datenerfassung auf unserer Website
            </h3>
            <p>
              <strong>
                Wer ist verantwortlich für die Datenerfassung auf dieser
                Website?
              </strong>{' '}
              Die Datenverarbeitung auf dieser Website erfolgt durch den
              Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum
              dieser Website entnehmen.
            </p>
            <p>
              <strong>Wie erfassen wir Ihre Daten?</strong> Ihre Daten werden zum
              einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann
              es sich z. B. um Daten handeln, die Sie in ein Kontaktformular
              eingeben. Andere Daten werden automatisch beim Besuch der Website
              durch unsere IT-Systeme erfasst. Das sind vor allem technische
              Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des
              Seitenaufrufs).
            </p>
            <p>
              <strong>Wofür nutzen wir Ihre Daten?</strong> Ein Teil der Daten
              wird erhoben, um eine fehlerfreie Bereitstellung der Website zu
              gewährleisten. Ihre Formular- und Berechnungsdaten nutzen wir zur
              Bearbeitung Ihrer Versicherungsanfrage.
            </p>
            <p>
              <strong>
                Welche Rechte haben Sie bezüglich Ihrer Daten?
              </strong>{' '}
              Sie haben jederzeit das Recht unentgeltlich Auskunft über
              Herkunft, Empfänger und Zweck Ihrer gespeicherten
              personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht,
              die Berichtigung, Sperrung oder Löschung dieser Daten zu
              verlangen. Des Weiteren steht Ihnen ein Beschwerderecht bei der
              zuständigen Aufsichtsbehörde zu.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-spartan font-bold text-lg text-[#384808]">
              2. Allgemeine Hinweise und Pflichtinformationen
            </h2>
            <h3 className="font-bold text-[#384808]">Datenschutz</h3>
            <p>
              Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen
              Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten
              vertraulich und entsprechend der gesetzlichen
              Datenschutzvorschriften sowie dieser Datenschutzerklärung.
            </p>
            <h3 className="font-bold text-[#384808] pt-1">
              Hinweis zur verantwortlichen Stelle
            </h3>
            <p>
              Die verantwortliche Stelle für die Datenverarbeitung auf dieser
              Website ist:
              <br />
              DS-Caravaning GmbH, Wiesenstr. 48, 41372 Niederkrüchten
              <br />
              Telefon: +49 (0) 172 21 111 89 | E-Mail:
              info@caravan-vermieter-bund.de
            </p>
            <h3 className="font-bold text-[#384808] pt-1">
              Widerruf Ihrer Einwilligung zur Datenverarbeitung
            </h3>
            <p>
              Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen
              Einwilligung möglich. Sie können eine bereits erteilte
              Einwilligung jederzeit widerrufen. Dazu reicht eine formlose
              Mitteilung per E-Mail an uns. Die Rechtmäßigkeit der bis zum
              Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf
              unberührt.
            </p>
            <h3 className="font-bold text-[#384808] pt-1">
              Widerspruchsrecht (Art. 21 DSGVO)
            </h3>
            <p>
              Wenn die Datenverarbeitung auf Grundlage von Art. 6 Abs. 1 lit. e
              oder f DSGVO erfolgt, haben Sie jederzeit das Recht, aus Gründen,
              die sich aus Ihrer besonderen Situation ergeben, gegen die
              Verarbeitung Ihrer personenbezogenen Daten Widerspruch einzulegen.
            </p>
            <h3 className="font-bold text-[#384808] pt-1">
              SSL- bzw. TLS-Verschlüsselung
            </h3>
            <p>
              Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der
              Übertragung vertraulicher Inhalte, wie zum Beispiel
              Versicherungsanfragen, eine SSL- bzw. TLS-Verschlüsselung.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-spartan font-bold text-lg text-[#384808]">
              3. Datenerfassung auf unserer Website
            </h2>
            <h3 className="font-bold text-[#384808]">
              Anfrage- & Kontaktformular
            </h3>
            <p>
              Wenn Sie uns per Versicherungs- oder Kontaktformular Anfragen
              zukommen lassen, werden Ihre Angaben aus dem Anfrageformular
              inklusive der von Ihnen dort angegebenen Kontaktdaten und
              Fahrzeugdaten zwecks Bearbeitung der Anfrage und für den Fall von
              Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht
              ohne Ihre Einwilligung weiter. Die Verarbeitung erfolgt
              ausschließlich auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1
              lit. a DSGVO) bzw. zur Durchführung vorvertraglicher Maßnahmen
              (Art. 6 Abs. 1 lit. b DSGVO).
            </p>
            <h3 className="font-bold text-[#384808] pt-1">
              Server-Log-Dateien
            </h3>
            <p>
              Der Provider der Seiten erhebt und speichert automatisch
              Informationen in so genannten Server-Log-Dateien (Browsertyp und
              Browserversion, verwendetes Betriebssystem, Referrer URL,
              Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage,
              IP-Adresse). Eine Zusammenführung dieser Daten mit anderen
              Datenquellen wird nicht vorgenommen.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

