import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);
gsap.registerPlugin(CustomEase);

const Manifesto: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current || !headingRef.current || !bodyRef.current)
      return;

    const headingSplit = new SplitText(headingRef.current, { type: "lines" });
    const bodySplit = new SplitText(bodyRef.current, { type: "lines" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 60%",
        toggleActions: "play none none reverse",
      },
    });

    tl.from(headingSplit.lines, {
      y: 60,
      autoAlpha: 0,
      stagger: 0.1,
      ease: CustomEase.create("smooth", "0.25, 0.1, 0.25, 1.0"),
    });

    tl.from(bodySplit.lines, {
      autoAlpha: 0,
      ease: CustomEase.create("smooth", "0.25, 0.1, 0.25, 1.0"),
    });

    return () => {
      headingSplit.revert();
      bodySplit.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section className="relative w-full z-10 overflow-visible">
      <div ref={containerRef} className="relative w-full flex justify-center">
        <div className=" w-full px-4 md:px-10 lg:px-12 xl:px-16 flex flex-col items-center md:max-w-3xl 2xl:max-w-5xl justify-center">
          <div className="overflow-hidden">
            <h2
              ref={headingRef}
              className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-7xl mb-8 text-[var(--foreground)] font-cabinet font-medium leading-[1.25] text-center"
            >
              I design and build purposeful digital experiences.
            </h2>
          </div>
          <p
            ref={bodyRef}
            className="text-xl md:text-2xl 3xl:text-xl text-[var(--foreground-muted)] max-w-xl font-cabinet font-regular leading-[1.1] tracking-tight text-center"
          >
            I specialize in building performant, motion-driven web interfaces
            using React, TypeScript and GSAP.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Manifesto;
