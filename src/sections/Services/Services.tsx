import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

interface ServiceItem {
  id: string;
  name: string;
  smallTitle: string;
  description: string;
}

const services: ServiceItem[] = [
  {
    id: "01",
    name: "Digital Strategy",
    smallTitle: "Clear direction blueprint",
    description:
      "We define the digital path for your brand, ensuring every interaction serves a purpose. From market analysis to brand positioning, we build the foundation for your digital growth.",
  },
  {
    id: "02",
    name: "UX/UI Design",
    smallTitle: "Design with intent",
    description:
      "Designing with clarity and creative ambition. We create immersive interfaces that balance aesthetic beauty with functional simplicity, making digital navigation a seamless experience.",
  },
  {
    id: "03",
    name: "Web Development",
    smallTitle: "Code that holds up over time",
    description:
      "Turning designs into high-end digital experiences. We focus on performance, clean code, and interactive excellence to bring your vision to life on the modern web.",
  },
];

const Services: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const duration = 10000; // 10 seconds

  useEffect(() => {
    const startTimer = () => {
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const currentProgress = (elapsed / duration) * 100;

        if (currentProgress >= 100) {
          setActiveIndex((prev) => (prev + 1) % services.length);
          if (timerRef.current) clearInterval(timerRef.current);
          setProgress(0);
        } else {
          setProgress(currentProgress);
        }
      }, 50);
    };

    startTimer();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeIndex]);

  useEffect(() => {
    if (descriptionRef.current) {
      gsap.fromTo(
        descriptionRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
      );
    }
  }, [activeIndex]);

  return (
    <section
      id="services"
      className="w-full px-8 md:px-12 lg:px-24 mb-64 text-[#fff] text-left font-switzer"
    >
      {/* Redesigned Heading: Full width, NewRoman font, Left aligned */}
      <div className="w-full mb-48">
        <h2 className="text-4xl md:text-5xl lg:text-6xl color-[#fff] font-newroman leading-[1.1] tracking-[.65px] text-left">
          <span style={{ textIndent: "25%", display: "inline-block" }}>
            Frisdahl Studio is a creative digital studio building immersive
            websites for modern brands. We balance creative ambition with
            clarity and usability, creating high-end digital experiences that
            support real-world goals without noise or complexity.
          </span>
        </h2>
      </div>

      {/* Service Items Section: Aligned with the 25% offset of the heading first line */}
      <div className="w-full lg:pl-[25%]">
        {/* Service Section Label & Divider */}
        <div className="flex flex-col mb-12">
          <p className="text-sm uppercase mb-4 font-switzer font-semibold tracking-[0.2em]">
            Services
          </p>
          <hr className="w-full h-px border-0 bg-[#e4e2dd]" />
        </div>

        {/* Two Columns Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 pt-12">
          {/* Left Column: Service Names with Timer Lines, Aligned Left */}
          <div className="flex flex-col gap-10 items-start">
            {services.map((service, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={service.id}
                  className={`flex items-center cursor-pointer transition-all duration-500 w-full group ${isActive ? "opacity-100" : "opacity-20 hover:opacity-40"}`}
                  onClick={() => {
                    setActiveIndex(index);
                    setProgress(0);
                  }}
                >
                  <span className="text-5xl font-newroman opacity-60 w-6 shrink-0">
                    {service.id}
                  </span>
                  <div
                    className={`relative h-px shrink-0 ml-12 mr-6 transition-all duration-700 ease-in-out ${
                      isActive ? "w-16 md:w-20 lg:w-24" : "w-8 md:w-10 lg:w-12"
                    }`}
                  >
                    {/* Background line (base line with constant low opacity) */}
                    <div className="absolute inset-0 bg-[#e4e2dd] opacity-20" />

                    {/* Progress line (solid white) - Overlay on top with full opacity */}
                    {isActive && (
                      <div
                        className="absolute top-0 left-0 h-full bg-[#ffffff] z-10"
                        style={{ width: `${progress}%` }}
                      />
                    )}
                  </div>
                  <h3 className="text-5xl font-newroman whitespace-nowrap">
                    {service.name}
                  </h3>
                </div>
              );
            })}
          </div>

          {/* Right Column: Dynamic Descriptions, Left aligned */}
          <div className="flex flex-col items-start lg:pl-12">
            <div ref={descriptionRef} className="w-full">
              <h4 className="text-3xl mb-6 font-newroman">
                {services[activeIndex].smallTitle}
              </h4>
              <p className="text-lg md:text-xl font-switzer font-light leading-relaxed text-left opacity-70">
                {services[activeIndex].description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
