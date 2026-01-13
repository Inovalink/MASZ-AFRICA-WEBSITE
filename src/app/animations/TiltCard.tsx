'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

interface TiltCardProps {
  imageSrc: string;
  title: string;
  bottomText?: string;
  className?: string;
  enableTilt?: boolean;
  enableMouse?: boolean; // 🔹 NEW
}

export default function TiltCard({
  imageSrc,
  title,
  bottomText,
  className = '',
  enableTilt = true,
  enableMouse = true, // 🔹 DEFAULT keeps current behavior
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // ------------------ Hover Tilt + Mouse Parallax ------------------
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!enableMouse) return; // 🔒 HARD STOP

    const card = cardRef.current;
    const inner = innerRef.current;
    const text = textRef.current;
    if (!card || !inner) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -(y - centerY) / 50;
    const rotateY = (x - centerX) / 50;

    // 🔹 TILT (only if BOTH mouse + tilt are enabled)
    if (enableTilt) {
      gsap.to(card, {
        rotateX,
        rotateY,
        transformPerspective: 1000,
        duration: 0.4,
        ease: 'power3.out',
      });
    }

    // 🔹 MOUSE PARALLAX
    gsap.to(inner, {
      x: enableTilt ? (x - centerX) / 50 : 0, // no X drift if tilt is off
      y: (y - centerY) / 50,
      duration: 0.4,
      ease: 'power3.out',
    });

    if (text) {
      gsap.to(text, {
        x: enableTilt ? (x - centerX) / 40 : 0,
        y: (y - centerY) / 40,
        duration: 0.4,
        ease: 'power3.out',
      });
    }
  };

  const handleMouseLeave = () => {
    if (!enableMouse) return; // 🔒 HARD STOP

    const card = cardRef.current;
    const inner = innerRef.current;
    const text = textRef.current;
    if (!card || !inner) return;

    gsap.to(inner, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    });

    if (text) {
      gsap.to(text, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
    }

    if (enableTilt) {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
    }
  };

  // ------------------ Scroll Parallax (ALWAYS ON) ------------------
  useEffect(() => {
    const card = cardRef.current;
    const inner = innerRef.current;
    const text = textRef.current;
    if (!card || !inner) return;

    const handleScroll = () => {
      const rect = card.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const cardCenter = rect.top + rect.height / 2;
      const distanceFromCenter = windowHeight / 2 - cardCenter;

      const parallaxY = distanceFromCenter / 20;
      const textY = distanceFromCenter / 15;

      gsap.to(inner, {
        y: parallaxY,
        duration: 0.5,
        ease: 'power3.out',
      });

      if (text) {
        gsap.to(text, {
          y: textY,
          duration: 0.5,
          ease: 'power3.out',
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative h-[400] lg:h-[520px] overflow-hidden cursor-pointer ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div
        ref={innerRef}
        className="absolute inset-0 w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <Image
          src={imageSrc}
          alt={title}
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {bottomText && (
          <div
            ref={textRef}
            className="absolute bottom-6 lg:bottom-12 left-6 right-6 text-light text-sm-regular lg:text-lg-medium"
            style={{ transform: 'translateZ(40px)' }}
          >
            {bottomText}
          </div>
        )}
      </div>
    </div>
  );
}
