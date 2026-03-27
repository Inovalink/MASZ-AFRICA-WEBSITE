"use client";

import React, { useState, memo, useEffect, useRef } from "react";
import Image from "next/image";

// ─── Shared partner data — single source of truth for both map + marquee ─────

export const PARTNERS = [
  {
    id: 1,
    name: "Aglogold Ashanti",
    address: "House #17, Breeze Street, GT 353-5495, Community 16, Tema",
    lat: 6.7,
    lng: -1.5,
    logo: "",
  },
  {
    id: 2,
    name: "NIO",
    address: "88 Supply District, Shanghai, China",
    lat: 31.2,
    lng: 121.4,
    logo: "/partnerLogos/Partner-2.svg",
  },
  {
    id: 3,
    name: "adidas",
    address: "42 Industrial Way, London, United Kingdom",
    lat: 51.5,
    lng: -0.1,
    logo: "/partnerLogos/Partner-1.svg",
  },
  {
    id: 4,
    name: "DIADORA",
    address: "14 Mine Road, Johannesburg, South Africa",
    lat: -26.2,
    lng: 28.0,
    logo: "",
  },
  {
    id: 5,
    name: "PUMA",
    address: "500 Commerce Blvd, Houston, TX",
    lat: 29.7,
    lng: -95.3,
    logo: "",
  },
  {
    id: 6,
    name: "NIKE",
    address: "25 Mining Ave, Perth, Australia",
    lat: -31.9,
    lng: 115.8,
    logo: "",
  },
];

function toPercent(lat: number, lng: number) {
  return {
    x: ((lng + 180) / 360) * 100,
    y: ((90 - lat) / 180) * 100,
  };
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────

function Tooltip({ name, address }: { name: string; address: string; flipLeft?: boolean }) {
  return (
    <div
      className="absolute z-30 pointer-events-none"
      style={{ bottom: "18px", left: "50%", transform: "translateX(-50%)" }}
    >
      <div className="bg-white shadow-md rounded-[7px] pl-[14px] pr-2 pt-[11px] pb-[13px] w-[220px]">
        <div className="flex items-start gap-[7px] mb-[5px]">
          <span className="text-default-heading leading-tight text-sm-medium">
            {name}
          </span>
        </div>
        <p className="text-default-body text-[10.4px] font-medium leading-snug m-0">
          {address}
        </p>
      </div>
      <div className="flex justify-center">
        <div
          className="w-0 h-0"
          style={{
            borderLeft: "6.5px solid transparent",
            borderRight: "6.5px solid transparent",
            borderTop: "11px solid white",
            filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.08))",
          }}
        />
      </div>
    </div>
  );
}

// ─── Pin ─────────────────────────────────────────────────────────────────────

function Pin({
  partner,
  isActive,
  onEnter,
  onLeave,
}: {
  partner: (typeof PARTNERS)[number];
  isActive: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const { x, y } = toPercent(partner.lat, partner.lng);
  return (
    <div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)" }}
    >
      {/* Pulse ring — always visible, faster when active */}
      <span
        className="absolute rounded-full bg-[#51B948]/25 animate-ping"
        style={{
          width: isActive ? 28 : 20,
          height: isActive ? 28 : 20,
          top: isActive ? -9 : -5,
          left: isActive ? -9 : -5,
          animationDuration: isActive ? "0.8s" : "1.5s",
        }}
        aria-hidden
      />
      <div
        className={[
          "relative rounded-full border-2 border-white cursor-pointer transition-all duration-200",
          isActive
            ? "w-[14px] h-[14px] bg-[#51B948] scale-150"
            : "w-[11px] h-[11px] bg-[#51B948]",
        ].join(" ")}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      />
      {isActive && (
        <Tooltip name={partner.name} address={partner.address} flipLeft={x > 78} />
      )}
    </div>
  );
}

// ─── Marquee ─────────────────────────────────────────────────────────────────

const BG_COLORS = ["#016BF2", "#16a34a"];
const INTERVAL_MS = 3000;
const TRANSITION_MS = 800;

