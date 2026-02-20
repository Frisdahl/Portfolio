import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

const VideoShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const longTextRef = useRef<HTMLParagraphElement>(null);
  const smallTextRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Split text into lines for the reveal effect
      const splitHeading = new SplitType(headingRef.current!, {
        types: "lines",
        tagName: "span",
      });
      const splitLongText = new SplitType(longTextRef.current!, {
        types: "lines",
        tagName: "span",
      });
      const splitSmallText = new SplitType(smallTextRef.current!, {
        types: "lines",
        tagName: "span",
      });

      // Wrap each line in an overflow-hidden container for the "reveal from bottom" effect
      [splitHeading, splitLongText, splitSmallText].forEach((split) => {
        split.lines?.forEach((line) => {
          const wrapper = document.createElement("div");
          wrapper.style.overflow = "hidden";
          // Add small padding to prevent font clipping on tall characters
          wrapper.style.paddingTop = "0.1em";
          wrapper.style.paddingBottom = "0.1em";
          wrapper.style.marginTop = "-0.1em";

          line.style.display = "inline-block";

          line.parentNode?.insertBefore(wrapper, line);
          wrapper.appendChild(line);

          // Initial state for lines
          gsap.set(line, { yPercent: 100, opacity: 0 });
        });
      });

      // 2. Create the master timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=250%", // Slightly longer for staggered text
          pin: true,
          scrub: 0.8,
          onRefresh: (self) => {
            if (self.pin) self.pin.style.zIndex = "10";
          },
        },
      });

      // Phase 1: Expand Video
      tl.to(videoWrapperRef.current, {
        width: "100%",
        borderRadius: "0rem",
        duration: 1,
        ease: "power2.inOut",
      })
        .to({}, { duration: 0.2 })

        // Phase 2: Shrink and move to BOTTOM LEFT
        .to(videoWrapperRef.current, {
          width: "42%",
          xPercent: -60,
          yPercent: 30,
          borderRadius: "4rem",
          duration: 1,
          ease: "power2.inOut",
        })

        // Phase 3: Reveal Text Container (Start just as video finishes)
        .set(
          textContainerRef.current,
          { visibility: "visible", yPercent: -45 },
          "-=0.1",
        )

        // Phase 4: Staggered Line Reveals
        // Reveal Heading Lines (100% Opacity)
        .to(
          splitHeading.lines!,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
          },
          "+=0.1", // Small delay after video stops
        )

        // Reveal Long Text Lines (80% Opacity)
        .to(
          splitLongText.lines!,
          {
            yPercent: 0,
            opacity: 0.8,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.4",
        )

        // Reveal Small Text Lines (60% Opacity)
        .to(
          splitSmallText.lines!,
          {
            yPercent: 0,
            opacity: 0.6,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.4",
        )

        // Phase 5: Dead-zone (Briefly hold the final state)
        .to({}, { duration: 0.5 })

        // Phase 6: Handle theme transition refresh
        .add(() => {
          ScrollTrigger.refresh();
        });

      ScrollTrigger.refresh();
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

          {/* Text Container */}
          <div
            ref={textContainerRef}
            className="absolute right-0 w-[50%] text-left pointer-events-none pr-12 flex flex-col gap-8"
            style={{ visibility: "hidden" }}
          >
            <h2
              ref={headingRef}
              className="text-6xl md:text-6xl lg:text-7xl font-granary uppercase leading-[0.85] tracking-tighter text-[var(--foreground)]"
            >
              <span className="font-apparel">i design</span> &<br />
              build websites
            </h2>

            <p
              ref={longTextRef}
              className="font-granary text-xl md:text-2xl tracking-tight text-[var(--foreground)] max-w-2xl"
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
