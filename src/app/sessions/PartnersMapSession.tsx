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

/** Full Ghana bounds — default overview after drill-in. */
function getGhanaDrillBounds() {
  return { left: -4.2, right: 2.2, top: 12.0, bottom: 4.0 };
}

/** Tight bounds around a single partner for hover / click zoom. */
function getPartnerZoomBounds(partner: { lat: number; lon: number }) {
  const padLon = 0.2;
  const padLat = 0.16;
  return {
    left: partner.lon - padLon,
    right: partner.lon + padLon,
    bottom: partner.lat - padLat,
    top: partner.lat + padLat,
  };
}



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
  marqueeRef,
  activeId,
  onEnter,
  onLeave,
  onTap,
  isPaused,
}: {
  marqueeRef?: React.RefObject<HTMLDivElement | null>;
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
      ref={marqueeRef}
      className="w-full py-5 lg:py-[70px] overflow-hidden"
      style={{
        backgroundColor: BG_COLORS[colorIndex],
        transition: `background-color ${TRANSITION_MS}ms ease-in-out`,
      }}
    >
      <div
        ref={trackRef}
        className="flex items-center h-11 md:h-16 gap-12! md:gap-16! lg:gap-24! xl:gap-30! will-change-transform"
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
                <div
                  className="relative flex items-center"
                  style={{ ["--logo-h" as string]: `${partner.logoHeight}px` }}
                >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={0}
                    height={0}
                    sizes="200px"
                    className={`partners-marquee-logo object-contain ${
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

/** Which partner tooltips to show at once (locked pin stays visible while previewing others). */
function getVisibleTooltipIds(
  locked: number | null,
  pinHover: number | null,
  active: number | null
): number[] {
  const ids = new Set<number>();
  if (locked !== null) ids.add(locked);
  if (pinHover !== null) ids.add(pinHover);
  if (locked === null && pinHover === null && active !== null) ids.add(active);
  return Array.from(ids);
}

type PinTooltip = {
  id: number;
  name: string;
  address: string;
  x: number;
  y: number;
};

// ─── Main Component ───────────────────────────────────────────────────────────
function PartnersMapSession() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [lockedId, setLockedId] = useState<number | null>(null);
  const [pinHoverId, setPinHoverId] = useState<number | null>(null);
  const [startTextAnimation, setStartTextAnimation] = useState(false);
  const [startSubtextAnimation, setStartSubtextAnimation] = useState(false);
  const visibleId = lockedId ?? activeId;
  /** Marquee hover + click lock zoom; pin hover does not. */
  const zoomTargetId = lockedId ?? activeId;
  const [pinTooltips, setPinTooltips] = useState<PinTooltip[]>([]);

  // ── amCharts instance refs ────────────────────────────────────────────────
  const chartDivRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<am5map.MapChart | null>(null);
  const worldSeriesRef = useRef<am5map.MapPolygonSeries | null>(null);
  const countrySeriesRef = useRef<am5map.MapPolygonSeries | null>(null);
  const worldPinsRef = useRef<am5map.MapPointSeries | null>(null);
  const ghanaPinsRef = useRef<am5map.MapPointSeries | null>(null);
  const bulletContainersRef = useRef<Map<number, am5.Container>>(new Map());
  const ghanaDrilledRef = useRef(false);
  const zoomToPartnerRef = useRef<(id: number | null) => void>(() => {});
  const deselectPartnerRef = useRef<() => void>(() => {});
  const pinClickJustRef = useRef(false);
  const lockedIdRef = useRef<number | null>(null);
  const pinHoverIdRef = useRef<number | null>(null);
  const activeIdRef = useRef<number | null>(null);
  const onGhanaDrilledRef = useRef<(() => void) | null>(null);
  const pinHitRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
  const [mapInteractive, setMapInteractive] = useState(false);
  lockedIdRef.current = lockedId;
  pinHoverIdRef.current = pinHoverId;
  activeIdRef.current = activeId;
  onGhanaDrilledRef.current = () => setMapInteractive(true);

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

    // ── Chart — display only; pins are HTML overlays so page scroll is never blocked ────
    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        projection: am5map.geoNaturalEarth1(),
        panX: "none",
        panY: "none",
        wheelX: "none",
        wheelY: "none",
        wheelable: false,
        pinchZoom: false,
        maxZoomLevel: 64,
      })
    );
    chart.get("background")?.setAll({ fillOpacity: 0, strokeOpacity: 0 });
    chart.setAll({
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      interactive: false,
      interactiveChildren: false,
    });
    chart.chartContainer.setAll({ interactive: false, interactiveChildren: false });
    chart.seriesContainer?.setAll({ interactive: false, interactiveChildren: false });
    chartRef.current = chart;

    // ── Shared bullet factory (visual only — clicks handled by HTML overlay) ──
    const makeBullet = (
      _rt: am5.Root,
      _sr: am5.Series,
      dataItem: am5.DataItem<am5map.IMapPointSeriesDataItem>
    ): am5.Bullet => {
      const ctx = dataItem.dataContext as {
        title?: string;
        name?: string;
        address?: string;
        partnerId?: number;
      };
      const partnerId = ctx.partnerId;

      const container = am5.Container.new(root, {
        interactive: false,
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
    worldSeries.setAll({ interactive: false, interactiveChildren: false });

    // ── World-view pins (test dataset — visible before drill-in) ──────────
    const worldPins = chart.series.push(
      am5map.MapPointSeries.new(root, {
        latitudeField: "latitude",
        longitudeField: "longitude",
      })
    );
    worldPinsRef.current = worldPins;
    worldPins.setAll({ interactive: false, interactiveChildren: false });
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
    countrySeries.setAll({ interactive: false, interactiveChildren: false });

    // ── Ghana partner pins (visible only in country view) ─────────────────
    const ghanaPins = chart.series.push(
      am5map.MapPointSeries.new(root, {
        latitudeField: "latitude",
        longitudeField: "longitude",
        visible: false,
      })
    );
    ghanaPinsRef.current = ghanaPins;
    ghanaPins.setAll({ interactive: false, interactiveChildren: false });
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
          try {
            chart.zoomToGeoBounds(getGhanaDrillBounds(), 1400);
          } catch {
            chart.zoomToGeoBounds(getGhanaDrillBounds(), 1400);
          }
          ghanaDrilledRef.current = true;
          onGhanaDrilledRef.current?.();
          zoomToPartnerRef.current = (id) => {
            if (!chartRef.current || !ghanaDrilledRef.current) return;
            if (id === null) {
              chart.zoomToGeoBounds(getGhanaDrillBounds(), 800);
              return;
            }
            const partner = PARTNERS.find((p) => p.id === id);
            if (partner) {
              chart.zoomToGeoBounds(getPartnerZoomBounds(partner), 700);
            }
          };
          const focusId = lockedIdRef.current;
          if (focusId !== null) {
            zoomToPartnerRef.current(focusId);
          }
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
      ghanaDrilledRef.current = false;
      zoomToPartnerRef.current = () => {};
      root.dispose();
      chartRef.current = null;
      worldSeriesRef.current = null;
      countrySeriesRef.current = null;
      worldPinsRef.current = null;
      ghanaPinsRef.current = null;
      bulletContainers.clear();
    };
  }, []);

  useEffect(() => {
    if (!ghanaDrilledRef.current) return;
    zoomToPartnerRef.current(zoomTargetId);
  }, [zoomTargetId]);

  const updatePinTooltips = useCallback(() => {
    const el = chartDivRef.current;
    if (!el || el.offsetWidth === 0) return;

    const ids = getVisibleTooltipIds(
      lockedIdRef.current,
      pinHoverIdRef.current,
      activeIdRef.current
    );

    if (ids.length === 0) {
      setPinTooltips([]);
      return;
    }

    const tips: PinTooltip[] = [];
    for (const id of ids) {
      const container = bulletContainersRef.current.get(id);
      const partner = PARTNERS.find((p) => p.id === id);
      if (!container || !partner) continue;
      const pos = container.toGlobal({ x: 0, y: 0 });
      tips.push({
        id,
        name: partner.name,
        address: partner.address,
        x: (pos.x / el.offsetWidth) * 100,
        y: (pos.y / el.offsetHeight) * 100,
      });
    }
    setPinTooltips(tips);
  }, []);

  /** Sync amCharts pin visuals, HTML hit targets, and tooltip positions. */
  useEffect(() => {
    if (!mapInteractive) return;

    let rafId = 0;
    const tick = () => {
      const el = chartDivRef.current;
      if (el && el.offsetWidth > 0) {
        const locked = lockedIdRef.current;
        const pinHover = pinHoverIdRef.current;
        const active = activeIdRef.current;

        bulletContainersRef.current.forEach((container, id) => {
          const isHighlighted =
            id === pinHover ||
            id === locked ||
            (locked === null && id === active);
          container.states.apply(isHighlighted ? "hover" : "default");
          const btn = pinHitRefs.current.get(id);
          if (!btn) return;
          const pos = container.toGlobal({ x: 0, y: 0 });
          btn.style.left = `${(pos.x / el.offsetWidth) * 100}%`;
          btn.style.top = `${(pos.y / el.offsetHeight) * 100}%`;
        });

        updatePinTooltips();
      }
      rafId = requestAnimationFrame(tick);
    };
    tick();

    return () => cancelAnimationFrame(rafId);
  }, [mapInteractive, updatePinTooltips]);

  const sectionRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const deselectPartner = useCallback(() => {
    lockedIdRef.current = null;
    setLockedId(null);
    setActiveId(null);
    setPinHoverId(null);
    setPinTooltips([]);
    if (ghanaDrilledRef.current) {
      zoomToPartnerRef.current(null);
    }
  }, []);

  const handleTap = useCallback(
    (id: number) => {
      if (lockedIdRef.current === id) {
        deselectPartner();
        return;
      }
      lockedIdRef.current = id;
      setLockedId(id);
      setActiveId(id);
      setPinHoverId(id);
      if (ghanaDrilledRef.current) {
        zoomToPartnerRef.current(id);
      }
    },
    [deselectPartner]
  );

  deselectPartnerRef.current = deselectPartner;

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

    const handleClickOutside = (e: MouseEvent) => {
      if (marqueeRef.current?.contains(e.target as Node)) return;
      if (mapContainerRef.current?.contains(e.target as Node)) return;
      deselectPartner();
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [lockedId, deselectPartner]);

  const handleMapBackgroundClick = useCallback(() => {
    if (pinClickJustRef.current) return;
    if (lockedIdRef.current !== null) {
      deselectPartner();
    }
  }, [deselectPartner]);

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
        ref={mapContainerRef}
        className="partners-map-container mx-auto w-full relative overflow-hidden mt-[28px] md:mt-[40px]"
        onClick={handleMapBackgroundClick}
      >
        <div className="partners-map-mask partners-map-chart-layer absolute inset-0">
          <div ref={chartDivRef} className="h-full w-full" />
        </div>
        {mapInteractive && (
          <div className="absolute inset-0 z-20 pointer-events-none">
            {PARTNERS.map((partner) => (
              <button
                key={partner.id}
                ref={(node) => {
                  if (node) pinHitRefs.current.set(partner.id, node);
                  else pinHitRefs.current.delete(partner.id);
                }}
                type="button"
                aria-label={partner.name}
                className="partners-map-pin-hit absolute h-[22px] w-[22px] -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border-0 bg-transparent p-0 pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  pinClickJustRef.current = true;
                  handleTap(partner.id);
                  queueMicrotask(() => {
                    pinClickJustRef.current = false;
                  });
                }}
                onMouseEnter={() => setPinHoverId(partner.id)}
                onMouseLeave={() => {
                  if (lockedIdRef.current !== partner.id) {
                    setPinHoverId(null);
                  }
                }}
              />
            ))}
          </div>
        )}
        <div className="partners-map-edge-fade-top" aria-hidden />
        <div className="partners-map-edge-fade-bottom" aria-hidden />
        <div className="partners-map-edge-fade-left" aria-hidden />
        <div className="partners-map-edge-fade-right" aria-hidden />
        {pinTooltips.map((tip) => (
          <div
            key={tip.id}
            className="absolute pointer-events-none z-[60]"
            style={{
              left: `${tip.x}%`,
              top: `${tip.y}%`,
            }}
          >
            <Tooltip name={tip.name} address={tip.address} />
          </div>
        ))}
      </div>

      {/* Marquee */}
      <PartnersMarqueeInline
        marqueeRef={marqueeRef}
        activeId={visibleId}
        onEnter={(id) => setActiveId(id)}
        onLeave={() => {
          if (lockedIdRef.current === null) setActiveId(null);
        }}
        onTap={handleTap}
        isPaused={lockedId !== null}
      />
    </section>
  );
}

export default memo(PartnersMapSession);
