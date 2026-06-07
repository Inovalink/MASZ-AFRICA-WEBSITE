'use client';

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import Tag from '../components/tag';
import Button from '../components/button';
import ImageCarousel from '../components/ImageCarousel';
import { MoveRight } from 'lucide-react';
import AnimationCopy from '../animations/WritingTextAnimation';
import HeaderLineByLineAnimation from '../animations/HeaderLineByLineAnimation';
import LineByLineText from '../components/LineByLineText';

const ABOUT_PARA_1 =
  'MASZ-Africa is a Ghana-based mining supply and engineering support ' +
  'company committed to helping mining operations run efficiently, ' +
  'reliably, and without interruption. We provide high-quality ' +
  'consumables, certified equipment, and practical technical services ' +
  'backed by real hands-on industry experience. Through trusted ' +
  'global sourcing and strong technical understanding, we ensure ' +
  'every product we deliver performs exactly as required in demanding ' +
  'mining environments.';

const ABOUT_PARA_2 =
  'Our team works closely with clients to understand their ' +
  'operational needs, recommend the right solutions, and provide ' +
  'support that genuinely improves performance. With a consistent ' +
  'focus on on-time delivery, transparent communication, and ' +
  'dependable field assistance, we help mines reduce downtime and ' +
  'keep production moving. At MASZ-Africa, our goal is simple — ' +
  'supply what works, support what matters, and deliver the level of ' +
  'service every mining operation expects and deserves.';

interface AboutSessionProps {
  /** When true, the about body line-by-line animation starts (after scroll reveal is about to end). */
  startTextAnimation?: boolean;
}

const ABOUT_CAROUSEL_SLIDES = [
  { src: '/homeAssets/Image-2.webp', alt: '', priority: true },
  { src: '/homeAssets/Image-7.webp', alt: '' },
  { src: '/homeAssets/Image-8.webp', alt: '' },
  { src: '/homeAssets/Image-9.webp', alt: '' },

];

const HEADER_LINE_Y = 28;
const HEADER_STAGGER = 0.07;
const HEADER_DURATION = 0.2;
const HEADER_DELAY = 0.1;
const DESCRIPTION_DURATION = 0.13;
const DESCRIPTION_STAGGER = 0.05;

