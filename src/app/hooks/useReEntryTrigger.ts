'use client';

import { useState, useEffect, RefObject } from 'react';

/**
 * Returns true the first time the observed element re-enters the viewport
 * after having been visible and then left.
 *
 * Pass `enabled = false` to delay arming (e.g. wait for lineByLineComplete).
 * When `enabled` becomes true the element is assumed to have already been
 * seen (line-by-line completed), so the hook skips directly to watching for
 * exit → re-entry rather than requiring a full seen → exit → seen cycle.
 */
export function useReEntryTrigger(
  ref: RefObject<Element | null>,
  enabled: boolean = true,
): boolean {
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (!enabled || triggered) return;
    const el = ref.current;
    if (!el) return;

    // Determine initial state from current scroll position.
    // Since enabled only becomes true after the section was visible (e.g.
    // lineByLineComplete), we skip the "waiting to be seen" phase.
    const rect = el.getBoundingClientRect();
    const isInView = rect.top < window.innerHeight && rect.bottom > 0;
    let exited = !isInView; // already out of view → skip straight to watching for re-entry

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? false;
        if (!visible && !exited) {
          exited = true;
        } else if (visible && exited) {
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
