"use client";

import React, { memo, useState, useRef, useEffect, useCallback } from "react";
import Tag from "../components/tag";
import AchievementsTimeline, {
  Achievement,
} from "../components/AchievementsTimeline";
import LineByLineText from "../components/LineByLineText";
import HeaderLineByLineAnimation from "../animations/HeaderLineByLineAnimation";
import { achievements } from "../Data/achievements";
// ============================================
// DATA
// ============================================
const ACHIEVEMENTS: Achievement[] = [
  {
    id: 1,
    title:
      "Founded in 2025 and operational across Ghana, West-Africa and Globally.",
  },
  {
    id: 2,
    title: "5+ Major clients served with repeated contracts.",
  },
  {
    id: 3,
    title:
      "Expanded into technical maintenance and engineering advisory services.",
  },
  {
    id: 4,
    title: "15+ Years of combined working experience.",
  },
  {
    id: 5,
    title: "Established strategic alliances with international manufacturers.",
  },
];

// ============================================
// ANIMATION CONSTANTS
// ============================================
const HEADER_LINE_Y = 28;
const HEADER_STAGGER = 0.07;
const HEADER_DURATION = 0.3;
const HEADER_DELAY = 0.1;

// ============================================
// COMPONENT PROPS
// ============================================
interface AchievementsSessionProps {
  /** When provided externally (e.g. from ScrollReveal on home page), controls text animation start.
   *  When omitted, the section self-triggers via IntersectionObserver + CSS reveal. */
  startTextAnimation?: boolean;
}

// ============================================
// MAIN COMPONENT
// ============================================
function AchievementsSession({
  startTextAnimation: externalTrigger,
}: AchievementsSessionProps) {
  const [startSubtextAnimation, setStartSubtextAnimation] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [internalTrigger, setInternalTrigger] = useState(false);
  const [revealDone, setRevealDone] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // If no external trigger is provided, self-detect with IntersectionObserver
  const isSelfManaged = externalTrigger === undefined;

  useEffect(() => {
    if (!isSelfManaged) return;
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // 250ms: start text animation while CSS reveal is still transitioning
          setTimeout(() => setInternalTrigger(true), 250);
          // 550ms: CSS transition is 500ms, add 50ms buffer then mark reveal done
          // so the timeline ScrollTrigger sets up with correct (final) positions
          setTimeout(() => setRevealDone(true), 550);
          io.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [isSelfManaged]);

  // Resolve which trigger to use
  const startTextAnimation = isSelfManaged
    ? internalTrigger
    : externalTrigger ?? false;

  const onHeaderComplete = useCallback(() => {
    setStartSubtextAnimation(true);
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`achievements-session py-[80px] lg:py-[120px]${
        isSelfManaged
          ? ` css-reveal${isVisible ? " css-reveal--visible" : ""}`
          : ""
      }`}
    >
      <div className="achievements-content mx-[21px] lg:mx-[24px] xl:mx-[120px] min-[1920px]:mx-[200]!">
        {/* Tag */}
        <Tag text="Key Achievements" className="mb-[30px]" />

        <div className="md:flex gap-[50px] md:mb-[80] md:justify-between">
          {/* Header */}
          <div className="section-header uppercase text-xl-semibold leading-[110%] tracking-tight lg:text-4xl-semibold mb-[20px]">
            <HeaderLineByLineAnimation
              startAnimation={startTextAnimation}
              onComplete={onHeaderComplete}
              lineY={HEADER_LINE_Y}
              duration={HEADER_DURATION}
              stagger={HEADER_STAGGER}
              delay={HEADER_DELAY}
              style={{ overflow: "hidden" }}
            >
              <span className="text-nowrap">Checkout our key</span> <br />
              <span className="text-primary-default">
                achievements and milestones
              </span>
            </HeaderLineByLineAnimation>
          </div>

          {/* Subtext */}
          <div className="subtext mb-[60px] lg:mb-[0px] max-w-[484px] w-full">
            <LineByLineText
              startAnimation={startSubtextAnimation}
              duration={0.13}
              stagger={0.05}
              className="text-sm-medium lg:text-xl-medium leading-[120%] text-default-body"
            >
              Every milestone we&apos;ve reached is a result of hard work,
              strong partnerships, and a genuine commitment to supporting our
              clients&apos; operations.
            </LineByLineText>
          </div>
        </div>

        {/* Timeline — gate on revealDone so ScrollTrigger sets up only after
             the section is visible and the CSS transition has finished,
             ensuring correct position calculations */}
        <AchievementsTimeline
          achievements={achievements}
          ready={isSelfManaged ? revealDone : true}
        />
      </div>
    </section>
  );
}

export default memo(AchievementsSession);
