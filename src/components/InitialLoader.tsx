import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import lenis from "../utils/lenis";

const InitialLoader: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoSVGRef = useRef<SVGSVGElement>(null);
  const logoRectRef = useRef<SVGRectElement>(null);
  const logoPathRef = useRef<SVGPathElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const contentWrapRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [columnCount, setColumnCount] = useState(12);

  useEffect(() => {
    const handleResize = () => {
      setColumnCount(window.innerWidth < 640 ? 5 : 12);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Force absolute scroll prevention immediately
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    if (lenis) lenis.stop();

    const tl = gsap.timeline({
      delay: 0.5, // Initial breathing room
      onComplete: () => {
        setIsVisible(false);
        // 2. Re-enable scrolling
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        if (lenis) lenis.start();
        
        // Remember that we've seen the loader in this session
        sessionStorage.setItem("hasSeenInitialLoader", "true");
        // Dispatch completion event
        window.dispatchEvent(new CustomEvent("initial-loader-complete"));
      },
    });

    // 1. Initial State
    const rect = logoRectRef.current;
    const path = logoPathRef.current;
    if (rect && path) {
      const rLen = rect.getTotalLength() + 2;
      const pLen = path.getTotalLength() + 2;
      gsap.set([rect, path], {
        strokeDasharray: (i) => (i === 0 ? rLen : pLen),
        strokeDashoffset: (i) => (i === 0 ? rLen : pLen),
        opacity: 0,
        fillOpacity: 0,
      });
    }
    gsap.set(progressFillRef.current, { scaleX: 0 });
    gsap.set(columnsRef.current, { scaleX: 1 });

    // 1. Anticipation (0.3s) - Micro shift/scale
    tl.to(contentWrapRef.current, {
      scale: 1.02,
      duration: 0.3,
      ease: "power2.out"
    });

    // 2. Main Slide (1.4s total) - Progress bar core expansion
    // Sprints to 70% then finishes the crawl
    tl.to(progressFillRef.current, {
      scaleX: 0.7,
      duration: 0.8,
      ease: "expo.out"
    }, "-=0.15");

    tl.to(progressFillRef.current, {
      scaleX: 1,
      duration: 0.6,
      ease: "power2.out"
    });

    // 3. Logo/Text Reveal (0.8s) - Layered Draw & Fill
    tl.to([rect, path], {
      opacity: 1,
      strokeDashoffset: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out"
    }, "-=1.2") // Overlapping with the start of the Main Slide
    .to([rect, path], {
      fillOpacity: 1,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.4");

    // 4. Short Pause for impact
    tl.to({}, { duration: 0.3 });

    // 5. Fade out center content (Pre-exit)
    tl.to([contentWrapRef.current, progressBarRef.current], {
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
    });

    // 6. Exit Sweep (0.7s) - Smooth but energetic clear
    tl.to(columnsRef.current, {
      scaleX: 0,
      transformOrigin: "left",
      duration: 0.7,
      stagger: { each: 0.03, from: "start" },
      ease: "expo.inOut",
      force3D: true,
    }, "-=0.1");

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (lenis) lenis.start();
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="initial-loader-wrap fixed inset-0 z-[100000] flex items-center justify-center bg-transparent pointer-events-auto"
    >
      {/* Dynamic Columns Background */}
      <div className="absolute inset-0 flex w-full h-full z-0 overflow-hidden">
        {[...Array(columnCount)].map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              columnsRef.current[i] = el;
            }}
            className="h-[101%] -mt-[0.5%] bg-[var(--background)] flex-grow origin-right"
            style={{ 
              willChange: "transform",
              width: `${100 / columnCount}%`,
              margin: "0 -0.1%" 
            }}
          />
        ))}
      </div>

      {/* Center Content */}
      <div ref={contentWrapRef} className="relative z-10 flex flex-col items-center">
        <svg
          ref={logoSVGRef}
          width="80"
          height="112"
          viewBox="-1 -1 27 37"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mb-16"
        >
          <rect
            ref={logoRectRef}
            x="0.5"
            y="0.5"
            width="24"
            height="34"
            rx="12"
            stroke="var(--foreground)"
            strokeWidth="1.5"
          />
          <path
            ref={logoPathRef}
            d="M16.4513 22.0222L6.91754 22.0445H6.25055C6.25055 22.0445 6.90687 20.7414 6.86092 20.8525L6.25055 22.0445L12.2702 10.2889H12.8216L20.6554 26H18.0365L16.3135 22.4C16.2446 22.2667 16.1986 22.0445 16.4054 22.0445H16.4513V22.0222ZM6.86092 20.8525L15.5554 20.8444L11.3196 12.1453L6.86092 20.8525Z"
            fill="var(--foreground)"
            stroke="var(--foreground)"
            strokeWidth="0.2"
          />
        </svg>
      </div>

      {/* Loader Bar - Absolute at Bottom */}
      <div 
        ref={progressBarRef}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[90vw] max-w-[1000px] h-[3px] bg-black/10 overflow-hidden z-20"
      >
        <div
          ref={progressFillRef}
          className="w-full h-full bg-black/40 origin-center"
        />
      </div>
    </div>
  );
};

export default InitialLoader;
