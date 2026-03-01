import React, { useLayoutEffect, useRef, useEffect, useState } from "react";
import { initVideoShowcaseAnimations } from "./VideoShowcase.anim";

const VideoShowcase: React.FC = () => {
  const [, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const longTextRef = useRef<HTMLParagraphElement>(null);
  const smallTextRef = useRef<HTMLParagraphElement>(null);

  // Lazy load video and control playback
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            videoRef.current?.play().catch(() => {});
          } else {
            videoRef.current?.pause();
          }
        });
      },
      { threshold: 0.1, rootMargin: "200px" }, // Start loading 200px before it enters
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (
      !containerRef.current ||
      !videoWrapperRef.current ||
      !textContainerRef.current ||
      !headingRef.current ||
      !longTextRef.current ||
      !smallTextRef.current
    )
      return;

    const ctx = initVideoShowcaseAnimations(
      containerRef.current,
      videoWrapperRef.current,
      headingRef.current,
      longTextRef.current,
      smallTextRef.current,
    );

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-transparent pt-48 md:pt-64 pb-32 md:pb-48 flex items-center overflow-hidden"
    >
      <div className="w-full max-w-[1920px] mx-auto px-6 md:px-10 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-12 lg:gap-20">
          {/* Video Column */}
          <div className="lg:col-span-7 flex justify-center lg:justify-start">
            <div
              ref={videoWrapperRef}
              className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl z-10 bg-neutral-900"
            >
              <video
                ref={videoRef}
                className="w-full h-full object-cover translate-z-0 backface-hidden"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
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

          {/* Text Column */}
          <div
            ref={textContainerRef}
            className="lg:col-span-5 flex flex-col gap-6 md:gap-10 text-center lg:text-left lg:-translate-y-[25%]"
          >
            <div className="flex flex-col gap-4 md:gap-6">
              <h2
                ref={headingRef}
                className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-aeonik font-bold text-[#1c1d1e] tracking-tight leading-[1.1]"
              >
                I design and
                <br />
                build websites
              </h2>{" "}
              <p
                ref={longTextRef}
                className="font-aeonik text-lg md:text-xl lg:text-2xl tracking-tight text-[#1c1d1e] max-w-xl mx-auto lg:mx-0 opacity-70"
              >
                Focused on creating digital experiences that bridge the gap
                between visual aesthetics and technical excellence.
              </p>
            </div>

            <p
              ref={smallTextRef}
              className="font-aeonik text-xs md:text-sm uppercase tracking-[0.3em] text-[#1c1d1e] opacity-40"
            >
              ( Creative Direction & Web Development )
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
