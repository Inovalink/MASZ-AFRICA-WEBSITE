'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxSection({
  imageSrc,
  imageAlt = 'Parallax image',
  title,
  subtitle,
  height = 'lg',
}) {
  const sectionRef = useRef(null);
  const mediaRef = useRef(null); // IMAGE + OVERLAY
  const textRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Image + overlay move together
      tl.to(
        mediaRef.current,
        {
          y: '40%',
          scale: 1.12,
          ease: 'none',
        },
        0
      );

      // Text counter motion
      tl.to(
        textRef.current,
        {
          y: '-20%',
          ease: 'none',
        },
        0
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative w-full overflow-hidden ${
        height === 'lg'
          ? 'h-[900px] lg:h-[1100px]'
          : 'h-[700px] lg:h-[900px]'
      }`}
    >
      {/* MEDIA LAYER (IMAGE + OVERLAY MOVE TOGETHER) */}
      <div
        ref={mediaRef}
        className="absolute top-[-10%] left-0 w-full h-[70%] lg:h-[120%]"
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          className="object-cover object-top"
        />

        {/* OVERLAY — now moves with image */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70 pointer-events-none" />
      </div>

      {/* TEXT LAYER */}
      <div ref={textRef} className="relative z-10 h-full flex items-end">
        <div className="max-w-[1200px] mx-auto px-6 pb-50 lg:pb-24">
          <h2 className="text-light text-xl-semibold lg:text-4xl-bold lg:text-6xl font-bold leading-tight">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-4 text-sm-regular lg:text-xl-regular text-light lg:w-[1000]">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
