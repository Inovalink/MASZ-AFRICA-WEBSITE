'use client';

import { useState, useEffect, RefObject } from 'react';

/**
 * Returns true once the observed element has been visible and then left
 * the viewport — i.e. the user scrolled past it.
 *
 * Pass `enabled = false` to delay arming until a prerequisite is met
 * (e.g. wait until lineByLineComplete before watching for exit).
 */
export function useOutOfViewTrigger(
  ref: RefObject<Element | null>,
  enabled: boolean = true,
): boolean {
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (!enabled || triggered) return;
    const el = ref.current;
    if (!el) return;

    let hasBeenVisible = false;

    const io = new IntersectionObserver(
      (entries) => {
        const isIntersecting = entries[0]?.isIntersecting ?? false;
        if (isIntersecting) {
          hasBeenVisible = true;
        } else if (hasBeenVisible) {
          setTriggered(true);
          io.disconnect();
        }
      },
      { threshold: 0 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [ref, enabled, triggered]);

  return triggered;
}
