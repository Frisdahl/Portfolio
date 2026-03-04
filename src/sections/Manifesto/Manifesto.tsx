import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

const Manifesto: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    if (!headingRef.current || !sectionRef.current) return;

    const split = new SplitType(headingRef.current, {
      types: "lines",
      lineClass: "manifesto-line",
    });

    if (!split.lines?.length) {
      return () => {
        split.revert();
      };
    }

    split.lines.forEach((line) => {
      const wrapper = document.createElement("div");
      wrapper.className = "manifesto-line-wrapper";
      wrapper.style.overflow = "hidden";
      line.parentNode?.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });

    const tween = gsap.fromTo(
      split.lines,
      { yPercent: 100 },
      {
        yPercent: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: headingRef.current,
          toggleActions: "play none none none",
          start: "top 60%",
        },
      },
    );

    return () => {
      tween.kill();
      split.revert();
    };
  });

  return (
    <section
      ref={sectionRef}
      className="w-full px-4 md:px-10 lg:px-12 xl:px-16 font-aeonik"
    >
      <div className="w-full mb-24 overflow-hidden items-center justify-center flex flex-col">
        <p className="uppercase font-aeonik text-lg md:text-md font-medium text-[#1b1b1a] leading-tight mb-6">
          About me
        </p>
        <h2
          ref={headingRef}
          className="text-4xl md:text-6xl lg:text-5xl xl:text-6xl 2xl:text-8xl text-[#1b1b1a] md:max-w-6xl 2xl:max-w-7xl font-aeonik font-medium leading-[1.2] tracking-tight text-center"
        >
          I design and build purposeful digital experiences.
        </h2>
      </div>
    </section>
  );
};

export default Manifesto;
