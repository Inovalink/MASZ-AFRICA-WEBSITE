'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import gsap from 'gsap';
import Lottie from 'lottie-react';
import type { LottieRefCurrentProps } from 'lottie-react';


const BOX_COUNT = 6;
const HALFWAY = 0.5;

export default function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const boxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const logoRef = useRef<HTMLDivElement>(null);
  const lottieInstanceRef = useRef<LottieRefCurrentProps | null>(null);
  const prevPathnameRef = useRef(pathname);
  const isNavigatingRef = useRef(false);
  const pageReadyRef = useRef(false);
  const halfwayDoneRef = useRef(false);
  const [logoVisible, setLogoVisible] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [lottieData, setLottieData] = useState<any>(null);

  // Load lottie data once on mount — same pattern as aboutUs page
  useEffect(() => {
    fetch('/aboutAssets/fullLoader.json')
      .then((res) => res.json())
      .then(setLottieData)
      .catch(() => {});
  }, []);

  const tryExit = useCallback(() => {
    if (!halfwayDoneRef.current || !pageReadyRef.current) return;

    const overlay = overlayRef.current;
    const boxes = boxRefs.current.filter(Boolean);
    if (!overlay) return;

    if (logoRef.current) {
      gsap.to(logoRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.out',
        onComplete: () => {
          setLogoVisible(false);
          lottieInstanceRef.current?.pause();

          gsap.to(boxes, {
            scaleY: 0,
            duration: 0.45,
            ease: 'power3.inOut',
            stagger: 0.05,
            transformOrigin: 'top',
            onComplete: () => {
              overlay.classList.remove('page-transition-overlay--active');
              overlay.style.pointerEvents = 'none';
              overlay.style.visibility = 'hidden';
              gsap.set(boxes, { clearProps: 'transform' });
              isNavigatingRef.current = false;
              pageReadyRef.current = false;
              halfwayDoneRef.current = false;
            },
          });
        },
      });
    }
  }, []);

  const animateOverlayIn = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    pageReadyRef.current = false;
    halfwayDoneRef.current = false;
    setLogoVisible(false);

    overlay.classList.add('page-transition-overlay--active');
    overlay.style.pointerEvents = 'auto';
    overlay.style.visibility = 'visible';

    const boxes = boxRefs.current.filter(Boolean);
    gsap.set(boxes, { scaleY: 0, transformOrigin: 'top' });

    gsap.to(boxes, {
      scaleY: 1,
      duration: 0.5,
      ease: 'power3.inOut',
      stagger: 0.06,
      onComplete: () => {
        // Boxes fully down — show lottie
        setLogoVisible(true);
      },
    });
  }, []);

  // Intercept internal link clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (!anchor || isNavigatingRef.current) return;

      const href = anchor.getAttribute('href');
      if (
        !href ||
        !href.startsWith('/') ||
        href.startsWith('//') ||
        anchor.hasAttribute('target') ||
        anchor.hasAttribute('download') ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey
      ) return;

      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin || url.pathname === pathname) return;

      e.preventDefault();
      isNavigatingRef.current = true;
      animateOverlayIn();

      setTimeout(() => {
        router.push(href);
      }, 500);
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [pathname, router, animateOverlayIn]);

  // Page ready when pathname changes
  useEffect(() => {
    if (pathname !== prevPathnameRef.current && isNavigatingRef.current) {
      prevPathnameRef.current = pathname;
      window.scrollTo(0, 0);
      setTimeout(() => {
        pageReadyRef.current = true;
        tryExit();
      }, 100);
    } else {
      prevPathnameRef.current = pathname;
    }
  }, [pathname, tryExit]);

  // Fade + scale logo in when it becomes visible, then start lottie
  useEffect(() => {
    if (logoVisible && logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: 'back.out(1.4)',
          onComplete: () => {
            // Start lottie playing from beginning after fade-in
            lottieInstanceRef.current?.goToAndPlay(0, true);
          },
        }
      );
    }
  }, [logoVisible]);

  return (
    <>
      {children}
      <div
        ref={overlayRef}
        className="page-transition-overlay page-transition-overlay--boxes"
        aria-hidden="true"
        style={{ visibility: 'hidden' }}
      >
        {/* Boxes */}
        <div className="page-transition-overlay__boxes">
          {Array.from({ length: BOX_COUNT }).map((_, i) => (
            <div
              key={i}
              ref={(el) => { boxRefs.current[i] = el; }}
              className="page-transition-overlay__box"
            />
          ))}
        </div>

        {/* Lottie — centred over boxes, only rendered when visible */}
        {logoVisible && lottieData && (
          <div
            ref={logoRef}
            className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
            style={{ opacity: 0 }}
          >
            <div className="w-[140px] lg:w-[300px]">
              <Lottie
                animationData={lottieData}
                loop={true}
                autoplay={false}
                lottieRef={lottieInstanceRef}
                onEnterFrame={(e) => {
                  const ev = e as { currentTime: number; totalTime: number };
                  const progress = ev.currentTime / ev.totalTime;
                  if (!halfwayDoneRef.current && progress >= HALFWAY) {
                    halfwayDoneRef.current = true;
                    tryExit();
                  }
                }}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}