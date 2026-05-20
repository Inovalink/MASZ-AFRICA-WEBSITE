"use client";

import { forwardRef } from "react";
import Image from "next/image";

interface CarouselCardProps {
  src: string;
}

const CarouselCard = forwardRef<HTMLDivElement, CarouselCardProps>(
  function CarouselCard({ src }, ref) {
    return (
      <div
        ref={ref}
        style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          left: "-150px",
          top: "-150px",
          borderRadius: 0,
          overflow: "hidden",
          cursor: "pointer",
          background: "#000",
        }}
      >
        <Image
          fill
          src={src}
          alt=""
          className="object-cover select-none pointer-events-none"
          draggable={false}
          sizes="300px"
        />
      </div>
    );
  }
);

export default CarouselCard;
