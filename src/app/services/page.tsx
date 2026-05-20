"use client";

import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import Tag from "../components/tag";
import ServicesCardsSection from "../sessions/ServicesCardsSection";
import ScrollReveal from "../components/ScrollReveal";
import LineByLineText from "../components/LineByLineText";
import HeaderLineByLineAnimation from "../animations/HeaderLineByLineAnimation";
import gsap from "gsap";

const HEADER_LINE_Y = 28;
const HEADER_STAGGER = 0.07;
const HEADER_DURATION = 0.3;
const HEADER_DELAY = 0.1;

export default function Page() {
  const [startTag, setStartTag] = useState(false);
  const [startHeader, setStartHeader] = useState(false);
  const [startDescription, setStartDescription] = useState(false);
  const tagRef = useRef<HTMLDivElement>(null);

  // Hide tag before first paint so it starts hidden before animating in.
  useLayoutEffect(() => {
    if (tagRef.current) gsap.set(tagRef.current, { y: 20, opacity: 0, force3D: true });
  }, []);

  // Wait for the page transition overlay to exit before starting animations.
  // PageTransitionProvider sets __masz_transitioning=true at the start of a navigation
  // and dispatches ‘masz:page-ready’ when the exit animation fully ends.
  // On a direct load (no transition active) we start immediately with a short RAF delay.
  useEffect(() => {
    const w = window as unknown as Record<string, unknown>;
    const start = () => setStartTag(true);

    if (!w.__masz_transitioning) {
      // Direct load — no overlay running, start shortly after mount
      const id = requestAnimationFrame(() => requestAnimationFrame(start));
      return () => cancelAnimationFrame(id as number);
    }

    // Page transition active — wait for it to fully exit
    window.addEventListener("masz:page-ready", start, { once: true });
    return () => window.removeEventListener("masz:page-ready", start);
  }, []);

  // Animate tag up, then chain to header.
  useEffect(() => {
    if (!startTag || !tagRef.current) return;
    gsap.to(tagRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.45,
      ease: "power2.out",
      force3D: true,
      onComplete: () => setStartHeader(true),
    });
  }, [startTag]);

  return (
    <section className="">
      <div className="services-main-content mx-[24]  xl:mx-[120]  min-[1920px]:mx-[200]! mt-[80] lg:mt-[150] max-h-[800] pb-[100] lg:pb-0 lg:h-screen ">
        <div ref={tagRef}>
          <Tag text="products and Services" />
        </div>
        <div className="text-content lg:mt-[50]">
          <div className="header uppercase text-xl-semibold lg:text-4xl-semibold tracking-tight mt-[50] xl:mt-[100]  mb-[30] lg:mb-[50]">
            <HeaderLineByLineAnimation
              startAnimation={startHeader}
              onComplete={() => setStartDescription(true)}
              lineY={HEADER_LINE_Y}
              duration={HEADER_DURATION}
              stagger={HEADER_STAGGER}
              delay={HEADER_DELAY}
              style={{ overflow: "hidden" }}
            >
              Strengthening the{" "}
              <span className="text-primary-default">Global mining backbone</span>
            </HeaderLineByLineAnimation>
          </div>
          <LineByLineText
            startAnimation={startDescription}
            delay={0.05}
            duration={0.3}
            stagger={0.05}
            className="description text-md-regular  lg:text-2xl-medium text-default-body lg:tracking-tight lg:leading-8"
          >
            At Masz-Africa, we do more than just supply mining products — we
            become a true operational partner for your business. Our
            commitment extends beyond delivery: we provide the tools,
            expertise, and ongoing support necessary to keep your projects
            running seamlessly. Whether it’s high-quality consumables,
            specialized equipment, or expert technical consultancy,
            Masz-Africa is dedicated to ensuring that every aspect of your
            mining operations is efficient, safe, and productive. We
            understand that each mining project has unique challenges, which
            is why our solutions are tailored to meet the specific demands of
            your site, no matter where you operate across West Africa. With
            Masz-Africa, you gain more than a supplier — you gain a trusted
            partner focused on maximizing performance, reducing downtime, and
            helping your operations achieve their full potential.
          </LineByLineText>
        </div>
      </div>

      <ScrollReveal direction="up" duration={0.75} start="top 80%" scale>
        <div className="service-cards-section">
          <ServicesCardsSection />
        </div>
      </ScrollReveal>
    </section>
  );
}
