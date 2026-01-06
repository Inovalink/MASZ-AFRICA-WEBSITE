import React from 'react'
import HeroSession from './sessions/HeroSession'
import AboutSession from './sessions/AboutSession'
import ServiceSession from './sessions/ServiceSession'
import CoreValueSession from './sessions/CoreValueSession'
import TestimonialSession from './sessions/TestimonialSession'
import FaqSession from './sessions/FaqSession'

function page() {
  return (
    <div>
      <HeroSession/>
      <AboutSession/>
      <ServiceSession/>
      <CoreValueSession/>
      <TestimonialSession/>
      <FaqSession/>

      
    </div>
  )
}

export default page