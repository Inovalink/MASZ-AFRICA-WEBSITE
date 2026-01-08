'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import Tag from './components/tag';

export default function VisionStatement() {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    const inner = innerRef.current;
    const text = textRef.current;
    if (!card || !inner || !text) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

   const rotateX = -(y - centerY) / 50; // softer tilt
const rotateY = (x - centerX) / 50; // softer tilt

    // Tilt the card
    gsap.to(card, {
      rotateX,
      rotateY,
      transformPerspective: 1000,
      duration: 0.4,
      ease: 'power3.out',
    });

    // Parallax inner layers
    gsap.to(inner, {
      x: (x - centerX) / 30,
      y: (y - centerY) / 30,
      duration: 0.4,
      ease: 'power3.out',
    });

    // Text moves slightly more for depth
    gsap.to(text, {
      x: (x - centerX) / 20,
      y: (y - centerY) / 20,
      duration: 0.4,
      ease: 'power3.out',
    });
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    const inner = innerRef.current;
    const text = textRef.current;
    if (!card || !inner || !text) return;

    gsap.to([card, inner, text], {
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
  };

  return (
    <section className="vision-statement grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      
      {/* LEFT — TEXT */}
      <div className="text space-y-6">
        <Tag text="vision" />
        <p className="subtext text-xl leading-relaxed text-neutral-700">
          To deliver trusted mining consumables and technical solutions
          that enhance productivity, reliability, and sustainability
          across Africa’s mining value chain.
        </p>
      </div>

      {/* RIGHT — IMAGE CARD */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="image-container relative h-[520px] rounded-2xl overflow-hidden cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* INNER LAYERS FOR PARALLAX */}
        <div
          ref={innerRef}
          className="absolute inset-0 w-full h-full"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* IMAGE */}
          <Image
            src="/aboutAssets/Image-3.jpg"
            alt="Vision Image"
            fill
            priority
            className="object-cover"
          />

          {/* OVERLAY — fixed relative to image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* BOTTOM TEXT ON IMAGE */}
          <div
            ref={textRef}
            className="absolute bottom-6 left-6 right-6 text-white text-lg font-medium"
            style={{ transform: 'translateZ(40px)' }}
          >
            Powering Africa’s Mining Future
          </div>
        </div>
      </div>
    </section>
  );
}
