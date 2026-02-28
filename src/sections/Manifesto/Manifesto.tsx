import React, { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

const Manifesto: React.FC = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const splitRef = useRef<SplitType | null>(null);

  useLayoutEffect(() => {
    if (!headingRef.current) return;

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
          }
        }
      );
    };

    runSplit();

    const handleResize = () => runSplit();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (splitRef.current) splitRef.current.revert();
    };
  }, []);

  return (
    <section className="w-full px-6 md:px-10 lg:px-12 xl:px-16 font-aeonik">
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
