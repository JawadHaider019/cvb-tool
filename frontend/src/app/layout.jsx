import { DM_Sans, League_Spartan } from 'next/font/google';
import { CustomCursor } from '@/components/CustomCursor.jsx';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const leagueSpartan = League_Spartan({
  subsets: ['latin'],
  variable: '--font-league-spartan',
  display: 'swap',
});

export const metadata = {
  title:
    'SelbstfahrerVermietversicherung.online | CVB Versicherungsrechner für Wohnmobil & Wohnwagen',
  description:
    'Selbstfahrervermietversicherung für Wohnmobile und Wohnwagen vom Caravan-Vermieter-Bund (CVB). Jetzt CVB-Plus, CVB-Premium und CVB-Flex 2027 live berechnen und unverbindlich anfragen.',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    title:
      'SelbstfahrerVermietversicherung.online | CVB Versicherungsrechner',
    description:
      'Spezialisierte Selbstfahrervermietversicherung für Wohnmobile und Wohnwagen — CVB-Plus, CVB-Premium und CVB-Flex sofort berechnen.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="de" className={`${dmSans.variable} ${leagueSpartan.variable}`}>
      <body className="bg-[#FFFFFF] text-[#585828] antialiased selection:bg-[#A09048] selection:text-white">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}

