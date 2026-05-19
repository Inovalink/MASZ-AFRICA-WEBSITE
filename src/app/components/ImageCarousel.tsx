'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export interface CarouselSlide {
  src: string;
  alt?: string;
  priority?: boolean;
}

interface ImageCarouselProps {
  slides: CarouselSlide[];
  /** Ms between auto-advances. Default: 4000 */
  interval?: number;
  /** Extra classes on the outer wrapper — use for sizing, spacing, visibility. */
  className?: string;
  /** Extra classes on each Image element. Default: "object-cover" */
  imageClassName?: string;
}

function ImageCarousel({
  slides,
  interval = 4000,
  className = '',
  imageClassName = 'object-cover',
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(true);

  // Clone first slide at the end to create the seamless wrap illusion
  const extended = [...slides, slides[0]];
  const total = extended.length; // slides.length + 1

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => {
        // Guard: if onTransitionEnd never fired (carousel was hidden via display:none),
        // currentIndex can drift past slides.length. Detect and snap back silently.
        if (prev >= slides.length) {
          setTransitioning(false);
          return 0;
        }
        setTransitioning(true);
        return prev + 1;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [interval, slides.length]);

  const handleTransitionEnd = () => {
    // Landed on the clone — snap back to the real slide 0 without animation
    if (currentIndex >= slides.length) {
      setTransitioning(false);
      setCurrentIndex(0);
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: `${total * 100}%`,
          transform: `translateX(-${currentIndex * (100 / total)}%)`,
          transition: transitioning ? 'transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {extended.map((slide, i) => (
          <div
            key={i}
            style={{
              flex: `0 0 ${100 / total}%`,
              position: 'relative',
              height: '100%',
            }}
          >
            <Image
              src={slide.src}
              alt={slide.alt ?? ''}
              fill
              priority={slide.priority ?? i === 0}
              className={imageClassName}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageCarousel;
