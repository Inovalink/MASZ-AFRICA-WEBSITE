'use client';

import React from 'react';
import Image from 'next/image';
import Button from '../components/button';
import { MoveRight } from 'lucide-react';

function HeroSession() {
  return (
    <div className="hero-session-container mt-[50]">
      <div className="hero-message">
        <div className="hero-logo flex items-center justify-center mt-[40]">
          <Image
            src="/maszAssets/logotype.svg"
            alt="masz-africa logotype"
            width={370}
            height={100}
            style={{ width: '370px', height: 'auto' }}
          />
        </div>

        {/* Static descriptive text */}
        <div className="text-sm-medium mx-[24] mt-[30]">
          Unleash reliable mining performance with MASZ-Africa, delivering
          certified consumables built for tough environments, supported by real
          engineering expertise and on-site technical service, so your operation
          stays efficient, productive, and continuously running.
        </div>

        {/* Button now shows correctly */}
        <Button
          label="Explore our services"
          variant="primary"
          size="large"
          icon={<MoveRight size={16} />}
          className="ml-[22] my-[35]"
        />
      </div>

      <div className="hero-image mt-[50]">
        <div className="hero-image-info h-[600] relative overflow-hidden z-0">
          <Image
            src="/homeAssets/image-6.jpg"
            alt="Hero Image"
            fill
            priority
            className="object-cover will-change-transform"
          />

          <div className="absolute inset-0 bg-surface-overlay z-10 opacity-50" />

          <div className="hero-image-text-info absolute z-20 text-light font-bold">
            <div className="hero-image-info-header flex items-center flex-col justify-center w-[430]">
              <p className="uppercase text-xl-semibold text-center py-[20]">
                Empowering the
                <br />
                global mining industry
                <br />
                through
              </p>
              <Image
                src="/homeAssets/arrow-icon.svg"
                alt=""
                width={24}
                height={24}
                style={{ height: 'auto' }}
              />
            </div>

            <div className="hero-image-info-subtext mx-[55] flex items-center justify-center flex-col backdrop-blur-sm p-[25] my-[20] electric-border">
              <div className="subtext-header uppercase text-xl-semibold my-[10]">
                innovation
              </div>
              <div className="subtext-itself font-medium text-sm-medium my-[10]">
                Our approach to innovation is practical, solving real problems
                mines face everyday. Whether it’s choosing the right media,
                improving equipment life, or refining a supply process, we bring
                ideas and technical insight that make your work smoother and
                more efficient.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSession;
