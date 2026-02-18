import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ThemeTransitionCircle: React.FC = () => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (triggerRef.current && circleRef.current) {
        // Simple scaling animation
        gsap.set(circleRef.current, { scale: 0, xPercent: -50, yPercent: -50 });

        gsap.to(circleRef.current, {
          scale: 150, // Massive scale to cover the screen
          ease: "none",
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "top bottom", // Start when trigger enters
            end: "bottom center", // Finish when trigger is in the middle
            scrub: true,
          }
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Trigger div between sections */}
      <div ref={triggerRef} className="h-32 w-full pointer-events-none" />
      
      {/* Fixed circle that scales up */}
      <div 
        ref={circleRef}
        className="fixed top-1/2 left-1/2 w-20 h-20 rounded-full bg-[#f2f2f2] z-[-1] pointer-events-none"
      />
    </>
  );
};

export default ThemeTransitionCircle;
