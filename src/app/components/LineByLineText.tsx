'use client';

import React, { useEffect, useRef, useState, useLayoutEffect, ReactNode } from 'react';
import SplitType from 'split-type';
import gsap from 'gsap';

export interface LineByLineTextProps {
  children: ReactNode;
  /** When true, the line-by-line reveal animation runs. */
  startAnimation?: boolean;
  /** Called when the line animation completes (e.g. to then show AnimationCopy). */
  onComplete?: () => void;
  className?: string;
  /** Duration per line (seconds). */
  duration?: number;
  /** Delay between lines (seconds). */
  stagger?: number;
  /** Delay before first line (seconds). */
  delay?: number;
  /** Initial y offset (px). */
  yFrom?: number;
  /** Wrapper element. */
  as?: 'div' | 'p' | 'span';
}

export default function LineByLineText({
  children,
  startAnimation = false,
  onComplete,
  className,
  duration = 0.7,
  stagger = 0.12,
  delay = 0.1,
  yFrom = 28,
  as: Wrapper = 'div',
}: LineByLineTextProps) {
  const wrapperRef = useRef<HTMLDivElement | HTMLParagraphElement | HTMLSpanElement>(null);
  const splitRef = useRef<{ split: SplitType; lines: Element[] } | null>(null);
  const [fontsReady, setFontsReady] = useState(false);

  // Wait for fonts to load before splitting.
  // In production, web fonts load async — SplitType measures line breaks using
  // font metrics, so splitting before fonts load creates wrong line breaks.
  // Uses document.fonts.ready with a hard 3s timeout fallback so text always
  // appears even if fonts fail to load.
  useEffect(() => {
    let cancelled = false;

    const markReady = () => {
      if (!cancelled) setFontsReady(true);
    };

    // Race: fonts.ready vs 3s timeout (whichever comes first)
    const timeoutId = setTimeout(markReady, 3000);

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        // Extra rAF after fonts.ready to ensure browser has reflowed with new metrics
        requestAnimationFrame(() => {
          requestAnimationFrame(markReady);
        });
      });
    } else {
      // No font loading API — use two rAFs as fallback
      requestAnimationFrame(() => {
        requestAnimationFrame(markReady);
      });
    }

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      setFontsReady(false);
    };
  }, []);

  // Split text into lines AFTER fonts have loaded
  useLayoutEffect(() => {
    if (!fontsReady) return;
    const el = wrapperRef.current;
    if (!el) return;

    // Revert any previous split (StrictMode double-invoke safety)
    if (splitRef.current) {
      splitRef.current.split.revert();
      splitRef.current = null;
    }

    const split = new SplitType(el as HTMLElement, { types: 'lines' });
    const lines = split.lines;

    if (!lines || lines.length === 0) {
      gsap.set(el, { visibility: 'visible' });
      return;
    }

    splitRef.current = { split, lines: Array.from(lines) };
    gsap.set(lines, { opacity: 0, y: yFrom, force3D: true });
    gsap.set(el, { visibility: 'visible' });

    return () => {
      split.revert();
      splitRef.current = null;
    };
  }, [fontsReady, yFrom]);

  // Start line-by-line animation when startAnimation becomes true.
  // Also depends on fontsReady so if startAnimation was already true
  // before fonts loaded (e.g. hover mount), the animation fires once
  // the split is populated.
  useEffect(() => {
    if (!startAnimation || !splitRef.current) return;

    const { lines, split } = splitRef.current;
    gsap.to(lines, {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease: 'power2.out',
      delay,
      force3D: true,
      onComplete: () => {
        // Revert SplitType — restores natural DOM so text reflows cleanly
        gsap.set(lines, { clearProps: 'all' });
        split.revert();
        splitRef.current = null;
        onComplete?.();
      },
    });
  }, [startAnimation, fontsReady, duration, stagger, delay, onComplete]);

  return (
    <Wrapper
      ref={wrapperRef as any}
      className={className ?? undefined}
      style={{
        overflow: 'hidden',
        // Hidden until fonts are loaded and SplitType has run —
        // prevents unsplit text from flashing with wrong line breaks.
        visibility: fontsReady ? undefined : 'hidden',
        willChange: startAnimation ? 'transform, opacity' : 'auto',
      }}
    >
      {children}
    </Wrapper>
  );
}