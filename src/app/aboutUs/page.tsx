'use client';

import React from 'react';
import ParallaxSection from '../animations/ImageParallax';
import Tag from '../components/tag';
import AnimationCopy from '../animations/WritingTextAnimation';
import PerformanceMetrics from '../components/PerformanceMetrics';
import TiltCard from '../animations/TiltCard';

function AboutUSPage() {
  return (
    <section className="w-full">
      <div className="main-about-page-content">
        <div className="main-about-hero-content">
          <div className="tag-container mx-[21] mt-[30] lg:mt-[60] lg:mx-[200]">
            <Tag text="About us" />
          </div>

          {/* TOP TEXT */}
          <div className="about-page-hero-text-container mx-[21px] lg:mx-[200px] my-[40px] lg:my-[40px]">
            <div className="page-header text-xl-semibold uppercase lg:text-4xl-bold">
              We are{' '}
              <span className="subtext text-primary-default">Masz-Africa</span>
            </div>
            <div className="uppercase text-xs-medium text-default-body lg:text-xl-semibold">
              General Mining and procurement services limited
            </div>
          </div>

          {/* PARALLAX IMAGE */}
          <ParallaxSection
            imageSrc="/aboutAssets/Image-6.jpg"
            ShowText={false}
          />
        </div>

        <div className="company-description-content lg:my-[100]">
          <div className="desctiption-text mx-[21] lg:mx-[200] ">
            <Tag text="our story" className="my-[40]" />
            <AnimationCopy>
              <div className="main-text-description text-lg-medium lg:text-2xl-medium lg:mt-[80] lg:leading-8 lg:tracking-tight">
                MASZ-AFRICA Ltd is a Ghana-based private limited liability
                company that provides high-quality mining consumables,
                engineering support, and procurement solutions to mining and
                mineral processing industries across Africa. Established in
                September 2025 by a multidisciplinary team with more than 15
                years of combined experience in metallurgy, engineering,
                finance, supply chain management, and business improvement, the
                company was created to address the lack of dependable,
                responsive, and technically knowledgeable supply partners within
                the African mining sector. From the beginning, MASZ-Africa has
                focused on quality, reliability, and client satisfaction.
                Through strong partnerships with globally recognized
                manufacturers and original equipment suppliers, the company
                delivers world-class products supported by solid technical
                expertise and consistent on-time delivery. With a growing
                presence across West Africa, MASZ-Africa aims to become a
                continental leader in mining supply, logistics, and technical
                services. The company is committed to empowering mining
                operations with reliable supplies, innovative solutions, and
                smooth service delivery that keeps production running
                efficiently.
              </div>
            </AnimationCopy>
            <div className="metrics-container my-[50px] lg:flex lg:gap-8 mt-[50]">
              <PerformanceMetrics
                text="years of combined experience"
                value="15+"
              />
              <PerformanceMetrics
                text="clients who rely on our consistent delivery and expertise."
                value="5+"
              />
              <PerformanceMetrics
                text="client satisfaction built on trust, transparency, and performance."
                value="99%"
              />
              <PerformanceMetrics
                text="on-time delivery, driven by efficiency and dependable logistics."
                value="98%"
              />
            </div>
          </div>
        </div>

        <div className="vision-mission-section-container">
          <div className="vision-mission-parallax-section">
            <ParallaxSection
              imageSrc="/aboutAssets/image-4.jpg"
              title="DEFINING THE FUTURE WE STAND FOR"
              subtitle="Our guiding principles define how we operate today—and the impact we aim to make tomorrow. They guide our work, shape our decisions, and keep us aligned with the needs of a fast-evolving mining sector. Every step we take reflects our commitment to progress and long-term value."
            />
          </div>
        </div>

        <div className="vision-mission-statement mx-[21] lg:mx-[200] lg:my-[150] ">
          <div className="vision-statement lg:flex lg:justify-between ">
            <div className="text">
              <Tag text="our vision" />
              <AnimationCopy>
                <div className="main-text lg:text-3xl-semibold lg:leading-10 tracking-tight text-default-body lg:my-[50] lg:w-[650]">
                  To deliver trusted mining consumables and technical solutions
                  that enhance productivity, reliability, and sustainability
                  across Africa’s mining value chain.
                </div>
              </AnimationCopy>
              <div className="subtext lg:w-[650] text-default-body lg:text-xl-medium lg:leading-6 my-[18] lg:bg-surface-card-colored-primary">
                As a trusted global partner, MASZ-AFRICA supplies quality mining
                products backed by technical expertise. We focus on improving
                productivity and ensuring uninterrupted operations. Our team
                works closely with clients to provide solutions tailored to
                their needs. We emphasize reliability, timely delivery, and
                long-term value creation. Our approach blends global standards
                with local understanding and responsiveness.
              </div>
            </div>
            <div className="image-container relative w-full lg:w-1/2 h-[520px]">
              <TiltCard
                imageSrc="/aboutAssets/Image-3.jpg"
                title="Vision Image"
              />
            </div>
          </div>
        </div>
        <div className="mission-statement mx-[21] lg:mx-[200] lg:my-[250]">
          <div className="mission-statement lg:flex lg:justify-between ">
            <div className="image-container relative w-full lg:w-1/2 h-[520px]">
              <TiltCard
                imageSrc="/aboutAssets/Image-3.jpg"
                title="mision Image"
              />
            </div>
            <div className="text">
              <Tag text="our mission" />
              <AnimationCopy>
                <div className="main-text lg:text-3xl-semibold lg:leading-10 tracking-tight text-default-body lg:my-[50] lg:w-[650]">
                  To become Africa’s most trusted and efficient mining
                  procurement and service brand, connecting global manufacturing
                  quality with local operational realities.
                </div>
              </AnimationCopy>
              <div className="subtext lg:w-[650] text-default-body lg:text-xl-medium lg:leading-6 my-[18] lg:bg-surface-card-colored-primary">
                MASZ-AFRICA aims to be Africa’s most trusted and efficient
                mining procurement and service brand. We connect global
                manufacturing quality with the practical needs of local mining
                operations. Our focus is on reliability, timely delivery, and
                technical excellence. We provide solutions that streamline
                procurement, reduce downtime, and enhance productivity. By
                combining international standards with local understanding, we
                empower mining operations
              </div>
            </div>
          </div>
        </div>

        <div className="core-values-section bg-[#f3f3f3] h-screen"></div>
      </div>
    </section>
  );
}

export default AboutUSPage;
