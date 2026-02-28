import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (
      !heroRef.current ||
      !containerRef.current ||
      !videoContainerRef.current ||
      !videoRef.current ||
      !headlineRef.current
    ) {
      return;
    }

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "power3.out" },
    });
    let splitHeadline: SplitType | null = null;

    const startEntranceAnimation = () => {
      sessionStorage.removeItem("isNavigating");
      tl.play();
    };

    const initialCenterMask =
      "inset(calc(50% - 50px) calc(50% - 100px) calc(50% - 50px) calc(50% - 100px) round 0.5rem)";

    splitHeadline = new SplitType(headlineRef.current, {
      types: "lines",
      lineClass: "hero-headline-line",
    });

    // Initial state (centered 200x100 mask)
    gsap.set(videoContainerRef.current, {
      autoAlpha: 0,
      clipPath: initialCenterMask,
      willChange: "clip-path, opacity",
    });
    gsap.set(videoRef.current, {
      scale: 1.08,
      transformOrigin: "50% 50%",
      force3D: true,
      willChange: "transform",
    });
    gsap.set(splitHeadline.lines, {
      autoAlpha: 0,
      yPercent: 100,
      display: "block",
      overflow: "hidden",
      paddingBottom: "0.08em",
      marginBottom: "-0.08em",
    });

    // Headline line reveal first, then video mask reveal with tight timing
    tl.to(splitHeadline.lines, {
      autoAlpha: 1,
      yPercent: 0,
      duration: 0.75,
      stagger: 0.08,
      ease: "power3.out",
      onComplete: () => {
        gsap.set(splitHeadline?.lines || [], {
          overflow: "visible",
          clearProps: "paddingBottom,marginBottom",
        });
      },
    })
      .to(
        videoContainerRef.current,
        {
          autoAlpha: 1,
          duration: 0.01,
        },
        "-=0.08",
      )
      .to(
        videoContainerRef.current,
        {
          clipPath: "inset(0% 0% 0% 0% round 1.5rem)",
          duration: 1.1,
          ease: "expo.inOut",
        },
        "<",
      )
      .to(
        videoRef.current,
        {
          scale: 1,
          duration: 1.1,
          ease: "expo.inOut",
        },
        "<",
      );

    // Trigger Logic
    const handleLoaderComplete = () => startEntranceAnimation();
    window.addEventListener("initial-loader-complete", handleLoaderComplete);
    window.addEventListener("page-transition-complete", handleLoaderComplete);

    const hasSeenLoader = sessionStorage.getItem("hasSeenInitialLoader");
    const isLoaderActive = !!document.querySelector(".initial-loader-wrap");
    const isNavigating = sessionStorage.getItem("isNavigating") === "true";

    if (hasSeenLoader && !isLoaderActive && !isNavigating) {
      startEntranceAnimation();
    }

    const safetyTimeout = setTimeout(
      () => {
        if (tl.progress() === 0) startEntranceAnimation();
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
      gsap.set(videoContainerRef.current, { clearProps: "willChange" });
      gsap.set(videoRef.current, { clearProps: "willChange" });
      if (splitHeadline) splitHeadline.revert();
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
        {/* Top Layout Header */}
        <div className="flex items-start w-full mb-8 md:mb-8 shrink-0">
          <div
            className="w-10 sm:w-12 md:w-14 shrink-0 opacity-0 pointer-events-none"
            aria-hidden="true"
          />
          <div className="w-20 md:w-40 lg:w-60 shrink-0" />
          <h1
            ref={headlineRef}
            className="text-2xl md:text-4xl lg:text-5xl font-aeonik font-normal text-[#1c1d1e] tracking-tight text-left leading-[1.05]"
          >
            I help brands create digital <br />
            experiences that connect with <br />
            their audience.
          </h1>
          <div className="flex-grow" />
          <div
            className="w-40 md:w-48 lg:w-56 shrink-0 opacity-0 pointer-events-none"
            aria-hidden="true"
          />
        </div>

        {/* Middle Content: Video Container */}
        <div
          ref={videoContainerRef}
          className="relative w-full overflow-hidden flex-grow mb-4 md:mb-8 bg-black shadow-2xl"
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
            preload="metadata"
            className="w-full h-full object-cover"
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
    </div>
  );
};

export default Hero;
