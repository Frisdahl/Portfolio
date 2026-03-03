import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

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
  const designTextWrapRef = useRef<HTMLDivElement>(null);
  const engineerTextWrapRef = useRef<HTMLDivElement>(null);
  const designTextRef = useRef<HTMLSpanElement>(null);
  const engineerTextRef = useRef<HTMLSpanElement>(null);
  const mobilePortraitRef = useRef<HTMLDivElement>(null);
  const portraitWrapRef = useRef<HTMLSpanElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const entrancePlayedRef = useRef(false);
  const isSplitAnimatingRef = useRef(false);

  // 1. Scroll expansion animation
  useLayoutEffect(() => {
    entrancePlayedRef.current = false;
    const forceHomeEntrance =
      sessionStorage.getItem("forceHomeEntrance") === "true";

    const ctx = gsap.context(() => {
      // Set container padding-top based on header height + 8px
      const setContainerPadding = () => {
        const headerElement = document.querySelector("header");
        if (headerElement && containerRef.current) {
          const headerHeight = headerElement.offsetHeight;
          const isMobile = window.matchMedia("(max-width: 767px)").matches;

          if (isMobile) {
            containerRef.current.style.paddingTop = `${headerHeight + 4}px`;
            containerRef.current.style.paddingBottom = "1rem";
            return;
          }

          containerRef.current.style.paddingTop = `${headerHeight + 8}px`;
          containerRef.current.style.paddingBottom = "0px";
        }
      };

      // Initial calculation
      setContainerPadding();

      const fitHeroWords = () => {
        const designWrap = designTextWrapRef.current;
        const engineerWrap = engineerTextWrapRef.current;
        const designText = designTextRef.current;
        const engineerText = engineerTextRef.current;
        const mobilePortrait = mobilePortraitRef.current;
        const portraitWrap = portraitWrapRef.current;
        const portrait = portraitRef.current;

        if (!designWrap || !engineerWrap || !designText || !engineerText) {
          return;
        }

        if (isSplitAnimatingRef.current) {
          return;
        }

        const isMobile = window.matchMedia("(max-width: 767px)").matches;
        const minFontSize = isMobile ? 42 : 72;
        const maxFontSize = isMobile ? 150 : 620;

        designText.style.fontSize = `${maxFontSize}px`;
        engineerText.style.fontSize = `${maxFontSize}px`;

        const designMeasured = designText.getBoundingClientRect().width;
        const engineerMeasured = engineerText.getBoundingClientRect().width;

        if (!designMeasured || !engineerMeasured) return;

        let sharedSize = minFontSize;

        if (isMobile) {
          const engineerTarget = engineerWrap.clientWidth;
          if (!engineerTarget) return;

          const engineerSize =
            (engineerTarget / engineerMeasured) * maxFontSize;

          const initialDesignTarget = Math.max(designWrap.clientWidth - 56, 0);
          if (!initialDesignTarget) return;
          const initialDesignSize =
            (initialDesignTarget / designMeasured) * maxFontSize;

          sharedSize = gsap.utils.clamp(
            minFontSize,
            maxFontSize,
            Math.min(initialDesignSize, engineerSize),
          );

          const portraitSize = gsap.utils.clamp(
            minFontSize,
            maxFontSize,
            sharedSize,
          );
          const finalDesignTarget = Math.max(
            designWrap.clientWidth - portraitSize - 4,
            0,
          );
          if (!finalDesignTarget) return;
          const finalDesignSize =
            (finalDesignTarget / designMeasured) * maxFontSize;

          sharedSize = gsap.utils.clamp(
            minFontSize,
            maxFontSize,
            Math.min(finalDesignSize, engineerSize) * 1.03,
          );
        } else {
          const designTarget = designWrap.clientWidth;
          const engineerTarget = engineerWrap.clientWidth;
          if (!designTarget || !engineerTarget) return;

          const designSize = (designTarget / designMeasured) * maxFontSize;
          const engineerSize =
            (engineerTarget / engineerMeasured) * maxFontSize;

          sharedSize = gsap.utils.clamp(
            minFontSize,
            maxFontSize,
            Math.min(designSize, engineerSize) * 1.02,
          );
        }

        designText.style.fontSize = `${sharedSize}px`;
        engineerText.style.fontSize = `${sharedSize}px`;

        if (portrait) {
          if (isMobile) {
            if (mobilePortrait) {
              const mobileSize = gsap.utils.clamp(
                minFontSize,
                maxFontSize,
                sharedSize,
              );
              mobilePortrait.style.width = `${mobileSize}px`;
              mobilePortrait.style.height = `${mobileSize}px`;
            }
            portrait.style.width = "0px";
            portrait.style.height = "0px";
            if (portraitWrap) {
              portraitWrap.style.left = "";
            }
          } else {
            const portraitSize = gsap.utils.clamp(100, 210, sharedSize * 1.0);
            portrait.style.width = `${portraitSize}px`;
            portrait.style.height = `${portraitSize}px`;

            if (portraitWrap && iconsRowRef.current) {
              const designRect = designText.getBoundingClientRect();
              const engineerRect = engineerText.getBoundingClientRect();
              const iconsRowRect = iconsRowRef.current.getBoundingClientRect();
              const midpoint =
                (designRect.right + engineerRect.left) / 2 - iconsRowRect.left;

              portraitWrap.style.left = `${midpoint}px`;
            }
          }
        }
      };

      fitHeroWords();

      const textFitResizeObserver =
        typeof ResizeObserver !== "undefined"
          ? new ResizeObserver(() => fitHeroWords())
          : null;

      if (iconsRowRef.current) {
        textFitResizeObserver?.observe(iconsRowRef.current);
      }
      if (designTextWrapRef.current) {
        textFitResizeObserver?.observe(designTextWrapRef.current);
      }
      if (engineerTextWrapRef.current) {
        textFitResizeObserver?.observe(engineerTextWrapRef.current);
      }

      // Recalculate on window resize
      const handleResize = () => {
        setContainerPadding();
        fitHeroWords();
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", handleResize);

      // Anchor expansion at the mask's top center
      gsap.set(videoMaskRef.current, { transformOrigin: "top center" });

      const initScrollAnimation = () => {
        const existingTrigger = ScrollTrigger.getById("heroScroll");
        if (existingTrigger) {
          existingTrigger.kill();
        }

        const isMobile = window.matchMedia("(max-width: 767px)").matches;
        if (isMobile) {
          gsap.set(videoMaskRef.current, { scale: 1, clearProps: "transform" });
          gsap.set(videoWrapperRef.current, { y: 0, clearProps: "transform" });
          gsap.set(containerRef.current, { y: 0, clearProps: "transform" });
          return;
        }

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
        isSplitAnimatingRef.current = true;

        if (forceHomeEntrance) {
          gsap.set(sceneRef.current, { autoAlpha: 1 });
          sessionStorage.removeItem("forceHomeEntrance");
        }

        const designHeading = designTextRef.current;
        const engineerHeading = engineerTextRef.current;
        if (designHeading) {
          const designWidth = designHeading.getBoundingClientRect().width;
          if (designWidth > 0) {
            designHeading.style.width = `${designWidth}px`;
          }
        }
        if (engineerHeading) {
          const engineerWidth = engineerHeading.getBoundingClientRect().width;
          if (engineerWidth > 0) {
            engineerHeading.style.width = `${engineerWidth}px`;
          }
        }

        const tl = gsap.timeline();
        const headingSplits: SplitType[] = [];
        if (designTextRef.current) {
          headingSplits.push(
            new SplitType(designTextRef.current as HTMLElement, {
              types: "chars",
            }),
          );
        }
        if (engineerTextRef.current) {
          headingSplits.push(
            new SplitType(engineerTextRef.current as HTMLElement, {
              types: "chars",
            }),
          );
        }
        const labelParagraphs = labelsRowRef.current
          ? gsap.utils.toArray<HTMLParagraphElement>("p", labelsRowRef.current)
          : [];
        const headingChars = headingSplits.flatMap(
          (split) => split.chars ?? [],
        );
        const portraitTargets = [
          portraitRef.current,
          mobilePortraitRef.current,
        ].filter((el): el is HTMLDivElement => Boolean(el));

        if (headingChars.length) {
          gsap.set(iconsRowRef.current, { autoAlpha: 1, yPercent: 0 });
          gsap.set(headingChars, { autoAlpha: 0, yPercent: 100 });
        }

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
            headingChars.length ? headingChars : iconsRowRef.current,
            {
              autoAlpha: 0,
              yPercent: 100,
            },
            {
              yPercent: 0,
              autoAlpha: 1,
              duration: 0.42,
              stagger: 0.02,
              ease: "power3.out",
            },
            "-=0.1",
          );

        if (portraitTargets.length) {
          tl.fromTo(
            portraitTargets,
            {
              scale: 0,
              transformOrigin: "center center",
            },
            {
              scale: 1,
              duration: 0.28,
              ease: "ease.out",
            },
            "-=0.14",
          );
        }

        tl.eventCallback("onComplete", () => {
          headingSplits.forEach((split) => split.revert());
          if (designHeading) {
            designHeading.style.width = "";
          }
          if (engineerHeading) {
            engineerHeading.style.width = "";
          }
          isSplitAnimatingRef.current = false;
        });
      };

      const resetEntranceState = () => {
        const labelParagraphs = labelsRowRef.current
          ? gsap.utils.toArray<HTMLParagraphElement>("p", labelsRowRef.current)
          : [];

        gsap.set(textWrapperRef.current, { autoAlpha: 1, yPercent: 0 });
        gsap.set(containerRef.current, { y: 0 });
        gsap.set(videoWrapperRef.current, { y: 0 });
        gsap.set(labelParagraphs, { autoAlpha: 0, yPercent: -100 });
        gsap.set(iconsRowRef.current, { autoAlpha: 0, yPercent: 100 });
        gsap.set([portraitRef.current, mobilePortraitRef.current], {
          scale: 0,
        });
        gsap.set(videoContentRef.current, { autoAlpha: 0, yPercent: -100 });
      };

      const handleReplayEntrance = () => {
        entrancePlayedRef.current = false;
        isSplitAnimatingRef.current = false;
        resetEntranceState();

        requestAnimationFrame(() => {
          playHeroEntrance();
        });
      };

      // Entrance Triggers
      const handleHeaderComplete = () => playHeroEntrance();
      window.addEventListener("header-entrance-complete", handleHeaderComplete);
      window.addEventListener("replay-hero-entrance", handleReplayEntrance);

      // Initial States
      resetEntranceState();

      if (forceHomeEntrance) {
        gsap.set(sceneRef.current, { autoAlpha: 0 });
      }

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
        window.removeEventListener(
          "replay-hero-entrance",
          handleReplayEntrance,
        );
        window.removeEventListener("resize", handleResize);
        textFitResizeObserver?.disconnect();
        clearTimeout(safetyTimeout);
        if (forceHomeEntrance && !entrancePlayedRef.current) {
          sessionStorage.removeItem("forceHomeEntrance");
        }
        if (designTextRef.current) {
          designTextRef.current.style.width = "";
        }
        if (engineerTextRef.current) {
          engineerTextRef.current.style.width = "";
        }
        isSplitAnimatingRef.current = false;
      };
    }, sceneRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sceneRef}
      className="relative w-full min-h-[100svh] md:h-[350vh] bg-[#f4f4f5] mb-24 sm:mb-28 md:mb-48 lg:mb-64"
    >
      <div
        ref={containerRef}
        className="w-full min-h-[100svh] md:h-screen flex flex-col items-center justify-start overflow-visible bg-[#f4f4f5] px-4 md:px-10 lg:px-4 xl:px-6"
      >
        {/* Video Section */}
        <div
          ref={videoWrapperRef}
          className="relative z-20 w-full flex-1 md:flex-none flex items-center justify-center -mx-4 md:mx-0"
        >
          <div
            ref={videoMaskRef}
            className="overflow-hidden rounded-none md:rounded-lg w-full md:max-w-[600px] lg:max-w-[800px] aspect-[4/3] md:aspect-video bg-transparent"
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
          className="mt-0 md:mt-16 w-full flex flex-col items-center z-10"
        >
          {/* Labels Row (hidden on mobile) */}
          <div
            ref={labelsRowRef}
            className="hidden md:grid w-full md:grid-cols-12 items-end mb-2"
          >
            <div className="overflow-hidden md:col-start-1 md:col-span-4">
              <p className="text-left font-aeonik uppercase font-medium tracking-widest text-base md:text-xl lg:text-2xl text-[#1c1d1e]">
                A
              </p>
            </div>
            <div className="md:col-start-7 md:col-span-6 flex items-end justify-between">
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
          <div className="w-full overflow-visible">
            <div
              ref={iconsRowRef}
              className="w-full flex flex-col md:grid md:grid-cols-12 md:relative items-start md:items-end justify-start gap-4 md:gap-0 overflow-visible"
            >
              <div
                ref={designTextWrapRef}
                className="w-full md:min-w-0 md:col-start-1 md:col-span-5 flex items-end justify-start overflow-hidden"
              >
                <span
                  ref={designTextRef}
                  className="block w-max whitespace-nowrap -ml-[0.06em] uppercase font-aeonik font-semibold leading-none tracking-normal text-[#1c1d1e]"
                >
                  Design
                </span>

                <span className="md:hidden ml-1 flex items-end">
                  <div
                    ref={mobilePortraitRef}
                    className="rounded-full bg-[#161618] overflow-hidden"
                    style={{ width: "0px", height: "0px" }}
                  >
                    <img
                      src="/images/portræt.png"
                      alt="Portrait"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </span>
              </div>

              <span
                ref={portraitWrapRef}
                className="hidden md:flex absolute bottom-0 -translate-x-1/2 justify-center items-end"
              >
                <div
                  ref={portraitRef}
                  className="rounded-full bg-[#1c1d1e] mb-[1.8%] overflow-hidden"
                  style={{ width: "100%", aspectRatio: "1/1" }}
                >
                  <img
                    src="/images/portræt.png"
                    alt="Portrait"
                    className="w-full h-full object-cover"
                  />
                </div>
              </span>

              <div
                ref={engineerTextWrapRef}
                className="w-full md:min-w-0 md:col-start-7 md:col-span-6 flex justify-start overflow-hidden"
              >
                <span
                  ref={engineerTextRef}
                  className="block w-max whitespace-nowrap -ml-[0.06em] pr-[0.03em] uppercase font-aeonik font-semibold leading-none tracking-normal text-[#1c1d1e]"
                >
                  Engineer
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
