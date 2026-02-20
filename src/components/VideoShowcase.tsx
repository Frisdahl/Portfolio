import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const VideoShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Create a master timeline for the sequence
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=150%", // How long the sticky effect lasts
          pin: true,
          scrub: 0.8,
          onRefresh: (self) => {
            if (self.pin) self.pin.style.zIndex = "10";
          },
        },
      });

      // Phase 1: Expand to Full Screen (from initial 50vw)
      tl.to(videoWrapperRef.current, {
        width: "100%",
        borderRadius: "0rem",
        duration: 1,
        ease: "power2.inOut",
      })
        // Pause slightly at full screen
        .to({}, { duration: 0.3 })
        // Phase 2: Shrink, move to BOTTOM LEFT, and round corners
        .to(videoWrapperRef.current, {
          width: "42%",
          xPercent: -60, // Move left
          yPercent: 30, // Move down
          borderRadius: "4rem",
          duration: 1,
          ease: "power2.inOut",
        })
        // Phase 3: Reveal Text on TOP RIGHT
        .fromTo(
          textRef.current,
          {
            opacity: 0,
            xPercent: 40,
            yPercent: -60,
            visibility: "hidden",
          },
          {
            opacity: 1,
            xPercent: 0,
            yPercent: -45, // Anchored in the top half
            visibility: "visible",
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.6", // Start before video finishes moving
        )
        // Phase 4: Handle theme transition refresh
        .add(() => {
          ScrollTrigger.refresh();
        });

      // Crucial: Refresh immediately
      ScrollTrigger.refresh();
      setTimeout(() => ScrollTrigger.refresh(), 500);
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-transparent mb-64"
    >
      <div
        ref={stickyRef}
        className="h-full w-full flex items-center justify-center px-8 md:px-16 lg:px-24"
      >
        <div className="relative w-full flex items-center justify-center">
          {/* Video Container */}
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

          {/* Text Container - Positioned Top Right */}
          <div
            ref={textRef}
            className="absolute right-0 top-30 w-[50%] text-left pointer-events-none pr-12"
            style={{ visibility: "hidden" }}
          >
            <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-granary uppercase leading-[1] tracking-tighter text-[var(--foreground)]">
              <span className="font-apparel">i design </span> &
              <br />
              build websites
            </h2>
            <p className="pt-[5%] text-2xl text-[var(--foreground-muted)] max-w-xl opacity-80">
              Passionate about design and web development — crafting modern
              digital experiences for years.
            </p>
            <p className="pt-[5%] text-sm text-[var(--foreground-muted)] max-w-xl opacity-60">
              Explore my selected work below.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
