import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

const Manifesto: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const splitRef = useRef<SplitType | null>(null);

  useEffect(() => {
    if (!headingRef.current || !sectionRef.current) return;

    let hasInitialized = false;
    let removeResizeListener: (() => void) | null = null;
    let breakpointKey = "";

    const getBreakpointKey = () => {
      const width = window.innerWidth;
      if (width >= 1280) return "xl";
      if (width >= 1024) return "lg";
      if (width >= 768) return "md";
      return "sm";
    };

    const runSplit = () => {
      if (splitRef.current) splitRef.current.revert();

      // Create new split for lines
      splitRef.current = new SplitType(headingRef.current!, {
        types: "lines",
        lineClass: "manifesto-line",
      });

      // Wrap each line in an overflow-hidden container for the reveal
      splitRef.current.lines?.forEach((line) => {
        const wrapper = document.createElement("div");
        wrapper.className = "manifesto-line-wrapper";
        wrapper.style.overflow = "hidden";
        line.parentNode?.insertBefore(wrapper, line);
        wrapper.appendChild(line);
      });

      // Entrance Reveal
      gsap.fromTo(
        splitRef.current.lines,
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );
    };

    const initAnimations = () => {
      if (hasInitialized) return;
      hasInitialized = true;
      breakpointKey = getBreakpointKey();

      runSplit();

      const handleResize = () => {
        const nextKey = getBreakpointKey();
        if (nextKey === breakpointKey) return;
        breakpointKey = nextKey;
        runSplit();
      };
      window.addEventListener("resize", handleResize);
      removeResizeListener = () => {
        window.removeEventListener("resize", handleResize);
      };
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          initAnimations();
          observer.disconnect();
        }
      },
      { rootMargin: "250px 0px" },
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
      removeResizeListener?.();
      if (splitRef.current) splitRef.current.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full px-6 md:px-10 lg:px-12 xl:px-16 font-aeonik"
    >
      <div className="w-full mb-24 overflow-hidden">
        <h2
          ref={headingRef}
          className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-[#1c1d1e] font-aeonik font-bold leading-[1.2] tracking-tight text-center"
        >
          I design and build digital experiences for ambitious brands — blending
          structure, clarity, and purposeful motion.
        </h2>
      </div>
    </section>
  );
};

export default Manifesto;
