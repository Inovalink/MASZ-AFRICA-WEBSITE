"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  memo,
  useCallback,
} from "react";
import gsap from "gsap";
import AnimationCopy from "../animations/WritingTextAnimation";
import { useScrollToTopTrigger } from "../hooks/useScrollToTopTrigger";
import AnimatedMetricCard from "../components/AnimatedMetricCard";
import HeaderLineByLineAnimation from "../animations/HeaderLineByLineAnimation";
import Image from "next/image";
import LineByLineText from "../components/LineByLineText";
import Button from "../components/button";
import { MoveRight } from "lucide-react";
import Link from "next/link";

const HEADER_LINE_Y = 28;
const HEADER_STAGGER = 0.07;
const HEADER_DURATION = 0.1;
const HEADER_DELAY = 0;
const CORE_VALUE_BODY_TEXT_DURATION = 0.1;
const CORE_VALUE_BODY_TEXT_STAGGER = 0.05;

const CORE_VALUE_BODY_TEXT = (
  <>
    Our uniqueness comes from blending product authenticity with real technical
    intelligence and dependable service delivery. Every item we supply is
    verified, traceable, and backed by expert insight tailored to the realities
    of mining environments. This combination allows us to offer solutions that
    improve efficiency, reduce risk, and keep operations running without
    interruption. But we don&apos;t just provide products—we provide peace of
    mind. From precision-engineered consumables to end-to-end procurement
    support, we anticipate your operational needs and deliver solutions that
    empower your team to perform at their best. Our clients trust us not only
    for the quality of our supplies but for our commitment to safety,
    sustainability, and innovation, ensuring that every decision we make
    enhances the value of your operations. With MASZ-Africa, you gain a partner
    who is as invested in your success as you are, driving measurable results,
    minimizing downtime, and unlocking new levels of operational excellence.
  </>
);

const CAROUSEL_IMAGES = [
  "/homeAssets/Image-15.webp",
  "/homeAssets/Image-11.webp",
  "/homeAssets/Image-12.webp",
  "/homeAssets/Image-13.webp",
] as const;

const CAROUSEL_INTERVAL_MS = 4000;

interface CoreValueSessionProps {
  startTextAnimation?: boolean;
}

const METRICS = [
  { text: "years of combined experience", value: "15+" },
  {
    text: "clients who rely on our consistent delivery and expertise.",
    value: "5+",
  },
  {
    text: "client satisfaction built on trust, transparency, and performance.",
    value: "99%",
  },
  {
    text: "on-time delivery, driven by efficiency and dependable logistics.",
    value: "98%",
  },
] as const;

