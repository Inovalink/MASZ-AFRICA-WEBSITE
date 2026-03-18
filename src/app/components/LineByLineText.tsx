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
  const [mounted, setMounted] = useState(false);

  // Mark as ready once mounted AND fonts are loaded
  useEffect(() => {
    let cancelled = false;
    const ready = () => { if (!cancelled) setMounted(true); };

    if (document.fonts?.ready) {
      document.fonts.ready.then(ready);
    } else {
      // Fallback: wait a frame for fonts to settle
      requestAnimationFrame(ready);
    }
    return () => { cancelled = true; };
  }, []);

  // Split text into lines AFTER fonts are loaded
  useLayoutEffect(() => {
    if (!mounted) return;
    const el = wrapperRef.current;
    if (!el) return;

    // Revert any previous split first
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
  }, [mounted, yFrom]);

  // Start line-by-line animation when startAnimation becomes true
  useEffect(() => {
    if (!startAnimation || !splitRef.current) return;

    const { lines } = splitRef.current;
    gsap.to(lines, {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease: 'power2.out',
      delay,
      force3D: true,
      onComplete: () => {
        gsap.set(lines, { clearProps: 'transform,opacity' });
        onComplete?.();
      },
    });
  }, [startAnimation, duration, stagger, delay, onComplete]);

  return (
    <Wrapper
      ref={wrapperRef as any}
      className={className ?? undefined}
      style={{
        overflow: 'hidden',
        // Server renders with visibility:hidden so no unsplit text flashes.
        // useLayoutEffect sets visibility:visible after SplitType runs.
        visibility: mounted ? undefined : 'hidden',
        willChange: startAnimation ? 'transform, opacity' : 'auto',
      }}
    >
      {children}
    </Wrapper>
  );
}
