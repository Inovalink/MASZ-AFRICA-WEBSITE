'use client';

import React from 'react';
import Tag from '../components/tag';

const images = [
  '/aboutAssets/Image-1.webp',
  '/aboutAssets/Image-2.webp',
  '/aboutAssets/Image-3.webp',
  '/aboutAssets/Image-4.webp',
  '/aboutAssets/Image-5.webp',
  '/aboutAssets/Image-6.webp',
  '/aboutAssets/Image-7.webp',
  '/aboutAssets/Image-8.webp',
  '/aboutAssets/Image-9.webp',
  '/aboutAssets/Image-10.webp',
  '/aboutAssets/Image-11.webp',
  '/aboutAssets/Image-12.webp',
  '/aboutAssets/Image-13.webp',
  '/aboutAssets/Image-14.webp',
  '/aboutAssets/Image-8.webp',
  '/aboutAssets/Image-14.webp',
  '/aboutAssets/Image-3.webp',
  '/aboutAssets/Image-5.webp',
  '/aboutAssets/Image-6.webp',
  '/aboutAssets/Image-4.webp',
  '/aboutAssets/Image-3.webp',
  '/aboutAssets/Image-5.webp',
  '/aboutAssets/Image-6.webp',
  '/aboutAssets/Image-4.webp',
];

const GallerySection = () => {
  // Split images into rows of 6
  const rows: string[][] = [];
  for (let i = 0; i < images.length; i += 6) {
    rows.push(images.slice(i, i + 6));
  }

  return (
    <section className="relative w-full py-16">
      {/* ===== Header ===== */}
      <div className="px-5 lg:px-20 max-w-7xl lg:mx-[180]">

        <div className="mb-6  space-y-5">
          <div className="uppercase text-2xl lg:text-4xl font-semibold">
            <div>Take a walk through</div>
            <div className="text-primary-default">Our company gallery</div>
          </div>

          <p className="max-w-4xl text-default-body">
            Take a walk through our company gallery, presenting the people and
            processes behind our success, reflecting our commitment to quality
            and integrity, reinforcing the standards we operate by and the
            impact we strive to create every day.
          </p>
        </div>
      </div>

      {/* ===== Gallery ===== */}
      <div className="mt-12 mx-[21px] space-y-5">
        {rows.map((rowImages, rowIndex) => {
          const isNormalRow = rowIndex % 2 === 0;

          return (
            <div
              key={rowIndex}
              className="flex flex-wrap lg:flex-nowrap justify-center gap-4"
            >
              <ImageBlock images={rowImages.slice(0, 3)} reverse={!isNormalRow} />
              <ImageBlock images={rowImages.slice(3, 6)} reverse={!isNormalRow} />
            </div>
          );
        })}
      </div>

      {/* ===== Bottom Fade Overlay ===== */}
     {/* ===== Bottom Fade Overlay ===== */}
<div className="absolute bottom-16 left-0 w-full h-58 lg:h-64 bg-gradient-to-t from-white/100 to-transparent pointer-events-none" />

    </section>
  );
};

export default GallerySection;

/* ============================= */
/* ===== Reusable Image Block === */
/* ============================= */

type BlockProps = {
  images: string[];
  reverse?: boolean;
};

const ImageBlock = ({ images, reverse }: BlockProps) => {
  const renderImage = (src: string, tall: boolean = false) => (
    <div
      className={`w-[260px] sm:w-[300px] lg:w-[340px] ${
        tall ? 'h-[420px] lg:h-[520px]' : 'h-[200px] lg:h-[250px]'
      } overflow-hidden cursor-pointer`}
    >
      <img
        src={src}
        alt="Gallery"
        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
      />
    </div>
  );

  return (
    <div className={`flex gap-4 ${reverse ? 'flex-row-reverse' : ''}`}>
      {renderImage(images[0], true)}
      <div className="flex flex-col justify-between gap-4">
        {renderImage(images[1])}
        {renderImage(images[2])}
      </div>
    </div>
  );
};
