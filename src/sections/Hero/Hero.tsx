import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DesignIcon from "../../assets/icons/heroSection/Design.svg";
import EngineerIcon from "../../assets/icons/heroSection/Engineer.svg";

gsap.registerPlugin(ScrollTrigger);

const Hero: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoContentRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (
      !sceneRef.current ||
      !containerRef.current ||
      !videoContentRef.current ||
      !textWrapperRef.current ||
      !videoWrapperRef.current
    )
      return;

    // Anchor expansion strictly at the top center
    gsap.set(videoContentRef.current, { transformOrigin: "top center" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sceneRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        pin: containerRef.current,
        pinSpacing: true,
      },
    });

    // Expansion Animation: Perfectly frame within width and available height
    tl.to(
      videoContentRef.current,
      {
        scale: () => {
          const containerW = videoWrapperRef.current!.clientWidth;
          const viewportH = window.innerHeight;
          const videoW = videoContentRef.current!.offsetWidth;
          const videoH = videoContentRef.current!.offsetHeight;

          // Calculate available vertical space from the video's top position
          const rect = videoWrapperRef.current!.getBoundingClientRect();
          const availableH = viewportH - rect.top - 64; // 64px buffer for bottom breathing room

          const scaleToWidth = containerW / videoW;
          const scaleToHeight = availableH / videoH;

          // Use the smaller scale to ensure full visibility and 16:9 ratio
          return Math.min(scaleToWidth, scaleToHeight);
        },
        borderRadius: "2rem", // Stronger border radius at the end (32px)
        ease: "none",
      },
      0
    ).to(
      textWrapperRef.current,
      {
        y: 200,
        autoAlpha: 0,
        duration: 0.4,
        ease: "power2.out",
      },
      0,
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    /* sceneRef height defines the scroll duration. 
       Added responsive margin-bottom to create spacing before the Manifesto section. */
    <div
      ref={sceneRef}
      className="relative w-full h-[350vh] bg-[#f4f4f5] mb-32 md:mb-48 lg:mb-64"
    >
      <div
        ref={containerRef}
        className="w-full h-screen flex flex-col items-center justify-start pt-24 md:pt-32 lg:pt-40 overflow-hidden bg-[#f4f4f5] px-4 md:px-10 lg:px-4 xl:px-6"
      >
        {/* Video Section - Anchored top */}
        <div
          ref={videoWrapperRef}
          className="relative z-20 w-full flex justify-center"
        >
          <div
            ref={videoContentRef}
            className="w-full max-w-[320px] md:max-w-[600px] lg:max-w-[800px] aspect-video overflow-hidden bg-black rounded-lg shadow-xl will-change-transform"
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

        {/* Text Section - Below Video */}
        <div
          ref={textWrapperRef}
          className="mt-8 md:mt-12 w-full flex flex-col items-center z-10 px-4 md:px-10 lg:px-4 xl:px-6"
        >
          {/* Labels Row - Distributed Flex for perfect spacing */}
          <div className="w-full flex items-end justify-between mb-2">
            <div style={{ width: "36%" }}>
              <p className="text-left font-aeonik uppercase tracking-widest text-base md:text-xl lg:text-2xl text-[#1c1d1e]">
                A
              </p>
            </div>
            {/* Spacer for circle alignment */}
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

          {/* SVG Heading Row - Distributed Flex for perfect centering */}
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
                className="rounded-full bg-[#1c1d1e] mb-[1.8%] overflow-hidden"
                style={{
                  width: "100%",
                  aspectRatio: "1/1",
                }}
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