function CoreValueSession({
  startTextAnimation = false,
}: CoreValueSessionProps) {
  const memoizedMetrics = useMemo(() => METRICS, []);

  const [lineByLineComplete, setLineByLineComplete] = useState(false);
  const [startBodyAnimation, setStartBodyAnimation] = useState(false);
  const showAnimationCopy = useScrollToTopTrigger(lineByLineComplete);
  const [startMetricsAnimation, setStartMetricsAnimation] = useState(false);
  const [startContentPhase, setStartContentPhase] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  // Internal gate: true once the section has actually entered the viewport
  const [inView, setInView] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const imageRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const carouselTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // True once the image/metrics block has entered the viewport at least once
  const imageInViewRef = useRef(false);

  // ── In-view gate ────────────────────────────────────────────────────────────
  // Fires once when at least 15% of the section is visible. Disconnects after
  // the first hit so it never re-fires. This replaces the parent-prop-only
  // trigger so text never animates before the section scrolls into view.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  // ── Fade in AnimationCopy overlay after React mounts it ─────────────────────
  useEffect(() => {
    if (!showAnimationCopy) return;
    const overlay = overlayRef.current;
    if (!overlay) return;
    gsap.fromTo(
      overlay,
      { opacity: 0, force3D: true },
      { opacity: 1, duration: 0.5, ease: "power2.out", force3D: true }
    );
  }, [showAnimationCopy]);

  // ── Image viewport gate + GSAP fade-in ─────────────────────────────────────
  // Calls GSAP directly from trigger() to avoid an extra React render cycle
  // between "text done" and "fade starts" — eliminates the blank-space flash.
  // setImageVisible(true) is still set so the metrics gate can depend on it.
  useEffect(() => {
    const imageDiv = imageRef.current;
    if (!imageDiv || imageVisible) return;

    const trigger = () => {
      setImageVisible(true);
      gsap.fromTo(
        imageDiv,
        { opacity: 0, y: 40, force3D: true },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", force3D: true }
      );
    };

    if (imageInViewRef.current && lineByLineComplete) {
      trigger();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          imageInViewRef.current = true;
          if (lineByLineComplete) {
            trigger();
            io.disconnect();
          }
        }
      },
      { threshold: 0.1 }
    );
    io.observe(imageDiv);
    return () => io.disconnect();
  }, [lineByLineComplete, imageVisible]);

  // ── Metrics viewport gate ────────────────────────────────────────────────────
  // Only fires after imageVisible (parent block is visible) AND the metrics
  // container itself has scrolled into view — avoids animating off-screen.
  useEffect(() => {
    if (!imageVisible || startMetricsAnimation) return;
    const metricsDiv = metricsRef.current;
    if (!metricsDiv) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setStartMetricsAnimation(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(metricsDiv);
    return () => io.disconnect();
  }, [imageVisible, startMetricsAnimation]);

  // ── Carousel auto-rotation ───────────────────────────────────────────────────
  useEffect(() => {
    carouselTimerRef.current = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, CAROUSEL_INTERVAL_MS);
    return () => {
      if (carouselTimerRef.current) clearInterval(carouselTimerRef.current);
    };
  }, []);

  const handleEmptyShown = useCallback(() => setStartContentPhase(true), []);
  const handleSequenceComplete = useCallback(() => {}, []);

  // Use internal in-view detection OR parent prop — whichever fires first.
  // In practice the IntersectionObserver (threshold 0.15) fires before the
  // parent's ScrollReveal callback, so the section must be meaningfully visible.
  const shouldStart = inView || startTextAnimation;

  return (
    <section ref={sectionRef} className="lg:my-[140] my-[80]">
      <div className="core-value-section-container">
        {/* Header — line-by-line reveal */}
        <div className="section-header uppercase text-xl-semibold lg:mx-[24] xl:mx-[120] min-[1920px]:mx-[200]! ml-[22] mt-[30] mb-[51] lg:text-4xl-semibold">
          <HeaderLineByLineAnimation
            startAnimation={shouldStart}
            onComplete={() => setStartBodyAnimation(true)}
            lineY={HEADER_LINE_Y}
            duration={HEADER_DURATION}
            stagger={HEADER_STAGGER}
            delay={HEADER_DELAY}
            style={{ overflow: "hidden" }}
          >
            what makes us{" "}
            <span className="text-primary-default">stand out</span>
          </HeaderLineByLineAnimation>
        </div>

        {/* Body text — three phases matching AboutSession */}
        {!lineByLineComplete ? (
          /* Phase 1: line-by-line reveal */
          <LineByLineText
            duration={CORE_VALUE_BODY_TEXT_DURATION}
            stagger={CORE_VALUE_BODY_TEXT_STAGGER}
            delay={0}
            startAnimation={startBodyAnimation}
            onComplete={() => setLineByLineComplete(true)}
            className="core-value-section-subtext mx-6.25 xl:mx-[120] min-[1920px]:mx-[200]! text-lg-medium lg:text-2xl-medium lg:leading-8 lg:tracking-tight text-default-body"
          >
            {CORE_VALUE_BODY_TEXT}
          </LineByLineText>
        ) : showAnimationCopy ? (
          /* Phase 3: AnimationCopy overlay — only mounts after scroll-to-top trigger */
          <div className="relative overflow-hidden" style={{ contain: "layout style paint" }}>
            <div
              className="core-value-section-subtext xl:mx-[120] min-[1920px]:mx-[200]! text-lg-medium mx-6.25 lg:text-2xl-medium lg:leading-8 lg:tracking-tight text-default-body"
              style={{ visibility: "hidden", pointerEvents: "none" }}
              aria-hidden
            >
              {CORE_VALUE_BODY_TEXT}
            </div>
            <div
              ref={overlayRef}
              className="absolute top-0 left-0 right-0"
              style={{ contain: "layout style paint", isolation: "isolate" }}
            >
              <AnimationCopy>
                <div className="core-value-section-subtext xl:mx-[120] min-[1920px]:mx-[200]! text-lg-medium mx-6.25 lg:text-2xl-medium lg:leading-8 lg:tracking-tight">
                  {CORE_VALUE_BODY_TEXT}
                </div>
              </AnimationCopy>
            </div>
          </div>
        ) : (
          /* Phase 2: static text — AnimationCopy not in DOM */
          <div className="core-value-section-subtext xl:mx-[120] min-[1920px]:mx-[200]! text-lg-medium mx-6.25 lg:text-2xl-medium lg:leading-8 lg:tracking-tight text-default-body">
            {CORE_VALUE_BODY_TEXT}
          </div>
        )}

        {/* Image carousel + metrics — fades in via GSAP once body text finishes */}
        <div
          ref={imageRef}
          style={{ opacity: 0 }}
          className="lg:mx-[24] xl:mx-[120] mt-[50] min-[1920px]:mx-[200]! bg-[#016BF2]"
        >
          <div className="relative h-125 overflow-hidden lg:h-175">
            {/* Overlay: tag + heading + button */}
            <div
              className="absolute justify-end left-0 right-0 bottom-11.75 px-6 lg:px-9 flex flex-row items-center lg:flex-row gap-5 lg:gap-12.5 lg:items-center lg:justify-between z-10"
              aria-hidden="true"
            >
              <div className="bg-white/19 hidden md:flex backdrop-blur-xs px-6 w-full lg:px-10.75 justify-center flex-col gap-2.5 min-h-38 text-light flex-1 rounded-sm">
                <div className="bg-white w-fit rounded-sm text-default-heading text-sm-medium absolute top-0 -translate-y-1/2 py-2 px-4">
                  <span>Our Foundation</span>
                </div>
                <h3 className="text-2xl-medium lg:text-3xl-medium">
                  Values That Shape Every Project
                </h3>
                <p className="text-md-medium lg:text-lg-medium">
                  Our core values guide how we operate, shaping our decisions.
                </p>
              </div>
              <Link href="/aboutUs#core-values">
                <Button
                  label="Our core values"
                  variant="primaryWhite"
                  size="large"
                  iconClassName="lg:group-hover/btn:text-[#016BF2]! lg:text-[#016BF2]!"
                  icon={<MoveRight size={20} />}
                  className="border-none"
                />
              </Link>
            </div>

            {/* Crossfade carousel images */}
            {CAROUSEL_IMAGES.map((src, i) => (
              <Image
                key={src}
                src={src}
                fill
                alt=""
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, calc(100vw - 240px)"
                className={`object-cover transition-opacity duration-700 ease-in-out ${
                  i === carouselIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}

            {/* Carousel dot indicators */}
            <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
              {CAROUSEL_IMAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCarouselIndex(i);
                    // Reset timer on manual navigation
                    if (carouselTimerRef.current)
                      clearInterval(carouselTimerRef.current);
                    carouselTimerRef.current = setInterval(() => {
                      setCarouselIndex(
                        (prev) => (prev + 1) % CAROUSEL_IMAGES.length
                      );
                    }, CAROUSEL_INTERVAL_MS);
                  }}
                  aria-label={`Show image ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    i === carouselIndex
                      ? "bg-white w-6"
                      : "bg-white/50 w-2 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Metrics */}
          <div ref={metricsRef} className="metrics-container py-8 gap-4 flex flex-col mx-[21] lg:mx-[34] md:grid grid-cols-2 2xl:grid-cols-4">
            {memoizedMetrics.map((metric, index) => (
              <AnimatedMetricCard
                key={index}
                index={index}
                text={metric.text}
                value={metric.value}
                showAsEmpty={startMetricsAnimation}
                showContent={startContentPhase}
                onEmptyShown={handleEmptyShown}
                onSequenceComplete={handleSequenceComplete}
              />
            ))}
          </div>
        </div>

        {/* Mobile-only supporting images */}
        <div className="core-value-section-images flex flex-col gap-5 lg:flex">
          <div className="relative h-[300px] mx-[21px] overflow-hidden lg:hidden">
            <Image
              src="/homeAssets/Image-3.jpg"
              alt="Core value visual"
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 0px"
              className="object-cover"
            />
          </div>
          <div className="flex gap-[20px] lg:gap-[40] mx-[21px] lg:mx-0">
            <div className="relative h-[200px] flex-1 overflow-hidden lg:h-[800] lg:hidden">
              <Image
                src="/homeAssets/Image-4.jpg"
                alt="Core value visual"
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 50vw, 0px"
                className="object-cover"
              />
            </div>
            <div className="relative h-[200px] flex-1 overflow-hidden lg:h-[800] lg:mx-0 lg:hidden">
              <Image
                src="/homeAssets/Image-5.jpg"
                alt="Core value visual"
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 50vw, 0px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(CoreValueSession);
