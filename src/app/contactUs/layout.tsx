import type { Metadata } from 'next';

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
    canonical: 'https://maszgh.com/contactUs',
  },
  openGraph: {
    title: 'Contact MASZ-Africa | Mining Operations Support, Ghana',
    description:
      'Get in touch with MASZ-Africa. Based in Tarkwa, Western Region, Ghana. Email admin@maszgh.com or call +233 24 416 3975. We respond within 24 hours.',
    url: 'https://maszgh.com/contactUs',
    images: [
      {
        url: '/homeAssets/Image-4.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact MASZ-Africa',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact MASZ-Africa | Mining Operations Support, Ghana',
    description:
      'Based in Tarkwa, Western Region, Ghana. Email admin@maszgh.com or call +233 24 416 3975.',
    images: ['/homeAssets/Image-4.jpg'],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
