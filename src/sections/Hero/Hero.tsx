import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Links from "../../components/Links";

gsap.registerPlugin(ScrollTrigger);

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [videoRatio, setVideoRatio] = React.useState<number>(16 / 9);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const { videoWidth, videoHeight } = videoRef.current;
      setVideoRatio(videoWidth / videoHeight);
    }
  };

  useEffect(() => {
    if (!heroRef.current || !containerRef.current) return;

    // Synchronously hide elements that will be animated in
    gsap.set([videoContainerRef.current, headlineRef.current], {
      autoAlpha: 0,
    });

    let animationTriggered = false;
    const startEntranceAnimation = () => {
      if (animationTriggered) return;
      animationTriggered = true;
      sessionStorage.removeItem("isNavigating");

      // Show elements for animation
      gsap.set([videoContainerRef.current, headlineRef.current], {
        autoAlpha: 1,
      });

      // Initial Load Animation
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Headline entrance
      tl.fromTo(
        headlineRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, delay: 0.2, ease: "power3.out" },
      );

      // 2. Video container fade and slight lift
      tl.fromTo(
        videoContainerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" },
        "-=0.8",
      );
    };

    // Listen for loader completion
    const handleLoaderComplete = () => {
      startEntranceAnimation();
    };
    window.addEventListener("initial-loader-complete", handleLoaderComplete);
    window.addEventListener("page-transition-complete", handleLoaderComplete);

    // Check if we should reveal immediately
    const hasSeenLoader = sessionStorage.getItem("hasSeenInitialLoader");
    const isLoaderActive = !!document.querySelector(".initial-loader-wrap");
    const isNavigating = sessionStorage.getItem("isNavigating") === "true";

    if (hasSeenLoader && !isLoaderActive && !isNavigating) {
      startEntranceAnimation();
    }

    // Safety timeout
    const safetyTimeout = setTimeout(
      () => {
        if (!animationTriggered) {
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

  return (
    <div
      ref={containerRef}
      id="hero"
      className="hero-container relative w-full h-screen bg-[var(--background)] overflow-hidden"
    >
      <section
        ref={heroRef}
        className="relative h-full w-full flex flex-col pt-6 md:pt-10 px-6 md:px-10 lg:px-4 xl:px-6"
      >
        {/* Top Layout Header (Alignment only) */}
        <div className="flex items-start w-full mb-8 md:mb-8 shrink-0">
          {/* Logo Spacer */}
          <div
            className="w-10 sm:w-12 md:w-14 shrink-0 opacity-0 pointer-events-none"
            aria-hidden="true"
          />

          {/* Larger gap to push heading more to the right */}
          <div className="w-20 md:w-40 lg:w-60 shrink-0" />

          {/* Heading in the flow of the page */}
          <h1
            ref={headlineRef}
            className="text-2xl md:text-4xl lg:text-5xl font-aeonik font-normal text-[#1c1d1e] tracking-tight text-left leading-[1.05]"
          >
            I help brands create digital <br />
            experiences that connect with <br />
            their audience.
          </h1>

          <div className="flex-grow" />

          {/* Nav Buttons Spacer (~200px based on button width) */}
          <div
            className="w-40 md:w-48 lg:w-56 shrink-0 opacity-0 pointer-events-none"
            aria-hidden="true"
          />
        </div>

        {/* Middle Content: Video Container */}
        <div
          ref={videoContainerRef}
          className="relative w-full overflow-hidden flex-grow mb-4 md:mb-8"
          style={{
            borderRadius: "clamp(1rem, 2vw, 1.5rem)",
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onLoadedMetadata={handleLoadedMetadata}
            className="w-full h-full object-cover translate-z-0 backface-hidden"
            style={{ opacity: 1, visibility: "visible", display: "block" }}
          >
            <source
              src="/projectVideos/videoshowcase/promo_vp9.webm"
              type="video/webm"
            />
            <source
              src="/projectVideos/videoshowcase/promo_h264.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </section>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .transform-gpu {
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Hero;
