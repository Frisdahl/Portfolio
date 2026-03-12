import { useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { _setTransitionTrigger } from "../utils/pageTransition";

const COLUMN_COUNT = 5;

const PageTransition = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const topRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bottomRefs = useRef<(HTMLDivElement | null)[]>([]);
  const location = useLocation();
  const isAnimatingRef = useRef(false);
  const isFirstMountRef = useRef(true);
  const ctxRef = useRef<gsap.Context | null>(null);
  const animateRef = useRef<(onCovered?: () => void) => Promise<void>>(() => Promise.resolve());

  const runAnimation = useCallback((onCovered?: () => void) => {
    return new Promise<void>((resolve) => {
      if (isAnimatingRef.current) {
        onCovered?.();
        resolve();
        return;
      }
      if (!containerRef.current) {
        onCovered?.();
        resolve();
        return;
      }

      const tops = topRefs.current.filter(Boolean) as HTMLElement[];
      const bottoms = bottomRefs.current.filter(Boolean) as HTMLElement[];
      if (tops.length === 0 || bottoms.length === 0) {
        onCovered?.();
        resolve();
        return;
      }

      isAnimatingRef.current = true;
      sessionStorage.setItem("isNavigating", "true");

      gsap.set(containerRef.current, {
        visibility: "visible",
        opacity: 1,
        pointerEvents: "all",
      });
      document.body.style.overflow = "hidden";

      if (ctxRef.current) ctxRef.current.revert();

      ctxRef.current = gsap.context(() => {
        const topsInner = topRefs.current.filter(Boolean) as HTMLElement[];
        const bottomsInner = bottomRefs.current.filter(Boolean) as HTMLElement[];
        const staggerDuration = 0.04;
        const slideDuration = 0.28;
        const pauseDuration = 0.06;

        const tl = gsap.timeline({
          onComplete: () => {
            isAnimatingRef.current = false;
            sessionStorage.removeItem("isNavigating");
            if (containerRef.current) {
              gsap.set(containerRef.current, {
                visibility: "hidden",
                opacity: 0,
                pointerEvents: "none",
              });
            }
            document.body.style.overflow = "";
            window.dispatchEvent(new CustomEvent("page-transition-complete"));
          },
        });

        tl.set(topsInner, { yPercent: -100 });
        tl.set(bottomsInner, { yPercent: 100 });

        tl.to(
          topsInner,
          {
            yPercent: 0,
            duration: slideDuration,
            stagger: { each: staggerDuration, from: "start" },
            ease: "power3.inOut",
            force3D: true,
          },
          0,
        );
        tl.to(
          bottomsInner,
          {
            yPercent: 0,
            duration: slideDuration,
            stagger: { each: staggerDuration, from: "start" },
            ease: "power3.inOut",
            force3D: true,
          },
          0,
        );

        tl.add(() => {
          if (onCovered) onCovered();
          resolve();
        });

        tl.to({}, { duration: pauseDuration });

        tl.to(
          topsInner,
          {
            yPercent: -100,
            duration: slideDuration,
            stagger: { each: staggerDuration, from: "start" },
            ease: "power3.inOut",
            force3D: true,
          },
          0,
        );
        tl.to(
          bottomsInner,
          {
            yPercent: 100,
            duration: slideDuration,
            stagger: { each: staggerDuration, from: "start" },
            ease: "power3.inOut",
            force3D: true,
          },
          0,
        );
      });
    });
  }, []);

  useLayoutEffect(() => {
    animateRef.current = runAnimation;
    _setTransitionTrigger((onCovered) => animateRef.current(onCovered));
    return () => _setTransitionTrigger(null);
  }, [runAnimation]);

  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      return;
    }
    if (!isAnimatingRef.current) {
      runAnimation();
    }
  }, [location.pathname, runAnimation]);

  const overlay = (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] pointer-events-none"
      style={{ visibility: "hidden", opacity: 0 }}
    >
      <div className="absolute inset-0 flex w-full h-full overflow-hidden">
        {[...Array(COLUMN_COUNT)].map((_, i) => (
          <div
            key={i}
            className="relative h-full overflow-hidden flex-shrink-0"
            style={{
              width: `${100 / COLUMN_COUNT}%`,
              willChange: "transform",
            }}
          >
            <div
              ref={(el) => {
                topRefs.current[i] = el;
              }}
              className="absolute left-0 right-0 top-0 h-1/2 bg-[var(--foreground)]"
              style={{ willChange: "transform" }}
            />
            <div
              ref={(el) => {
                bottomRefs.current[i] = el;
              }}
              className="absolute left-0 right-0 bottom-0 h-1/2 bg-[var(--foreground)]"
              style={{ willChange: "transform" }}
            />
          </div>
        ))}
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(overlay, document.body);
};

export default PageTransition;
