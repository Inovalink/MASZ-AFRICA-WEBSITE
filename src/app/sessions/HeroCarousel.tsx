'use client';

/**
 * HeroCarousel
 *
 * Infinite horizontal carousel of product/service slides (title, subtitle, image).
 * On hover over the section, the carousel animation pauses so users can hover
 * individual slides; a floating tooltip card (title + description) follows the
 * cursor and is rendered via a portal to avoid clipping.
 */

import React, { useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import LineByLineText from '../components/LineByLineText';

/** Tooltip colors: MASZ blue, red, MASZ green, orange (cycle per slide) */
const TOOLTIP_COLORS = ['#016BF2', '#D92D20', '#51B948', '#F79009'] as const;

/** Slide data: title, short description (subtitle), and image path */
const CAROUSEL_ITEMS = [
  { title: 'Industrial Equipment', subtitle: 'Performs consistently under demanding conditions.', image: '/homeAssets/Image-4.webp' },
  { title: 'Engineering Excellence', subtitle: 'Technical precision and strategic planning.', image: '/homeAssets/Image-5.webp' },
  { title: 'Operational Performance', subtitle: 'Coordinated logistics and field expertise.', image: '/homeAssets/Image-3.webp' },
  { title: 'Mining Consumables', subtitle: 'Critical for productivity, durability, safety.', image: '/homeAssets/Image-1.webp' },
  { title: 'Industry Partnership', subtitle: 'Dependable partners for long-term goals.', image: '/homeAssets/Image-6.webp' },
  { title: 'Technical Support', subtitle: 'Reduce downtime, maintain operational continuity.', image: '/homeAssets/Image-2.jpg' },
  { title: 'Resource Logistics', subtitle: 'Timely procurement for uninterrupted operations.', image: '/homeAssets/Image-3.webp' },
  { title: 'Safety Standards', subtitle: 'Strong safety practices, workforce protection.', image: '/homeAssets/Image-4.webp' },
  { title: 'Sustainable Operations', subtitle: 'Sustainable practices, innovation, long-term efficiency.', image: '/homeAssets/Image-5.webp' },
  { title: 'Field Solutions', subtitle: 'Practical solutions for operational demands.', image: '/homeAssets/Image-6.webp' },
];

type CarouselItem = (typeof CAROUSEL_ITEMS)[number];

/** Tooltip background color for a given slide index */
function getTooltipColor(index: number): string {
  return TOOLTIP_COLORS[index % TOOLTIP_COLORS.length];
}

/**
 * Single slide: text (title + subtitle) with line-by-line reveal, and image.
 * Reports hover via onHoverStart(item) / onHoverEnd() so the parent can show the cursor tooltip.
 */
function CarouselSlide({
  title,
  subtitle,
  image,
  startTextAnimation,
  onHoverStart,
  onHoverEnd,
}: {
  title: string;
  subtitle: string;
  image: string;
  startTextAnimation: boolean;
  onHoverStart: (item: CarouselItem) => void;
  onHoverEnd: () => void;
}) {
  const item = { title, subtitle, image };
  return (
    <div
      className="shrink-0 w-[min(90vw,560px)] flex items-center gap-5 mx-4 md:mx-6 cursor-none"
      onMouseEnter={() => onHoverStart(item)}
      onMouseLeave={onHoverEnd}
    >
      <div className="flex flex-col justify-center flex-1 min-w-0">
        <LineByLineText
          startAnimation={startTextAnimation}
          duration={0.45}
          stagger={0.1}
          delay={0}
          yFrom={14}
          as="div"
          className="text-black font-bold uppercase tracking-tight leading-[110%]  text-md-bold md:text-xl lg:text-2xl"
        >
          <>{title}</>
          <br />
          <span className="text-black/80 font-medium text-[10px]  sm:text-[12px] md:text-base mt-0.5">{subtitle}</span>
        </LineByLineText>
      </div>
      <div className="relative shrink-0 w-34 h-26.5 sm:w-40 sm:h-30 md:w-55 md:h-52 rounded overflow-hidden bg-white/10">
        <Image
          src={image}
          alt=""
          fill
          sizes="(max-width: 768px) 200px, 240px"
          className="object-cover"
        />
      </div>
    </div>
  );
}

/** Offset from cursor for the hover card (right and up) */
const CURSOR_OFFSET_X = 20;
const CURSOR_OFFSET_Y = -60;

interface HeroCarouselProps {
  /** When true, slide titles and subtitles use the line-by-line reveal animation. */
  startTextAnimation?: boolean;
}

export default function HeroCarousel({ startTextAnimation = false }: HeroCarouselProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoverItem, setHoverItem] = useState<CarouselItem | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isSectionHovered, setIsSectionHovered] = useState(false);

  /** Update tooltip position and clear hover when cursor leaves section bounds */
  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const { clientX, clientY } = e;
      setPosition({ x: clientX + CURSOR_OFFSET_X, y: clientY + CURSOR_OFFSET_Y });
      const section = sectionRef.current;
      if (section) {
        const r = section.getBoundingClientRect();
        const inside =
          clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom;
        if (!inside) setHoverItem(null);
      }
    },
    [],
  );

  /** Section hover: pause carousel so slide hover is reliable */
  const onSectionEnter = useCallback(() => {
    setIsSectionHovered(true);
  }, []);

  const onSectionLeave = useCallback(() => {
    setIsSectionHovered(false);
    setHoverItem(null);
  }, []);

  const onSlideEnter = useCallback((item: CarouselItem) => {
    setHoverItem(item);
  }, []);

  const onSlideLeave = useCallback(() => {
    setHoverItem(null);
  }, []);

  /** Hover card rendered into document.body so it isn't clipped by overflow/ScrollReveal */
  const hoverItemIndex =
    hoverItem ? CAROUSEL_ITEMS.findIndex((i) => i.title === hoverItem.title && i.image === hoverItem.image) : -1;
  const tooltipColor = hoverItemIndex >= 0 ? getTooltipColor(hoverItemIndex) : TOOLTIP_COLORS[0];

  const hoverCard =
    hoverItem && typeof document !== 'undefined' ? (
      createPortal( 
        <div
          className="hero-carousel-hover-card rounded-none"
          style={{
            translate: `${position.x}px ${position.y}px`,
            backgroundColor: tooltipColor,
          }}
        >
          <div className="hero-carousel-hover-card__title">{hoverItem.title}</div>
          <div className="hero-carousel-hover-card__desc">{hoverItem.subtitle}</div>
        </div>,
        document.body,
      )
    ) : null;

  return (
    <>
      <section
        ref={sectionRef}
        className="relative w-full bg-[#F7F7F7] py-8 md:py-12 mt-12 md:mt-16 cursor-none"
        onMouseMove={onMouseMove}
        onMouseEnter={onSectionEnter}
        onMouseLeave={onSectionLeave}
      >
        {/* Top dashed line */}
        <div
          className="absolute left-0 right-0 top-0 h-0 border-t-2 hidden border-dashed border-black/60"
          aria-hidden
        />

        {/* Carousel track – hero-carousel-section-hovered pauses animation via CSS */}
        <div className={`overflow-hidden ${isSectionHovered ? 'hero-carousel-section-hovered' : ''}`}>
          <div className="flex animate-hero-carousel w-max">
            {[...CAROUSEL_ITEMS, ...CAROUSEL_ITEMS].map((item, i) => (
              <CarouselSlide
                key={`${item.title}-${i}`}
                title={item.title}
                subtitle={item.subtitle}
                image={item.image}
                startTextAnimation={startTextAnimation}
                onHoverStart={onSlideEnter}
                onHoverEnd={onSlideLeave}
              />
            ))}
          </div>
          
        </div>

        {/* Bottom dashed line */}
        <div
          className="absolute left-0 hidden right-0 bottom-0 h-0 border-t-2 border-dashed border-black/60"
          aria-hidden
        />
      </section>
      {hoverCard}
    </>
  );
}
