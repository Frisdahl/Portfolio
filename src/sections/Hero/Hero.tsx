import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import DesignIcon from "../../assets/icons/heroSection/Design.svg";
import EngineerIcon from "../../assets/icons/heroSection/Engineer.svg";

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const videoContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !containerRef.current ||
      !videoWrapperRef.current ||
      !videoContentRef.current
    )
      return;

    // Use GSAP quickTo for performance and buttery smoothness
    const xTo = gsap.quickTo(videoWrapperRef.current, "x", {
      duration: 0.8,
      ease: "power3.out",
    });

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !videoContentRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const videoRect = videoContentRef.current.getBoundingClientRect();

      const mouseX = e.clientX - containerRect.left;
      const mousePercent = Math.max(
        0,
        Math.min(mouseX / containerRect.width, 1),
      );

      const travelDistance = containerRect.width - videoRect.width;
      const xPos = (mousePercent - 0.5) * travelDistance;

      xTo(xPos);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      id="hero"
      className="relative w-full h-[100vh] flex flex-col justify-end px-4 md:px-10 lg:px-4 xl:px-6 pb-8 md:pb-12 overflow-hidden"
    >
      <div ref={containerRef} className="w-full flex flex-col items-center">
        {/* Video Section - Faster horizontal cursor follow */}
        <div
          ref={videoWrapperRef}
          className="mb-4 md:mb-6 w-full flex justify-center will-change-transform"
        >
          <div
            ref={videoContentRef}
            className="w-full max-w-[320px] md:max-w-[600px] lg:max-w-[800px] aspect-video overflow-hidden bg-black rounded-[4px] md:rounded-[8px]"
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

        {/* Triple Paragraph Labels - 12 Column Grid */}
        <div className="w-full grid grid-cols-12 gap-0 mb-0.5 md:mb-1 px-[0.05em] overflow-visible">
          <div className="col-span-5 text-left">
            <p className="text-xs md:text-base lg:text-lg font-aeonik font-medium text-[#1c1d1e] uppercase tracking-widest">
              A
            </p>
          </div>
          <div className="col-span-2" />
          <div className="col-span-5 flex justify-end overflow-visible">
            <div
              className="flex justify-between"
              style={{ width: "124%", minWidth: "124%" }}
            >
              <p className="text-xs md:text-base lg:text-lg font-aeonik font-medium text-[#1c1d1e] uppercase tracking-widest">
                Seriously
              </p>
              <p className="text-xs md:text-base lg:text-lg font-aeonik font-medium text-[#1c1d1e] uppercase tracking-widest">
                Good
              </p>
            </div>
          </div>
        </div>

        {/* SVG Heading (Bottom) - Scaling both down slightly while keeping height matched */}
        <div className="w-full grid grid-cols-12 items-end gap-0 overflow-visible">
          <div className="col-span-5 flex items-end justify-start">
            <img
              src={DesignIcon}
              alt="Design"
              className="h-auto object-contain block"
              style={{ width: "90%", aspectRatio: "500 / 131" }}
            />
          </div>
          <div className="col-span-2" aria-hidden="true" />
          <div className="col-span-5 flex items-end justify-end">
            <img
              src={EngineerIcon}
              alt="Engineer"
              className="max-w-none h-auto object-contain block"
              style={{
                width: "124%", // 137.8% * 0.9 = 124.02%
                minWidth: "124%",
                aspectRatio: "689 / 131",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
