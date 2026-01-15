import React from 'react'
import Tag from '../components/tag'
import AnimationCopy from '../animations/WritingTextAnimation'

function page() {
  return (
    <section className='h-screen'>
      <div className="services-main-content lg:mx-[180] lg:mt-[150]">
        <Tag text='products and Services'/>
        <div className="text-content lg:mt-[50]">
          <div className="header uppercase lg:text-4xl-semibold lg:mt-[50] lg:mb-[50]">
            <div className="line-1 lg:mb-[-20]">
              Strengthening the
            </div>
            <div className="line-2 text-primary-default">
              Global minining backbone
            </div>
          </div>
          <AnimationCopy>

          <div className="description  lg:text-2xl-medium text-default-body lg:tracking-tight lg:leading-8">
           At Masz-Africa, we do more than just supply mining products — we become a true operational partner for your business. Our commitment extends beyond delivery: we provide the tools, expertise, and ongoing support necessary to keep your projects running seamlessly. Whether it’s high-quality consumables, specialized equipment, or expert technical consultancy, Masz-Africa is dedicated to ensuring that every aspect of your mining operations is efficient, safe, and productive.
We understand that each mining project has unique challenges, which is why our solutions are tailored to meet the specific demands of your site, no matter where you operate across West Africa. With Masz-Africa, you gain more than a supplier — you gain a trusted partner focused on maximizing performance, reducing downtime, and helping your operations achieve their full potential.
          </div>
          </AnimationCopy>
        </div>
      </div>
    </section>
  )
}

export default page