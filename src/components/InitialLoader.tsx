import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import lenis from "../utils/lenis";

const InitialLoader: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    // 1. Lock scroll during loading
    lenis.stop();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // 4. Cleanup and trigger site animations
          lenis.start();
          sessionStorage.setItem("hasSeenInitialLoader", "true");
          window.dispatchEvent(new CustomEvent("initial-loader-complete"));

          // Remove from DOM after transition
          if (containerRef.current) {
            containerRef.current.style.display = "none";
          }
        },
      });

      // 2. Animate the counter 0-100
      // Using Custom Ease string for the requested cubic-bezier
      tl.to(
        { val: 0 },
        {
          duration: 2.5,
          val: 100,
          ease: "cubic-bezier(0.22, 1, 0.36, 1)",
          onUpdate: function () {
            setPercentage(Math.round(this.targets()[0].val));
          },
        },
      );

      // 3. Slide up and exit - counter slides up inside mask while container slides up viewport
      tl.to(
        containerRef.current,
        {
          yPercent: -100,
          duration: 1.2,
          ease: "power4.inOut",
          delay: 0.2,
        },
        "exit",
      ).to(
        counterRef.current,
        {
          yPercent: -100,
          duration: 1.2,
          ease: "power4.inOut",
        },
        "exit",
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="initial-loader-wrap fixed inset-0 z-[300] bg-[#f4f4f5] flex items-center justify-center overflow-hidden"
    >
      <div className="overflow-hidden h-fit">
        <div 
          ref={counterRef}
          className="font-aeonik text-sm md:text-base lg:text-lg font-medium text-[#1c1d1e] tabular-nums leading-none"
        >
          {percentage}%
        </div>
      </div>
    </div>
  );
};

export default InitialLoader;
