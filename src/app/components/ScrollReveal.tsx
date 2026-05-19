'use client';

import React, { useLayoutEffect, useEffect, useRef, ReactNode } from 'react';
import gsap from 'gsap';

export type ScrollRevealDirection = 'up' | 'down' | 'left' | 'right';

export interface ScrollRevealProps {
  children: ReactNode;
  direction?: ScrollRevealDirection;
  delay?: number;
  duration?: number;
  once?: boolean;
  start?: string;
  className?: string;
  stagger?: number;
  /** Stagger delay (seconds) for child elements. Use data-scroll-reveal-item on inner elements, or direct children animate. */
  staggerChildren?: number;
  scale?: boolean;
  /** Called when the main reveal animation is about to end (at 85% progress). Use to chain e.g. hero text animation. */
  onRevealNearlyComplete?: () => void;
}

const directionFrom = {
  up: { y: 120, x: 0 },
  down: { y: -120, x: 0 },
  left: { x: 120, y: 0 },
  right: { x: -120, y: 0 },
};

const directionFromChild = {
  up: { y: 56, x: 0 },
  down: { y: -56, x: 0 },
  left: { x: 56, y: 0 },
  right: { x: -56, y: 0 },
};

// Convert GSAP-style "top X%" to IntersectionObserver rootMargin.
// "top 80%" means trigger when element top reaches 80% down the viewport →
// shrink IO root rectangle bottom by (100 - X)% so element intersects at that threshold.
function startToRootMargin(start: string): string {
  const m = start.match(/top\s+(\d+(?:\.\d+)?)%/);
  if (m) {
    const pct = parseFloat(m[1]);
    return `0px 0px -${(100 - pct).toFixed(1)}% 0px`;
  }
  return '0px 0px -20% 0px';
}

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.7,
  once = false,
  start = 'top 60%',
  className,
  stagger,
  staggerChildren,
  scale = false,
  onRevealNearlyComplete,
}: ScrollRevealProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Set initial "from" state before paint so no flash/jump when page loads or on nav
  useLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const from = directionFrom[direction];
    const initial: gsap.TweenVars = { ...from, opacity: 0, force3D: true };
    if (scale) initial.scale = 0.94;
    gsap.set(el, initial);
    if (staggerChildren != null) {
      const marked = el.querySelectorAll<HTMLElement>('[data-scroll-reveal-item]');
      const childTargets =
        marked.length > 0
          ? Array.from(marked)
          : el.children.length > 1
            ? Array.from(el.children)
            : el.children.length === 1 && el.children[0].children.length > 0
              ? Array.from(el.children[0].children)
              : Array.from(el.children);
      if (childTargets.length > 0) {
        const childFrom = directionFromChild[direction];
        gsap.set(childTargets, { ...childFrom, opacity: 0, force3D: true });
      }
    }
  }, [direction, scale, staggerChildren]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const from = directionFrom[direction];
    const fromVars: gsap.TweenVars = {
      ...from,
      opacity: 0,
      ease: 'power2.inOut',
    };
    if (scale) fromVars.scale = 0.94;

    const toVars: gsap.TweenVars = {
      x: 0,
      y: 0,
      opacity: 1,
      duration,
      delay,
      ease: 'power2.inOut',
      overwrite: 'auto',
      force3D: true,
      onComplete: () => {
        if (el) el.style.willChange = 'auto';
      },
    };
    if (scale) toVars.scale = 1;

    const parentTarget = staggerChildren != null ? el : (stagger != null ? el.children : el);
    const toVarsWithCallback = { ...toVars };
    if (onRevealNearlyComplete) {
      (toVarsWithCallback as gsap.TweenVars).onUpdate = function () {
        const tween = this;
        if (tween.progress() >= 0.85 && !(tween as any)._revealFired) {
          (tween as any)._revealFired = true;
          onRevealNearlyComplete();
        }
      };
    }

    const playForward = () => {
      gsap.fromTo(
        parentTarget,
        fromVars,
        {
          ...toVarsWithCallback,
          stagger: staggerChildren != null ? 0 : (stagger ?? 0),
        }
      );

      if (staggerChildren != null) {
        const marked = el.querySelectorAll<HTMLElement>('[data-scroll-reveal-item]');
        const childTargets =
          marked.length > 0
            ? Array.from(marked)
            : el.children.length > 1
              ? Array.from(el.children)
              : el.children.length === 1 && el.children[0].children.length > 0
                ? Array.from(el.children[0].children)
                : Array.from(el.children);

        if (childTargets.length > 0) {
          const childFrom = directionFromChild[direction];
          gsap.fromTo(
            childTargets,
            { ...childFrom, opacity: 0, ease: 'power2.inOut' },
            {
              x: 0,
              y: 0,
              opacity: 1,
              duration: 0.3,
              stagger: staggerChildren,
              delay: 0.2,
              ease: 'power2.inOut',
              overwrite: 'auto',
              force3D: true,
            }
          );
        }
      }
    };

    const rootMargin = startToRootMargin(start);
    let hasPlayed = false;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          if (once && hasPlayed) return;
          hasPlayed = true;
          playForward();
          if (once) io.disconnect();
        } else if (!once && hasPlayed) {
          // Reverse when element leaves viewport (non-once mode)
          gsap.to(el, {
            ...fromVars,
            duration: duration * 0.5,
            overwrite: 'auto',
            force3D: true,
          });
          hasPlayed = false;
        }
      },
      { rootMargin, threshold: 0 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      gsap.killTweensOf(el);
    };
  }, [direction, delay, duration, once, start, stagger, staggerChildren, scale]);

  const from = directionFrom[direction];
  const initialStyle: React.CSSProperties = {
    opacity: 0,
    transform: scale
      ? `translate3d(${from.x}px, ${from.y}px, 0) scale(0.94)`
      : `translate3d(${from.x}px, ${from.y}px, 0)`,
    willChange: 'transform, opacity',
  };

  return (
    <div
      ref={wrapperRef}
      className={className ?? undefined}
      style={initialStyle}
    >
      {children}
    </div>
  );
}
