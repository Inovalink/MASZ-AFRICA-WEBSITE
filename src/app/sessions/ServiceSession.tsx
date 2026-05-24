"use client";

import React, { useState, useMemo, memo } from "react";
import Tag from "../components/tag";
import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import Button from "../components/button";
import HeaderLineByLineAnimation from "../animations/HeaderLineByLineAnimation";
import AnimatedListContainer from "../animations/AnimatedListContainer";
import LineByLineText from "../components/LineByLineText";

const HEADER_LINE_Y = 28;
const HEADER_STAGGER = 0.07;
const HEADER_DURATION = 0.3;
const HEADER_DELAY = 0.1;
const LIST_TITLE_STAGGER = 0.08;

interface ServiceSessionProps {
  startTextAnimation?: boolean;
}

const serviceList = [
  {
    id: 1,
    slug: "grinding-media",
    title: "Grinding media",
    subtext:
      "We offer complete gearbox diagnostics, repairs, and component replacements using OEM parts and experienced technicians. Our work helps restore equipment reliability and prevent costly downtime across crushers, mills, and conveyors.",
    heroImage: "/serviceAssets/Image-1-3.webp",
    heroAltText: "Grinding media",
  },
  {
    id: 2,
    slug: "activated-carbon",
    title: "Activated Carbon",
    subtext:
      "We offer complete gearbox diagnostics, repairs, and component replacements using OEM parts and experienced technicians. Our work helps restore equipment reliability and prevent costly downtime across crushers, mills, and conveyors.",
    heroImage: "/serviceAssets/Image-2-1.webp",
    heroAltText: "Activated carbon",
  },
  {
    id: 3,
    slug: "metal-and-steel-pipes",
    title: "Metal and steel Pipes",
    subtext:
      "We offer complete gearbox diagnostics, repairs, and component replacements using OEM parts and experienced technicians. Our work helps restore equipment reliability and prevent costly downtime across crushers, mills, and conveyors.",
    heroImage: "/serviceAssets/Image-3-1.webp",
    heroAltText: "Metal and steel pipes",
  },
  {
    id: 4,
    slug: "gear-box-servicing-and-heavy-equipment-maintenance",
    title: "Gear Box servicing and Heavy Machine Maintenance",
    subtext:
      "We offer complete gearbox diagnostics, repairs, and component replacements using OEM parts and experienced technicians. Our work helps restore equipment reliability and prevent costly downtime across crushers, mills, and conveyors.",
    heroImage: "/serviceAssets/Image-6-1.webp",
    heroAltText: "Gear box servicing",
  },
  {
    id: 5,
    slug: "crusher-seals-installation-and-equipment-protection",
    title: "Crusher Seals Installation and Equipment Protection",
    subtext:
      "We provide precision crusher seal installation and replacement for cone, jaw, and gyratory crushers. Our solutions prevent contamination and leakage, extending bearing life and stabilizing crusher performance under continuous heavy loads.",
    heroImage: "/serviceAssets/Image-20.webp",
    heroAltText: "Crusher seals installation",
  },
  {
    id: 6,
    slug: "procurement-and-supply-chain-management",
    title: "Procurement and Supply Chain Management",
    subtext:
      "We deliver fully integrated, end-to-end procurement solutions for the mining and industrial sectors. From strategic sourcing and supplier vetting to logistics and on-site delivery, we ensure critical materials arrive on time and to specification.",
    heroImage: "/serviceAssets/Image-21.webp",
    heroAltText: "Procurement and supply chain management",
  },
  {
    id: 7,
    slug: "technical-consultancy",
    title: "Technical Consultancy",
    subtext:
      "Our experienced engineers conduct detailed operational assessments and process evaluations to identify inefficiencies and failure points. We deliver data-driven recommendations that improve equipment performance, reduce downtime, and lower operational costs.",
    heroImage: "/serviceAssets/Image-12.webp",
    heroAltText: "Technical consultancy",
  },
] as const;

