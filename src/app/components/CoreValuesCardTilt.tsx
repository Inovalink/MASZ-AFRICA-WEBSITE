'use client';
import React, { useRef, useState } from 'react';

interface CoreValueCardProps {
  number: number;
  title: string;
  description: string;
}

const CoreValueCard: React.FC<CoreValueCardProps> = ({ number, title, description }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({ rotateX: 0, rotateY: 0, scale: 1 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const cardX = rect.left + rect.width / 2;
    const cardY = rect.top + rect.height / 2;

    const rotateX = ((e.clientY - cardY) / rect.height) * 15;
    const rotateY = ((e.clientX - cardX) / rect.width) * -15;

    setStyle({ rotateX, rotateY, scale: 1.03 });
  };

  const handleMouseLeave = () => {
    setStyle({ rotateX: 0, rotateY: 0, scale: 1 });
  };

  return (
    <div
      ref={cardRef}
      className="relative group cursor-pointer bg-surface-card-colored-primary text-light overflow-hidden w-[450px] h-[450px] rounded-2xl shadow-xl"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${style.rotateX}deg) rotateY(${style.rotateY}deg) scale(${style.scale})`,
        transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-[55%] bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

      {/* CONTENT LAYER */}
      <div className="relative z-10 h-full">
        <p className="lg:text-3xl-semibold lg:translate-x-[60px] lg:translate-y-[40px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
          {number}.
        </p>

        <p className="
          uppercase
          lg:text-2xl-semibold
          lg:rotate-90
          lg:translate-y-[140px]
          lg:px-[30px]
          lg:py-[30px]
          lg:group-hover:rotate-0
          lg:group-hover:px-0
          lg:group-hover:py-0
          lg:group-hover:translate-y-[55px]
          lg:group-hover:translate-x-[64px]
          transition-transform
          duration-500
          ease-[cubic-bezier(0.22,1,0.36,1)]
        ">
          {title}
        </p>

        <div className="lg:absolute lg:top-[300px] lg:left-0 lg:right-0 lg:overflow-hidden">
          <p className="
            lg:text-lg-regular
            lg:px-[70px]
            lg:w-[540px]
            opacity-0
            -translate-x-[96px]
            group-hover:opacity-100
            group-hover:translate-x-0
            transition-all
            duration-600
            ease-[cubic-bezier(0.22,1,0.36,1)]
            will-change-[opacity,transform]
          ">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CoreValueCard;
