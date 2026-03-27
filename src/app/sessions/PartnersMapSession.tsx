"use client";

import React, { useState, memo, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

// ─── Shared partner data — single source of truth for both map + marquee ─────
// svgX / svgY are coordinates inside the SVG viewBox (0 0 1010 666),
// derived from each country's SVG path centroid + city-level offset.
export const PARTNERS = [
  { id: 1,  name: "AngloGold Ashanti Ghana",       address: "Community 16, Tema, Ghana",                         svgX: 469, svgY: 446, logo: "" },
  { id: 2,  name: "AngloGold South Africa",         address: "76 Jeppe Street, Johannesburg, South Africa",      svgX: 556, svgY: 543, logo: "/partnerLogos/Partner-2.svg" },
  { id: 3,  name: "Kinross Gold Nigeria",           address: "Victoria Island, Lagos, Nigeria",                  svgX: 483, svgY: 435, logo: "" },
  { id: 4,  name: "Barrick Gold Tanzania",          address: "Msalato Industrial Area, Dodoma, Tanzania",        svgX: 580, svgY: 465, logo: "" },
  { id: 5,  name: "Gold Fields Kenya",              address: "Upper Hill Road, Nairobi, Kenya",                  svgX: 581, svgY: 455, logo: "/partnerLogos/Partner-1.svg" },
  { id: 6,  name: "Endeavour Mining Senegal",       address: "Almadies Zone, Dakar, Senegal",                    svgX: 425, svgY: 416, logo: "" },
  { id: 7,  name: "Perseus Mining Ivory Coast",     address: "Plateau District, Abidjan, Côte d'Ivoire",        svgX: 457, svgY: 443, logo: "" },
  { id: 8,  name: "Hummingbird Resources Mali",     address: "Badalabougou, Bamako, Mali",                       svgX: 466, svgY: 418, logo: "" },
  { id: 9,  name: "Newmont Mining USA",             address: "Greenwood Village, Colorado, USA",                 svgX: 178, svgY: 318, logo: "" },
  { id: 10, name: "Freeport-McMoRan",               address: "Phoenix, Arizona, USA",                            svgX: 164, svgY: 337, logo: "" },
  { id: 11, name: "Coeur Mining Canada",            address: "401 Bay Street, Toronto, Ontario",                 svgX: 240, svgY: 296, logo: "" },
  { id: 12, name: "Vale Brasil",                    address: "Praia de Botafogo 186, Rio de Janeiro, Brazil",    svgX: 335, svgY: 530, logo: "" },
];

const SVG_W = 1010;
const SVG_H = 666;

// ─── Tooltip ──────────────────────────────────────────────────────────────────

function Tooltip({ name, address }: { name: string; address: string }) {
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
  onTap,
}: {
  partner: (typeof PARTNERS)[number];
  isActive: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onTap: () => void;
}) {
  // Convert SVG coordinates → percentage of the SVG viewBox
  const xPct = (partner.svgX / SVG_W) * 100;
  const yPct = (partner.svgY / SVG_H) * 100;

  return (
    <div
      className="absolute"
      style={{
        left: `${xPct}%`,
        top: `${yPct}%`,
        transform: "translate(-50%,-50%)",
        zIndex: isActive ? 50 : 1,
      }}
    >
      {/* Invisible larger hit area for easier hovering + tap */}
      <div
        className="absolute cursor-pointer"
        style={{ width: 30, height: 30, top: -10, left: -10 }}
        onClick={(e) => { e.stopPropagation(); onTap(); }}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      />
      {/* Pulse ring */}
      <span
        className="absolute rounded-full bg-[#51B948]/25 animate-ping pointer-events-none"
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
          "relative rounded-full border-2 border-white pointer-events-none transition-all duration-200",
          isActive
            ? "w-[14px] h-[14px] bg-[#51B948] scale-150"
            : "w-[11px] h-[11px] bg-[#51B948]",
        ].join(" ")}
      />
      {isActive && (
        <Tooltip name={partner.name} address={partner.address} />
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
  onTap,
  isPaused,
}: {
  activeId: number | null;
  onEnter: (id: number) => void;
  onLeave: () => void;
  onTap: (id: number) => void;
  isPaused: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const lastTimeRef = useRef<number>(0);
  const scrollDirRef = useRef<1 | -1>(1);
  const pausedRef = useRef(isPaused);
  const [colorIndex, setColorIndex] = useState(0);
  const speed = 60;

  // Keep ref in sync with prop
  useEffect(() => { pausedRef.current = isPaused; }, [isPaused]);

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
      if (halfWidth > 0 && !pausedRef.current) {
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
              onClick={(e) => { e.stopPropagation(); onTap(partner.id); }}
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
  // "locked" means a tap selected a partner (persists until tapped again)
  const [lockedId, setLockedId] = useState<number | null>(null);

  // The visible active partner = locked selection OR hover
  const visibleId = lockedId ?? activeId;

  const handleTap = useCallback((id: number) => {
    setLockedId((prev) => (prev === id ? null : id));
  }, []);

  // Click anywhere outside a pin / marquee item dismisses the lock
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (lockedId === null) return;
    const handleClickOutside = (e: MouseEvent) => {
      // Let pin / marquee onClick handlers run first via stopPropagation;
      // if the click reaches the document, nothing interactive was tapped.
      setLockedId(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [lockedId]);

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

      {/* Map — aspect-ratio locked to match SVG viewBox so % pins align */}
      <div
        className="mx-auto relative select-none mb-10 lg:mb-20"
        style={{ aspectRatio: `${SVG_W} / ${SVG_H}`, maxHeight: 530 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/maszAssets/world-map.svg"
          alt=""
          aria-hidden="true"
          draggable={false}
          className="absolute inset-0 w-full h-full"
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
              isActive={visibleId === partner.id}
              onEnter={() => setActiveId(partner.id)}
              onLeave={() => setActiveId(null)}
              onTap={() => handleTap(partner.id)}
            />
          ))}
        </div>
      </div>

      {/* Marquee — full bleed, directly below map, shares activeId */}
      <PartnersMarqueeInline
        activeId={visibleId}
        onEnter={(id) => setActiveId(id)}
        onLeave={() => setActiveId(null)}
        onTap={handleTap}
        isPaused={lockedId !== null}
      />
    </section>
  );
}

export default memo(PartnersMapSession);