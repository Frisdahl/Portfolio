import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DesignIcon from "../../assets/icons/heroSection/Design.svg";
import EngineerIcon from "../../assets/icons/heroSection/Engineer.svg";

gsap.registerPlugin(ScrollTrigger);

const Hero: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoMaskRef = useRef<HTMLDivElement>(null);
  const videoContentRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);

  // 1. Scroll expansion animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Anchor expansion at the mask's top center
      gsap.set(videoMaskRef.current, { transformOrigin: "top center" });

      const initScrollAnimation = () => {
        if (ScrollTrigger.getById("heroScroll")) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            id: "heroScroll",
            trigger: sceneRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            pin: containerRef.current,
            pinSpacing: true,
            invalidateOnRefresh: true,
          },
        });

        // Expansion: Scale the MASK so the video grows without clipping
        tl.fromTo(
          videoMaskRef.current,
          { scale: 1, borderRadius: "0.5rem" },
          {
            scale: () => {
              const containerW = videoWrapperRef.current!.clientWidth;
              const viewportH = window.innerHeight;
              const videoW = videoMaskRef.current!.offsetWidth;
              const videoH = videoMaskRef.current!.offsetHeight;

              const rect = videoMaskRef.current!.getBoundingClientRect();
              const availableH = viewportH - rect.top - 64;

              const scaleToWidth = containerW / videoW;
              const scaleToHeight = availableH / videoH;

              return Math.min(scaleToWidth, scaleToHeight);
            },
            borderRadius: "2rem",
            ease: "none",
            immediateRender: false,
          },
          0,
        ).fromTo(
          textWrapperRef.current,
          { autoAlpha: 1, y: 0 },
          {
            y: 100,
            autoAlpha: 0,
            duration: 0.4,
            ease: "power2.out",
            immediateRender: false,
          },
          0,
        );
      };

      const playHeroEntrance = () => {
        if (gsap.isTweening(textWrapperRef.current)) return;

        const tl = gsap.timeline({
          onComplete: () => {
            initScrollAnimation();
            ScrollTrigger.refresh();
          },
        });

        tl.to(textWrapperRef.current, {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          delay: 0.2,
        }).to(
          videoContentRef.current,
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 1.4,
            ease: "expo.out",
          },
          "-=0.6",
        );
      };

      // Entrance Triggers
      const handleHeaderComplete = () => playHeroEntrance();
      window.addEventListener("header-entrance-complete", handleHeaderComplete);

      // Initial States
      gsap.set(textWrapperRef.current, { autoAlpha: 0, y: 20 });
      gsap.set(videoContentRef.current, { autoAlpha: 0, yPercent: -100 });

      // Fallback
      const isLoaderActive = !!document.querySelector(".initial-loader-wrap");
      const safetyTimeout = setTimeout(
        () => {
          if (gsap.getProperty(textWrapperRef.current, "opacity") === 0) {
            playHeroEntrance();
          }
        },
        isLoaderActive ? 8000 : 1500,
      );

      return () => {
        window.removeEventListener(
          "header-entrance-complete",
          handleHeaderComplete,
        );
        clearTimeout(safetyTimeout);
      };
    }, sceneRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sceneRef}
      className="relative w-full h-[350vh] bg-[#f4f4f5] mb-32 md:mb-48 lg:mb-64"
    >
      <div
        ref={containerRef}
        className="w-full h-screen flex flex-col items-center justify-start pt-24 md:pt-32 lg:pt-40 overflow-hidden bg-[#f4f4f5] px-4 md:px-10 lg:px-4 xl:px-6"
      >
        {/* Video Section */}
        <div
          ref={videoWrapperRef}
          className="relative z-20 w-full flex justify-center"
        >
          <div
            ref={videoMaskRef}
            className="overflow-hidden rounded-lg w-full max-w-[320px] md:max-w-[600px] lg:max-w-[800px] aspect-video bg-transparent "
          >
            <div
              ref={videoContentRef}
              className="w-full h-full bg-transparent will-change-transform"
            >
              <video
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
          </div>
        </div>

        {/* Text Section */}
        <div
          ref={textWrapperRef}
          className="mt-8 md:mt-12 w-full flex flex-col items-center z-10 px-4 md:px-10 lg:px-4 xl:px-6"
        >
          {/* Labels Row */}
          <div className="w-full flex items-end justify-between mb-2">
            <div style={{ width: "36%" }}>
              <p className="text-left font-aeonik uppercase tracking-widest text-base md:text-xl lg:text-2xl text-[#1c1d1e]">
                A
              </p>
            </div>
            <div style={{ width: "9.4%" }} />
            <div className="flex justify-between" style={{ width: "49.6%" }}>
              <p className="font-aeonik uppercase tracking-widest text-base md:text-xl lg:text-2xl text-[#1c1d1e]">
                Seriously
              </p>
              <p className="font-aeonik uppercase tracking-widest text-base md:text-xl lg:text-2xl text-[#1c1d1e]">
                Good
              </p>
            </div>
          </div>

          {/* Icons Row */}
          <div className="w-full flex items-end justify-between overflow-visible">
            <div className="flex justify-start" style={{ width: "36%" }}>
              <img
                src={DesignIcon}
                alt="Design"
                className="w-full h-auto block object-contain"
                style={{ aspectRatio: "500/131" }}
              />
            </div>

            <div
              className="flex justify-center items-end"
              style={{ width: "9.4%" }}
            >
              <div
                className="rounded-full bg-[#f1efed] mb-[1.8%] overflow-hidden"
                style={{ width: "100%", aspectRatio: "1/1" }}
              >
                <img
                  src="/images/portræt.png"
                  alt="Portrait"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex justify-end" style={{ width: "49.6%" }}>
              <img
                src={EngineerIcon}
                alt="Engineer"
                className="w-full h-auto block object-contain"
                style={{ aspectRatio: "689/131" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
