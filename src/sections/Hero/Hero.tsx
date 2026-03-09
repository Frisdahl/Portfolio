import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import AnimatedNavLink from "../../components/AnimatedNavLink";

const Hero: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const setContainerPadding = () => {
      const headerElement = document.querySelector("header");
      if (headerElement && containerRef.current) {
        const headerHeight = headerElement.offsetHeight;
        const isMobile = window.matchMedia("(max-width: 767px)").matches;
        containerRef.current.style.paddingTop = `${
          isMobile ? headerHeight + 4 : headerHeight + 8
        }px`;
      }
    };

    setContainerPadding();
    window.addEventListener("resize", setContainerPadding);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" },
      );
    }, sceneRef);

    return () => {
      window.removeEventListener("resize", setContainerPadding);
      ctx.revert();
    };
  }, []);

  return (
    <div
      id="hero"
      ref={sceneRef}
      className="relative w-full h-[100svh] flex flex-col bg-[var(--background)] overflow-hidden"
    >
      <div
        ref={containerRef}
        className="flex-1 min-h-0 w-full flex flex-col items-center justify-center px-4 md:px-10 lg:px-4 xl:px-6 xl:pb-14 overflow-hidden"
      >
        {/* Video container: same width as header content (full width within padding) */}
        <div className="relative w-full h-full min-h-0 max-h-full rounded-2xl overflow-hidden flex-shrink">
          {/* Video background */}
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/glassobj.mp4" type="video/mp4" />
          </video>

          {/* Text content */}
          <div
            ref={contentRef}
            className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 py-8"
          >
            <p className="text-[var(--foreground)] text-lg md:text-2xl font-regular mb-8 font-aeonik">
              Hi! i'm Alexander
            </p>
            <h1 className="text-[var(--foreground)] text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-regular font-cabinet tracking-tight">
              Full-stack Developer <br /> UI & UX Designer.
            </h1>
          </div>
        </div>
      </div>

      {/* Bottom bar: full width, same padding as header (aligns with logo and buttons) */}
      <footer className="justify-between w-full px-4 md:px-10 lg:px-4 xl:px-6 py-4 md:py-5 ">
        <div className="w-full items-center flex justify-between text-sm md:text-base">
          <div className="flex flex-wrap items-center gap-4 md:gap-6 order-2 md:order-1 justify-center md:justify-start">
            <AnimatedNavLink
              label="Facebook"
              to="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--foreground)] text-sm md:text-xl font-cabinet"
            />
            <AnimatedNavLink
              label="LinkedIn"
              to="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--foreground)] text-sm md:text-xl font-cabinet"
            />
            <AnimatedNavLink
              label="Email"
              to="mailto:hello@example.com"
              className="text-[var(--foreground)] text-sm md:text-xl font-cabinet"
            />
          </div>
          <p className="text-[var(--foreground)]/80 font-cabinet md:text-xl text-right order-3 md:order-3 md:text-right">
            Frontend | Motion designer
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Hero;
