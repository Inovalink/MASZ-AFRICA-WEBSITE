'use client';
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

type CoreValue = {
  id: number;
  number: string;
  title: string;
  description: string;
  image: string;
};

type CoreValueCardProps = {
  card: CoreValue;
};


const CoreValueCard: React.FC<CoreValueCardProps> = ({ card }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const numberRef = useRef<HTMLParagraphElement | null>(null);
  const titleRef = useRef<HTMLParagraphElement | null>(null);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);

  const hoverTl = useRef<gsap.core.Timeline | null>(null);

  const isMobile = useRef(false);

  useEffect(() => {
    const update = () => {
      isMobile.current = window.innerWidth < 1024;
    };

    update(); // set initial value after mount
    window.addEventListener('resize', update);

    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    const image = imageRef.current;
    const number = numberRef.current;
    const title = titleRef.current;
    const description = descriptionRef.current;

    // ===== Initial state for mobile & desktop =====
    if (isMobile.current) {
      // --- MOBILE: vertical stack ---

      gsap.set(number, { x: 40, y: 24 });
      gsap.set(title, { x: 100, y: 24, rotation: 0 });
      gsap.set(description, { opacity: 1, x: 195, y: 70 });
      gsap.set(cardEl, { height: 80, width: '100%' });
      gsap.set(image, { opacity: 0 });
    } else {
      // --- DESKTOP ---
      gsap.set(title, {
        rotation: 90,
        x: 100,
        y: 80,
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 30,
        paddingBottom: 30,
      });

      gsap.set(number, {
        x: 80,
        y: 40,
      });

      gsap.set(description, {
        x: 150,
        y: 100,
      });

      gsap.set(cardEl, { height: 550, width: 208 });
      gsap.set(image, { opacity: 0 });
    }

    // ===== Desktop hover timeline (ONCE) =====
    hoverTl.current = gsap.timeline({ paused: true });

    hoverTl.current
      .to(
        cardEl,
        {
          width: 635,
          duration: 0.35,
          ease: 'power3.out',
          overwrite: 'auto',
        },
        0
      )
      .to(
        image,
        {
          autoAlpha: 1,
          duration: 0.35,
          ease: 'power3.out',
          overwrite: 'auto',
        },
        0
      )
      .to(
        number,
        {
          fontSize: '1.875rem',
          duration: 0.35,
          ease: 'power3.out',
          overwrite: 'auto',
        },
        0
      )
      .to(
        title,
        {
          rotation: 0,
          x: 81,
          y: 100,
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
          paddingBottom: 0,
          fontSize: '1.875rem',
          fontWeight: 700,
          duration: 0.35,
          ease: 'power3.out',
          overwrite: 'auto',
        },
        0
      )
      .to(
        description,
        {
          autoAlpha: 1,
          x: 8,
          duration: 0.35,
          delay: 0.05,
          ease: 'power3.out',
          overwrite: 'auto',
        },
        0
      );

    // ===== Mobile tap animations (unchanged) =====
    const mobileExpand = () => {
      gsap.to(cardEl, {
        height: 450,
        duration: 0.5,
        ease: 'cubic-bezier(0.22,1,0.36,1)',
      });
      gsap.to(image, { opacity: 1, duration: 0.5 });
      gsap.to(title, { x: 42, y: 60, duration: 0.5 });
      gsap.to(description, { opacity: 1, y: -25, duration: 0.6 });
    };

    const mobileCollapse = () => {
      gsap.to(cardEl, {
        height: 80,
        duration: 0.5,
        ease: 'cubic-bezier(0.22,1,0.36,1)',
      });
      gsap.to(image, { opacity: 0, duration: 0.5 });
      gsap.to(title, { x: 100, y: 24, duration: 0.5 });
      gsap.to(description, { opacity: 0, y: 180, duration: 0.6 });
    };

    // ===== Event handlers =====
    const onEnter = () => {
      if (!isMobile.current && hoverTl.current) hoverTl.current.play();
    };

    const onLeave = () => {
      if (!isMobile.current && hoverTl.current) hoverTl.current.reverse();
    };

    const onFocus = () => {
      if (isMobile.current) mobileExpand();
    };

    const onBlur = () => {
      if (isMobile.current) mobileCollapse();
    };

    cardEl.addEventListener('mouseenter', onEnter);
    cardEl.addEventListener('mouseleave', onLeave);
    cardEl.addEventListener('focus', onFocus);
    cardEl.addEventListener('blur', onBlur);

    return () => {
      cardEl.removeEventListener('mouseenter', onEnter);
      cardEl.removeEventListener('mouseleave', onLeave);
      cardEl.removeEventListener('focus', onFocus);
      cardEl.removeEventListener('blur', onBlur);
      hoverTl.current?.kill();
    };
  }, []);

  return (
    <div
      ref={cardRef}
      tabIndex={0}
      className="relative group cursor-pointer overflow-hidden text-light bg-surface-card-colored-primary h-20 lg:h-[550px] lg:w-52 focus:outline-none"
      style={{ willChange: 'transform, opacity', transformOrigin: 'left' }}

    >
      {/* Image */}
      <div
        ref={imageRef}
        className="absolute inset-0 z-0 opacity-0"
        style={{ willChange: 'opacity' }}
      >
        <img
          src={card.image}
          alt={card.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute bottom-0 left-0 right-0 h-[55%] bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full">
        <p
          ref={numberRef}
          className="text-xl font-semibold absolute lg:text-3xl"
        >
          {card.number}.
        </p>

        <p
          ref={titleRef}
          className="uppercase text-xl font-semibold absolute whitespace-nowrap lg:text-2xl lg:rotate-90 lg:px-[30px] lg:py-[30px]"
          style={{ transformOrigin: 'left center' }}
        >
          {card.title}
        </p>

        <p
          ref={descriptionRef}
          className="text-sm-regular  lg:text-md-regular absolute w-[300px] lg:w-[630px] lg:px-[70px] opacity-0"
          style={{ top: '230px', transform: 'translateX(-150px)' }}
        >
          {card.description}
        </p>
      </div>
    </div>
  );
};

export default CoreValueCard;
