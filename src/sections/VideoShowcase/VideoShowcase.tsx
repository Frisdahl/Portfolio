import React, { useLayoutEffect, useRef } from "react";
import { initVideoShowcaseAnimations } from "./VideoShowcase.anim";

const VideoShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const longTextRef = useRef<HTMLParagraphElement>(null);
  const smallTextRef = useRef<HTMLParagraphElement>(null);

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
      smallTextRef.current
    );

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-transparent mb-64"
    >
      <div className="h-full w-full flex items-center justify-center px-8 md:px-16 lg:px-24">
        <div className="relative w-full flex items-center justify-center">
          <div
            ref={videoWrapperRef}
            className="relative w-[50vw] aspect-video overflow-hidden rounded-3xl z-10 bg-neutral-900"
          >
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              src="/projectVideos/videoshowcase/promo_h264.mp4"
            />
          </div>

          <div
            ref={textContainerRef}
            className="absolute right-0 w-[50%] text-left pointer-events-none pr-12 flex flex-col gap-8"
            style={{ visibility: "hidden" }}
          >
            <h2
              ref={headingRef}
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-granary uppercase leading-[0.85] tracking-tighter text-[var(--foreground)]"
            >
              <span className="font-apparel">i design</span> &<br />
              build websites
            </h2>

            <p
              ref={longTextRef}
              className="font-granary text-xl md:text-2xl uppercase tracking-tight text-[var(--foreground)] max-w-xl"
            >
              Focused on creating digital experiences that bridge the gap
              between visual aesthetics and technical excellence.
            </p>

            <p
              ref={smallTextRef}
              className="font-granary text-sm uppercase tracking-[0.2em] text-[var(--foreground-muted)]"
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
