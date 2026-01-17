'use client';

import React, { useState } from 'react';
import Image from 'next/image';

/* -------------------- TEAM DATA -------------------- */

const teamMembers = [
  {
    id: 1,
    name: 'Samuel Okwabeng',
    position: 'CEO of MASZ-Africa',
    description:
      'Samuel Okwabeng is the Chief Executive Officer of MASZ-AFRICA, where he leads the company’s strategic vision and drives operational excellence across all its services. With extensive experience in procurement, supply chain management, engineering, and business operations, Samuel has transformed MASZ-AFRICA into a trusted partner for clients seeking quality, efficiency, and innovation.',
    image: '/aboutAssets/TEAM-1.jpg',
  },
  {
    id: 2,
    name: 'Team Member Two',
    position: 'Operations Manager',
    description:
      'Description for member two goes here. Responsible for daily operations and execution excellence.',
    image: '/aboutAssets/TEAM-2.jpg',
  },
  {
    id: 3,
    name: 'Team Member Three',
    position: 'Project Engineer',
    description:
      'Description for member three goes here. Oversees engineering projects and technical delivery.',
    image: '/aboutAssets/TEAM-3.jpg',
  },
  {
    id: 4,
    name: 'Team Member Four',
    position: 'Procurement Lead',
    description:
      'Description for member four goes here. Handles sourcing and vendor partnerships.',
    image: '/aboutAssets/TEAM-4.jpg',
  },
  {
    id: 5,
    name: 'Team Member Five',
    position: 'Technical Advisor',
    description:
      'Description for member five goes here. Provides strategic technical guidance.',
    image: '/aboutAssets/TEAM-5.jpg',
  },
];

/* -------------------- COMPONENT -------------------- */

export default function TeamMembersTest() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeMember = teamMembers[activeIndex];

  return (
    <div className="h-screen bg-[#f3f3f3] flex items-center justify-center">
      <div className="w-full max-w-6xl flex flex-col gap-20">
        {/* ---------------- Upper Section ---------------- */}
        <div className="flex items-center gap-16">
          {/* Image */}
          <div className="relative w-[300px] h-[420px] overflow-hidden rounded-lg shadow-md">
            <Image
              src={activeMember.image}
              alt={activeMember.name}
              fill
              priority
              className="object-cover object-top"
            />
          </div>

          {/* Details */}
          <div className="flex-1">
            <h2 className="uppercase text-blue-600 text-3xl font-semibold mb-2">
              {activeMember.name}
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              {activeMember.position}
            </p>

            <p className="text-gray-700 leading-relaxed max-w-xl">
              {activeMember.description}
            </p>
          </div>
        </div>

        {/* ---------------- Indicators ---------------- */}
        <div className="flex items-center justify-center gap-6 bg-white p-4 rounded-full shadow-sm w-fit mx-auto">
          {teamMembers.map((member, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={member.id}
                onClick={() => setActiveIndex(index)}
                className={`relative rounded-full p-[3px] transition-all duration-300 hover:scale-105
                  ${
                    isActive
                      ? 'ring-2 ring-blue-500'
                      : 'ring-1 ring-transparent'
                  }
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
