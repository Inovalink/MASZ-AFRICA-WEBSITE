'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Template({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        clearProps: 'all',
      }
    );
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
