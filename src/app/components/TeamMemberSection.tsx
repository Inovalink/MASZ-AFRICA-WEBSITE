'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import TeamMemberCard, { TeamMember } from './TeamMemberCard';

gsap.registerPlugin(ScrollTrigger);

type Props = {
  teamMembers: TeamMember[];
};

const TeamMembersSection: React.FC<Props> = ({ teamMembers }) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const indicatorsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
      const indicators = indicatorsRef.current.filter(Boolean) as HTMLDivElement[];
      const vw = window.innerWidth;

      // INITIAL STATE
      cards.forEach((card, i) => {
        gsap.set(card, {
          left: '50%',
          xPercent: -50,
          x: i === 0 ? 0 : vw,
          opacity: i === 0 ? 1 : 0,
        });
      });

      indicators.forEach((dot, i) => {
        gsap.set(dot, {
          scale: i === 0 ? 1.4 : 1,
          opacity: i === 0 ? 1 : 0.4,
        });
      });

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
        if (index === 0) return;

        tl.fromTo(
          card,
          { x: vw, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, ease: 'power3.inOut' }
        )
          .to(
            cards[index - 1],
            { x: -vw, opacity: 0, duration: 0.8, ease: 'power3.inOut' },
            '<'
          )
          .to(
            indicators,
            {
              scale: (i) => (i === index ? 1.4 : 1),
              opacity: (i) => (i === index ? 1 : 0.4),
              duration: 0.4,
            },
            '<'
          );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [teamMembers.length]);

  return (
    <div
      ref={sectionRef}
      className="team-members-section lg:py-[120px] bg-[#f3f3f3] relative overflow-hidden"
    >
      <div className="relative w-full h-[600px]">
        {/* INDICATORS */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">
          {teamMembers.map((_, index) => (
            <div
              key={index}
              ref={(el) => (indicatorsRef.current[index] = el)}
              className="w-2.5 h-2.5 bg-[#016BF2]"
            />
          ))}
        </div>

        {/* CARDS */}
        {teamMembers.map((member, index) => (
          <TeamMemberCard
            key={member.id}
            member={member}
            ref={(el) => (cardsRef.current[index] = el)}
          />
        ))}
      </div>
    </div>
  );
};

export default TeamMembersSection;
