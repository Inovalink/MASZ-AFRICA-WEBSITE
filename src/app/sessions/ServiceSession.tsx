'use client';

import React from 'react';
import Tag from '../components/tag';
import Link from 'next/link';
import { MoveRight } from 'lucide-react';
import Button from '../components/button';

function ServiceSession() {
  const serviceList = [
    {
      id: 1,
      title: 'Grinding media',
      subtext:
        'We offer complete gearbox diagnostics, repairs, and component replacements using OEM parts and experienced technicians. Our work helps restore equipment reliability and prevent costly downtime across crushers, mills, and conveyors.',
    },
    {
      id: 2,
      title: 'Activated Carbon',
      subtext:
        'We offer complete gearbox diagnostics, repairs, and component replacements using OEM parts and experienced technicians. Our work helps restore equipment reliability and prevent costly downtime across crushers, mills, and conveyors.',
    },
    {
      id: 3,
      title: 'Metal and steel Pipes',
      subtext:
        'We offer complete gearbox diagnostics, repairs, and component replacements using OEM parts and experienced technicians. Our work helps restore equipment reliability and prevent costly downtime across crushers, mills, and conveyors.',
    },
    {
      id: 4,
      title: 'Gear Box servicing and Heavy Machine Maintenance',
      subtext:
        'We offer complete gearbox diagnostics, repairs, and component replacements using OEM parts and experienced technicians. Our work helps restore equipment reliability and prevent costly downtime across crushers, mills, and conveyors.',
    },
  ];

  return (
    <section>
      <div className="services-section-container my-[100]">
        <Tag text="services" className="ml-[22] " />

        <div className="services-section-header text-xl-semibold uppercase ml-[22] my-[30]">
          Explore our <span className="text-primary-default">products</span>{' '}
          <span>and</span>{' '}
          <span className="text-primary-default">services</span>
        </div>

        <div className="services-session-product-list-container my-[60]">
          <ul>
            {serviceList.map((list) => (
              <li
                key={list.id}
                tabIndex={0}
                className="
                    group mx-[22px] flex relative cursor-pointer
                    border-b border-gray-300
                    outline-none

                    before:content-['']
                    before:absolute before:left-0 before:top-0
                    before:h-[2px] before:w-full
                    before:bg-blue-600
                    before:scale-x-0 before:origin-left
                    before:transition-transform before:duration-[1200ms]
                    before:ease-[cubic-bezier(0.25,0.8,0.25,1)]
                    before:will-change-transform

                    after:content-['']
                    after:absolute after:left-0 after:bottom-0
                    after:h-[2px] after:w-full
                    after:bg-blue-600
                    after:scale-x-0 after:origin-right
                    after:transition-transform after:duration-[1200ms]
                    after:ease-[cubic-bezier(0.25,0.8,0.25,1)]
                    after:will-change-transform

                    hover:before:scale-x-100 hover:after:scale-x-100
                    focus-within:before:scale-x-100 focus-within:after:scale-x-100
        "
              >
                <p
                  className="
                      services-list-number text-lg-semibold text-default-body pr-[80px] py-[20px]
                      flex items-center justify-center
                      transition-all duration-[700ms] ease-[cubic-bezier(0.25,0.8,0.25,1)]
                      group-hover:text-blue-600 group-hover:scale-110
                      group-focus-within:text-blue-600 group-focus-within:scale-110
                      group-active:text-blue-600 group-active:scale-110
                      animate-numberFloat
        "
                >
                  {list.id}
                </p>

                <div className="flex-1 relative">
                  <div
                    className="
                        grinding-media uppercase text-default-body text-lg-semibold
                        pr-[20px] py-[20px]
                        transition-colors duration-[700ms]
                        ease-[cubic-bezier(0.25,0.8,0.25,1)]
                        group-hover:text-blue-600
                        group-active:text-blue-600
                        group-focus-within:text-blue-600
          "
                  >
                    {list.title}
                  </div>

                  <div
                    className="
                        overflow-hidden max-h-0 opacity-0 translate-y-2
                        transition-all duration-[1200ms]
                        ease-[cubic-bezier(0.25,0.8,0.25,1)]
                        group-hover:max-h-[240px] group-hover:opacity-100 group-hover:translate-y-0
                        group-focus-within:max-h-[240px] group-focus-within:opacity-100 group-focus-within:translate-y-0
          "
                  >
                    <div className="list-subtext text-sm-medium pr-[20px]">
                      {list.subtext}
                    </div>

                    <div className="flex items-center bg-white my-[20px] pr-[20px]">
                      <Link
                        href="/"
                        className="
                          uppercase text-sm-medium text-primary-default
                          transition-colors duration-[700ms]
                          ease-[cubic-bezier(0.25,0.8,0.25,1)]
                          group-hover:text-blue-600
                          group-focus-within:text-blue-600
                          group-hover:underline
                          group-focus-within:underline
                "
                      >
                        Learn More
                      </Link>
                      <MoveRight
                        className="ml-2 text-blue-600
                        transition-transform duration-700
                        ease-[cubic-bezier(0.25,0.8,0.25,1)]
                        group-hover:translate-x-1
                        group-focus-within:translate-x-1
                        group-active:translate-x-1
                        animate-arrowFloat"
                      />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <Button
            label="Explore our services"
            variant="primary"
            size="large"
            icon={<MoveRight size={16} />}
            className="ml-[22] my-[35]"
          />
        </div>
      </div>
    </section>
  );
}

export default ServiceSession;