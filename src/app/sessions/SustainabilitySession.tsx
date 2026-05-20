"use client";

import React, { useState, useCallback, memo, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HeaderLineByLineAnimation from "../animations/HeaderLineByLineAnimation";
import LineByLineText from "../components/LineByLineText";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── SVG Icons as named function components ───────────────────────────────────

function IconRecycle({ className }: { className?: string }) {
  return (
    <svg
      className={`size-[42] lg:size-[61px]  ${className}`}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M21.82,15.42L19.32,19.75C18.83,20.61 17.92,21.06 17,21H15V23L12.5,18.5L15,14V16H17.82L15.6,12.15L19.93,9.65L21.73,12.77C22.25,13.54 22.32,14.57 21.82,15.42M9.21,3.06H14.21C15.19,3.06 16.04,3.63 16.45,4.45L17.45,6.19L19.18,5.19L16.54,9.6L11.39,9.69L13.12,8.69L11.71,6.24L9.5,10.09L5.16,7.59L6.96,4.47C7.37,3.64 8.22,3.06 9.21,3.06M5.05,19.76L2.55,15.43C2.06,14.58 2.13,13.56 2.64,12.79L3.64,11.06L1.91,10.06L7.05,10.14L9.7,14.56L7.97,13.56L6.56,16H11V21H7.4C6.47,21.07 5.55,20.61 5.05,19.76Z" />
    </svg>
  );
}

function IconLeaf({ className }: { className?: string }) {
  return (
    <svg
      className={`size-[42] lg:size-[51px] ${className}`}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
    </svg>
  );
}

function IconStar({ className }: { className?: string }) {
  return (
    <svg
      className={`size-[42] lg:size-[58px] ${className}`}
      width="58"
      height="58"
      viewBox="0 0 58 58"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M46.0052 36.216C46.3229 36.216 46.5985 36.332 46.832 36.5639L50.63 40.3761C50.8619 40.608 50.9778 40.8892 50.9778 41.2196C50.9778 41.55 50.8619 41.8311 50.63 42.063C50.3981 42.2949 50.1169 42.4109 49.7865 42.4109C49.4561 42.4109 49.175 42.2949 48.9431 42.063L45.1308 38.2627C44.8989 38.0308 44.7909 37.7481 44.8068 37.4145C44.8227 37.0809 44.9458 36.7974 45.1761 36.5639C45.4064 36.3304 45.6828 36.2144 46.0052 36.216ZM47.1751 9.74003C47.1751 10.0736 47.0592 10.3563 46.8273 10.5883L43.0293 14.391C42.7974 14.6229 42.5218 14.7388 42.2025 14.7388C41.8833 14.7388 41.6077 14.6229 41.3758 14.391C41.1423 14.1575 41.0255 13.8739 41.0255 13.5404C41.0255 13.2068 41.1423 12.9233 41.3758 12.6898L45.1403 8.89181C45.3723 8.6599 45.6534 8.54395 45.9838 8.54395C46.3142 8.54395 46.5953 8.6599 46.8273 8.89181C47.0592 9.12372 47.1751 9.40726 47.1751 9.74242M11.2043 8.58683C11.5379 8.58683 11.8206 8.70279 12.0525 8.9347L15.8528 12.6993C16.0848 12.9328 16.2007 13.2147 16.2007 13.5451C16.2007 13.8739 16.0848 14.1551 15.8528 14.3886C15.6209 14.6205 15.3374 14.7364 15.0022 14.7364C14.6687 14.7364 14.3859 14.6205 14.154 14.3886L10.3537 10.5883C10.1218 10.3563 10.0058 10.0808 10.0058 9.76148C10.0058 9.4422 10.1218 9.16661 10.3537 8.9347C10.5856 8.70279 10.8691 8.58683 11.2043 8.58683ZM12.3504 37.4383C12.3504 37.756 12.2344 38.0316 12.0025 38.2651L8.20455 42.063C7.97264 42.2949 7.69704 42.4109 7.37777 42.4109C7.05849 42.4109 6.7829 42.2949 6.55099 42.063C6.31908 41.8311 6.20312 41.5476 6.20312 41.2124C6.20312 40.8773 6.31908 40.5937 6.55099 40.3618L10.3156 36.5639C10.5491 36.332 10.831 36.2232 11.1614 36.2375C11.4902 36.2533 11.7714 36.378 12.0049 36.6115C12.2368 36.8435 12.3504 37.119 12.3504 37.4383ZM28.5905 39.6947L17.8328 46.1517C17.5787 46.2772 17.3436 46.328 17.1276 46.3042C16.9099 46.2787 16.6987 46.2041 16.4938 46.0802C16.2889 45.9531 16.1332 45.7736 16.0268 45.5417C15.9204 45.3066 15.9108 45.0533 15.9982 44.7816L18.8502 32.6992L9.36013 24.4934C9.14569 24.3187 9.01227 24.1098 8.95985 23.8668C8.90584 23.6253 8.92808 23.3926 9.02656 23.1686C9.12504 22.9447 9.25609 22.7628 9.4197 22.623C9.58331 22.4832 9.80569 22.3887 10.0868 22.3395L22.56 21.2816L27.4397 9.80675C27.5477 9.54466 27.7033 9.35563 27.9067 9.23968C28.11 9.12372 28.3379 9.06654 28.5905 9.06813C28.843 9.06972 29.0718 9.12769 29.2767 9.24206C29.4816 9.35643 29.6365 9.54545 29.7413 9.80913L34.6662 21.284L47.1394 22.3419C47.4205 22.3895 47.6429 22.4848 47.8065 22.6278C47.9717 22.766 48.1036 22.9471 48.202 23.171C48.3005 23.395 48.3228 23.6277 48.2688 23.8691C48.2148 24.1122 48.0805 24.321 47.8661 24.4958L38.3784 32.7016L41.228 44.8293C41.317 45.1009 41.3075 45.3463 41.1994 45.5655C41.0914 45.7847 40.9358 45.9571 40.7325 46.0826C40.5275 46.2065 40.3171 46.2803 40.101 46.3042C39.8834 46.3296 39.6476 46.2795 39.3934 46.154L28.5905 39.6947Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconShield({ className }: { className?: string }) {
  return (
    <svg
      className={`size-[42] lg:size-[61px] ${className}`}
      width="61"
      height="61"
      viewBox="0 0 61 61"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M30.4963 57.188L18.7232 50.9106C15.3666 49.1254 12.5597 46.4596 10.6037 43.1996C8.64776 39.9395 7.61665 36.2083 7.62111 32.4065V7.62503C7.62111 6.61389 8.02278 5.64415 8.73777 4.92917C9.45276 4.21418 10.4225 3.8125 11.4336 3.8125H49.559C50.5701 3.8125 51.5399 4.21418 52.2548 4.92917C52.9698 5.64415 53.3715 6.61389 53.3715 7.62503V32.4065C53.376 36.2083 52.3449 39.9395 50.3889 43.1996C48.4329 46.4596 45.626 49.1254 42.2694 50.9106L30.4963 57.188ZM11.4336 7.62503V32.4065C11.4315 35.5169 12.276 38.5693 13.8765 41.2364C15.477 43.9034 17.7732 46.0846 20.5189 47.5461L30.4963 52.8665L40.4737 47.548C43.2197 46.0864 45.5161 43.9049 47.1166 41.2375C48.7172 38.57 49.5614 35.5173 49.559 32.4065V7.62503H11.4336Z"
        fill="currentColor"
      />
      <path
        d="M30.5 48.1846V11.4375H45.7501V32.0347C45.75 34.4509 45.0938 36.8218 43.8516 38.8943C42.6094 40.9667 40.8278 42.663 38.6969 43.8021L30.5 48.1846Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconPlus({ className }: { className?: string }) {
  return (
    <svg
      className={`size-[42] lg:size-[49px] ${className}`}
      width="49"
      height="49"
      viewBox="0 0 49 49"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M47.6344 16.5261C47.6344 15.9914 47.197 15.554 46.6623 15.554H34.0247C33.4901 15.554 33.0526 15.1165 33.0526 14.5819V1.94429C33.0526 1.40962 32.6152 0.972168 32.0805 0.972168H16.5266C15.9919 0.972168 15.5545 1.40962 15.5545 1.94429V14.5819C15.5545 15.1165 15.117 15.554 14.5823 15.554H1.94478C1.41011 15.554 0.972656 15.9914 0.972656 16.5261V32.08C0.972656 32.6147 1.41011 33.0521 1.94478 33.0521H14.5823C15.117 33.0521 15.5545 33.4896 15.5545 34.0243V46.6618C15.5545 47.1965 15.9919 47.6339 16.5266 47.6339H32.0805C32.6152 47.6339 33.0526 47.1965 33.0526 46.6618V34.0243C33.0526 33.4896 33.4901 33.0521 34.0247 33.0521H46.6623C47.197 33.0521 47.6344 32.6147 47.6344 32.08V16.5261Z"
        fill="currentColor"
      />
    </svg>
  );
}

// ─── Data — exactly 4 sustainability cards ───────────────────────────────────

const CARDS = [
  {
    id: 1,
    title: "Resource Efficiency",
    description:
      "Reducing energy, water, and material consumption across operations. Optimized products help minimize waste and improve overall output. Supporting cost-effective and environmentally responsible mining.",
    image: "/homeAssets/Image-18.webp",
    Icon: IconLeaf,
  },
  {
    id: 2,
    title: "Durability",
    description:
      "Engineered for long-term performance in harsh mining conditions.Reduced wear and fewer replacements lower operational disruptions.Helping cut waste while improving equipment lifecycle value.",
    image: "/homeAssets/Image-19.webp",
    Icon: IconStar,
  },
  {
    id: 3,
    title: "Environmental Protection",
    description:
      "Designed to minimize emissions, leaks, and site contamination risks.Supporting cleaner operations through reliable and tested solutions.Helping protect surrounding ecosystems throughout mining activities.",
    image: "/homeAssets/Image-20.webp",
    Icon: IconShield,
  },
  {
    id: 4,
    title: "Safety & Compliance",
    description:
      "Built to meet industry standards and regulatory requirements.Enhancing worker safety through reliable and proven products.Supporting compliance while maintaining consistent operations.",
    image: "/homeAssets/Image-21.webp",
    Icon: IconPlus,
  },
] as const;

const TOTAL_SLIDES = 5;

// ─── Bottom-right indicator squares ──────────────────────────────────────────

interface IndicatorButtonsProps {
  currentSlide: number;
  onSelect: (slide: number) => void;
}

const IndicatorButtons = memo(function IndicatorButtons({
  currentSlide,
  onSelect,
}: IndicatorButtonsProps) {
  return (
    <div className="flex flex-row gap-2.5">
      {/* Intro slide indicator */}
      <button
        onClick={() => onSelect(0)}
        aria-label="Go to Introduction"
        className={[
          "flex items-center justify-center text-[#51B948] bg-white/2 backdrop-blur-sm w-[65px] h-[65px] lg:w-[115px] lg:h-[99px] border transition-all duration-200 cursor-pointer",
          currentSlide === 0 ? "border-white" : "border-white/24 hover:border-white",
        ].join(" ")}
      >
        <div className="bg-white w-[42px] h-[42px] lg:w-[67px] lg:h-[59px] flex items-center justify-center">
          <IconRecycle className="size-[32px]! lg:size-[40px]!" />
        </div>
      </button>
      {CARDS.map((card) => {
        const isActive = currentSlide === card.id;
        const SlideIcon = card.Icon;
        return (
          <button
            key={card.id}
            onClick={() => onSelect(card.id)}
            aria-label={`Go to ${card.title}`}
            className={[
              "flex items-center justify-center  text-[#51B948] bg-white/2 backdrop-blur-sm w-[65px] h-[65px] lg:w-[115px] lg:h-[99px] border transition-all duration-200 cursor-pointer",
              isActive
                ? " border-white "
                : " border-white/24   hover:border-white ",
            ].join(" ")}
          >
            <div className="bg-white w-[42px] h-[42px] lg:w-[67px] lg:h-[59px] flex items-center justify-center">
              <SlideIcon className="size-[32px]! lg:size-[40px]!" />
            </div>
          </button>
        );
      })}
    </div>
  );
});

// ─── Edge chevron nav button ──────────────────────────────────────────────────

interface EdgeNavProps {
  direction: "left" | "right";
  onClick: () => void;
  show: boolean;
}

const EdgeNav = memo(function EdgeNav({
  direction,
  onClick,
  show,
}: EdgeNavProps) {
  if (!show) return null;
  return (
    <button
      onClick={onClick}
      aria-label={direction === "left" ? "Previous slide" : "Next slide"}
      className={`absolute top-1/2 ${
        direction === "left" ? `left-4` : `right-4`
      } -translate-y-1/2 z-20 hidden lg:flex items-center justify-center w-[38px] h-[180px] text-white transition-all duration-200 hover:bg-white/24 rounded-[4px] hover:text-white cursor-pointer`}
    >
      {direction === "left" ? (
        <svg
          className="w-4 h-7.5"
          width="46"
          height="46"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4.8 12 17.6 0v24L4.8 12Z"></path>
        </svg>
      ) : (
        <svg
          className="w-4 h-7.5"
          width="46"
          height="46"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M19.2 12 6.4 0v24l12.8-12Z"></path>
        </svg>
      )}
    </button>
  );
});

// ─── Main Component ───────────────────────────────────────────────────────────

interface SustainabilitySessionProps {
  startTextAnimation?: boolean;
}

function SustainabilitySession({
  startTextAnimation = false,
}: SustainabilitySessionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [startBodyAnimation, setStartBodyAnimation] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "right"
  );

  const AUTOSLIDE_MS = 5000;
  const isHoveredRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!isHoveredRef.current) {
        setSlideDirection('right');
        setCurrentSlide(prev => (prev + 1) % TOTAL_SLIDES);
      }
    }, AUTOSLIDE_MS);
  }, []);

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTimer]);

  const navigate = useCallback(
    (nextSlide: number, direction?: "left" | "right") => {
      const dir = direction ?? (nextSlide > currentSlide ? "right" : "left");
      setSlideDirection(dir);
      setCurrentSlide(nextSlide);
      startTimer();
    },
    [currentSlide, startTimer]
  );

  const goLeft = useCallback(
    () => navigate(Math.max(0, currentSlide - 1), "left"),
    [currentSlide, navigate]
  );

  const goRight = useCallback(
    () => navigate(Math.min(TOTAL_SLIDES - 1, currentSlide + 1), "right"),
    [currentSlide, navigate]
  );

  const onHeaderComplete = useCallback(() => setStartBodyAnimation(true), []);

  const card = currentSlide > 0 ? CARDS[currentSlide - 1] : null;
  const CardIcon = card ? card.Icon : null;

  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const introParallaxRef = useRef<HTMLDivElement>(null);
  const cardParallaxRefs = useRef<Array<HTMLDivElement | null>>(Array(CARDS.length).fill(null));

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      touchEndX.current = e.changedTouches[0].clientX;
      const diff = touchStartX.current - touchEndX.current;
      if (Math.abs(diff) < 40) return; // ignore small movements
      if (diff > 0) {
        // swiped left → go right
        navigate(Math.min(TOTAL_SLIDES - 1, currentSlide + 1), "right");
      } else {
        // swiped right → go left
        navigate(Math.max(0, currentSlide - 1), "left");
      }
    },
    [currentSlide, navigate]
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const allImages = [
      introParallaxRef.current,
      ...cardParallaxRefs.current,
    ].filter((el): el is HTMLDivElement => el !== null);

    if (allImages.length === 0) return;

    let mm: ReturnType<typeof gsap.matchMedia> | null = null;
    let ctx: ReturnType<typeof gsap.context> | null = null;

    const init = () => {
      if (!sectionRef.current) return;
      mm = gsap.matchMedia();
      ctx = gsap.context(() => {
        mm!.add('(max-width: 1023px)', () => {
          gsap.fromTo(
            allImages,
            { y: 0 },
            {
              y: '15%',
              ease: 'none',
              force3D: true,
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.2,
                invalidateOnRefresh: true,
              },
            }
          );
        });

        mm!.add('(min-width: 1024px)', () => {
          gsap.fromTo(
            allImages,
            { y: 0 },
            {
              y: '20%',
              ease: 'none',
              force3D: true,
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.2,
                invalidateOnRefresh: true,
              },
            }
          );
        });
      }, section);
    };

    requestAnimationFrame(() => requestAnimationFrame(() => init()));

    return () => {
      ctx?.revert();
      mm?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className=" my-[80px]  lg:my-[140px]"
      onMouseEnter={() => { isHoveredRef.current = true; }}
      onMouseLeave={() => { isHoveredRef.current = false; }}
    >
      <div
        className="relative w-full h-[700px] lg:h-[800px] overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        //   style={{ height: "clamp(420px, 52vw, 760px)" }}
      >
        {/* Full slide track — all 5 slides side by side */}
        <div
          className="absolute top-0 left-0 h-full"
          style={{
            width: `${TOTAL_SLIDES * 100}%`,
            transform: `translateX(-${(currentSlide / TOTAL_SLIDES) * 100}%)`,
            transition: "transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          {/* Intro slide image */}
          <div
            className="absolute top-0 h-full overflow-hidden"
            style={{ left: "0%", width: `${100 / TOTAL_SLIDES}%` }}
          >
            <div
              ref={introParallaxRef}
              style={{
                position: 'absolute',
                inset: '-15% 0',
                willChange: 'transform',
              }}
            >
              <Image src="/homeAssets/Image-17.webp" alt="Sustainability" fill priority sizes="100vw" className="object-cover" />
            </div>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.48) 40%, rgba(0,0,0,0.82) 100%)",
              }}
            />
          </div>

          {/* Card slide images */}
          {CARDS.map((c, i) => (
            <div
              key={c.id}
              className="absolute top-0 h-full overflow-hidden"
              style={{
                left: `${((i + 1) / TOTAL_SLIDES) * 100}%`,
                width: `${100 / TOTAL_SLIDES}%`,
              }}
            >
              <div
                ref={(el) => { cardParallaxRefs.current[i] = el; }}
                style={{
                  position: 'absolute',
                  inset: '-15% 0',
                  willChange: 'transform',
                }}
              >
                <Image src={c.image} alt={c.title} fill sizes="100vw" className="object-cover" />
              </div>
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.48) 40%, rgba(0,0,0,0.82) 100%)",
                }}
              />
            </div>
          ))}
        </div>
        {/* Left edge chevron */}
        <EdgeNav direction="left" onClick={goLeft} show={currentSlide > 0} />

        {/* Right edge chevron */}
        <EdgeNav
          direction="right"
          onClick={goRight}
          show={currentSlide < TOTAL_SLIDES - 1}
        />

        {/* Bottom content row */}
        <div
          className={`absolute ${
            currentSlide === 0
              ? `top-[80] gap-12 lg:top-[140] xl:top-[200]`
              : `top-[180] lg:top-[240] xl:top-0 gap-16 lg:bottom-[60]`
          }  left-0 right-0 z-[3] px-[24px]  pb-[24px] lg:px-[24px] xl:pl-[120px] xl:pr-[58px] min-[1920px]:pl-[200px]! lg:pb-[32px] flex flex-col xl:flex-row xl:items-end xl:justify-between `}
        >
          {/* Left: icon badge + text */}
          <div className="flex flex-col gap-[38px] min-w-0">
            {/* Icon badge */}
            <div
              className={[
                "flex items-center justify-center w-[55px] h-[50px] lg:w-[88px] lg:h-[78px] xl:w-[92px] xl:h-[82px]",
                currentSlide === 0
                  ? "bg-[#51B948] text-white"
                  : "bg-white text-[#51B948]",
              ].join(" ")}
            >
              {currentSlide === 0 && <IconRecycle />}
              {CardIcon && <CardIcon />}
            </div>

            {/* Intro heading + body */}
            {currentSlide === 0 && (
              <div className="flex flex-col gap-[32px] max-w-[485px] lg:max-w-[751px]">
                <div className="text-xl-semibold lg:text-3xl-semibold xl:text-[44px] uppercase tracking-tight text-white leading-[1.15]">
                  <HeaderLineByLineAnimation
                    startAnimation={startTextAnimation}
                    onComplete={onHeaderComplete}
                    lineY={28}
                    duration={0.15}
                    stagger={0.07}
                    delay={0}
                    style={{ overflow: "hidden" }}
                  >
                    Driving responsible
                    <br />
                    mining operations for
                    <br />
                    <span className="text-[#51B948]">sustainability</span>
                  </HeaderLineByLineAnimation>
                </div>
                <LineByLineText
                  startAnimation={startBodyAnimation}
                  duration={0.1}
                  stagger={0.04}
                  yFrom={12}
                  as="p"
                  className="text-sm-medium md:text-md-medium lg:text-lg-medium xl:text-xl-medium text-white leading-relaxed  m-0"
                >
                  Our products are engineered to reduce environmental impact
                  while improving operational efficiency. From durable materials
                  to optimized performance, we help minimize waste, energy use,
                  and downtime across mining operations. Helping our partners
                  operate more efficiently while minimizing their environmental
                  footprint.
                </LineByLineText>
              </div>
            )}

            {/* Card title + body */}
            {card && (
              <div className="flex flex-col gap-[32px]  max-w-[485px] lg:max-w-[751px] ">
                <h3 className="text-xl-semibold lg:text-nowrap lg:text-3xl-semibold tracking-tight xl:text-[44px] uppercase text-white leading-[1.15] m-0">
                  {card.title}
                </h3>
                <p className="text-sm-medium md:text-md-medium lg:text-lg-medium xl:text-xl-medium text-white leading-relaxed  m-0">
                  {card.description}
                </p>
              </div>
            )}

            {/* Slide progress bar + counter */}
            <div className="hidden xl:block">
              {/* 5-segment slide indicator */}
              <div className="flex flex-row   max-w-[425px]  lg:max-w-[550px] xl:max-w-full  gap-3 mb-5">
                {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={[
                      "h-2 rounded-[4px] flex-1 transition-all duration-300 cursor-pointer border-none p-0",
                      i === currentSlide
                        ? "bg-white"
                        : "bg-white/20 hover:bg-white/50",
                    ].join(" ")}
                  />
                ))}
              </div>
              <span className="text-2xl-medium text-white tracking-widest">
                {String(currentSlide + 1).padStart(2, "0")}/
                <span className="text-default-body">05</span>
              </span>
            </div>
          </div>

          {/* Right: 4 icon indicator squares */}
          <div className="flex-shrink-0 flex flex-col gap-8 xl:pb-9.5">
            <IndicatorButtons currentSlide={currentSlide} onSelect={navigate} />
            {/* Slide progress bar + counter */}
            <div className="block xl:hidden">
              {/* 5-segment slide indicator */}
              <div className="flex flex-row  max-w-[425px] lg:max-w-[550px] xl:max-w-full gap-3 mb-5">
                {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={[
                      "h-2 rounded-[4px] flex-1 transition-all duration-300 cursor-pointer border-none p-0",
                      i === currentSlide
                        ? "bg-white"
                        : "bg-white/20 hover:bg-white/50",
                    ].join(" ")}
                  />
                ))}
              </div>
              <span className="text-xl-medium lg:text-2xl-medium text-white tracking-widest">
                {String(currentSlide + 1).padStart(2, "0")}/
                <span className="text-default-body">05</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(SustainabilitySession);
