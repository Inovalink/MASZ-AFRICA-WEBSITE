'use client';

import React, { useRef, useEffect, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import SplitType from 'split-type';

export interface HeaderLineByLineAnimationProps {
  /** When true, the header animation starts */
  startAnimation?: boolean;
  /** Callback fired when animation completes */
  onComplete?: () => void;
  /** Initial Y offset for lines (default: 28) */
  lineY?: number;
  /** Animation duration (default: 0.6) */
  duration?: number;
  /** Stagger delay between lines (default: 0.12) */
  stagger?: number;
  /** Delay before animation starts (default: 0.1) */
  delay?: number;
  /** Easing function (default: 'power2.out') */
  ease?: string;
  /** Children to animate (should be text content) */
  children: React.ReactNode;
  /** Additional className */
  className?: string;
  /** Additional style */
  style?: React.CSSProperties;
  /** Element to render. Use a heading tag to give the section a real outline;
   *  Tailwind preflight resets heading font-size/weight, so styling is
   *  unchanged and the tag is purely semantic. */
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'h4';
}

/**
 * Reusable Header Line-by-Line Animation Component
 *
 * - Waits two rAFs before running SplitType so fonts have settled.
 * - Does NOT use document.fonts.ready (unreliable in production).
 * - Handles the race where startAnimation=true before the split is ready.
 * - Safe under React 18 StrictMode (hasAnimatedRef resets on cleanup).
 */
export default function HeaderLineByLineAnimation({
  startAnimation = false,
  onComplete,
  lineY = 28,
  duration = 0.6,
  stagger = 0.12,
  delay = 0.1,
  ease = 'power2.out',
  children,
  className,
  style,
  as: Wrapper = 'div',
}: HeaderLineByLineAnimationProps) {
  const headerTextRef = useRef<HTMLDivElement | HTMLHeadingElement>(null);
  const splitRef = useRef<{ split: SplitType; lines: Element[] } | null>(null);
  const hasAnimatedRef = useRef(false);

  // Phase 1: "ready" after two rAFs so fonts have been applied.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!cancelled) setReady(true);
      });
    });
    return () => {
      cancelled = true;
      // Reset so StrictMode double-invoke works correctly
      setReady(false);
    };
  }, []);

  // Phase 2: Split text into lines after fonts have settled.
  useLayoutEffect(() => {
    if (!ready) return;
    const el = headerTextRef.current;
    if (!el) return;

    if (splitRef.current) {
      splitRef.current.split.revert();
      splitRef.current = null;
    }

    const split = new SplitType(el, { types: 'lines' });
    const lines = split.lines;

    if (!lines || lines.length === 0) return;

    splitRef.current = { split, lines: Array.from(lines) };
    gsap.set(lines, { opacity: 0, y: lineY, force3D: true });

    return () => {
      split.revert();
      splitRef.current = null;
      // Reset so animation can fire again after StrictMode re-mount
      hasAnimatedRef.current = false;
    };
  }, [ready, lineY]);

  // Phase 3: Animate when both startAnimation AND split are ready.
  useEffect(() => {
    if (!startAnimation || !ready || hasAnimatedRef.current || !splitRef.current) return;
    hasAnimatedRef.current = true;

    const { lines } = splitRef.current;
    gsap.to(lines, {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      delay,
      ease: ease as gsap.EaseString,
      force3D: true,
      onComplete: () => {
        gsap.set(lines, { clearProps: 'transform,opacity' });
        onComplete?.();
      },
    });
  }, [startAnimation, ready, duration, stagger, delay, ease, onComplete]);

  return (
    <Wrapper
      ref={headerTextRef as React.Ref<HTMLDivElement & HTMLHeadingElement>}
      className={className}
      style={style}
    >
      {children}
    </Wrapper>
  );
}
