'use client';

import React, { useEffect, useRef, useState, useLayoutEffect, ReactNode } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/dist/SplitText';

gsap.registerPlugin(SplitText);

export interface LineByLineTextProps {
  children: ReactNode;
  /** When true, the line-by-line reveal animation runs. */
  startAnimation?: boolean;
  /** Called when the line animation completes. */
  onComplete?: () => void;
  className?: string;
  /** Duration per line (seconds). */
  duration?: number;
  /** Delay between lines (seconds). */
  stagger?: number;
  /** Delay before first line (seconds). */
  delay?: number;
  /** Initial y offset (px). Accepted for API compatibility — not used with
   *  the SplitText mask approach, which always starts lines at yPercent:100
   *  so they are fully hidden behind their per-line clip masks. */
  yFrom?: number;
  /** Wrapper element. */
  as?: 'div' | 'p' | 'span';
  /** If true, keep SplitText wrappers after animation completes. */
  keepSplit?: boolean;
  /** If true, defer splitting until startAnimation becomes true. */
  deferSplit?: boolean;
}

/* ----------------------------------------------------------------------------
   Why visibility:hidden on the initial render (same reasoning as inovalink):

   The browser paints SSR HTML before React hydrates. Without pre-hiding, the
   user sees the raw un-animated text for the few frames between first paint
   and hydration. Rendering with visibility:hidden keeps the first paint blank;
   the layout effect then keeps it hidden until SplitText has wrapped each line
   in its overflow:clip mask, at which point autoAlpha:1 reveals it cleanly.
---------------------------------------------------------------------------- */
const HIDDEN_STYLE: React.CSSProperties = { visibility: 'hidden' };

export default function LineByLineText({
  children,
  startAnimation = false,
  onComplete,
  className,
  duration = 0.7,
  stagger = 0.12,
  delay = 0.1,
  yFrom: _yFrom = 28, // eslint-disable-line @typescript-eslint/no-unused-vars
  as: Wrapper = 'div',
  keepSplit = false,
  deferSplit = false,
}: LineByLineTextProps) {
  const wrapperRef = useRef<HTMLDivElement | HTMLParagraphElement | HTMLSpanElement>(null);
  const splitRef = useRef<SplitText | null>(null);
  const hasAnimatedRef = useRef(false);
  const [fontsReady, setFontsReady] = useState(false);

  // Stable ref for onComplete — keeps the animation effect dependency array
  // stable so the tween is never killed by a callback identity change.
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; });

  useEffect(() => {
    let cancelled = false;
    const markReady = () => { if (!cancelled) setFontsReady(true); };
    const timeoutId = setTimeout(markReady, 3000);
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        requestAnimationFrame(() => requestAnimationFrame(markReady));
      });
    } else {
      requestAnimationFrame(() => requestAnimationFrame(markReady));
    }
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      setFontsReady(false);
    };
  }, []);

  const readyToSplit = fontsReady && (!deferSplit || startAnimation);

  useLayoutEffect(() => {
    if (!readyToSplit) return;
    const el = wrapperRef.current;
    if (!el) return;

    if (splitRef.current) {
      splitRef.current.revert();
      splitRef.current = null;
    }
    hasAnimatedRef.current = false;

    // mask:'lines' wraps each line in an overflow:clip div automatically.
    // This is the key difference from SplitType: lines are clipped at their
    // own boundaries, so the container needs no overflow:hidden and flex
    // layouts never see a max-content width change on revert.
    const split = new SplitText(el as HTMLElement, {
      type: 'lines',
      mask: 'lines',
    });

    const lines = split.lines as HTMLElement[];

    if (!lines.length) {
      gsap.set(el, { autoAlpha: 1 });
      return;
    }

    splitRef.current = split;

    // Reset margins/padding on lines and their mask parents so the split
    // doesn't break inherited line-height or add unexpected spacing.
    const masks = lines
      .map(l => l.parentElement)
      .filter((m): m is HTMLElement => Boolean(m));
    gsap.set([...lines, ...masks], { lineHeight: 'inherit', margin: 0, padding: 0 });

    // Promote lines to their own GPU layer for the duration of the tween.
    gsap.set(lines, { willChange: 'transform', force3D: true });

    // yPercent:100 moves each line exactly one line-height below its mask —
    // perfectly hidden. This is the approach from the inovalink hook.
    gsap.set(lines, { yPercent: 100, opacity: 0 });
    gsap.set(el, { autoAlpha: 1 });

    return () => {
      split.revert();
      splitRef.current = null;
      gsap.set(el, { clearProps: 'visibility,opacity' });
    };
  }, [readyToSplit]);

  useEffect(() => {
    if (!startAnimation || !fontsReady || !splitRef.current) return;
    if (hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    const el = wrapperRef.current;
    const split = splitRef.current;
    const lines = split.lines as HTMLElement[];

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lines,
        { yPercent: 100, opacity: 0, force3D: true },
        {
          yPercent: 0,
          y: 0,
          opacity: 1,
          duration,
          stagger,
          ease: 'power2.out',
          delay,
          force3D: true,
          onComplete: () => {
            if (!keepSplit) {
              gsap.set(lines, { willChange: 'auto', clearProps: 'all' });
              split.revert();
              splitRef.current = null;
              if (el) gsap.set(el, { clearProps: 'visibility,opacity' });
            }
            onCompleteRef.current?.();
          },
        },
      );
    });

    return () => { ctx.revert(); };
  }, [startAnimation, fontsReady, readyToSplit, duration, stagger, delay, keepSplit]);

  return (
    <Wrapper
      ref={wrapperRef as any}
      className={className ?? undefined}
      style={HIDDEN_STYLE}
    >
      {children}
    </Wrapper>
  );
}
