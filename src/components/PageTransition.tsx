import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { gsap } from "gsap";
import SplitType from "split-type";

let transitionTrigger: (() => Promise<void>) | null = null;

/**
 * Manually trigger the page transition animation.
 * Returns a promise that resolves when the transition is "at the middle"
 * (screen covered) so you can switch content/scroll.
 */
export const triggerPageTransition = () => {
  if (transitionTrigger) {
    return transitionTrigger();
  }
  return Promise.resolve();
};

const PageTransition = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<(HTMLDivElement | null)[]>([]);
  const logoSVGRef = useRef<SVGSVGElement>(null);
  const logoRectRef = useRef<SVGRectElement>(null);
  const logoPathRef = useRef<SVGPathElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const location = useLocation();
  const isAnimatingRef = useRef(false);
  const isFirstMountRef = useRef(true);
  const ctxRef = useRef<gsap.Context | null>(null);

  const animate = (isInitial = false) => {
    return new Promise<void>((resolve) => {
      const isReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (isAnimatingRef.current && !isInitial) {
        resolve();
        return;
      }

      isAnimatingRef.current = true;

      // 1. Prepare DOM synchronously before timeline
      if (containerRef.current) {
        gsap.set(containerRef.current, {
          autoAlpha: 1,
          display: "block",
          pointerEvents: "all", // Enable to block clicks behind it
        });
        containerRef.current.offsetHeight; // Force reflow
      }

      // Disable scrolling
      document.body.style.overflow = "hidden";

      // Synchronously hide logo and split text to prevent flash
      if (logoSVGRef.current) {
        gsap.set(logoSVGRef.current, { opacity: 0, visibility: "hidden" });
      }

      let split: SplitType | null = null;
      if (textRef.current) {
        gsap.set(textRef.current, { opacity: 0, visibility: "hidden" });
        split = new SplitType(textRef.current, { types: "chars" });
        if (split.chars) {
          gsap.set(split.chars, {
            opacity: 0,
            yPercent: isReducedMotion ? 0 : 100,
          });
        }
      }

      ctxRef.current = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            isAnimatingRef.current = false;
            if (split) split.revert();
            if (containerRef.current) {
              gsap.set(containerRef.current, {
                autoAlpha: 0,
                display: "none",
                pointerEvents: "none", // Reset for future use
              });
            }
            // Re-enable scrolling
            document.body.style.overflow = "";
          },
        });

        // Setup Logo lengths
        tl.add(() => {
          gsap.set([logoSVGRef.current, textRef.current], {
            opacity: 1,
            visibility: "visible",
          });

          const rect = logoRectRef.current;
          const path = logoPathRef.current;
          if (rect && path) {
            const rLen = (rect.getTotalLength() || 200) + 1;
            const pLen = (path.getTotalLength() || 200) + 1;
            gsap.set([rect, path], {
              strokeDasharray: (i) => (i === 0 ? rLen : pLen),
              strokeDashoffset: (i) => (i === 0 ? rLen : pLen),
              opacity: 0,
              fillOpacity: 0,
            });
          }
        });

        // 2. Expand Phase
        if (!isInitial) {
          tl.set(columnsRef.current, { scaleX: 0, transformOrigin: "right" });
          tl.to(columnsRef.current, {
            scaleX: 1,
            duration: 0.65,
            stagger: { each: 0.035, from: "end" },
            ease: "power3.inOut",
            force3D: true,
            onComplete: () => resolve(),
          });
        } else {
          tl.set(columnsRef.current, { scaleX: 1 });
          tl.to({}, { duration: 0.15 });
          resolve();
        }

        // ... (Logo and Text phases remain the same) ...

        // 7. Retract Phase
        tl.to(columnsRef.current, {
          scaleX: 0,
          transformOrigin: "left",
          duration: 0.65,
          stagger: { each: 0.035, from: "start" },
          ease: "power3.inOut",
          force3D: true,
        });
      });
    });
  };

  useEffect(() => {
    // ... (Effect logic remains the same) ...
  }, []);

  useEffect(() => {
    if (!isAnimatingRef.current && !isFirstMountRef.current) {
      animate();
    }
  }, [location.pathname]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] pointer-events-none"
      style={{ display: "block" }}
    >
      <div className="absolute inset-0 flex w-full h-full z-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              columnsRef.current[i] = el;
            }}
            className="h-[101%] -mt-[0.5%] bg-[var(--background)] flex-grow origin-right"
            style={{
              transform: "scaleX(1)",
              willChange: "transform",
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center">
          <svg
            ref={logoSVGRef}
            width="60"
            height="84"
            viewBox="-1 -1 27 37"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mb-8"
            style={{ opacity: 0, visibility: "hidden" }}
          >
            <rect
              ref={logoRectRef}
              x="0.5"
              y="0.5"
              width="24"
              height="34"
              rx="12"
              stroke="var(--foreground)"
              strokeWidth="1.8"
            />
            <path
              ref={logoPathRef}
              d="M16.4513 22.0222L6.91754 22.0445H6.25055C6.25055 22.0445 6.90687 20.7414 6.86092 20.8525L6.25055 22.0445L12.2702 10.2889H12.8216L20.6554 26H18.0365L16.3135 22.4C16.2446 22.2667 16.1986 22.0445 16.4054 22.0445H16.4513V22.0222ZM6.86092 20.8525L15.5554 20.8444L11.3196 12.1453L6.86092 20.8525Z"
              fill="var(--foreground)"
              stroke="var(--foreground)"
              strokeWidth="0.2"
            />
          </svg>

          <div className="overflow-hidden">
            <h1
              ref={textRef}
              className="text-3xl md:text-4xl text-[var(--foreground)] uppercase text-center font-semibold tracking-tight py-1"
              style={{ opacity: 0, visibility: "hidden" }}
            >
              Frisdahl studio°
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageTransition;
