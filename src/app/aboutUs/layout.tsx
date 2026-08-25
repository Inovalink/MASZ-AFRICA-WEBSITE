import type { Metadata } from "next";

const BASE_URL = "https://www.maszgh.com";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "MASZ-Africa is a trusted mining supply and services company headquartered in Tarkwa, Western Region, Ghana. We deliver certified consumables, technical expertise, and reliable operational support to mines across West Africa.",
  keywords: [
    "about MASZ-Africa",
    "mining company Ghana",
    "mining supplier West Africa",
    "Tarkwa mining company",
    "Ghana mining services company",
    "MASZ Africa about",
    "mining consumables company Ghana",
    "West Africa mining supply company",
  ],
  alternates: {
    canonical: `${BASE_URL}/aboutUs`,
  },
  openGraph: {
    title: "About MASZ-Africa | Mining Supply & Services Experts, Ghana",
    description:
      "MASZ-Africa is a trusted mining supply and services company headquartered in Tarkwa, Western Region, Ghana. We deliver certified consumables, technical expertise, and reliable support to mines across West Africa.",
    url: `${BASE_URL}/aboutUs`,
  },
  twitter: {
    card: "summary_large_image",
    title: "About MASZ-Africa | Mining Supply & Services Experts, Ghana",
    description:
      "MASZ-Africa is a trusted mining supply and services company headquartered in Tarkwa, Western Region, Ghana.",
  },
};

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About MASZ-Africa",
  description:
    "MASZ-Africa is a trusted mining supply and services company headquartered in Tarkwa, Western Region, Ghana.",
  url: `${BASE_URL}/aboutUs`,
  mainEntity: {
    "@type": "Organization",
    name: "MASZ-Africa",
    url: BASE_URL,
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "House #17, Breeze Street, GT 353-5495, Community 16, Terno",
      postOfficeBoxNumber: "P.O. Box 729",
      addressLocality: "Tarkwa",
      addressRegion: "Western Region",
      addressCountry: "GH",
    },
    telephone: "+233244163975",
    email: "info@maszgh.com",
  },
};

const aboutBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "About Us",
      item: `${BASE_URL}/aboutUs`,
    },
  ],
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutBreadcrumb) }}
      />
      {children}
    </>
  );
}