function ServiceSession({ startTextAnimation = false }: ServiceSessionProps) {
  const [startListAnimation, setStartListAnimation] = useState(false);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const memoizedServiceList = useMemo(() => serviceList, []);

  return (
    <section className="xl:mx-[120] min-[1920px]:mx-[200]! mx-[24] bg-white relative z-10">
      <div className="services-section-container my-[100]">
        <Tag text="services" className="ml-[22] lg:ml-[0]" />

        <div className="services-section-header flex items-start justify-between text-xl-semibold  leading-[110%] uppercase my-[30] lg:mt-[37] lg:mb-[98] lg:text-4xl-semibold tracking-tight">
          <HeaderLineByLineAnimation
            startAnimation={startTextAnimation}
            onComplete={() => setStartListAnimation(true)}
            lineY={HEADER_LINE_Y}
            duration={HEADER_DURATION}
            stagger={HEADER_STAGGER}
            delay={HEADER_DELAY}
            style={{ overflow: "hidden" }}
          >
            Explore our <span className="text-primary-default">products</span>{" "}
            <span>and</span>{" "}
            <span className="text-primary-default">services</span>
          </HeaderLineByLineAnimation>

          <Link
            href="/services"
            className="hidden md:block shrink-0 ml-8 mr-[24]"
          >
            <Button
              label="ALL PRODUCTS & SERVICES"
              variant="primaryWhite"
              iconClassName="text-primary-default group-hover/btn:text-white!"
              size="large"
              className="hover:bg-[#0160DA]! hover:text-white! border-primary-default! bg-transparent!"
              alwaysExpanded
              icon={<MoveRight size={20} />}
            />
          </Link>
        </div>

        <AnimatedListContainer
          startAnimation={startListAnimation}
          className="services-session-product-list-container my-[60]"
        >
          <ul>
            {memoizedServiceList.map((list, index) => (
              <li
                key={list.id}
                tabIndex={0}
                className="relative mx-[22px] flex cursor-pointer border-b border-gray-300 outline-none service-item"
                onMouseEnter={() => setHoveredId(list.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(list.id)}
                onBlur={() => setHoveredId(null)}
              >
                {/* Number */}
                <p className="pr-[40px] lg:pr-[80px] py-[20px] text-lg-semibold lg:text-2xl-semibold text-gray-700 flex items-center justify-center transition-all duration-[600ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] transform-gpu origin-center service-number">
                  {list.id}
                </p>

                {/* Text content */}
                <div className="flex-1 relative service-text-content">
                  <div className="uppercase pr-[20px] py-[20px] text-lg-semibold lg:text-3xl-semibold  tracking-tight text-[#626262] transition-colors duration-[600ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] service-title">
                    <LineByLineText
                      startAnimation={startListAnimation}
                      delay={index * LIST_TITLE_STAGGER}
                      duration={0.5}
                      stagger={0.08}
                      yFrom={20}
                      as="div"
                    >
                      {list.title}
                    </LineByLineText>
                  </div>

                  {/* Expandable subtext */}
                  <div className="overflow-hidden max-h-0 service-subtext-container">
                    <LineByLineText
                      key={`subtext-${list.id}-${hoveredId === list.id}`}
                      startAnimation={hoveredId === list.id}
                      duration={0.4}
                      stagger={0.1}
                      delay={0.45}
                      yFrom={12}
                      as="div"
                      className="list-subtext text-sm-medium pr-[20px] lg:text-xl-medium lg:w-[500] lg:leading-7 lg:tracking-tight"
                    >
                      {list.subtext}
                    </LineByLineText>
                    <div className="lg:hidden flex items-center bg-white my-[20px] pr-[20px]">
                      <Link
                        href={`/services/${list.slug}`}
                        className="uppercase text-sm-medium text-primary-default"
                      >
                        Learn More
                      </Link>
                      <MoveRight className="ml-2 text-blue-600" />
                    </div>
                  </div>
                </div>

                {/*
                  Image stack — desktop only.
                  Default height: 0 → collapsed rows take no extra space.
                  On hover/focus-within the CSS class drives height to 260px instantly,
                  then opacity fades in after the row finishes opening (~500ms delay).
                  overflow: visible so rotated cards are never clipped.
                */}
                <div className="service-image-stack hidden xl:block pointer-events-none">
                  {/* Back card — blue rect, fans left + down */}
                  <div className="service-image-back absolute xl:w-[175px] xl:h-[200px] 2xl:w-[224px] 2xl:h-[256px] rounded-[7px] bg-[#016BF2]" />
                  {/* Front image — sits on top, tilts the other way */}
                  <div className="service-image-front absolute xl:w-[175px] xl:h-[200px] 2xl:w-[224px] 2xl:h-[256px] rounded-[7px] overflow-hidden">
                    <Image
                      className="w-full h-full object-cover"
                      src={list.heroImage}
                      alt={list.heroAltText}
                      height={1080}
                      width={1920}
                    />
                  </div>
                </div>

                {/* Desktop "Learn More" button */}
                {/* Desktop "Learn More" button */}
{/* Desktop "Learn More" button */}
<Button
  href={`/services/${list.slug}`}
  label="learn more"
  variant="primary"
  size="large"
  className="hidden lg:flex absolute right-0 inset-y-0 my-auto service-button"
  icon={<MoveRight size={16} strokeWidth={3} />}
/>
              </li>
            ))}
          </ul>
          <Link href="/services">
            <Button
              label="Explore our services"
              variant="primary"
              size="large"
              icon={<MoveRight size={16} />}
              className="ml-[22] my-[35] lg:my-[100]"
            />
          </Link>
        </AnimatedListContainer>
      </div>
    </section>
  );
}

export default memo(ServiceSession);
