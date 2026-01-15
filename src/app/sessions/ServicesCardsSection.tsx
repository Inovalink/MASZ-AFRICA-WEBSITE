'USE CLIENT'
import React from 'react';
import { MoveRight } from 'lucide-react';

const cardsData = [
  {
    id: 1,
    tag: "product",
    number: "01",
    title: "Grinding media",
    description: "We offer complete gearbox diagnostics, repairs, and component replacements using OEM parts and experienced technicians. Our work helps restore equipment reliability and prevent costly downtime across crushers, mills, and conveyors.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=800&fit=crop",
    bgColor: "bg-slate-900"
  },
  {
    id: 2,
    tag: "service",
    number: "02",
    title: "Industrial Solutions",
    description: "Advanced industrial solutions designed to optimize your operations. We provide cutting-edge technology and expert support to ensure maximum efficiency and minimal downtime in your production processes.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=800&fit=crop",
    bgColor: "bg-blue-900"
  },
  {
    id: 3,
    tag: "innovation",
    number: "03",
    title: "Smart Manufacturing",
    description: "Leverage the power of IoT and AI-driven insights to transform your manufacturing processes. Our smart solutions help you predict maintenance needs, optimize workflows, and reduce operational costs significantly.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=800&fit=crop",
    bgColor: "bg-purple-900"
  },
  {
    id: 4,
    tag: "technology",
    number: "04",
    title: "Automation Systems",
    description: "State-of-the-art automation systems that streamline your production line. From robotics to control systems, we deliver comprehensive automation solutions tailored to your specific industry requirements.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=800&fit=crop",
    bgColor: "bg-emerald-900"
  },
  {
    id: 5,
    tag: "consulting",
    number: "05",
    title: "Strategic Planning",
    description: "Expert consulting services to help you navigate complex industrial challenges. Our team provides strategic insights and actionable plans to drive growth, improve efficiency, and maintain competitive advantage.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=800&fit=crop",
    bgColor: "bg-orange-900"
  }
];

function ServicesCardsSection() {
  return (
    <section className="bg-[#f3f3f3] py-20">
      {cardsData.map((card, index) => (
        <div 
          key={card.id}
          className="sticky top-0 h-screen flex justify-center items-center px-[21px] lg:px-[200px]"
          style={{
            top: `${index * 40}px`,
            zIndex: index + 1
          }}
        >
          <div 
            className="card-content w-full lg:w-[70%] lg:h-[550px] rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.02]"
            style={{
              transform: `scale(${0.8 + index * 0.05})`,
              transformOrigin: 'top center'
            }}
          >
            {/* Upper Section */}
            <div className="upper-section flex justify-between items-center p-6 lg:p-8 bg-white">
              <div className="left-section">
                <span className="inline-block px-4 py-2 bg-black text-white text-xs lg:text-sm font-medium rounded-full uppercase tracking-wider">
                  {card.tag}
                </span>
              </div>
              <div className="right-section">
                <a 
                  href="#" 
                  className="text-sm lg:text-base font-medium hover:underline transition-all"
                >
                  Details
                </a>
              </div>
            </div>

            {/* Lower Section with Image */}
            <div className="lower-section w-full h-[calc(100%-80px)] lg:h-[458px] relative">
              <div className="image-container relative w-full h-full overflow-hidden">
                {/* Background Image */}
                <img
                  src={card.image}
                  alt={card.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 ${card.bgColor} opacity-70`}></div>
                
                {/* Content Overlay */}
                <div className="absolute inset-0 flex justify-between items-end p-6 lg:p-12">
                  <div className="text-white text-6xl lg:text-8xl font-bold opacity-30">
                    {card.number}
                  </div>
                  
                  <div className="text-container max-w-[600px] bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 lg:p-8 shadow-xl">
                    <h3 className="text-2xl lg:text-4xl font-semibold text-white uppercase mb-4">
                      {card.title}
                    </h3>
                    <p className="text-sm lg:text-base text-white/90 mb-6 leading-relaxed">
                      {card.description}
                    </p>
                    <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-opacity-90 transition-all group">
                      <span>Explore our services</span>
                      <MoveRight 
                        size={20} 
                        strokeWidth={2.5} 
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

export default ServicesCardsSection;