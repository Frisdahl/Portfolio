import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CurvedTransitionProps {
  /**
   * The color of the curve, usually matches the background of the section below.
   */
  color?: string;
  /**
   * Optional className for additional styling or positioning.
   */
  className?: string;
}

/**
 * A premium curved section transition component.
 * Uses GSAP path morphing to create a smooth, organic feel during scroll.
 */
const CurvedTransition: React.FC<CurvedTransitionProps> = ({
  color = "#1b1b1a",
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!pathRef.current || !containerRef.current) return;

      // The logic: Morphs the path from a flat line to a deep soft curve.
      // We use a Quadratic Bezier curve (Q) for the smoothest possible arc.
      // M0 100: Start at bottom-left
      // Q50 100: Control point at bottom-center (flat)
      // 100 100: End at bottom-right
      
      gsap.fromTo(
        pathRef.current,
        {
          attr: { d: "M0 100 Q50 100 100 100 L100 100 L0 100 Z" },
        },
        {
          attr: { d: "M0 100 Q50 0 100 100 L100 100 L0 100 Z" },
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom", // Starts as soon as the curve enters the viewport
            end: "bottom top",   // Ends when the curve leaves the viewport
            scrub: true,         // Smoothly follows scroll progress
          },
        }
      );
    }, containerRef);

    return () => ctx.revert(); // Cleanup on unmount
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[150px] md:h-[350px] pointer-events-none overflow-visible z-[20] ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full block"
      >
        <path
          ref={pathRef}
          fill={color}
          d="M0 100 Q50 100 100 100 L100 100 L0 100 Z"
        />
      </svg>
    </div>
  );
};

export default CurvedTransition;
