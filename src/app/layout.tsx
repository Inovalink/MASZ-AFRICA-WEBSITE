// app/layout.tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import AppShell from './AppShell';
import GoogleAnalyticsProvider from './components/GoogleAnalyticsProvider';
import { GA_MEASUREMENT_ID } from '@/lib/analytics/gtag';

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

const BASE_URL = 'https://maszgh.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'MASZ-Africa | Mining Equipment & Services in Ghana',
    template: '%s | MASZ-Africa',
  },
  description:
    'MASZ-Africa supplies certified mining consumables, grinding media, activated carbon, steel pipes, and gearbox maintenance services to mines across Ghana and West Africa. Reliable supply chain backed by expert technical support.',
  keywords: [
    'mining equipment Ghana',
    'mining consumables Ghana',
    'mining services West Africa',
    'grinding media Ghana',
    'grinding media supplier West Africa',
    'forged steel grinding balls',
    'cast steel grinding media',
    'grinding balls mining',
    'activated carbon gold mining',
    'activated carbon CIP',
    'activated carbon CIL',
    'carbon in pulp Ghana',
    'carbon in leach process',
    'gold recovery activated carbon',
    'steel pipes mining Ghana',
    'carbon steel pipes mine',
    'stainless steel pipes Ghana',
    'slurry pipes mining',
    'industrial steel pipes Ghana',
    'gearbox servicing mining Ghana',
    'heavy equipment maintenance Ghana',
    'crusher maintenance Ghana',
    'grinding mill repair',
    'conveyor maintenance mining',
    'mining equipment repair Ghana',
    'crusher seals Ghana',
    'crusher seals installation',
    'equipment protection mining',
    'procurement and supply chain mining',
    'mining procurement Ghana',
    'mining supply chain West Africa',
    'technical consultancy mining',
    'mining field support Ghana',
    'mining technical consultancy West Africa',
    'MASZ Africa',
    'MASZ-Africa Ghana',
    'Tarkwa mining services',
    'Tarkwa mining supplier',
    'Ghana gold mine equipment',
    'gold mine equipment supplier',
    'mining support services Ghana',
    'mining workforce training Ghana',
    'mining safety solutions',
    'industrial equipment Ghana',
    'mining operations support West Africa',
    'mine consumables supplier',
    'West Africa mining company',
  ],
  authors: [{ name: 'MASZ-Africa', url: BASE_URL }],
  creator: 'MASZ-Africa',
  publisher: 'MASZ-Africa',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_GH',
    url: BASE_URL,
    siteName: 'MASZ-Africa',
    title: 'MASZ-Africa | Mining Equipment & Services in Ghana',
    description:
      'Certified mining consumables, grinding media, activated carbon, steel pipes, and technical services for mines across Ghana and West Africa.',
    images: [
      {
        url: '/homeAssets/Image-4.jpg',
        width: 1200,
        height: 630,
        alt: 'MASZ-Africa — Mining Equipment and Services, Ghana',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MASZ-Africa | Mining Equipment & Services in Ghana',
    description:
      'Certified mining consumables, grinding media, activated carbon, steel pipes, and technical services for mines across Ghana and West Africa.',
    images: ['/homeAssets/Image-4.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'LocalBusiness'],
  name: 'MASZ-Africa',
  url: BASE_URL,
  logo: `${BASE_URL}/maszAssets/website-logo.svg`,
  image: `${BASE_URL}/homeAssets/Image-4.jpg`,
  description:
    'MASZ-Africa supplies certified mining consumables and professional services to mines across Ghana and West Africa, including grinding media, activated carbon, steel pipes, and gearbox maintenance.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'House #17, Breeze Street, GT 353-5495, Community 16, Terno',
    postOfficeBoxNumber: 'P.O. Box 729',
    addressLocality: 'Tarkwa',
    addressRegion: 'Western Region',
    addressCountry: 'GH',
  },
  telephone: '+233244163975',
  email: 'admin@maszgh.com',
  areaServed: [
    { '@type': 'Country', name: 'Ghana' },
    { '@type': 'Place', name: 'West Africa' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Mining Products & Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Grinding Media Supply' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Activated Carbon Supply' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Metal & Steel Pipes Supply' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Gearbox Servicing & Heavy Equipment Maintenance' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Crusher Seals Installation & Equipment Protection' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Procurement & Supply Chain Management' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Technical Consultancy & Field Support' } },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.className} ${geistMono.className}`}>
      <head>
        {/* Run before React: clear scroll history on every load so scroll-to-reveal starts fresh */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined') return;
                try {
                  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
                  window.scrollTo(0, 0);
                  if (document.documentElement) document.documentElement.scrollTop = 0;
                  if (document.body) document.body.scrollTop = 0;
                } catch (e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {/* Google Analytics */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="antialiased">
        <GoogleAnalyticsProvider />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
