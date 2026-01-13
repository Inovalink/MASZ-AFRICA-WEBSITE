'use client';

import React, { forwardRef } from 'react';
import Image from 'next/image';

export type TeamMember = {
  id: number;
  description: string;
  image: string;
};

type Props = {
  member: TeamMember;
};

const TeamMemberCard = forwardRef<HTMLDivElement, Props>(({ member }, ref) => {
  return (
    <div
      ref={ref}
      className="card bg-white w-full max-w-[1200px] lg:h-[600px]
        flex flex-col lg:flex-row gap-10 lg:items-center
        px-6 lg:px-[40px] py-8 absolute top-1/2 -translate-y-1/2"
    >
      {/* LEFT */}
      <div className="lg:w-[500px] flex justify-center">
        <div className="relative w-full lg:w-[70%] h-64 lg:h-[450px]">
          {/* Blue background (BEHIND everything) */}
          <div className="absolute -bottom-8 -left-7 w-[117%] h-[50%] bg-[#016BF2] z-0" />

          <Image
            src={member.image}
            alt="Team member"
            fill
            priority
            className="object-cover relative z-10"
          />

          {/* Overlay */}
          <div
            className="absolute bottom-0 left-0 right-0 z-20 px-4 py-3
                    bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center"
          >
            <h3 className="text-white text-xl-semibold font-semibold ">
              Samuel Okwabeng
            </h3>
            <p className="text-white/80 text-sm lg:mb-[30]">
              CEO of MASZ-Africa
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div
        className="text-base lg:text-md-medium leading-relaxed lg:w-[60%] text-gray-700"
        dangerouslySetInnerHTML={{ __html: member.description }}
      />
    </div>
  );
});

TeamMemberCard.displayName = 'TeamMemberCard';
export default TeamMemberCard;
