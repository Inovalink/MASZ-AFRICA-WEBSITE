"use client";

import React, { useState, memo, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import HeaderLineByLineAnimation from "../animations/HeaderLineByLineAnimation";
import LineByLineText from "../components/LineByLineText";
import { PARTNERS } from "../Data/partners";
export type { Partner as PartnerType } from "../Data/partners";

// ─── amCharts 5 imports ───────────────────────────────────────────────────────
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5geodata_ghanaLow from "@amcharts/amcharts5-geodata/ghanaLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";



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

  useEffect(() => {
    pausedRef.current = isPaused;
  }, [isPaused]);

  const scrollingPartners = [
    ...PARTNERS,
    ...PARTNERS,
    ...PARTNERS,
    ...PARTNERS,
    ...PARTNERS,
    ...PARTNERS,
  ];

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
        className="flex items-center h-16 gap-12! md:gap-16! lg:gap-24! xl:gap-30! will-change-transform"
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
              onClick={(e) => {
                e.stopPropagation();
                onTap(partner.id);
              }}
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
                    width={0}
                    height={0}
                    sizes="200px"
                    style={{ height: `${partner.logoHeight}px`, width: "auto" }}
                    className={`object-contain ${
                      partner.noInvert ? "" : "brightness-0 invert"
                    }`}
                    loading="eager"
                    unoptimized
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
  const [hoveredPin, setHoveredPin] = useState<{
    name: string;
    address: string;
    x: number;
    y: number;
  } | null>(null);

  // ── amCharts instance refs ────────────────────────────────────────────────
  const chartDivRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<am5map.MapChart | null>(null);
  const worldSeriesRef = useRef<am5map.MapPolygonSeries | null>(null);
  const countrySeriesRef = useRef<am5map.MapPolygonSeries | null>(null);
  const worldPinsRef = useRef<am5map.MapPointSeries | null>(null);
  const ghanaPinsRef = useRef<am5map.MapPointSeries | null>(null);
  const bulletContainersRef = useRef<Map<number, am5.Container>>(new Map());

  // ── amCharts 5 drill-down map ─────────────────────────────────────────────
  useEffect(() => {
    const el = chartDivRef.current;
    if (!el) return;
    const bulletContainers = bulletContainersRef.current;

    // ── Root ───────────────────────────────────────────────────────────────
    const root = am5.Root.new(el);
    // NOTE: for production replace this with am5.addLicense("key") before Root.new()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (root as any)._logo?.dispose();

    root.setThemes([am5themes_Animated.new(root)]);
    root.container.set(
      "background",
      am5.Rectangle.new(root, { fillOpacity: 0, strokeOpacity: 0 })
    );

    // ── Chart — user interaction locked; only programmatic zoom allowed ────
    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        projection: am5map.geoNaturalEarth1(),
        panX: "none",
        panY: "none",
        wheelY: "none",
        pinchZoom: false,
        maxZoomLevel: 64,
      })
    );
    chart.get("background")?.setAll({ fillOpacity: 0, strokeOpacity: 0 });
    chartRef.current = chart;

    // ── Shared bullet factory ─────────────────────────────────────────────
    const makeBullet = (
      _rt: am5.Root,
      _sr: am5map.MapPointSeries,
      dataItem: am5.DataItem<am5map.IMapPointSeriesDataItem>
    ): am5.Bullet => {
      const ctx = dataItem.dataContext as {
        title?: string;
        name?: string;
        address?: string;
        partnerId?: number;
      };
      const pinName = ctx.name ?? ctx.title ?? "";
      const pinAddress = ctx.address ?? "";
      const partnerId = ctx.partnerId;

      const container = am5.Container.new(root, {
        cursorOverStyle: "pointer",
        interactive: true,
      });
      container.states.create("hover", { scale: 1.5 });

      const ping = container.children.push(
        am5.Circle.new(root, {
          radius: 8,
          fill: am5.color(0x51b948),
          fillOpacity: 0.25,
        })
      );
      ping.animate({
        key: "scale",
        from: 1,
        to: 2.5,
        duration: 1500,
        loops: Infinity,
      });
      ping.animate({
        key: "fillOpacity",
        from: 0.25,
        to: 0,
        duration: 1500,
        loops: Infinity,
      });
      container.children.push(
        am5.Circle.new(root, {
          radius: 5,
          fill: am5.color(0x51b948),
          stroke: am5.color(0xffffff),
          strokeWidth: 2,
        })
      );
      container.events.on("pointerover", () => {
        const pos = container.toGlobal({ x: 0, y: 0 });
        setHoveredPin({
          name: pinName,
          address: pinAddress,
          x: (pos.x / el.offsetWidth) * 100,
          y: (pos.y / el.offsetHeight) * 100,
        });
      });
      container.events.on("pointerout", () => setHoveredPin(null));
      if (partnerId !== undefined) bulletContainers.set(partnerId, container);
      return am5.Bullet.new(root, { sprite: container });
    };

    // ── World series (continent-coloured polygons) ─────────────────────────
    const worldSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, { geoJSON: am5geodata_worldLow })
    );
    worldSeriesRef.current = worldSeries;

    worldSeries.mapPolygons.template.setAll({
      fill: am5.color(0xdfdfdf),
      stroke: am5.color(0xffffff),
      strokeWidth: 0.5,
      interactive: false,
    });

    // ── World-view pins (test dataset — visible before drill-in) ──────────
    const worldPins = chart.series.push(
      am5map.MapPointSeries.new(root, {
        latitudeField: "latitude",
        longitudeField: "longitude",
      })
    );
    worldPinsRef.current = worldPins;
    worldPins.bullets.push(makeBullet);
    worldPins.data.setAll([]);

    // ── Ghana detail series (hidden until drill-in) ───────────────────────
    const countrySeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_ghanaLow,
        visible: false,
      })
    );
    countrySeriesRef.current = countrySeries;

    countrySeries.mapPolygons.template.setAll({
      fill: am5.color(0xdfdfdf),
      stroke: am5.color(0xffffff),
      strokeWidth: 0.5,
      interactive: false,
    });

    // ── Ghana partner pins (visible only in country view) ─────────────────
    const ghanaPins = chart.series.push(
      am5map.MapPointSeries.new(root, {
        latitudeField: "latitude",
        longitudeField: "longitude",
        visible: false,
      })
    );
    ghanaPinsRef.current = ghanaPins;
    ghanaPins.bullets.push(makeBullet);
    ghanaPins.data.setAll(
      PARTNERS.map((p) => ({
        latitude: p.lat,
        longitude: p.lon,
        title: p.name,
        address: p.address,
        partnerId: p.id,
      }))
    );

    // ── Drill-in function — hides world, shows Ghana ───────────────────────
    let drilled = false; // Strict Mode guard: fire once even if effect runs twice
    const drillIntoGhana = () => {
      if (drilled) return;
      drilled = true;
      // Brief pause on world map, then fade and zoom into Ghana.
      setTimeout(() => {
        worldSeries.hide(500);
        worldPins.hide(500);
        setTimeout(() => {
          countrySeries.show();
          ghanaPins.show();
          chart.zoomToGeoBounds(
            { left: -4.2, right: 2.2, top: 12.0, bottom: 4.0 },
            1400
          );
        }, 200);
      }, 600);
    };

    // ── Scroll-triggered drill-in ─────────────────────────────────────────
    // Attach observer only after world geodata loads so zoomToGeoBounds is safe.
    let ioRef: IntersectionObserver | null = null;
    worldSeries.events.once("datavalidated", () => {
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            drillIntoGhana();
            io.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      io.observe(el);
      ioRef = io;
    });

    chart.appear(800, 0);

    return () => {
      ioRef?.disconnect();
      root.dispose();
      chartRef.current = null;
      worldSeriesRef.current = null;
      countrySeriesRef.current = null;
      worldPinsRef.current = null;
      ghanaPinsRef.current = null;
      bulletContainers.clear();
    };
  }, []);

  const sectionRef = useRef<HTMLElement>(null);
  const lockedIdRef = useRef<number | null>(null);

  // Reads refs inside an event-handler callback — not during render, lint-safe.
  const showMarqueeTooltip = useCallback((id: number | null) => {
    if (id === null) {
      setHoveredPin(null);
      return;
    }
    const container = bulletContainersRef.current.get(id);
    const el = chartDivRef.current;
    if (!container || !el || el.offsetWidth === 0) return;
    const pos = container.toGlobal({ x: 0, y: 0 });
    const x = (pos.x / el.offsetWidth) * 100;
    const y = (pos.y / el.offsetHeight) * 100;
    if (x <= 0 || y <= 0) return;
    const partner = PARTNERS.find((p) => p.id === id);
    if (partner)
      setHoveredPin({ name: partner.name, address: partner.address, x, y });
  }, []);

  const handleTap = useCallback(
    (id: number) => {
      const next = lockedIdRef.current === id ? null : id;
      lockedIdRef.current = next;
      setLockedId(next);
      showMarqueeTooltip(next);
    },
    [showMarqueeTooltip]
  );

  const onHeaderComplete = useCallback(() => {
    setStartSubtextAnimation(true);
  }, []);

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
    const handleClickOutside = () => {
      lockedIdRef.current = null;
      setLockedId(null);
      setHoveredPin(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [lockedId]);

  return (
    <section ref={sectionRef} className="my-[80px] lg:my-[140px]">
      {/* Header */}
      <div className="mx-[22px] lg:mx-[24px] md:flex md:justify-between md:gap-[50] xl:mx-[120px] min-[1920px]:mx-[200px]  ">
        <div className="section-header uppercase text-xl-semibold leading-[110%] lg:text-4xl-semibold tracking-tight mb-[12px]">
          <HeaderLineByLineAnimation
            startAnimation={startTextAnimation}
            onComplete={onHeaderComplete}
            lineY={28}
            duration={0.3}
            stagger={0.07}
            delay={0.1}
            style={{ overflow: "hidden" }}
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
            sourcing to delivery, our partners ensure reliability at every
            stage. Together, we drive efficiency, safety, and consistent
            results.
          </LineByLineText>
        </div>
      </div>

      {/*
       * ── OLD MAP IMPLEMENTATION (world SVG + clustered pins) ──────────────
       * Kept commented out for rollback. To restore: uncomment this block,
       * remove the NEW IMPLEMENTATION block below, and remove isZoomed state.
       * ─────────────────────────────────────────────────────────────────────
      <div
        className="mx-auto relative select-none mb-10 lg:mb-20"
        style={{ aspectRatio: `${SVG_W} / ${SVG_H}`, maxHeight: 530 }}
      >
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
              isGhana={false}
            />
          ))}
        </div>
      </div>
       * ── END OLD MAP IMPLEMENTATION ───────────────────────────────────────
       */}

      {/*
       * ── GHANA MAP (static SVG + custom CSS pins) ──────────────────────────
       * Kept for rollback. Swap this comment block with the amCharts block
       * below to restore.
       * ──────────────────────────────────────────────────────────────────────
      <div
        className="mx-auto relative select-none mb-10 lg:mb-20"
        style={{ aspectRatio: `${GHANA_VB_W} / ${GHANA_VB_H}`, maxHeight: 650, maxWidth: 390 }}
      >
        <img src="/ghanaLow.svg" alt="" aria-hidden="true" draggable={false}
          className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0">
          {PARTNERS.map((partner) => (
            <Pin key={partner.id} partner={partner} isActive={visibleId === partner.id}
              onEnter={() => setActiveId(partner.id)} onLeave={() => setActiveId(null)}
              onTap={() => handleTap(partner.id)} isGhana />
          ))}
        </div>
      </div>
       */}

      {/* amCharts 5 — world view auto-drills into Ghana on scroll */}
      <div
        className="mx-auto select-none   w-full  relative"
        style={{ aspectRatio: "16 / 9", maxHeight: 650 }}
      >
        <div ref={chartDivRef}  style={{ width: "100%", height: "100%" }} />
        {hoveredPin && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: `${hoveredPin.x}%`,
              top: `${hoveredPin.y}%`,
              zIndex: 50,
            }}
          >
            <Tooltip name={hoveredPin.name} address={hoveredPin.address} />
          </div>
        )}
      </div>

      {/* Marquee */}
      <PartnersMarqueeInline
        activeId={visibleId}
        onEnter={(id) => {
          setActiveId(id);
          if (lockedIdRef.current === null) showMarqueeTooltip(id);
        }}
        onLeave={() => {
          setActiveId(null);
          if (lockedIdRef.current === null) showMarqueeTooltip(null);
        }}
        onTap={handleTap}
        isPaused={lockedId !== null}
      />
    </section>
  );
}

export default memo(PartnersMapSession);
