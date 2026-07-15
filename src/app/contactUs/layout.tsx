import type { Metadata } from 'next';

const BASE_URL = 'https://maszgh.com';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with MASZ-Africa. Our team is based in Tarkwa, Western Region, Ghana. Reach us at admin@maszgh.com or call +233 24 416 3975. We respond to all inquiries within 24 hours.',
  keywords: [
    'contact MASZ-Africa',
    'MASZ Africa contact',
    'mining supplier contact Ghana',
    'Tarkwa mining company contact',
    'mining services enquiry Ghana',
    'admin@maszgh.com',
    'MASZ Africa phone',
    'mining company Western Region Ghana',
  ],
  alternates: {
    canonical: `${BASE_URL}/contactUs`,
  },
  openGraph: {
    title: 'Contact MASZ-Africa | Mining Operations Support, Ghana',
    description:
      'Get in touch with MASZ-Africa. Based in Tarkwa, Western Region, Ghana. Email admin@maszgh.com or call +233 24 416 3975. We respond within 24 hours.',
    url: `${BASE_URL}/contactUs`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact MASZ-Africa | Mining Operations Support, Ghana',
    description:
      'Based in Tarkwa, Western Region, Ghana. Email admin@maszgh.com or call +233 24 416 3975.',
  },
};

const contactPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact MASZ-Africa',
  description:
    'Get in touch with MASZ-Africa. Our team is based in Tarkwa, Western Region, Ghana.',
  url: `${BASE_URL}/contactUs`,
  mainEntity: {
    '@type': 'Organization',
    name: 'MASZ-Africa',
    url: BASE_URL,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+233244163975',
      email: 'admin@maszgh.com',
      contactType: 'customer service',
      areaServed: ['GH', 'West Africa'],
      availableLanguage: 'English',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'House #17, Breeze Street, GT 353-5495, Community 16, Terno',
      postOfficeBoxNumber: 'P.O. Box 729',
      addressLocality: 'Tarkwa',
      addressRegion: 'Western Region',
      addressCountry: 'GH',
    },
  },
};

const contactBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Contact Us', item: `${BASE_URL}/contactUs` },
  ],
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactBreadcrumb) }}
      />
      {children}
    </>
  );
}
