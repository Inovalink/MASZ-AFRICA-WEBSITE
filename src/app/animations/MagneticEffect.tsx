'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface ButtonProps {
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function Button({ label, icon, className = '' }: ButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!buttonRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(buttonRef.current, {
        willChange: 'transform, box-shadow',
      });
    }, buttonRef);

    return () => ctx.revert();
  }, []);

  const onHover = () => {
    gsap.to(buttonRef.current, {
      y: -3,
      scale: 1.02,
      boxShadow: '0px 18px 40px rgba(0,0,0,0.25)',
      duration: 0.35,
      ease: 'power3.out',
    });
  };

  const onLeave = () => {
    gsap.to(buttonRef.current, {
      y: 0,
      scale: 1,
      boxShadow: '0px 10px 20px rgba(0,0,0,0.15)',
      duration: 0.35,
      ease: 'power3.out',
    });
  };

  return (
    <button
      ref={buttonRef}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`
        group relative inline-flex items-center gap-3
        rounded-full px-7 py-4
        bg-black text-white font-medium
        overflow-hidden
        ${className}
      `}
    >
      <span className="relative z-10">{label}</span>

      {icon && (
        <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
          {icon}
        </span>
      )}

      {/* Subtle glow */}
      <span
        className="
          absolute inset-0 rounded-full
          bg-white/10 opacity-0
          transition-opacity duration-300
          group-hover:opacity-100
        "
      />
    </button>
  );
}
