"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type Props = {
  bgRefs: {
    current: React.RefObject<HTMLDivElement>;
    next: React.RefObject<HTMLDivElement>;
  };
  titleRef: React.RefObject<HTMLHeadingElement>;
  textRef: React.RefObject<HTMLParagraphElement>;
  nextImage: string;
  onComplete: () => void;
  deps: number;
};

export default function HeroAnimation({ bgRefs, titleRef, textRef, nextImage, onComplete, deps }: Props) {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const parallaxRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const current = bgRefs.current.current;
    const next = bgRefs.next.current;
    const titleEl = titleRef.current;
    const textEl = textRef.current;

    if (!current || !next || !titleEl || !textEl) return;

    timelineRef.current?.kill();

    const img = new Image();
    img.src = nextImage;
    img.onload = () => {
      next.style.backgroundImage = `url(${nextImage})`;

      const titleWords = Array.from(titleEl.children) as HTMLElement[];
      const textWords = Array.from(textEl.children) as HTMLElement[];

      gsap.set(next, { opacity: 0, scale: 1.05 });
      gsap.set(current, { scale: 1, opacity: 1 });

      const tl = gsap.timeline({ onComplete });
      timelineRef.current = tl;

      // === Crossfade & subtle zoom ===
      tl.to(next, { opacity: 1, scale: 1, duration: 2.2, ease: "power2.out" }, 0);
      tl.to(current, { opacity: 0, scale: 1.05, duration: 2.2, ease: "power2.out" }, 0);

      // === Text IN ===
      tl.fromTo(titleWords,
        { opacity: 0, y: 40, filter: "blur(14px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, stagger: 0.08, ease: "power3.out" },
        0.3
      );

      tl.fromTo(textWords,
        { opacity: 0, y: 28, filter: "blur(12px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.3, stagger: 0.06, ease: "power3.out" },
        0.35
      );

      // === Hold ===
      tl.to({}, { duration: 3 });

      // === Text OUT ===
      tl.to([...titleWords, ...textWords],
        { opacity: 0, y: -30, filter: "blur(10px)", duration: 1.0, stagger: 0.05, ease: "power3.in" },
        "+=0"
      );

      // === Swap layers ===
      tl.call(() => {
        const temp = bgRefs.current.current;
        bgRefs.current.current = bgRefs.next.current;
        bgRefs.next.current = temp;
      });
    };

    // === Parallax effect ===
    const onMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20; // subtle movement
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      parallaxRef.current = { x, y };

      gsap.to([current, next], { x, y, duration: 0.7, ease: "power3.out" });
    };

    window.addEventListener("mousemove", onMouseMove);

    return () => {
      timelineRef.current?.kill();
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [deps]);

  return null;
}