function PartnersMarqueeInline({
  activeId,
  onEnter,
  onLeave,
}: {
  activeId: number | null;
  onEnter: (id: number) => void;
  onLeave: () => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const lastTimeRef = useRef<number>(0);
  const scrollDirRef = useRef<1 | -1>(1);
  const [colorIndex, setColorIndex] = useState(0);
  const speed = 60;

  const scrollingPartners = [...PARTNERS, ...PARTNERS, ...PARTNERS];

  useEffect(() => {
    const id = setInterval(() => {
      setColorIndex((i) => (i + 1) % BG_COLORS.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      scrollDirRef.current = y >= lastY ? 1 : -1;
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let animationFrameId: number;
    const step = (time: number) => {
      const dt = lastTimeRef.current
        ? Math.min((time - lastTimeRef.current) / 1000, 0.1)
        : 0;
      lastTimeRef.current = time;
      const halfWidth = track.scrollWidth / 3;
      if (halfWidth > 0) {
        offsetRef.current += speed * dt * scrollDirRef.current;
        if (offsetRef.current >= halfWidth) offsetRef.current -= halfWidth;
        if (offsetRef.current < 0) offsetRef.current += halfWidth;
        track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      }
      animationFrameId = requestAnimationFrame(step);
    };
    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div
      className="w-full py-5 lg:py-[70px] overflow-hidden"
      style={{
        backgroundColor: BG_COLORS[colorIndex],
        transition: `background-color ${TRANSITION_MS}ms ease-in-out`,
      }}
    >
      <div
        ref={trackRef}
        className="flex items-center gap-16 lg:gap-24 will-change-transform"
        style={{ transition: "none" }}
      >
        {scrollingPartners.map((partner, index) => {
          const isActive = activeId === partner.id;
          return (
            <div
              key={`${partner.id}-${index}`}
              className={[
                "flex items-center gap-3 shrink-0 cursor-pointer transition-opacity duration-200",
                activeId !== null && !isActive ? "opacity-40" : "opacity-100",
              ].join(" ")}
              onMouseEnter={() => onEnter(partner.id)}
              onMouseLeave={onLeave}
            >
              {!partner.logo && (
                <div className="w-3 h-3 rotate-45 bg-white/30" />
              )}
              {partner.logo ? (
                <div className="relative h-8 lg:h-12 w-auto">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={120}
                    height={48}
                    className="object-contain h-full w-auto brightness-0 invert"
                    loading="lazy"
                  />
                </div>
              ) : (
                <span
                  className={[
                    "text-xl-semibold uppercase tracking-wider transition-colors duration-200",
                    isActive ? "text-white" : "text-white/80",
                  ].join(" ")}
                >
                  {partner.name}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function PartnersMapSession() {
  const [activeId, setActiveId] = useState<number | null>(null);

  return (
    <section className="my-[80px] lg:my-[140px]">
      {/* Header */}
      <div className="mx-[22px] lg:mx-[24px] xl:mx-[120px] min-[1920px]:mx-[200px] mb-[32px] lg:mb-[48px]">
        <h2 className="text-xl-semibold lg:text-4xl-semibold uppercase text-default-heading leading-tight mb-[12px]">
          Our <span className="text-primary-default">Partners</span>
        </h2>
        <p className="text-sm-medium lg:text-xl-medium text-default-body leading-relaxed max-w-[656px]">
          Built on trusted relationships across the mining supply chain. From
          sourcing to delivery, our partners ensure reliability at every stage.
          Together, we drive efficiency, safety, and consistent results.
        </p>
      </div>

      {/* Map */}
      <div className="mx-[22px] lg:mx-[24px] xl:mx-[120px] min-[1920px]:mx-[200px] relative   lg:h-[530px] select-none mb-10 lg:mb-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/maszAssets/world-map.svg"
          alt=""
          aria-hidden="true"
          draggable={false}
          className="w-full h-full"
          style={{
            filter:
              "brightness(1) saturate(100%) invert(96%) sepia(0%) saturate(200%) hue-rotate(180deg) brightness(98%) contrast(85%)",
          }}
        />
        <div className="absolute inset-0">
          {PARTNERS.map((partner) => (
            <Pin
              key={partner.id}
              partner={partner}
              isActive={activeId === partner.id}
              onEnter={() => setActiveId(partner.id)}
              onLeave={() => setActiveId(null)}
            />
          ))}
        </div>
      </div>

      {/* Marquee — full bleed, directly below map, shares activeId */}
      <PartnersMarqueeInline
        activeId={activeId}
        onEnter={(id) => setActiveId(id)}
        onLeave={() => setActiveId(null)}
      />
    </section>
  );
}

export default memo(PartnersMapSession);