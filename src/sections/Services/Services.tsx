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
  const [displayIndex, setDisplayIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const timerRef = useRef<number | null>(null);
  const descriptionTextRef = useRef<HTMLParagraphElement>(null);
  const smallTitleRef = useRef<HTMLHeadingElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const headingTextRef = useRef<HTMLDivElement>(null);

  const duration = 10000; // 10 seconds

  // Heading Animation
  useLayoutEffect(() => {
    if (!headingRef.current || !headingTextRef.current) return;

    const ctx = gsap.context(() => {
      const split = new SplitType(headingTextRef.current!, {
        types: "lines,words",
        lineClass: "split-line",
        wordClass: "split-word",
      });

      // Wrap each word in a container that has overflow hidden to make the slide up work
      // or just ensure lines have overflow hidden. 
      // The current structure uses lines as the masking container.
      gsap.set(split.lines, { overflow: "hidden" });
      gsap.set(split.words, { display: "inline-block" });

      gsap.fromTo(
        split.words,
        { yPercent: 100, opacity: 0 },
        {
          opacity: 1,
          yPercent: 0,
          stagger: 0.02,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );
    }, headingRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const startTime = Date.now();
    const interval = 50; // ms

    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min((elapsed / duration) * 100, 100);

      if (currentProgress >= 100) {
        setProgress(100);
        setActiveIndex((prev) => (prev + 1) % services.length);
      } else {
        setProgress(currentProgress);
      }
    }, interval);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [activeIndex]);

  // Handle the index transition with exit animation
  useEffect(() => {
    if (activeIndex === displayIndex) return;

    const ctx = gsap.context(() => {
      const words =
        descriptionTextRef.current?.querySelectorAll(".description-word");
      const titleWords = smallTitleRef.current?.querySelectorAll(".title-word");

      const elementsToAnimate = [];
      if (words) elementsToAnimate.push(...Array.from(words));
      if (titleWords) elementsToAnimate.push(...Array.from(titleWords));

      const tl = gsap.timeline({
        onComplete: () => setDisplayIndex(activeIndex),
      });

      if (elementsToAnimate.length > 0) {
        tl.to(elementsToAnimate, {
          yPercent: 100,
          opacity: 0,
          duration: 0.4,
          stagger: 0.005,
          ease: "power2.in",
        });
      } else {
        setDisplayIndex(activeIndex);
      }
    });

    return () => ctx.revert();
  }, [activeIndex, displayIndex]);

  useLayoutEffect(() => {
    if (
      !descriptionTextRef.current ||
      !smallTitleRef.current ||
      !rightContentRef.current
    )
      return;

    const ctx = gsap.context(() => {
      // 1. Split small title
      const titleSplit = new SplitType(smallTitleRef.current!, {
        types: "words",
        wordClass: "title-word",
      });

      // 2. Split description
      const lineSplit = new SplitType(descriptionTextRef.current!, {
        types: "lines",
        lineClass: "description-line",
      });

      const wordSplit = new SplitType(lineSplit.lines!, {
        types: "words",
        wordClass: "description-word",
      });

      // Set initial states
      gsap.set(lineSplit.lines, { overflow: "hidden", display: "block" });
      gsap.set([titleSplit.words, wordSplit.words], {
        yPercent: 100,
        opacity: 0,
        display: "inline-block",
      });

      // Animate in
      const tl = gsap.timeline();
      tl.to(titleSplit.words, {
        yPercent: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.02,
        ease: "power3.out",
      }).to(
        wordSplit.words,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.01,
          ease: "power3.out",
        },
        "-=0.4",
      );

      return () => {
        titleSplit.revert();
        wordSplit.revert();
        lineSplit.revert();
      };
    }, rightContentRef);

    return () => ctx.revert();
  }, [displayIndex]);

  return (
    <section
      id="services"
      className="w-full mb-64 text-[#1c1d1e] text-left font-switzer px-8"
    >
      {/* Heading - Full width across the padded container */}
      <div className="w-full mb-24">
        <h2
          ref={headingRef}
          className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl text-[#1c1d1e] font-instrumentsans font-bold leading-[1.25] tracking-tight text-left w-full"
        >
          {/* 
            To have ONLY the first line indented and the rest full width, 
            we use a wrapper that adds an invisible inline block at the start.
          */}
          <div ref={headingTextRef} className="w-full">
            <span
              className="hidden lg:inline-block h-1"
              style={{ width: "calc(var(--nav-width, 25%) + 3rem)" }}
              aria-hidden="true"
            ></span>
            Frisdahl Studio builds refined digital experiences for modern brands
            — where visual ambition meets clarity.
          </div>
        </h2>
      </div>

      {/* Services */}
      <div className="w-full lg:pl-[calc(var(--nav-width,25%)+3rem)]">
        <div className="flex flex-col mb-12">
          <p className="text-sm uppercase mb-4 font-switzer font-semibold tracking-[0.2em] text-[#1c1d1e]/40">
            Services
          </p>
          <hr className="w-full h-px border-0 bg-[#1c1d1e]/10" />
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
                    isActive ? "opacity-100" : "opacity-30 hover:opacity-40"
                  }`}
                  onClick={() => {
                    setActiveIndex(index);
                    setProgress(0);
                  }}
                >
                  <span className="text-2xl md:text-4xl font-instrumentsans font-bold w-12 shrink-0">
                    {service.id}
                  </span>

                  <div
                    className={`relative h-px shrink-0 ml-4 md:ml-12 mr-6 transition-all duration-700 ease-in-out ${
                      isActive ? "w-16 md:w-20 lg:w-24" : "w-8 md:w-10 lg:w-12"
                    }`}
                  >
                    <div className="absolute inset-0 bg-[#1c1d1e] opacity-30" />
                    {isActive && (
                      <div
                        className="absolute top-0 left-0 h-full bg-[#1c1d1e] z-10"
                        style={{ width: `${progress}%` }}
                      />
                    )}
                  </div>

                  <h3 className="text-2xl md:text-4xl font-instrumentsans font-bold whitespace-nowrap">
                    {service.name}
                  </h3>
                </div>
              );
            })}
          </div>

          {/* Right column */}
          <div className="flex flex-col items-start lg:pl-12">
            <div key={displayIndex} ref={rightContentRef} className="w-full">
              <h4
                ref={smallTitleRef}
                className="text-2xl md:text-3xl mb-6 font-instrumentsans font-bold"
              >
                {services[displayIndex].smallTitle}
              </h4>
              <p
                ref={descriptionTextRef}
                className="text-lg md:text-xl font-switzer font-light leading-relaxed text-left opacity-70"
              >
                {services[displayIndex].description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Services as default };
