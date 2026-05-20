import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'MASZ-Africa is a trusted mining supply and services company headquartered in Tarkwa, Western Region, Ghana. We deliver certified consumables, technical expertise, and reliable operational support to mines across West Africa.',
  keywords: [
    'about MASZ-Africa',
    'mining company Ghana',
    'mining supplier West Africa',
    'Tarkwa mining company',
    'Ghana mining services company',
    'MASZ Africa about',
    'mining consumables company Ghana',
    'West Africa mining supply company',
  ],
  alternates: {
    canonical: 'https://maszgh.com/aboutUs',
  },
  openGraph: {
    title: 'About MASZ-Africa | Mining Supply & Services Experts, Ghana',
    description:
      'MASZ-Africa is a trusted mining supply and services company headquartered in Tarkwa, Western Region, Ghana. We deliver certified consumables, technical expertise, and reliable support to mines across West Africa.',
    url: 'https://maszgh.com/aboutUs',
    images: [
      {
        url: '/homeAssets/Image-4.jpg',
        width: 1200,
        height: 630,
        alt: 'MASZ-Africa — About Us',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About MASZ-Africa | Mining Supply & Services Experts, Ghana',
    description:
      'MASZ-Africa is a trusted mining supply and services company headquartered in Tarkwa, Western Region, Ghana.',
    images: ['/homeAssets/Image-4.jpg'],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
