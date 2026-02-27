import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { _setTransitionTrigger } from "../utils/pageTransition";

const PageTransition = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<(HTMLDivElement | null)[]>([]);
  const location = useLocation();
  const isAnimatingRef = useRef(false);
  const isFirstMountRef = useRef(true);
  const ctxRef = useRef<gsap.Context | null>(null);
  
  const [columnCount, setColumnCount] = useState(12);

  useEffect(() => {
    const handleResize = () => {
      setColumnCount(window.innerWidth < 640 ? 5 : 12);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const animate = (isInitial = false) => {
    return new Promise<void>((resolve) => {
      if (isAnimatingRef.current && !isInitial) {
        resolve();
        return;
      }

      isAnimatingRef.current = true;

      // 1. Prepare DOM
      if (containerRef.current) {
        gsap.set(containerRef.current, {
          autoAlpha: 1,
          display: "block",
          pointerEvents: "all",
        });
      }

      // Disable scrolling
      document.body.style.overflow = "hidden";

      ctxRef.current = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            isAnimatingRef.current = false;
            if (containerRef.current) {
              gsap.set(containerRef.current, {
                autoAlpha: 0,
                display: "none",
                pointerEvents: "none",
              });
            }
            document.body.style.overflow = "";
          },
        });

        // 2. Expand Phase
        if (!isInitial) {
          tl.set(columnsRef.current, { scaleX: 0, transformOrigin: "right" });
          tl.to(columnsRef.current, {
            scaleX: 1,
            duration: 0.6,
            stagger: { each: 0.03, from: "end" },
            ease: "expo.inOut",
            force3D: true,
            onComplete: () => {
              resolve();
            },
          });
        } else {
          tl.set(columnsRef.current, { scaleX: 1 });
          tl.to({}, { duration: 0.1 });
          resolve();
        }

        // 3. Brief pause
        tl.to({}, { duration: 0.2 });

        // 4. Retract Phase
        tl.to(columnsRef.current, {
          scaleX: 0,
          transformOrigin: "left",
          duration: 0.6,
          stagger: { each: 0.03, from: "start" },
          ease: "expo.inOut",
          force3D: true,
          onComplete: () => {
            // Dispatch event ONLY after the screen is clear
            window.dispatchEvent(new CustomEvent("page-transition-complete"));
          }
        });
      });
    });
  };

  useEffect(() => {
    _setTransitionTrigger(() => animate());
    
    // Initial mount: trigger immediately to hide initial loading jump if needed
    // But InitialLoader handles the first one, so we just clear first mount flag
    isFirstMountRef.current = false;
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
      style={{ display: "block", opacity: 0, visibility: "hidden" }}
    >
      <div className="absolute inset-0 flex w-full h-full z-0 overflow-hidden">
        {[...Array(columnCount)].map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              columnsRef.current[i] = el;
            }}
            className="h-[101%] -mt-[0.5%] bg-[var(--foreground)] flex-grow"
            style={{
              willChange: "transform",
              width: `${100 / columnCount}%`,
              margin: "0 -0.1%"
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PageTransition;
