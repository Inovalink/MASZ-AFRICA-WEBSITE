import type { Metadata } from 'next';

const BASE_URL = 'https://www.maszgh.com';

export const metadata: Metadata = {
  title: 'Products & Services',
  description:
    'Explore the full range of MASZ-Africa mining products and services: grinding media, activated carbon, metal and steel pipes, gearbox servicing, crusher seals, procurement, and technical consultancy for mines in Ghana and West Africa.',
  keywords: [
    'mining products Ghana',
    'mining services Ghana',
    'grinding media supplier',
    'activated carbon mining',
    'steel pipes mining',
    'gearbox servicing Ghana',
    'crusher seals installation',
    'mining procurement West Africa',
    'technical consultancy mining Ghana',
    'mining consumables supplier West Africa',
    'mining equipment services Ghana',
    'field support mining',
  ],
  alternates: {
    canonical: `${BASE_URL}/services`,
  },
  openGraph: {
    title: 'Mining Products & Services | MASZ-Africa Ghana',
    description:
      'Grinding media, activated carbon, steel pipes, gearbox servicing, crusher seals, procurement, and technical consultancy for mines across Ghana and West Africa.',
    url: `${BASE_URL}/services`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mining Products & Services | MASZ-Africa Ghana',
    description:
      'Grinding media, activated carbon, steel pipes, gearbox servicing, and more — trusted mining services across Ghana and West Africa.',
  },
};

const servicesPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Mining Products & Services — MASZ-Africa',
  description:
    'Full range of MASZ-Africa mining products and services for mines across Ghana and West Africa.',
  url: `${BASE_URL}/services`,
  provider: {
    '@type': 'Organization',
    name: 'MASZ-Africa',
    url: BASE_URL,
  },
};

const servicesBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Products & Services', item: `${BASE_URL}/services` },
  ],
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesBreadcrumb) }}
      />
      {children}
    </>
  );
}
