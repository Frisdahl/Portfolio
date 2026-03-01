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

    // Expansion Animation
    tl.to(
      videoContentRef.current,
      {
        scale: () => {
          const containerW = videoWrapperRef.current!.clientWidth;
          const containerH = window.innerHeight;
          const videoW = videoContentRef.current!.offsetWidth;
          const videoH = videoContentRef.current!.offsetHeight;

          const scaleToWidth = containerW / videoW;
          const scaleToHeight = (containerH - 120) / videoH;

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
      0
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
          className="mt-8 md:mt-12 w-full flex flex-col items-center z-10"
        >
          {/* Labels Row */}
          <div className="w-full grid grid-cols-12 gap-0 mb-2 overflow-visible">
            <div className="col-span-5 text-left font-aeonik uppercase tracking-widest text-xs md:text-base lg:text-lg text-[#1c1d1e]">
              A
            </div>
            <div className="col-span-2" />
            <div className="col-span-5 flex justify-end overflow-visible">
              <div
                className="flex justify-between w-[124%] min-w-[124%] font-aeonik uppercase tracking-widest text-xs md:text-base lg:text-lg text-[#1c1d1e]"
              >
                <span>Seriously</span>
                <span>Good</span>
              </div>
            </div>
          </div>

          {/* SVG Heading Row */}
          <div className="w-full grid grid-cols-12 items-end gap-0 overflow-visible">
            <div className="col-span-5 flex items-end justify-start">
              <img
                src={DesignIcon}
                alt="Design"
                className="h-auto block"
                style={{ width: "90%", aspectRatio: "500/131" }}
              />
            </div>
            <div className="col-span-2" />
            <div className="col-span-5 flex items-end justify-end">
              <img
                src={EngineerIcon}
                alt="Engineer"
                className="max-w-none h-auto block"
                style={{
                  width: "124%",
                  minWidth: "124%",
                  aspectRatio: "689/131",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
