'use client';

import { useState, useEffect, useRef } from 'react';

const TOP_THRESHOLD = 150;

/**
 * Returns true the first time the user scrolls back to the top of the page
 * and then scrolls down again — identical to the pattern in AboutSession.
 *
 * Pass `enabled = false` to pause the listener until a prerequisite is met
 * (e.g. wait until lineByLineComplete before arming the trigger).
 */
export function useScrollToTopTrigger(enabled: boolean = true): boolean {
  const [triggered, setTriggered] = useState(false);

  const pendingRef          = useRef<{ idleId: number; timeoutId: ReturnType<typeof setTimeout> } | null>(null);
  const hasScrolledDownRef  = useRef(false);
  const hasReturnedToTopRef = useRef(false);

  useEffect(() => {
    if (triggered || !enabled) return;

    let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    let wasAtTop    = lastScrollY <= TOP_THRESHOLD;

    const clearPending = () => {
      const p = pendingRef.current;
      if (p) {
        cancelIdleCallback(p.idleId);
        clearTimeout(p.timeoutId);
        pendingRef.current = null;
      }
    };

    const handleScroll = () => {
      const currentScrollY  = window.scrollY;
      const isAtTop         = currentScrollY <= TOP_THRESHOLD;
      const isScrollingDown = currentScrollY > lastScrollY;
      const justLeftTop     = wasAtTop && !isAtTop && isScrollingDown;

      if (isAtTop && hasScrolledDownRef.current && !hasReturnedToTopRef.current) {
        hasReturnedToTopRef.current = true;
      }

      if (justLeftTop && hasReturnedToTopRef.current) {
        clearPending();
        const run = () => {
          clearPending();
          setTriggered(true);
          window.removeEventListener('scroll', handleScroll);
        };
        // Triple rAF so layout is fully settled before mounting AnimationCopy,
        // then wait for an idle frame (or 500 ms fallback) for smoothest possible mount.
        requestAnimationFrame(() =>
          requestAnimationFrame(() =>
            requestAnimationFrame(() => {
              const idleId    = requestIdleCallback(run, { timeout: 500 });
              const timeoutId = setTimeout(run, 500);
              pendingRef.current = { idleId, timeoutId };
            })
          )
        );
      }

      if (justLeftTop && !hasScrolledDownRef.current) {
        hasScrolledDownRef.current = true;
      }

      wasAtTop    = isAtTop;
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearPending();
    };
  }, [triggered, enabled]);

  return triggered;
}