function AboutSession({ startTextAnimation = false }: AboutSessionProps) {
  const [lineByLineComplete, setLineByLineComplete] = useState(false);
  const [startBodyAnimation, setStartBodyAnimation] = useState(false);
  const [startPara2Animation, setStartPara2Animation] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const showAnimationCopyRef = useRef(false);
  const sectionExitedRef = useRef(false);
  const pendingCopyRafRef = useRef<number | null>(null);

  // ── AnimationCopy scroll-reveal (mirrors OurStory pattern) ──────────────────
  useEffect(() => {
    if (!lineByLineComplete) return;
    const section = sectionRef.current;
    if (!section) return;

    const clearPending = () => {
      if (pendingCopyRafRef.current !== null) {
        cancelAnimationFrame(pendingCopyRafRef.current);
        pendingCopyRafRef.current = null;
      }
    };

    const revealOverlay = () => {
      clearPending();
      if (showAnimationCopyRef.current) return;
      showAnimationCopyRef.current = true;
      const overlay = overlayRef.current;
      if (!overlay) return;
      const staticText = overlay.previousElementSibling as HTMLElement | null;
      if (staticText) { staticText.style.visibility = 'hidden'; staticText.style.pointerEvents = 'none'; }
      gsap.set(overlay, { visibility: 'visible', pointerEvents: 'auto' });
      requestAnimationFrame(() => {
        gsap.fromTo(overlay,
          { opacity: 0, force3D: true },
          { opacity: 1, duration: 0.5, ease: 'power2.out', force3D: true },
        );
      });
    };

    const handleScroll = () => {
      if (showAnimationCopyRef.current) return;
      const rect = section.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;

      if (!isInView) {
        sectionExitedRef.current = true;
        return;
      }

      if (isInView && sectionExitedRef.current) {
        clearPending();
        pendingCopyRafRef.current = requestAnimationFrame(revealOverlay);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearPending();
    };
  }, [lineByLineComplete]);

  return (
    <section ref={sectionRef} className=" lg:mx-[24] xl:mx-[120] min-[1920px]:mx-[200]! relative lg:my-[100] xl:my-[150]">
<div className="about-session-container my-[100] xl:flex xl:justify-between xl:items-stretch xl:gap-[50px]">        {/* Left: Text + Button */}
        <div className="session-container xl:w-1/2" data-scroll-reveal-item>
          <Tag text="About us" className="ml-[22] lg:ml-[0]" />
          <div className="about-us-header text-xl-semibold leading-[110%] uppercase ml-[22] lg:ml-[0] my-[30] lg:my-[37]  lg:text-4xl-semibold tracking-tight ">
            <HeaderLineByLineAnimation
              startAnimation={startTextAnimation}
              onComplete={() => setStartBodyAnimation(true)}
              lineY={HEADER_LINE_Y}
              duration={HEADER_DURATION}
              stagger={HEADER_STAGGER}
              delay={HEADER_DELAY}
              style={{ overflow: 'hidden' }}
            >
              Who <span className="text-primary-default">We are</span>
            </HeaderLineByLineAnimation>
          </div>

          {/* Phase 1: line-by-line reveal.
              Phase 2: AnimationCopy mounts immediately after — overlay starts
              visibility:hidden via useLayoutEffect so ScrollTrigger runs silently.
              Revealed via GSAP on re-entry with no DOM swap (no scroll break). */}
          {!lineByLineComplete ? (
            <div className="flex flex-col gap-5 mx-[25] lg:ml-[0]">
              <LineByLineText
                startAnimation={startBodyAnimation}
                duration={DESCRIPTION_DURATION}
                stagger={DESCRIPTION_STAGGER}
                onComplete={() => setStartPara2Animation(true)}
                className="about-us-text text-lg-medium lg:text-xl-medium 2xl:text-[24px] lg:leading-8 lg:tracking-tight text-default-body"
              >
                {ABOUT_PARA_1}
              </LineByLineText>
              <LineByLineText
                startAnimation={startPara2Animation}
                duration={DESCRIPTION_DURATION}
                stagger={DESCRIPTION_STAGGER}
                onComplete={() => setLineByLineComplete(true)}
                className="about-us-text text-lg-medium lg:text-xl-medium 2xl:text-[24px] lg:leading-8 lg:tracking-tight text-default-body"
              >
                {ABOUT_PARA_2}
              </LineByLineText>
            </div>
          ) : (
            <div className="relative overflow-hidden" style={{ contain: 'layout style paint' }}>
              <div
                className="flex flex-col gap-5 mx-[25] lg:ml-[0] about-us-text text-lg-medium lg:text-xl-medium 2xl:text-[24px] lg:leading-8 lg:tracking-tight text-default-body"
              >
                <p>{ABOUT_PARA_1}</p>
                <p>{ABOUT_PARA_2}</p>
              </div>
              <div
                ref={overlayRef}
                className="absolute top-0 left-0 right-0"
                style={{ opacity: 0, visibility: 'hidden', pointerEvents: 'none', contain: 'layout style paint', isolation: 'isolate' }}
              >
                <AnimationCopy colorAccent='#41E932'>
                  <div className="flex flex-col gap-5 mx-[25] lg:ml-[0] about-us-text text-default-body text-lg-medium lg:text-xl-medium 2xl:text-[24px] lg:leading-8 lg:tracking-tight">
                    <p>{ABOUT_PARA_1}</p>
                    <p>{ABOUT_PARA_2}</p>
                  </div>
                </AnimationCopy>
              </div>
            </div>
          )}

          {/* Mobile-only image */}
          <ImageCarousel
            slides={ABOUT_CAROUSEL_SLIDES}
            className="xl:hidden about-us-image rounded-[4px] h-[400px] mx-[25] lg:mx-0 mt-[50]"
          />

          <Button
          href='/aboutUs'
            label="Learn more"
            variant="primary"
            size="large"
            icon={<MoveRight size={16} />}
            className="ml-[22] lg:ml-[0] hover:w-fit! w-fit  my-[35] lg:mt-[65] lg:mb-0"
          />
        </div>

        {/* Right: Large screen image */}
        <div className="hidden xl:flex xl:w-1/2 rounded-[4px] overflow-hidden xl:justify-end xl:items-stretch" data-scroll-reveal-item>
          <ImageCarousel
            slides={ABOUT_CAROUSEL_SLIDES}
            className="about-us-image w-full h-full"
          />
        </div>
      </div>
    </section>
  );
}

export default AboutSession;
