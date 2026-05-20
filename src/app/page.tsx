"use client";

import React, { useState, memo, useCallback, useEffect } from "react";
import HeroSession from "./sessions/HeroSession";
import AboutSession from "./sessions/AboutSession";
import ServiceSession from "./sessions/ServiceSession";
import HeroCarousel from "./sessions/HeroCarousel";
import SustainabilitySession from "./sessions/SustainabilitySession";
import CoreValueSession from "./sessions/CoreValueSession";
import AchievementsSession from "./sessions/AchievementsSession";
import TestimonialSession from "./sessions/TestimonialSession";
import PartnersMapSession from "./sessions/PartnersMapSession";
import AnimatedImagesSection from "./sessions/AnimatedImagesSection";
import FaqSession from "./sessions/FaqSession";
import ScrollReveal from "@/app/components/ScrollReveal";
import PartnersMarquee from "./components/PartnersMarquee";

// PERFORMANCE: All session components are already memoized in their own files
// No need to re-memoize here, but keeping for consistency
const MemoHeroSession = memo(HeroSession);
const MemoAboutSession = memo(AboutSession);
const MemoServiceSession = memo(ServiceSession);
const MemoHeroCarousel = memo(HeroCarousel);
const MemoSustainabilitySession = memo(SustainabilitySession);
const MemoCoreValueSession = memo(CoreValueSession);
const MemoAchievementsSession = memo(AchievementsSession);
const MemoTestimonialSession = memo(TestimonialSession);
const MemoAnimatedImagesSection = memo(AnimatedImagesSection);
const MemoFaqSession = memo(FaqSession);
const MemoPartnersMapSession = memo(PartnersMapSession);

export default function Page() {
  const [heroRevealNearlyComplete, setHeroRevealNearlyComplete] =
    useState(false);
  const [aboutRevealNearlyComplete, setAboutRevealNearlyComplete] =
    useState(false);
  const [serviceRevealNearlyComplete, setServiceRevealNearlyComplete] =
    useState(false);
  const [carouselRevealNearlyComplete, setCarouselRevealNearlyComplete] =
    useState(false);
  const [
    sustainabilityRevealNearlyComplete,
    setSustainabilityRevealNearlyComplete,
  ] = useState(false);
  const [coreValueRevealNearlyComplete, setCoreValueRevealNearlyComplete] =
    useState(false);
  // (achievements state removed — AchievementsSession now self-triggers via IntersectionObserver + CSS reveal)

  /**
   * PERFORMANCE OPTIMIZATION: useCallback for stable function references
   *
   * Why useCallback?
   * - Prevents ScrollReveal from re-rendering when other state changes
   * - Memoized components (MemoHeroSession, etc.) won't re-render unnecessarily
   * - Reduces React reconciliation work
   *
   * Without useCallback: New function created on every render → ScrollReveal sees new prop → re-renders
   * With useCallback: Same function reference → ScrollReveal doesn't re-render → better performance
   */
  // Hero text waits for the page transition overlay to exit before starting.
  useEffect(() => {
    const w = window as unknown as Record<string, unknown>;
    const start = () => setHeroRevealNearlyComplete(true);
    if (!w.__masz_transitioning) {
      const id = requestAnimationFrame(() => requestAnimationFrame(start));
      return () => cancelAnimationFrame(id as number);
    }
    window.addEventListener('masz:page-ready', start, { once: true });
    return () => window.removeEventListener('masz:page-ready', start);
  }, []);
  const onAboutReveal = useCallback(
    () => setAboutRevealNearlyComplete(true),
    []
  );
  const onServiceReveal = useCallback(
    () => setServiceRevealNearlyComplete(true),
    []
  );
  const onCarouselReveal = useCallback(
    () => setCarouselRevealNearlyComplete(true),
    []
  );
  const onSustainabilityReveal = useCallback(
    () => setSustainabilityRevealNearlyComplete(true),
    []
  );
  const onCoreValueReveal = useCallback(
    () => setCoreValueRevealNearlyComplete(true),
    []
  );

  const partners = [
    { id: 1, name: "DIADORA", logo: "" },
    { id: 2, name: "NIO", logo: "/partnerLogos/Partner-2.svg" },
    { id: 3, name: "adidas", logo: "/partnerLogos/Partner-1.svg" },
    { id: 4, name: "DIADORA", logo: "" },
    { id: 5, name: "PUMA", logo: "" },
    { id: 6, name: "NIKE", logo: "" },
  ];

  return (
    <div>
      <ScrollReveal
        direction="up"
        duration={0.75}
        start="top 60%"
        once
        staggerChildren={0.08}
      >
        <MemoHeroSession startTextAnimation={heroRevealNearlyComplete} />
      </ScrollReveal>
      <ScrollReveal
        direction="up"
        duration={0.4}
        start="top 90%"
        scale
        once
        staggerChildren={0.1}
        onRevealNearlyComplete={onAboutReveal}
      >
        <MemoAboutSession startTextAnimation={aboutRevealNearlyComplete} />
      </ScrollReveal>
      <ScrollReveal
        direction="up"
        duration={0.4}
        start="top 90%"
        scale
        once
        staggerChildren={0.1}
        onRevealNearlyComplete={onServiceReveal}
      >
        <MemoServiceSession startTextAnimation={serviceRevealNearlyComplete} />
      </ScrollReveal>
      <ScrollReveal
        direction="up"
        duration={0.4}
        start="top 90%"
        scale
        once
        staggerChildren={0.1}
        onRevealNearlyComplete={onCarouselReveal}
      >
        <MemoHeroCarousel startTextAnimation={carouselRevealNearlyComplete} />
      </ScrollReveal>
      <ScrollReveal
        direction="up"
        duration={0.4}
        start="top 90%"
        scale
        once
        staggerChildren={0.1}
        onRevealNearlyComplete={onSustainabilityReveal}
      >
        <MemoSustainabilitySession
          startTextAnimation={sustainabilityRevealNearlyComplete}
        />
      </ScrollReveal>
      <ScrollReveal
        direction="up"
        duration={0.15}
        start="top 90%"
        scale
        once
        staggerChildren={0.08}
        onRevealNearlyComplete={onCoreValueReveal}
        className=""
      >
        <MemoCoreValueSession
          startTextAnimation={coreValueRevealNearlyComplete}
        />
      </ScrollReveal>
      {/* Achievements — self-triggers via IntersectionObserver + CSS reveal, no ScrollReveal wrapper */}
      <MemoAchievementsSession />
      <ScrollReveal direction="up" duration={0.4} start="top 80%" scale once>
        <MemoTestimonialSession />
      </ScrollReveal>
      <ScrollReveal direction="up" duration={0.4} start="top 85%" scale once>
  <MemoPartnersMapSession />
</ScrollReveal>
      <ScrollReveal direction="up" duration={0.4} start="top 80%" scale once>
        <MemoAnimatedImagesSection />
      </ScrollReveal>
      <MemoFaqSession />
    </div>
  );
}
