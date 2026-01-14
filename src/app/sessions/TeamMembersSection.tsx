'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/dist/SplitText';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// Register plugins
gsap.registerPlugin(SplitText, ScrollTrigger);

/* -------------------- TEAM DATA -------------------- */
const teamMembers = [
  {
    id: 1,
    name: "Samuel Okwabeng",
    position: "CEO of MASZ-Africa",
    description: `Samuel Okwabeng is the Chief Executive Officer of MASZ-AFRICA, where he leads the company’s strategic vision and drives operational excellence across all its services. With extensive experience in procurement, supply chain management, engineering, and business operations, Samuel has transformed MASZ-AFRICA into a trusted partner for clients seeking quality, efficiency, and innovation. His leadership blends deep industry knowledge with a forward-thinking approach, ensuring the company stays ahead in a competitive and dynamic market. Under his guidance, MASZ-AFRICA has significantly expanded its reach across Africa and internationally, strengthened its service delivery, and earned a reputation for integrity, reliability, and client satisfaction.`,
    image: "/aboutAssets/TEAM-1.jpg",
  },
  {
    id: 2,
    name: "Samuel Okwabeng",
    position: "CEO of MASZ-Africa",
    description: `Samuel Okwabeng is the Chief Executive Officer of MASZ-AFRICA, where he leads the company’s strategic vision and drives operational excellence across all its services. With extensive experience in procurement, supply chain management, engineering, and business operations, Samuel has transformed MASZ-AFRICA into a trusted partner for clients seeking quality, efficiency, and innovation. His leadership blends deep industry knowledge with a forward-thinking approach, ensuring the company stays ahead in a competitive and dynamic market. Under his guidance, MASZ-AFRICA has significantly expanded its reach across Africa and internationally, strengthened its service delivery, and earned a reputation for integrity, reliability, and client satisfaction.`,
    image: "/aboutAssets/TEAM-2.jpg",
  },
  {
    id: 3,
    name: "Samuel Okwabeng",
    position: "CEO of MASZ-Africa",
    description: `Samuel Okwabeng is the Chief Executive Officer of MASZ-AFRICA, where he leads the company’s strategic vision and drives operational excellence across all its services. With extensive experience in procurement, supply chain management, engineering, and business operations, Samuel has transformed MASZ-AFRICA into a trusted partner for clients seeking quality, efficiency, and innovation. His leadership blends deep industry knowledge with a forward-thinking approach, ensuring the company stays ahead in a competitive and dynamic market. Under his guidance, MASZ-AFRICA has significantly expanded its reach across Africa and internationally, strengthened its service delivery, and earned a reputation for integrity, reliability, and client satisfaction.`,
    image: "/aboutAssets/TEAM-3.jpg",
  },
  {
    id: 4,
    name: "Samuel Okwabeng",
    position: "CEO of MASZ-Africa",
    description: `Samuel Okwabeng is the Chief Executive Officer of MASZ-AFRICA, where he leads the company’s strategic vision and drives operational excellence across all its services. With extensive experience in procurement, supply chain management, engineering, and business operations, Samuel has transformed MASZ-AFRICA into a trusted partner for clients seeking quality, efficiency, and innovation. His leadership blends deep industry knowledge with a forward-thinking approach, ensuring the company stays ahead in a competitive and dynamic market. Under his guidance, MASZ-AFRICA has significantly expanded its reach across Africa and internationally, strengthened its service delivery, and earned a reputation for integrity, reliability, and client satisfaction.`,
    image: "/aboutAssets/TEAM-5.jpg",
  },
  {
    id: 5,
    name: "Samuel Okwabeng",
    position: "CEO of MASZ-Africa",
    description: `Samuel Okwabeng is the Chief Executive Officer of MASZ-AFRICA, where he leads the company’s strategic vision and drives operational excellence across all its services. With extensive experience in procurement, supply chain management, engineering, and business operations, Samuel has transformed MASZ-AFRICA into a trusted partner for clients seeking quality, efficiency, and innovation. His leadership blends deep industry knowledge with a forward-thinking approach, ensuring the company stays ahead in a competitive and dynamic market. Under his guidance, MASZ-AFRICA has significantly expanded its reach across Africa and internationally, strengthened its service delivery, and earned a reputation for integrity, reliability, and client satisfaction.`,
    image: "/aboutAssets/TEAM-6.jpg",
  },
  {
    id: 6,
    name: "Samuel Okwabeng",
    position: "CEO of MASZ-Africa",
    description: `Samuel Okwabeng is the Chief Executive Officer of MASZ-AFRICA, where he leads the company’s strategic vision and drives operational excellence across all its services. With extensive experience in procurement, supply chain management, engineering, and business operations, Samuel has transformed MASZ-AFRICA into a trusted partner for clients seeking quality, efficiency, and innovation. His leadership blends deep industry knowledge with a forward-thinking approach, ensuring the company stays ahead in a competitive and dynamic market. Under his guidance, MASZ-AFRICA has significantly expanded its reach across Africa and internationally, strengthened its service delivery, and earned a reputation for integrity, reliability, and client satisfaction.`,
    image: "/aboutAssets/TEAM-7.jpg",
  },
];

