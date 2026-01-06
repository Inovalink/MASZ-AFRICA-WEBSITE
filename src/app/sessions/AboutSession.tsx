import React from 'react';
import Tag from '../components/tag';
import Image from 'next/image';
import Button from '../components/button';
import { MoveRight } from 'lucide-react';
import AnimationCopy from '../animations/WritingTextAnimation';

function AboutSession() {
  return (
    <section>
      <div className="about-session-container my-[100]">
        <div className="session-container">
          <Tag text="About us" className=" ml-[22]" />
          <div className="about-us-header text-xl-semibold uppercase ml-[22] my-[30]">
            Who <span className="text-primary-default">We are</span>
          </div>
          <AnimationCopy>

          <div className="about-us-text mx-[25] text-lg-medium">
            MASZ-Africa is a Ghana-based mining supply and engineering support
            company committed to helping mining operations run efficiently,
            reliably, and without interruption. We provide high-quality
            consumables, certified equipment, and practical technical services
            backed by real hands-on industry experience. Through trusted global
            sourcing and strong technical understanding, we ensure every product
            we deliver performs exactly as required in demanding mining
            environments.
            <br />
            <br />
            Our team works closely with clients to understand their operational
            needs, recommend the right solutions, and provide support that
            genuinely improves performance. With a consistent focus on on-time
            delivery, transparent communication, and dependable field
            assistance, we help mines reduce downtime and keep production
            moving. At MASZ-Africa, our goal is simple — supply what works,
            support what matters, and deliver the level of service every mining
            operation expects and deserves.
          </div>
          </AnimationCopy>

          <div className="about-us-image relative w-[88%] h-[400] mx-[25] mt-[50] bg-red-500 flex items-center justify-center">
            <Image
              src="/homeAssets/Image-2.jpg"
              alt=""
              fill
              priority
              className='object-cover '
            />
          </div>

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

export default AboutSession;
