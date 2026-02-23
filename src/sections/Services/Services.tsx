import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

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

  const timerRef = useRef<number | null>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const headingTextRef = useRef<HTMLDivElement>(null);

  const duration = 10000; // 10 seconds

  useLayoutEffect(() => {
    if (!headingRef.current || !headingTextRef.current) return;

    const ctx = gsap.context(() => {
      // Split ONLY the inner text wrapper (not the entire h2),
      // so layout/indent stays predictable.
      const split = new SplitType(headingTextRef.current, {
        types: "lines, words",
        lineClass: "split-line",
        wordClass: "split-word",
      });

      const lines = headingTextRef.current.querySelectorAll(".split-line");
      const words = headingTextRef.current.querySelectorAll(".split-word");

      // Each line clips its own words so they never overlap into other lines
      gsap.set(lines, {
        display: "block",
        overflow: "hidden",
      });

      // Words can transform without breaking spacing
      gsap.set(words, {
        display: "inline-block",
        willChange: "transform, opacity",
      });

      gsap.fromTo(
        words,
        { opacity: 0, yPercent: 100 },
        {
          opacity: 1,
          yPercent: 0,
          stagger: 0.05,
          duration: 1.2,
          ease: "power4.out", // Very smooth, premium ease
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            once: true, // Only plays once, stays visible
          },
        },
      );

      return () => {
        split.revert();
      };
    }, headingRef);

    return () => {
      ctx.revert(); // kills animations created in this context
      // Extra safety: kill any triggers attached to this section
      ScrollTrigger.getAll().forEach((t) => {
        const triggerEl = t.vars.trigger as Element | undefined;
        if (
          triggerEl &&
          headingRef.current &&
          headingRef.current.contains(triggerEl)
        ) {
          t.kill();
        }
      });
    };
  }, []);

  useEffect(() => {
    const startTimer = () => {
      const startTime = Date.now();

      timerRef.current = window.setInterval(() => {
        const elapsed = Date.now() - startTime;
        const currentProgress = (elapsed / duration) * 100;

        if (currentProgress >= 100) {
          setActiveIndex((prev) => (prev + 1) % services.length);
          if (timerRef.current) window.clearInterval(timerRef.current);
          setProgress(0);
        } else {
          setProgress(currentProgress);
        }
      }, 50);
    };

    startTimer();

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [activeIndex]);

  useEffect(() => {
    if (!descriptionRef.current) return;

    gsap.fromTo(
      descriptionRef.current,
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
    );
  }, [activeIndex]);

  return (
    <section
      id="services"
      className="w-full mb-64 text-[#fff] text-left font-switzer px-8 md:px-12 lg:px-24"
    >
      {/* Heading - Full width across the padded container */}
      <div className="w-full mb-24">
        <h2
          ref={headingRef}
          className="text-4xl md:text-5xl lg:text-6xl text-[#fff] font-newroman leading-[1.18] tracking-[.65px] text-left w-full"
        >
          {/* 
            To have ONLY the first line indented and the rest full width, 
            we use a wrapper that adds an invisible inline block at the start.
          */}
          <div ref={headingTextRef} className="w-full">
            <span
              className="inline-block lg:w-[25%] h-1"
              aria-hidden="true"
            ></span>
            Frisdahl Studio is a creative digital studio crafting immersive
            websites for modern brands — balancing visual ambition with clarity
            to create refined digital experiences that serve real-world goals.
          </div>
        </h2>
      </div>

      {/* Services */}
      <div className="w-full lg:pl-[25%]">
        <div className="flex flex-col mb-12">
          <p className="text-sm uppercase mb-4 font-switzer font-semibold tracking-[0.2em]">
            Services
          </p>
          <hr className="w-full h-px border-0 bg-[#e4e2dd]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 pt-12">
          {/* Left column */}
          <div className="flex flex-col gap-10 items-start">
            {services.map((service, index) => {
              const isActive = index === activeIndex;

              return (
                <div
                  key={service.id}
                  className={`flex items-center cursor-pointer transition-all duration-500 w-full group ${
                    isActive ? "opacity-100" : "opacity-20 hover:opacity-40"
                  }`}
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
                    <div className="absolute inset-0 bg-[#e4e2dd] opacity-20" />
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

          {/* Right column */}
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
