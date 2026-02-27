import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import Links from "../../components/Links";

gsap.registerPlugin(ScrollTrigger);

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current || !containerRef.current) return;

    // Synchronously hide elements that will be animated in
    // DO NOT hide videoRef.current here as we want it visible immediately
    gsap.set([headlineRef.current, footerRef.current], {
      autoAlpha: 0,
    });
    let animationTriggered = false;
    const startEntranceAnimation = () => {
      if (animationTriggered) return;
      animationTriggered = true;
      sessionStorage.removeItem("isNavigating");

      // Show elements for animation
      gsap.set([headlineRef.current, footerRef.current], {
        autoAlpha: 1,
      });

      // Initial Load Animation
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      // 1. Heading slide up (Split headline)
      if (headlineRef.current) {
        const split = new SplitType(headlineRef.current, {
          types: "lines,words",
        });
        gsap.set(split.lines, { overflow: "hidden" });
        tl.fromTo(
          split.words,
          { yPercent: 100, opacity: 0 },
          {
            opacity: 1,
            yPercent: 0,
            duration: 1.5,
            stagger: 0.05,
            ease: "power4.out",
          },
          0.6, // Small initial delay
        );
      }

      // 2. Footer area slide up (socials and paragraph)
      tl.fromTo(
        footerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.2, visibility: "visible" },
        "-=0.8",
      );
    };

    // Listen for loader completion
    const handleLoaderComplete = () => {
      startEntranceAnimation();
    };
    window.addEventListener("initial-loader-complete", handleLoaderComplete);
    window.addEventListener("page-transition-complete", handleLoaderComplete);

    // Check if we should reveal immediately (e.g. not the first load or loader already finished)
    const hasSeenLoader = sessionStorage.getItem("hasSeenInitialLoader");
    const isLoaderActive = !!document.querySelector(".initial-loader-wrap");
    const isNavigating = sessionStorage.getItem("isNavigating") === "true";

    if (hasSeenLoader && !isLoaderActive && !isNavigating) {
      console.log("Hero: Internal navigation detected, revealing immediately");
      startEntranceAnimation();
    }

    // Safety timeout - only long on first load
    const safetyTimeout = setTimeout(
      () => {
        if (!animationTriggered) {
          console.log("Hero: Safety timeout triggered");
          startEntranceAnimation();
        }
      },
      isLoaderActive ? 6000 : 100,
    );

    return () => {
      window.removeEventListener(
        "initial-loader-complete",
        handleLoaderComplete,
      );
      window.removeEventListener(
        "page-transition-complete",
        handleLoaderComplete,
      );
      clearTimeout(safetyTimeout);
    };
  }, []);

  useEffect(() => {
    if (!heroRef.current || !containerRef.current) return;

    // Scroll-driven Wipe Transition
    gsap.to(heroRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        pin: true,
        pinSpacing: false,
      },
      clipPath: "inset(0% 0% 100% 0%)",
      ease: "none",
    });

    // Subtle Parallax for video
    gsap.to(videoRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
      y: "10%",
      ease: "none",
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="hero"
      className="hero-container relative w-full"
    >
      <section
        ref={heroRef}
        className="dark-section relative h-[100vh] w-full bg-[#1c1d1e] overflow-hidden flex flex-col justify-between pt-32 pb-4 md:pb-8 will-change-[clip-path]"
        style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      >
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover transform-gpu"
            style={{ opacity: 0.4, visibility: "visible", display: "block" }}
          >
            <source
              src="/projectVideos/herovideo/wave-optimized.webm"
              type="video/webm"
            />
            <source
              src="/projectVideos/herovideo/wave-optimized.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        {/* Top Content: Headline Wrap */}
        <div className="relative z-[10] px-8">
          <div className="flex flex-col items-start text-left gap-8 md:gap-10">
            <h1
              ref={headlineRef}
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-instrumentsans font-bold text-white tracking-tight leading-[1.2]"
            >
              Immersive Websites, <br />
              Designed With Clarity.
            </h1>
          </div>
        </div>

        {/* Bottom Content Area */}
        <div ref={contentRef} className="relative z-[10] w-full">
          <div ref={footerRef} className="w-full opacity-0">
            {/* Elements ABOVE the divider */}
            <div className="px-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                <div className="flex items-center space-x-6">
                  <img
                    src="/images/danish-flag.svg"
                    alt="Danish Flag"
                    className="h-6 rounded-full"
                  />
                  <Links
                    links={[
                      { label: "IG", href: "#" },
                      { label: "FB", href: "#" },
                      { label: "LK", href: "#" },
                      { label: "TEL", href: "#" },
                      { label: "MAIL", href: "#" },
                    ]}
                    className="flex space-x-6"
                    textColor="text-white"
                    underlineColor="bg-white"
                  />
                </div>

                <p className="text-xs md:text-sm max-w-sm text-left md:text-right leading-relaxed font-switzer font-light uppercase tracking-wider text-white opacity-60">
                  I help ambitious brands launch digital experiences and
                  strengthen their identity through strategic, custom design.
                </p>
              </div>

              {/* Divider (Also aligned to sides) */}
              <hr className="w-full h-px border-0 bg-white opacity-10" />
            </div>
          </div>
        </div>

        <style>{`
        @media (prefers-reduced-motion: reduce) {
          .transform-gpu {
            transform: none !important;
          }
        }
      `}</style>
      </section>
    </div>
  );
};

export default Hero;
