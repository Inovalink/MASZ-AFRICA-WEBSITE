'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

interface AutoplayVideoProps {
  src: string;
  classname?: string;
  /** If true, video takes full viewport width (w-screen). If false, respects parent width. Default: true */
  fullWidth?: boolean;
  /** If true, renders a play/pause toggle button over the video. Default: false */
  showPauseButton?: boolean;
}

function AutoplayVideo({ src, classname = '', fullWidth = true, showPauseButton = false }: AutoplayVideoProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

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

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={showPauseButton ? togglePlayPause : undefined}
      className={`relative h-full lg:max-h-210 lg:h-full bg-[#0d0d0d] overflow-hidden flex items-center justify-center ${
        fullWidth ? 'w-screen' : 'w-full'
      } ${showPauseButton ? 'cursor-pointer' : ''} ${classname}`}
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        playsInline
        loop
        controls={false}
        preload="metadata"
        className="h-full w-full object-contain"
      />

      {showPauseButton && (
        <button
          onClick={(e) => { e.stopPropagation(); togglePlayPause(); }}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
          className="absolute bottom-4  z-10 flex items-center justify-center w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors duration-200 cursor-pointer"
        >
          {isPlaying ? <Pause size={16} fill="white" strokeWidth={0} /> : <Play size={16} fill="white" strokeWidth={0} />}
        </button>
      )}
    </div>
  );

}

export default AutoplayVideo;
