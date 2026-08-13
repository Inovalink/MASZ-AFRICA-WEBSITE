import React from 'react';
import type { Metadata } from 'next';
import { serviceDetailsTemplate } from '@/app/Data/serviceDetails';
import ServiceDetailContent from './ServiceDetailContent';

const BASE_URL = 'https://www.maszgh.com';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Per-service keyword sets that complement the shared metadata
const SERVICE_KEYWORDS: Record<string, string[]> = {
  'grinding-media': [
    'grinding media Ghana',
    'grinding media supplier West Africa',
    'forged steel grinding balls',
    'cast steel grinding media',
    'grinding balls mining',
    'ISO grinding media',
    'ASTM grinding balls',
    'steel grinding media Ghana',
    'milling grinding balls',
    'grinding media CIP',
    'mining grinding media supplier',
  ],
  'activated-carbon': [
    'activated carbon gold mining',
    'activated carbon CIP Ghana',
    'activated carbon CIL process',
    'carbon in pulp activated carbon',
    'carbon in leach Ghana',
    'gold recovery activated carbon',
    'high adsorption activated carbon',
    'activated carbon supplier Ghana',
    'gold mine activated carbon West Africa',
    'activated carbon regeneration',
  ],
  'metal-and-steel-pipes': [
    'steel pipes mining Ghana',
    'carbon steel pipes mine',
    'stainless steel pipes Ghana',
    'galvanized pipes mining',
    'slurry pipes Ghana',
    'API steel pipes mining',
    'ASTM pipes mining',
    'industrial steel pipes Ghana',
    'pipe supply mining West Africa',
    'steel pipe supplier Ghana',
    'mining pipeline solutions',
  ],
  'gear-box-servicing-and-heavy-equipment-maintenance': [
    'gearbox servicing mining Ghana',
    'heavy equipment maintenance Ghana',
    'crusher maintenance Ghana',
    'grinding mill repair Ghana',
    'conveyor maintenance mining',
    'mining equipment repair Ghana',
    'gearbox repair mine',
    'preventive maintenance mining Ghana',
    'mobile maintenance mining',
    'OEM gearbox parts Ghana',
  ],
  'crusher-seals-installation-and-equipment-protection': [
    'crusher seals Ghana',
    'crusher seals installation',
    'equipment protection mining',
    'crusher seal supplier Ghana',
    'mining crusher seals West Africa',
    'crusher liner protection',
    'dust seals mining Ghana',
    'mining equipment protection Ghana',
    'crusher seal kit Ghana',
    'sealing solutions mining',
  ],
  'procurement-and-supply-chain-management': [
    'mining procurement Ghana',
    'mining supply chain West Africa',
    'procurement management mining',
    'mining consumables procurement',
    'West Africa mining procurement',
    'mining equipment procurement Ghana',
    'mining supply management',
    'strategic procurement mining',
    'logistics mining Ghana',
    'mining supply chain solutions',
  ],
  'technical-consultancy-and-field-support': [
    'mining technical consultancy Ghana',
    'mining field support West Africa',
    'technical consultancy mining Ghana',
    'mining engineering consultancy',
    'mine operations consultancy',
    'mining technical support Ghana',
    'field engineering mining',
    'mine process consultancy',
    'mining advisory services Ghana',
    'technical mining support West Africa',
  ],
};

function titleCase(str: string): string {
  return str
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceDetailsTemplate.find((s) => s.slug === slug);

  if (!service) {
    return { title: 'Service Not Found' };
  }

  const title = titleCase(service.heroTitle);
  const plainDescription = stripHtml(service.description).slice(0, 155);

  return {
    title,
    description: plainDescription,
    keywords: SERVICE_KEYWORDS[slug] ?? [],
    alternates: {
      canonical: `${BASE_URL}/services/${slug}`,
    },
    openGraph: {
      title: `${title} | MASZ-Africa`,
      description: plainDescription,
      url: `${BASE_URL}/services/${slug}`,
      images: [
        {
          url: service.heroImage,
          width: 1200,
          height: 630,
          alt: service.heroAltText,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | MASZ-Africa`,
      description: plainDescription,
      images: [service.heroImage],
    },
  };
}

export function generateStaticParams() {
  return serviceDetailsTemplate.map((s) => ({ slug: s.slug }));
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = serviceDetailsTemplate.find((item) => item.slug === slug);

  if (!service) {
    return <div className="p-20">Service not found: {slug}</div>;
  }

  const title = titleCase(service.heroTitle);
  const plainDescription = stripHtml(service.description).slice(0, 300);

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: title,
    description: plainDescription,
    url: `${BASE_URL}/services/${slug}`,
    image: `${BASE_URL}${service.heroImage}`,
    provider: {
      '@type': 'Organization',
      name: 'MASZ-Africa',
      url: BASE_URL,
    },
    areaServed: [
      { '@type': 'Country', name: 'Ghana' },
      { '@type': 'Place', name: 'West Africa' },
    ],
    serviceType: 'Mining Services',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: `${BASE_URL}/services`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: `${BASE_URL}/services/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ServiceDetailContent service={service} />
    </>
  );
}
