'use client';
import React, { useEffect, useRef } from 'react';

interface AutoplayVideoProps {
  src: string;
  classname?: string;
  /** If true, video takes full viewport width (w-screen). If false, respects parent width. Default: true */
  fullWidth?: boolean;
}

function AutoplayVideo({ src, classname = '', fullWidth = true }: AutoplayVideoProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   const el = containerRef.current;
  //   if (!el || typeof window === 'undefined') return;

  //   const observer = new IntersectionObserver(
  //     ([entry]) => {
  //       if (entry.isIntersecting) {
  //         document.body.classList.add('video-in-view');
  //       } else {
  //         document.body.classList.remove('video-in-view');
  //       }
  //     },
  //     {
  //       threshold: 0.5,
  //     }
  //   );

  //   observer.observe(el);

  //   return () => {
  //     observer.disconnect();
  //     document.body.classList.remove('video-in-view');
  //   };
  // }, []);
  
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only hide the navbar when the user has scrolled past the initial
        // viewport — prevents hero-section videos from triggering on page load.
        if (entry.isIntersecting && window.scrollY > 150) {
          document.body.classList.add('video-in-view');
        } else {
          document.body.classList.remove('video-in-view');
        }
      },
      {
        threshold: 0.6,
        rootMargin: '-10% 0px -10% 0px',
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      document.body.classList.remove('video-in-view');
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative h-full lg:max-h-[840px] lg:h-full bg-[#0d0d0d] overflow-hidden flex items-center justify-center ${
        fullWidth ? 'w-screen' : 'w-full'
      } ${classname}`}
    >
      <video
        src={src}
        autoPlay
        muted
        playsInline
        loop
        controls={false}
        preload="metadata"
        className="h-full w-full object-contain"
      />
    </div>
  );
  
}

export default AutoplayVideo;
