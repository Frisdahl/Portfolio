import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { Link } from "react-router-dom";

const AboutPage: React.FC = () => {
  const headingRef1 = useRef<HTMLHeadingElement>(null);
  const headingRef2 = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!headingRef1.current || !headingRef2.current) return;

    // Split both headings into lines
    const split1 = new SplitType(headingRef1.current, { types: "lines", tagName: "span" });
    const split2 = new SplitType(headingRef2.current, { types: "lines", tagName: "span" });

    const allLines = [...(split1.lines || []), ...(split2.lines || [])];

    if (allLines.length > 0) {
      allLines.forEach((line) => {
        gsap.set(line, {
          display: "block",
          overflow: "hidden",
          clipPath: "inset(0 100% 0 0)",
          filter: "blur(20px)",
          opacity: 0,
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1.5,
        },
      });

      tl.to(allLines, {
        clipPath: "inset(0 0% 0 0)",
        filter: "blur(0px)",
        opacity: 1,
        stagger: 0.5,
        ease: "power2.out",
      });
    }

    return () => {
      split1.revert();
      split2.revert();
    };
  }, []);

  return (
    <div className="pt-32 pb-64">
      <section id="about-me" className="text-[var(--foreground)] w-full px-8 md:px-16 lg:px-24">
        <div ref={containerRef} className="relative">
          
          <h2 
            ref={headingRef1}
            className="text-8xl font-[granary] text-[var(--foreground)] w-full text-left leading-tight mb-4"
          >
            As a <span className="font-apparel">creative designer</span>, I help
            brands and companies connect with their audience,
          </h2>

          <img
            src="https://placehold.co/560x760"
            alt="Project placeholder"
            className="float-left w-[46vw] min-w-[240px] max-w-[640px] mr-10 mt-2 mb-4 rounded-md"
          />

          <h2 
            ref={headingRef2}
            className="text-8xl font-[granary] text-[var(--foreground)] w-full text-left leading-tight"
          >
            achieve their business goals, and leave a mark in a fast-moving world
          </h2>

          <p className="text-2xl text-left mt-10 clear-none text-[var(--foreground)] opacity-90">
            My name is Alexander. I’m a passionate creative who works closely with
            companies to help them unlock their full potential and solve specific
            business problems with effective and memorable design solutions.
          </p>
          
          <div className="w-full clear-both">
            <img
              src="/images/line.svg"
              alt="line"
              className="w-full mt-4 mb-12"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
