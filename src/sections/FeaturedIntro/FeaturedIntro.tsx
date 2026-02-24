import React, { useLayoutEffect, useRef } from "react";
import { initFeaturedIntroAnimations } from "./FeaturedIntro.anim";

const FeaturedIntro: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftBoxRef = useRef<HTMLDivElement>(null);
  const rightTextRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current || !leftBoxRef.current || !rightTextRef.current) return;
    const ctx = initFeaturedIntroAnimations(
      sectionRef.current,
      leftBoxRef.current,
      rightTextRef.current
    );
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="featured-intro"
      className="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center bg-transparent z-10 mb-32 md:mb-64"
    >
      <div className="w-full px-8 md:px-16 lg:px-24">
        {/* Flex layout for precise center alignment of the pair */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-center gap-10 md:gap-32 lg:gap-44 max-w-7xl mx-auto">
          
          {/* Left: Featured Project Badge */}
          <div 
            ref={leftBoxRef}
            className="flex-shrink-0"
          >
            <div className="bg-[#1a1a1a] border border-white/5 px-10 py-5 rounded-full inline-flex items-center justify-center shadow-xl">
              <span className="text-[10px] md:text-[11px] uppercase tracking-[0.5em] font-switzer font-medium text-[#fff] opacity-60 whitespace-nowrap">
                featured project
              </span>
            </div>
          </div>

          {/* Right: Heading Text */}
          <div className="max-w-2xl">
            <h3 
              ref={rightTextRef}
              className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-newroman text-[#fff] leading-[1.3] tracking-tight text-left"
            >
              Handcrafted Experiences for <br className="hidden md:block" />
              Brands of All Sizes, Worldwide
            </h3>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeaturedIntro;
