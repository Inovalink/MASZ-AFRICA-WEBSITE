"use client";

import { useEffect, useRef } from "react";

const AUTO_SCROLL_SPEED = 0.4; // smaller = smoother

export default function TestimonialSection() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isPaused = useRef(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let rafId: number;

    const autoScroll = () => {
      if (!isPaused.current) {
        container.scrollLeft += AUTO_SCROLL_SPEED;

        // Loop effect
        if (
          container.scrollLeft + container.clientWidth >=
          container.scrollWidth
        ) {
          container.scrollLeft = 0;
        }
      }

      rafId = requestAnimationFrame(autoScroll);
    };

    rafId = requestAnimationFrame(autoScroll);

    // Pause on hover
    const pause = () => (isPaused.current = true);
    const resume = () => (isPaused.current = false);

    container.addEventListener("mouseenter", pause);
    container.addEventListener("mouseleave", resume);

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener("mouseenter", pause);
      container.removeEventListener("mouseleave", resume);
    };
  }, []);

  return null;
}