/* -------------------- COMPONENT -------------------- */
export default function TeamMembersAnimated() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);

  const activeMember = teamMembers[activeIndex];

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const nameRef = useRef<HTMLHeadingElement | null>(null);
  const positionRef = useRef<HTMLParagraphElement | null>(null);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);
  const splitRef = useRef<any>(null);

  /* -------------------- ANIMATION FUNCTION -------------------- */
  const animateMember = (direction: number = 1) => {
    if (!imageRef.current || !descriptionRef.current) return;

    // Revert previous SplitText if exists
    if (splitRef.current) splitRef.current.revert();

    // Split text into lines
    splitRef.current = new SplitText(descriptionRef.current, { type: "lines" });
    const lines = splitRef.current.lines;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Image animation
    tl.fromTo(
      imageRef.current,
      { x: 140 * direction, opacity: 0, scale: 0.97 },
      { x: 0, opacity: 1, scale: 1, duration: 1.0 }
    );

    // Name animation
    tl.fromTo(
      nameRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 },
      "-=0.6"
    );

    // Position animation
    tl.fromTo(
      positionRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      "-=0.5"
    );

    // Description line-by-line
    tl.fromTo(
      lines,
      { y: 20, opacity: 0, filter: "blur(2px)" },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.7,
        stagger: 0.18,
        ease: "power2.out",
      },
      "-=0.3"
    );
  };

  /* -------------------- SCROLL TRIGGER -------------------- */
  useEffect(() => {
    if (!sectionRef.current) return;

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 80%",
      onEnter: () => {
        animateMember(activeIndex > prevIndex ? 1 : -1);
      },
      onEnterBack: () => {
        animateMember(activeIndex > prevIndex ? 1 : -1);
      },
    });

    return () => st.kill();
  }, [activeIndex, prevIndex]);

  /* -------------------- INDICATOR CLICK ANIMATION -------------------- */
  useEffect(() => {
    // Animate when activeIndex changes from indicator click
    if (!sectionRef.current) return;
    if (activeIndex === 0) return; // first member animation handled by ScrollTrigger
    const direction = activeIndex > prevIndex ? 1 : -1;
    animateMember(direction);
  }, [activeIndex, prevIndex]);

  /* -------------------- HANDLE INDICATOR CLICK -------------------- */
  const handleIndicatorClick = (index: number) => {
    if (index === activeIndex) return;
    setPrevIndex(activeIndex);
    setActiveIndex(index);
  };

  /* -------------------- UI -------------------- */
  return (
    <div ref={sectionRef} className="h-screen bg-[#f3f3f3] flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-6xl flex flex-col gap-20">

        {/* ---------------- Upper Section ---------------- */}
        <div className="flex items-center gap-16">

          {/* Image */}
          <div className="relative w-[450px] h-[470px] cursor-pointer perspective-1000">
            <div
              ref={imageRef}
              className="relative w-full h-full overflow-hidden rounded-xl shadow-lg transition-transform duration-500 ease-out hover:rotate-[3deg] hover:scale-[1.02]"
            >
              <Image
                src={activeMember.image}
                alt={activeMember.name}
                width={450}
                height={470}
                className="object-cover object-top"
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex-1">
            <h2 ref={nameRef} className="uppercase text-blue-600 text-3xl font-semibold mb-2">
              {activeMember.name}
            </h2>

            <p ref={positionRef} className="text-md font-semibold text-gray-900 mb-8 uppercase">
              {activeMember.position}
            </p>

            <p ref={descriptionRef} className="text-gray-700 leading-relaxed lg:w-[700px]">
              {activeMember.description}
            </p>
          </div>
        </div>

        {/* ---------------- Indicators ---------------- */}
        <div className="flex items-center justify-center gap-6 bg-white p-4 rounded-full shadow-sm w-fit mx-auto cursor-pointer">
          {teamMembers.map((member, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={member.id}
                onClick={() => handleIndicatorClick(index)}
                className={`relative rounded-full p-[3px] transition-all duration-300 hover:scale-105 cursor-pointer
                  ${isActive ? 'ring-2 ring-blue-500' : 'ring-1 ring-transparent'}
                `}
              >
                <div className="relative w-[50px] h-[50px] rounded-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top"
                  />
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
