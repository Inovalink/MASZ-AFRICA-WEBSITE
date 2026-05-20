import type { Metadata } from 'next';

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
    canonical: 'https://maszgh.com/services',
  },
  openGraph: {
    title: 'Mining Products & Services | MASZ-Africa Ghana',
    description:
      'Grinding media, activated carbon, steel pipes, gearbox servicing, crusher seals, procurement, and technical consultancy for mines across Ghana and West Africa.',
    url: 'https://maszgh.com/services',
    images: [
      {
        url: '/homeAssets/Image-4.webp',
        width: 1200,
        height: 630,
        alt: 'MASZ-Africa Mining Products and Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mining Products & Services | MASZ-Africa Ghana',
    description:
      'Grinding media, activated carbon, steel pipes, gearbox servicing, and more — trusted mining services across Ghana and West Africa.',
    images: ['/homeAssets/Image-4.webp'],
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
