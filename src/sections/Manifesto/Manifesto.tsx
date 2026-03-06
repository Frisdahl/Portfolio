import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import CurvedTransition from "../../components/CurvedTransition";
import AnimatedButton from "../../components/AnimatedButton";
import ArrowIcon from "../../components/ArrowIcon";
import Marquee from "../../components/Marquee";
import { useMagnetic } from "../../utils/animations/useMagnetic";

gsap.registerPlugin(ScrollTrigger);

const Manifesto: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const expandingContainerRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);

  // Apply magnetic effect to the button container
  useMagnetic(buttonRef, { strength: 40 });

  useLayoutEffect(() => {
    if (!headingRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Text Reveal Animation for heading
      const splitHeading = new SplitType(headingRef.current!, {
        types: "lines",
        lineClass: "manifesto-line",
      });

      if (splitHeading.lines?.length) {
        splitHeading.lines.forEach((line) => {
          const wrapper = document.createElement("div");
          wrapper.className = "manifesto-line-wrapper overflow-hidden";
          line.parentNode?.insertBefore(wrapper, line);
          wrapper.appendChild(line);
        });

        gsap.fromTo(
          splitHeading.lines,
          { yPercent: 100 },
          {
            yPercent: 0,
            duration: 1.1,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 95%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      // 2. Text Reveal Animation for body
      if (bodyRef.current) {
        const splitBody = new SplitType(bodyRef.current, {
          types: "lines",
          lineClass: "manifesto-line",
        });

        if (splitBody.lines?.length) {
          splitBody.lines.forEach((line) => {
            const wrapper = document.createElement("div");
            wrapper.className = "manifesto-line-wrapper overflow-hidden";
            line.parentNode?.insertBefore(wrapper, line);
            wrapper.appendChild(line);
          });

          gsap.fromTo(
            splitBody.lines,
            { yPercent: 100 },
            {
              yPercent: 0,
              duration: 1.1,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: bodyRef.current,
                start: "top 95%",
                toggleActions: "play none none reverse",
              },
            },
          );
        }
      }

      // 3. Parallax Slide-Up
      gsap.fromTo(
        containerRef.current,
        { y: 200 },
        {
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        },
      );

      // 4. Expanding Container Animation
      if (expandingContainerRef.current) {
        gsap.fromTo(
          expandingContainerRef.current,
          {
            width: "80vw",
            borderRadius: "2rem",
            marginTop: "200px", // Start with a clear gap from the divider
          },
          {
            width: "100vw",
            borderRadius: 0,
            marginTop: 0, // Grows upwards to touch the divider
            scrollTrigger: {
              trigger: expandingContainerRef.current.parentElement,
              start: "top 95%", // Start when the section top enters
              end: "top 10%", // Finish while still in the upper part of the screen
              scrub: 1.2, // Smoother expansion
            },
          },
        );
      }

      // 5. Video Wrapper Expansion
      if (videoWrapperRef.current) {
        gsap.to(videoWrapperRef.current, {
          width: "100%",
          borderRadius: 0,
          scrollTrigger: {
            trigger: videoWrapperRef.current,
            start: "top 80%",
            end: "bottom 80%",
            scrub: 1.5, // Even smoother for the video
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative w-full z-10 overflow-visible">
      <div
        ref={containerRef}
        className="relative w-full -mt-[150px] md:-mt-[350px]"
      >
        <CurvedTransition color="#131312" className="translate-y-[2px]" />

        <div className="bg-[#131312] w-full px-4 md:px-10 lg:px-12 xl:px-16 flex flex-col items-center justify-center py-24 md:py-48 lg:py-64">
          <h2
            ref={headingRef}
            className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-5xl mb-16 text-[#fefffe] md:max-w-3xl 2xl:max-w-4xl font-cabinet font-regular leading-[1.25] text-center"
          >
            I design and build purposeful digital experiences that bridge the
            gap between aesthetics and functionality.
          </h2>
          <p
            ref={bodyRef}
            className="text-2xl md:text-3xl text-[#fefffe] md:max-w-6xl 2xl:max-w-8xl font-cabinet font-regular leading-[1.1] md:max-w-3xl 2xl:max-w-4xl tracking-tight text-center mb-16"
          >
            I specialize in building performant, motion-driven web interfaces
            using React, TypeScript and GSAP.
          </p>

          {/* About Me Button with Magnetic effect */}
          <div ref={buttonRef} className="inline-block">
            <AnimatedButton
              text="About Me"
              link="/about"
              icon={<ArrowIcon className="w-5 h-5 -rotate-45" />}
              baseBgColor="bg-[#d4f534]"
              baseTextColor="text-[#131312]"
              hoverBgColor="bg-[#131312]"
              hoverTextColor="text-[#d4f534]"
              baseBorderColor="border-[#d4f534]"
              hoverBorderColor="border-[#d4f534]"
              fontSize="text-lg md:text-xl"
              padding="px-10 py-4 md:px-14 md:py-5"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-[#d4f534]/10" />

        {/* Expanding Container Section */}
        <div className="w-full flex flex-col items-center pb-24 md:pb-48 bg-[#131312]">
          <div
            ref={expandingContainerRef}
            className="w-[80vw] bg-[var(--background)] rounded-2xl md:rounded-[2rem] overflow-hidden flex flex-col items-center py-20"
          >
            {/* Marquee - Full Width */}
            <div className="w-full mb-20 overflow-hidden">
              <Marquee
                text="Full-stack development"
                className="text-6xl md:text-8xl lg:text-9xl font-cabinet font-bold uppercase text-[#1b1b1a]"
                speed={30}
              />
            </div>

            {/* Video Showcase Container - Padded */}
            <div
              ref={videoWrapperRef}
              className="w-[80%] aspect-video rounded-xl overflow-hidden mx-6 md:px-[6.3rem]"
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              >
                <source
                  src="/projectVideos/videoshowcase/promo_h264.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Manifesto;
