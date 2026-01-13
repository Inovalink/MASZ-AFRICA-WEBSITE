'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type TeamMember = {
  id: number;
  description: string;
  image: string;
};

const teamMembers: TeamMember[] = [
  {
    id: 1,
    description: `Samuel Okwabeng is the Chief Executive Officer of MASZ-AFRICA,
      where he leads the company's strategic vision and drives
      operational excellence across all its services...`,
    image: '/aboutAssets/Image-5.webp',
  },
  {
    id: 2,
    description: `Jane Doe ensures operational efficiency and drives strategic initiatives
      to optimize service delivery across MASZ-AFRICA's operations...`,
    image: '/aboutAssets/Image-6.webp',
  },
  {
    id: 3,
    description: `John Smith oversees procurement and supply chain operations,
      ensuring timely delivery of mining consumables and equipment...`,
    image: '/aboutAssets/Image-7.webp',
  },
  {
    id: 4,
    description: `Mary Johnson provides technical expertise and consultancy to
      optimize mining and engineering solutions...`,
    image: '/aboutAssets/Image-8.webp',
  },
  {
    id: 5,
    description: `David Akoto manages procurement, logistics, and ensures
      timely delivery of equipment across West Africa...`,
    image: '/aboutAssets/Image-9.webp',
  },
];

const TeamMembersSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const indicatorsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(
        (el): el is HTMLDivElement => el !== null
      );
      const indicators = indicatorsRef.current.filter(
        (el): el is HTMLDivElement => el !== null
      );

      const vw = typeof window !== 'undefined' ? window.innerWidth : 0;

      // INITIAL STATE: all offscreen except first card
      cards.forEach((card, i) => {
        gsap.set(card, {
          left: '50%',
          xPercent: -50,
          x: i === 0 ? 0 : vw,
          opacity: i === 0 ? 1 : 0,
        });
      });

      // INDICATORS
      indicators.forEach((dot, i) => {
        gsap.set(dot, { scale: i === 0 ? 1.4 : 1, opacity: i === 0 ? 1 : 0.4 });
      });

      // TIMELINE: smooth magnet card scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${teamMembers.length * window.innerHeight}`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
        },
      });

     cards.forEach((card, index) => {
  const enterDuration = 0.8;
  const exitDuration = 0.8;

  // 🔹 FIRST CARD: already visible, no enter animation
  if (index === 0) {
    tl.to(
      indicators,
      {
        scale: (i) => (i === 0 ? 1.4 : 1),
        opacity: (i) => (i === 0 ? 1 : 0.4),
        duration: 0.3,
      },
      0
    );
    return;
  }

  // 🔹 ENTER current card
  tl.fromTo(
    card,
    { x: vw, opacity: 0 },
    { x: 0, opacity: 1, duration: enterDuration, ease: 'power3.inOut' }
  );

  // 🔹 EXIT previous card
  tl.to(
    cards[index - 1],
    { x: -vw, opacity: 0, duration: exitDuration, ease: 'power3.inOut' },
    '<'
  );

  // 🔹 INDICATORS sync
  tl.to(
    indicators,
    {
      scale: (i) => (i === index ? 1.4 : 1),
      opacity: (i) => (i === index ? 1 : 0.4),
      duration: enterDuration,
      ease: 'power2.out',
    },
    '<'
  );
});

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="team-members-section lg:py-[120px] bg-[#f3f3f3] relative overflow-hidden"
    >
      <div className="section-main-content">
        <div className="relative w-full h-[600px]">
          {/* INDICATORS */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">
            {teamMembers.map((_, index) => (
              <div
                key={index}
                ref={(el) => {
                  indicatorsRef.current[index] = el;
                }}
                className="w-2.5 h-2.5  bg-[#016BF2]"
              />
            ))}
          </div>

          {/* CARDS */}
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="card bg-white w-full max-w-[1200px] h-auto lg:h-[600px] flex flex-col lg:flex-row lg:justify-between gap-10 lg:items-center px-6 lg:px-[40px] py-8 lg:pb-[30px] absolute top-1/2 -translate-y-1/2  "
            >
              {/* Left */}
              <div className="main-section-container lg:h-[400px] lg:w-[500px] flex justify-center items-center">
                <div className="image-container relative w-full lg:w-[70%] h-64 lg:h-[450px]">
                  <div className="absolute -bottom-8 -left-7 w-[117%] h-[50%] bg-[#016BF2] z-0"></div>
                  <Image
                    src={member.image}
                    alt="Team member"
                    fill
                    priority
                    className="object-cover relative z-10"
                  />
                </div>
              </div>

              {/* Right */}
              <div className="main-tech-description text-base lg:text-lg leading-relaxed lg:h-[50%] lg:w-[60%] flex items-center justify-center text-gray-700">
                {member.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamMembersSection;
