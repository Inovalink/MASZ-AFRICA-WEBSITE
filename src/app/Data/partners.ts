// ─── Partner data — single source of truth ────────────────────────────────────
// Used by: PartnersMapSession (map pins + marquee) and TestimonialSession (cards)
//
// logoHeight     : logo height (px) in the marquee strip
// cardLogoHeight : logo height (px) in testimonial cards
// noInvert       : true = skip brightness-0/invert filter (logos with solid backgrounds)
// lat / lon      : geographic coordinates used for amCharts map pins

export type PartnerTestimonial = {
  subtext: string;
  picture: string;
  personName: string;
  position: string;
};

export type Partner = {
  id: number;
  name: string;
  address: string;
  logo: string;
  logoHeight: number;
  cardLogoHeight: number;
  noInvert: boolean;
  lat: number;
  lon: number;
  testimonial: PartnerTestimonial | null;
};

export const PARTNERS: Partner[] = [
  {
    id: 1,
    name: "Asantegold Bibiani",
    address: "No. 19 Abidjan Avenue East Legon, Accra - Ghana",
    logo: "/partnerLogos/Asante_Gold_Bibiani_logo.png",
    logoHeight: 45,
    cardLogoHeight: 80,
    noInvert: false,
    lat: 5.636277733719174, lon: -0.1612652082713351,
    testimonial: {
      subtext: "MASZ-Africa has been one of the most reliable suppliers we've worked with. Every product we receive is authentic, traceable, and exactly as specified. Their on-time delivery record has helped us avoid unnecessary downtime, and their communication is always clear and professional.",
      picture: "/homeAssets/Picture-1.jpg",
      personName: "Samuel Okwabeng",
      position: "CEO",
    },
  },
  {
    id: 2,
    name: "Damang Goldfields",
    address: "16 Amber Street, Roman Ridge, Ghana",
    logo: "/partnerLogos/Damang_Gold_Fields_Logo.png",
    logoHeight: 85,
    cardLogoHeight: 80,
    noInvert: false,
    lat: 5.671093651119249, lon: -0.3374425248033329,
    testimonial: {
      subtext: "What sets MASZ-Africa apart is their deep understanding of mining operations. They don't just deliver products — they deliver the right products. Their technical team helped us select the optimal grinding media for our mill, which reduced wear rates significantly and improved throughput.",
      picture: "/homeAssets/Picture-2.jpg",
      personName: "Kwame Asante",
      position: "Plant Manager",
    },
  },
  {
    id: 3,
    name: "Asanko Mines",
    address: "Manso-Nkwanta, Ghana",
    logo: "/partnerLogos/Asanko_Mines_logo.png",
    logoHeight: 35,
    cardLogoHeight: 30,
    noInvert: false,
    lat: 6.345564949990798, lon: -1.989121870967129,
    testimonial: {
      subtext: "We've partnered with MASZ-Africa across several of our operations in Ghana. Their logistics team consistently meets tight delivery windows, even in remote locations. The quality of their activated carbon has been exceptional — recovery rates have remained well above our benchmarks.",
      picture: "/homeAssets/Picture-3.jpg",
      personName: "Adaeze Nwosu",
      position: "Supply Chain Director",
    },
  },
  {
    id: 4,
    name: "Asantegold Chirano",
    address: "No. 19 Abidjan Avenue East Legon, Accra - Ghana",
    logo: "/partnerLogos/Asante_Gold_Bibiani_logo.png",
    logoHeight: 45,
    cardLogoHeight: 80,
    noInvert: false,
    lat: 5.636277733719174, lon: -0.1612652082713351,
    testimonial: null,
  },
  {
    id: 5,
    name: "Adamus Resources",
    address: "35 Nortei Ababio St, Accra",
    logo: "/partnerLogos/Adamus_Resources_Limited_logo.png",
    logoHeight: 50,
    cardLogoHeight: 43,
    noInvert: false,
    lat: 5.611451894178936, lon: -0.1838613674525461,
    testimonial: {
      subtext: "The gearbox servicing team from MASZ-Africa turned around a critical mill repair in under 48 hours, preventing what could have been a week-long production halt. Their technicians are knowledgeable, fast, and safety-conscious. We've made them our go-to maintenance partner.",
      picture: "/homeAssets/Picture-4.jpg",
      personName: "Kofi Mensah",
      position: "Maintenance Superintendent",
    },
  },
  {
    id: 6,
    name: "Perseus Mining",
    address: "4 Chancery Court, 147A Giffard Road, East Cantonments, Accra",
    logo: "/partnerLogos/Perseus_Mining_Limited_logo.png",
    logoHeight: 45,
    cardLogoHeight: 35,
    noInvert: false,
    lat: 5.616422690357834, lon: -0.17913601382660338,
    testimonial: {
      subtext: "MASZ-Africa helped us transition from multiple fragmented suppliers to a single reliable partner. The cost savings have been significant, but more importantly, we now have consistent product quality and a team that understands our site requirements. They are a true operational extension of our business.",
      picture: "/homeAssets/Picture-7.jpg",
      personName: "Bernard Tetteh",
      position: "General Manager",
    },
  },
  {
    id: 7,
    name: "Zijin Golden Ridge",
    address: "18, Airport, Dr Quartey Papafio Ave, Accra",
    logo: "/partnerLogos/Zijin_Golden_Ridge_Limited_logo.png",
    logoHeight: 45,
    cardLogoHeight: 45,
    noInvert: false,
    lat: 5.6033426561287785, lon: -0.1821652426626137,
    testimonial: null,
  },
  {
    id: 8,
    name: "Golden Star Resources",
    address: "Wassa, Western Region, Ghana",
    logo: "/partnerLogos/Golden_Star_Resources_Limited_logo.png",
    logoHeight: 42,
    cardLogoHeight: 30,
    noInvert: false,
    lat: 5.559221155012598, lon: -1.698523005575312,
    testimonial: {
      subtext: "Procurement has always been a pain point for us in this region, but MASZ-Africa changed that. They handle everything — sourcing, customs, delivery — with minimal input from our side. The steel pipes they supply meet international specs and arrive in perfect condition every time.",
      picture: "/homeAssets/Picture-5.jpg",
      personName: "Emeka Okafor",
      position: "Operations Manager",
    },
  },
  {
    id: 9,
    name: "Newmont Ahafo",
    address: "8th Floor, Standard Chartered Bank (SCB), Head Office Building, 87 Independence Avenue, Liberation Rd, Accra",
    logo: "/partnerLogos/Newmont_Coporation_Ahafo_logo.png",
    logoHeight: 50,
    cardLogoHeight: 45,
    noInvert: false,
    lat: 5.5720357461606245, lon: -0.1909134578449212,
    testimonial: {
      subtext: "I've worked with many suppliers across the continent and MASZ-Africa stands out for one reason: accountability. If there's ever an issue, it's resolved before it becomes a problem. Their proactive approach to service and communication gives us confidence that our operations won't be disrupted.",
      picture: "/homeAssets/Picture-6.jpg",
      personName: "Fatima Diallo",
      position: "Head of Procurement",
    },
  },
];

// Pre-filtered list for testimonial cards — only partners with testimonial content
export const TESTIMONIALS = PARTNERS.filter(
  (p): p is Partner & { testimonial: PartnerTestimonial } => p.testimonial !== null
);
