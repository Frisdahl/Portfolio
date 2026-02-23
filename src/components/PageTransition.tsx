import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { gsap } from "gsap";

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
  const logoRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const location = useLocation();
  const isAnimatingRef = useRef(false);

  const animate = () => {
    return new Promise<void>((resolve) => {
      // If already animating, don't start a new one but still resolve
      // so the caller (like a link click) can proceed.
      if (isAnimatingRef.current) {
        resolve();
        return;
      }

      isAnimatingRef.current = true;

      const tl = gsap.timeline({
        onComplete: () => {
          isAnimatingRef.current = false;
          if (containerRef.current) {
            gsap.set(containerRef.current, { autoAlpha: 0, display: "none" });
          }
        },
      });

      // Ensure container is visible
      if (containerRef.current) {
        gsap.set(containerRef.current, { autoAlpha: 1, display: "block" });
      }

      // Initial states
      gsap.set(columnsRef.current, {
        scaleX: 0,
        transformOrigin: "right",
      });

      gsap.set([logoRef.current, textRef.current], {
        opacity: 0,
        y: 20,
      });

      // 1. Columns expand from right to left (DARK)
      tl.to(columnsRef.current, {
        scaleX: 1,
        duration: 0.6,
        stagger: {
          each: 0.05,
          from: "end",
        },
        ease: "power2.inOut",
        force3D: true,
        onComplete: () => {
          // Resolve as soon as the screen is covered!
          resolve();
        },
      });

      // 2. Logo and text appear (WHITE)
      tl.to(
        [logoRef.current, textRef.current],
        {
          opacity: 0.4,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
        },
        "-=0.2",
      );

      // 3. Pause
      tl.to({}, { duration: 0.8 });

      // 4. Logo and text disappear
      tl.to([logoRef.current, textRef.current], {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: "power2.in",
      });

      // 5. Columns removed from right to left
      tl.to(columnsRef.current, {
        scaleX: 0,
        transformOrigin: "left",
        duration: 0.6,
        stagger: {
          each: 0.05,
          from: "end",
        },
        ease: "power2.inOut",
        force3D: true,
      });
    });
  };

  useEffect(() => {
    transitionTrigger = animate;

    // Auto-trigger on initial load/mount
    animate();

    return () => {
      transitionTrigger = null;
      isAnimatingRef.current = false;
      gsap.killTweensOf([
        ...columnsRef.current,
        logoRef.current,
        textRef.current,
      ]);
    };
  }, []);

  // Watch for location changes for standard navigation
  useEffect(() => {
    if (!isAnimatingRef.current) {
      animate();
    }
  }, [location.pathname]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] pointer-events-none invisible"
      style={{ display: "none" }}
    >
      {/* Background Columns - DARK BACKGROUND */}
      <div className="absolute inset-0 flex w-full h-full z-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              columnsRef.current[i] = el;
            }}
            className="h-full bg-[#0a0a0a] flex-grow origin-right"
            style={{
              transform: "scaleX(0)",
              willChange: "transform",
            }}
          />
        ))}
      </div>

      {/* Content Layer - WHITE TEXT/LOGO */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center">
          <img
            ref={logoRef}
            src="/images/Portfolio-logo.svg"
            alt="Frisdahl Studio Logo"
            className="h-16 md:h-20 mb-8"
            style={{
              willChange: "opacity, transform",
              filter: "brightness(0) invert(1)", // Force logo white
              opacity: 0,
            }}
          />
          <h1
            ref={textRef}
            className=" text-3xl md:text-5xl text-[#fff] uppercase text-center"
            style={{
              willChange: "opacity, transform",
              opacity: 0,
            }}
          >
            Frisdahl studio°
          </h1>
        </div>
      </div>
    </div>
  );
};

export default PageTransition;
