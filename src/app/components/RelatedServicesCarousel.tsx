"use client";

import { useRef, useState, useEffect, useCallback, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { serviceDetailsTemplate } from "@/app/Data/serviceDetails";
import Tag from "@/app/components/tag";
import Button from "./button";
import { MoveRight, ChevronLeft, ChevronRight } from "lucide-react";
import HeaderLineByLineAnimation from "@/app/animations/HeaderLineByLineAnimation";
import LineByLineText from "@/app/components/LineByLineText";

interface Props {
  currentSlug: string;
}

const SPEED = 0.6;
const GAP   = 32;

const EdgeNav = memo(function EdgeNav({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={direction === "left" ? "Previous slide" : "Next slide"}
      className={`absolute top-1/2 ${
        direction === "left" ? "left-4" : "right-4"
      } -translate-y-1/2 z-20 hidden lg:flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-xl text-default-body hover:bg-[var(--neutral-light-3)] transition-colors duration-200 cursor-pointer`}
    >
      {direction === "left" ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
    </button>
  );
});

export default function RelatedServicesCarousel({ currentSlug }: Props) {
  const base = serviceDetailsTemplate.filter((s) => s.slug !== currentSlug);

  const trackRef       = useRef<HTMLDivElement>(null);
  const posRef         = useRef(0);
  const pausedRef      = useRef(false);
  const draggingRef    = useRef(false);
  const dragStartXRef  = useRef(0);
  const dragStartPos   = useRef(0);
  const velocityRef    = useRef(0);
  const lastDragX      = useRef(0);
  const halfRef        = useRef(0);
  const cardWidthRef   = useRef(0);
  const [dotIndex, setDotIndex] = useState(0);

  // ── Header / subtext animation state ──────────────────────────────────────
  const sectionRef         = useRef<HTMLElement>(null);
  const [startHeader,    setStartHeader]    = useState(false);
  const [startSubtext,   setStartSubtext]   = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartHeader(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onHeaderComplete = useCallback(() => setStartSubtext(true), []);

  // ── Carousel measurement ──────────────────────────────────────────────────
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const firstCard = track.children[0] as HTMLElement;
      if (!firstCard) return;
      const cw             = firstCard.offsetWidth + GAP;
      cardWidthRef.current = cw;
      halfRef.current      = cw * base.length;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [base.length]);

  // ── Auto-scroll loop ──────────────────────────────────────────────────────
  useEffect(() => {
    const wrap = (v: number) => {
      const h = halfRef.current;
      if (h <= 0) return v;
      return ((v % h) + h) % h;
    };

    const applyPos = () => {
      const track = trackRef.current;
      if (!track) return;
      posRef.current = wrap(posRef.current);
      track.scrollLeft = posRef.current;
      const cw = cardWidthRef.current;
      if (cw > 0) setDotIndex(Math.floor(posRef.current / cw) % base.length);
    };

    const tick = () => {
      if (draggingRef.current) {
        // drag handlers write posRef directly
      } else if (Math.abs(velocityRef.current) > 0.1) {
        posRef.current     += velocityRef.current;
        velocityRef.current *= 0.92;
        if (Math.abs(velocityRef.current) < 0.1) velocityRef.current = 0;
        applyPos();
      } else if (!pausedRef.current) {
        posRef.current += SPEED;
        applyPos();
      }
      requestAnimationFrame(tick);
    };

    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  const wrap = (v: number) => {
    const h = halfRef.current;
    if (h <= 0) return v;
    return ((v % h) + h) % h;
  };

  const applyPos = () => {
    const track = trackRef.current;
    if (!track) return;
    posRef.current = wrap(posRef.current);
    track.scrollLeft = posRef.current;
    const cw = cardWidthRef.current;
    if (cw > 0) setDotIndex(Math.floor(posRef.current / cw) % base.length);
  };

  const syncPos = () => {
    const track = trackRef.current;
    if (!track) return;
    posRef.current = track.scrollLeft;
  };

  // ── Arrow nav ─────────────────────────────────────────────────────────────
  const goPrev = () => {
    velocityRef.current = 0;
    posRef.current = wrap(posRef.current - cardWidthRef.current);
    applyPos();
  };

  const goNext = () => {
    velocityRef.current = 0;
    posRef.current = wrap(posRef.current + cardWidthRef.current);
    applyPos();
  };

  // ── Mouse ──
  const onMouseEnter = () => { pausedRef.current = true; };

  const onMouseLeave = () => {
    syncPos();
    draggingRef.current = false;
    pausedRef.current   = false;
  };

  const onMouseDown = (e: React.MouseEvent) => {
    draggingRef.current   = true;
    pausedRef.current     = true;
    velocityRef.current   = 0;
    dragStartXRef.current = e.clientX;
    dragStartPos.current  = posRef.current;
    lastDragX.current     = e.clientX;
    e.preventDefault();
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!draggingRef.current) return;
    velocityRef.current   = lastDragX.current - e.clientX;
    lastDragX.current     = e.clientX;
    posRef.current        = wrap(dragStartPos.current - (e.clientX - dragStartXRef.current));
    applyPos();
  };

  const onMouseUp = () => {
    if (!draggingRef.current) return;
    syncPos();
    draggingRef.current = false;
  };

  // ── Touch ──
  const onTouchStart = (e: React.TouchEvent) => {
    draggingRef.current   = true;
    pausedRef.current     = true;
    velocityRef.current   = 0;
    dragStartXRef.current = e.touches[0].clientX;
    dragStartPos.current  = posRef.current;
    lastDragX.current     = e.touches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!draggingRef.current) return;
    velocityRef.current = lastDragX.current - e.touches[0].clientX;
    lastDragX.current   = e.touches[0].clientX;
    posRef.current      = wrap(dragStartPos.current - (e.touches[0].clientX - dragStartXRef.current));
    applyPos();
  };

  const onTouchEnd = () => {
    syncPos();
    draggingRef.current = false;
    pausedRef.current   = false;
  };

  const goTo = (i: number) => {
    velocityRef.current = 0;
    posRef.current      = i * cardWidthRef.current;
    applyPos();
  };

  return (
    <section ref={sectionRef} className="related-services-carousel py-[80px] lg:py-[120px]">
      <div className="mx-[24px] xl:mx-[120px] min-[1920px]:mx-[200]!">

        {/* Header row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-[40px] lg:mb-[71px] gap-4 lg:gap-[50]">
          <div>
            <Tag text="services" className="mb-[30px] lg:mb-[50px]" />
            <HeaderLineByLineAnimation
              startAnimation={startHeader}
              onComplete={onHeaderComplete}
              lineY={28}
              duration={0.3}
              stagger={0.07}
              delay={0.1}
              style={{ overflow: "hidden" }}
              className="text-2xl-semibold  lg:text-4xl-semibold uppercase leading-[110%] text-default-heading"
            >
              More <span className="text-primary-default">Products</span> And
              <br />
              <span className="text-primary-default">Services</span>
            </HeaderLineByLineAnimation>
          </div>

          <LineByLineText
            startAnimation={startSubtext}
            duration={0.13}
            stagger={0.05}
            delay={0}
            yFrom={16}
            as="p"
            className="text-sm-medium md:text-md-medium mb-10 lg:mb-0 lg:text-xl-medium text-[#777777] lg:max-w-[520] lg:text-right leading-[120%]"
          >
            Explore other products and services we are ready to offer
          </LineByLineText>
        </div>

        {/* Carousel — outer relative so arrows aren't clipped by overflow-hidden */}
        <div className="relative">
          <div className="overflow-hidden">
            {/* Side fade overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-4 md:w-16 lg:w-24 bg-linear-to-r from-white to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-4 md:w-16 lg:w-24 bg-linear-to-l from-white to-transparent pointer-events-none z-10" />
            <div
              ref={trackRef}
              className="flex gap-[16px] lg:gap-[32px] overflow-x-scroll
                         [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
                         cursor-grab active:cursor-grabbing select-none"
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {[...base, ...base].map((service, i) => (
                <div
                  key={`${service.slug}-${i}`}
                  className="flex-shrink-0 group relative overflow-hidden
                             w-[calc(100%-32px)]
                             md:w-[calc(50%-10px)]
                             xl:w-[calc(33.333%-14px)]
                             h-[380px] lg:h-[469px]"
                >
                  <Image
                    src={service.heroImage}
                    alt={service.heroAltText}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    draggable={false}
                  />
                  <div className="absolute lg:group-hover:opacity-100 lg:opacity-0 transition-all duration-150 ease-in-out bottom-0 left-0 right-0 px-[26px] py-[31px] mx-[16px] lg:mx-[27px] mb-4
                                  bg-white/10 backdrop-blur-[6px]">
                    <h3 className="text-white uppercase text-md-semibold lg:text-2xl-semibold leading-tight mb-4 lg:mb-[22px]">
                      {service.heroTitle}
                    </h3>
                    <p
                      className="text-white text-xs-medium lg:text-sm-medium leading-snug mb-[16px]"
                      style={{ display: "-webkit-box", WebkitLineClamp: 5, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                      dangerouslySetInnerHTML={{ __html: service.description.replace(/<br\s*\/?>/gi, " ") }}
                    />
                    <Link href={`/services/${service.slug}`} className="flex place-self-end">
                      <Button
                        label="Go to service"
                        variant="primaryWhite"
                        size="large"
                        iconClassName="lg:group-hover/btn:text-[#016BF2]! lg:text-white!"
                        icon={<MoveRight size={20} />}
                        className="border-white! bg-white! lg:hover:bg-white! group lg:bg-transparent!"
                      />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Arrow nav buttons */}
          <EdgeNav direction="left"  onClick={goPrev} />
          <EdgeNav direction="right" onClick={goNext} />
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-[8px] mt-[28px] lg:mt-[36px]">
          {Array.from({ length: base.length }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-[8px] rounded-[4px] cursor-pointer transition-all duration-300 ${
                i === dotIndex ? "w-[49px] bg-[#0160DA]" : "w-[49px] bg-[#E6F0FE]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
