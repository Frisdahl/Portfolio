import React, { useLayoutEffect, useRef, useEffect } from "react";
import { initVideoShowcaseAnimations } from "./VideoShowcase.anim";

const VideoShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const longTextRef = useRef<HTMLParagraphElement>(null);
  const smallTextRef = useRef<HTMLParagraphElement>(null);

  // Pause video when not visible for better performance
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {}); // Resume playback
          } else {
            video.pause(); // Pause when off-screen
          }
        });
      },
      { threshold: 0.25 }, // Trigger when 25% visible
    );

    observer.observe(video);

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
      textContainerRef.current,
      headingRef.current,
      longTextRef.current,
      smallTextRef.current,
    );

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-transparent mb-64"
    >
      <div className="h-full w-full flex items-center justify-center px-8 md:px-12 lg:px-24">
        <div className="relative w-full flex items-center justify-center">
          <div
            ref={videoWrapperRef}
            className="relative w-[65vw] max-w-[1440px] max-h-[85vh] aspect-[1440/810] overflow-hidden rounded-3xl z-10 bg-neutral-900 shadow-2xl"
          >
            <video
              ref={videoRef}
              className="w-full h-full object-cover object-center"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              src="/projectVideos/videoshowcase/promo_h264.mp4"
            />
          </div>

          <div
            ref={textContainerRef}
            className="absolute right-0 text-left pointer-events-none pr-12 flex flex-col gap-8"
            style={{ visibility: "hidden" }}
          >
            <h2
              ref={headingRef}
              className="text-5xl md:text-6xl lg:text-7xl xl:text-7xl font-newroman text-[#fff] tracking-[.65px] leading-[1]"
            >
              <span className="font-newroman">I design</span> and
              <br />
              build websites
            </h2>

            <p
              ref={longTextRef}
              className="font-switzer text-xl md:text-2xl tracking-tight text-[var(--foreground)] w-full"
            >
              Focused on creating digital experiences that bridge the gap
              between visual aesthetics and technical excellence.
            </p>

            <p
              ref={smallTextRef}
              className="font-switzer text-sm uppercase tracking-[0.2em] text-[var(--foreground-muted)]"
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
