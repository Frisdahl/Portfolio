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
  const labelsRowRef = useRef<HTMLDivElement>(null);
  const iconsRowRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const entrancePlayedRef = useRef(false);

  // 1. Scroll expansion animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Anchor expansion at the mask's top center
      gsap.set(videoMaskRef.current, { transformOrigin: "top center" });

      const initScrollAnimation = () => {
        if (ScrollTrigger.getById("heroScroll")) return;

        const getVideoTravelY = () => {
          const viewportH = window.innerHeight;
          const textHeight = textWrapperRef.current?.offsetHeight ?? 0;
          return viewportH + textHeight * 0.35;
        };

        const getContainerFollowY = () => {
          if (!videoWrapperRef.current || !videoMaskRef.current) return 0;

          const viewportH = window.innerHeight;
          const videoH = videoMaskRef.current.offsetHeight;
          const travelY = getVideoTravelY();
          const finalScale = (viewportH * 0.8) / videoH;
          const wrapperRect = videoWrapperRef.current.getBoundingClientRect();
          const finalCenterOffset =
            viewportH / 2 - (wrapperRect.top + (videoH * finalScale) / 2);

          const followY = -(travelY - finalCenterOffset);

          // Prevent overshoot at the end of scrub that can push video out of view
          return gsap.utils.clamp(-travelY, 0, followY);
        };

        const tl = gsap.timeline({
          scrollTrigger: {
            id: "heroScroll",
            trigger: sceneRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            pin: containerRef.current,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Expansion: Scale the MASK so the video grows without clipping
        tl.fromTo(
          videoMaskRef.current,
          { scale: 1, borderRadius: "0.5rem" },
          {
            scale: () => {
              const viewportH = window.innerHeight;
              const videoH = videoMaskRef.current!.offsetHeight;

              return (viewportH * 0.8) / videoH;
            },
            borderRadius: "2rem",
            ease: "none",
            immediateRender: false,
          },
          0,
        )
          .to(
            videoWrapperRef.current,
            {
              y: getVideoTravelY,
              ease: "none",
              immediateRender: false,
            },
            0,
          )
          .to(
            containerRef.current,
            {
              y: getContainerFollowY,
              ease: "none",
              immediateRender: false,
            },
            0,
          );
      };

      const playHeroEntrance = () => {
        if (entrancePlayedRef.current) return;
        if (gsap.isTweening(textWrapperRef.current)) return;
        entrancePlayedRef.current = true;

        const tl = gsap.timeline();
        const labelParagraphs = labelsRowRef.current
          ? gsap.utils.toArray<HTMLParagraphElement>("p", labelsRowRef.current)
          : [];

        tl.fromTo(
          videoContentRef.current,
          {
            autoAlpha: 0,
            yPercent: -100,
          },
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.7,
            ease: "ease.out",
          },
        )
          .fromTo(
            labelParagraphs,
            {
              autoAlpha: 0,
              yPercent: -100,
            },
            {
              yPercent: 0,
              autoAlpha: 1,
              duration: 0.45,
              stagger: 0.06,
              ease: "power3.out",
            },
            "-=0.2",
          )
          .fromTo(
            iconsRowRef.current,
            {
              autoAlpha: 0,
              yPercent: 100,
            },
            {
              yPercent: 0,
              autoAlpha: 1,
              duration: 0.4,
              ease: "power3.out",
            },
            "-=0.1",
          )
          .fromTo(
            portraitRef.current,
            {
              scale: 0,
              transformOrigin: "center center",
            },
            {
              scale: 1,
              duration: 0.3,
              ease: "ease.out",
            },
            "-=0.01",
          );
      };

      // Entrance Triggers
      const handleHeaderComplete = () => playHeroEntrance();
      window.addEventListener("header-entrance-complete", handleHeaderComplete);

      // Initial States
      const labelParagraphs = labelsRowRef.current
        ? gsap.utils.toArray<HTMLParagraphElement>("p", labelsRowRef.current)
        : [];

      gsap.set(textWrapperRef.current, { autoAlpha: 1, yPercent: 0 });
      gsap.set(containerRef.current, { y: 0 });
      gsap.set(videoWrapperRef.current, { y: 0 });
      gsap.set(labelParagraphs, { autoAlpha: 0, yPercent: -100 });
      gsap.set(iconsRowRef.current, { autoAlpha: 0, yPercent: 100 });
      gsap.set(videoContentRef.current, { autoAlpha: 0, yPercent: -100 });

      // Create scroll trigger immediately so pin layout is stable even if user scrolls early
      initScrollAnimation();

      const isLoaderActive = !!document.querySelector(".initial-loader-wrap");
      const hasSeenLoader = sessionStorage.getItem("hasSeenInitialLoader");

      // On page switches/home returns where loader isn't active, start immediately
      if (!isLoaderActive && hasSeenLoader && !entrancePlayedRef.current) {
        requestAnimationFrame(() => playHeroEntrance());
      }

      // Fallback
      const safetyTimeout = setTimeout(
        () => {
          if (!entrancePlayedRef.current) {
            playHeroEntrance();
          }
        },
        isLoaderActive ? 8000 : 250,
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
        className="w-full h-screen flex flex-col items-center justify-start pt-24 md:pt-32 lg:pt-40 overflow-visible bg-[#f4f4f5] px-4 md:px-10 lg:px-4 xl:px-6"
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
          <div
            ref={labelsRowRef}
            className="w-full flex items-end justify-between mb-2"
          >
            <div className="overflow-hidden" style={{ width: "36%" }}>
              <p className="text-left font-aeonik uppercase font-medium tracking-widest text-base md:text-xl lg:text-2xl text-[#1c1d1e]">
                A
              </p>
            </div>
            <div style={{ width: "9.4%" }} />
            <div className="flex justify-between" style={{ width: "49.6%" }}>
              <div className="overflow-hidden">
                <p className="font-aeonik uppercase tracking-widest text-base font-medium md:text-xl lg:text-2xl text-[#1c1d1e]">
                  Seriously
                </p>
              </div>
              <div className="overflow-hidden">
                <p className="font-aeonik uppercase tracking-widest font-medium text-base md:text-xl lg:text-2xl text-[#1c1d1e]">
                  Good
                </p>
              </div>
            </div>
          </div>

          {/* Icons Row */}
          <div className="w-full overflow-hidden">
            <div
              ref={iconsRowRef}
              className="w-full flex items-end justify-between overflow-visible"
            >
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
                  ref={portraitRef}
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
    </div>
  );
};

export default Hero;
