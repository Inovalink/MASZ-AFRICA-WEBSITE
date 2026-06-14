"use client";

import React, { useState, memo, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import HeaderLineByLineAnimation from "../animations/HeaderLineByLineAnimation";
import LineByLineText from "../components/LineByLineText";

// ─── Shared partner data — single source of truth for both map + marquee ─────
// svgX / svgY are coordinates inside the SVG viewBox (0 0 1010 666),
// derived from each country's SVG path centroid + city-level offset.
export const PARTNERS = [
  { id: 1,  name: "Asantegold Bibiani",  address: "No. 19 Abidjan Avenue East Legon, Accra - Ghana",             svgX: 478, svgY: 431, logo: "/partnerLogos/Asante_Gold_Bibiani_logo.png", logoHeight: 90 },
  { id: 2,  name: "Damang Goldfields",  address: "16 Amber Street, Roman Ridge, Ghana",                          svgX: 474, svgY: 435, logo: "/partnerLogos/Damang_Gold_Fields_Logo.png",  logoHeight: 90 },
  { id: 3,  name: "Asanko Mines",       address: "#4 Sir Arku Korsah Road, Airport Residential Area, Accra, Ghana", svgX: 476, svgY: 433, logo: "/partnerLogos/Asanko_Mines_logo.png",      logoHeight: 48 },
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

  const scrollingPartners = [...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS];

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
      const halfWidth = track.scrollWidth / 6;
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
        className="flex items-center h-16 gap-16 lg:gap-24 will-change-transform"
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
                <div className="relative flex items-center">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={120}
                    height={partner.logoHeight ?? 48}
                    style={{ height: `${partner.logoHeight ?? 48}px`, width: "auto" }}
                    className="object-contain brightness-0 invert"
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
  const [lockedId, setLockedId] = useState<number | null>(null);
  const [startTextAnimation, setStartTextAnimation] = useState(false);
  const [startSubtextAnimation, setStartSubtextAnimation] = useState(false);

  const visibleId = lockedId ?? activeId;

  const handleTap = useCallback((id: number) => {
    setLockedId((prev) => (prev === id ? null : id));
  }, []);

  const onHeaderComplete = useCallback(() => {
    setStartSubtextAnimation(true);
  }, []);

  const sectionRef = useRef<HTMLElement>(null);

  // Self-trigger animations when the section scrolls into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartTextAnimation(true);
          io.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (lockedId === null) return;
    const handleClickOutside = () => setLockedId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [lockedId]);

  return (
    <section ref={sectionRef} className="my-[80px] lg:my-[140px]">
      {/* Header */}
      <div className="mx-[22px] lg:mx-[24px] md:flex md:justify-between md:gap-[50] xl:mx-[120px] min-[1920px]:mx-[200px] mb-[32px] lg:mb-[72px]">
        <div className="section-header uppercase text-xl-semibold leading-[110%] lg:text-4xl-semibold tracking-tight mb-[12px]">
          <HeaderLineByLineAnimation
            startAnimation={startTextAnimation}
            onComplete={onHeaderComplete}
            lineY={28}
            duration={0.3}
            stagger={0.07}
            delay={0.1}
            style={{ overflow: 'hidden' }}
          >
            Our <span className="text-primary-default">Partners</span>
          </HeaderLineByLineAnimation>
        </div>
        <div className="max-w-[656px] w-full">
          <LineByLineText
            startAnimation={startSubtextAnimation}
            duration={0.13}
            stagger={0.05}
            className="text-sm-medium lg:text-xl-medium text-default-body leading-[120%]"
          >
            Built on trusted relationships across the mining value chain. From
            sourcing to delivery, our partners ensure reliability at every stage.
            Together, we drive efficiency, safety, and consistent results.
          </LineByLineText>
        </div>
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