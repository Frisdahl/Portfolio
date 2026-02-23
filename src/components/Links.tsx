import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface LinksProps {
  links?: Array<{ label: string; href: string }>;
}

const ArrowSVG: React.FC<{
  svgRef?: (el: SVGSVGElement | null) => void;
  fillOnly?: boolean;
  strokeOnly?: boolean;
}> = ({ svgRef, fillOnly, strokeOnly }) => (
  <svg
    ref={svgRef}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 85.01 85.01"
    style={{ display: "block", width: "100%", height: "100%" }}
    shapeRendering="geometricPrecision"
  >
    <path
      d="M6.62,0c-1.48,0-2.68,1.19-2.69,2.67l-.08,8.93c0,1.5,1.2,2.71,2.69,2.71h47.52c2.4,0,3.6,2.9,1.9,4.59L74.87,0H6.62Z"
      fill={strokeOnly ? "none" : "#0a0a0a"}
      stroke={fillOnly ? "none" : "#0a0a0a"}
    />
    <path
      d="M85,2.69c0-1.49-1.2-2.69-2.69-2.69h-7.44l-18.9,18.9-4.1,4.1L.79,74.08c-1.05,1.05-1.05,2.75,0,3.81l6.33,6.33c1.05,1.05,2.75,1.05,3.81,0l55.18-55.18,18.9-18.9V2.69h-.01Z"
      fill={strokeOnly ? "none" : "#0a0a0a"}
      stroke={fillOnly ? "none" : "#0a0a0a"}
    />
    <path
      d="M66.1,29.04c1.7-1.7,4.59-.49,4.59,1.9v47.52c0,1.5,1.22,2.7,2.71,2.69l8.93-.08c1.48-.01,2.67-1.21,2.67-2.69V10.13l-18.9,18.9h0Z"
      fill={strokeOnly ? "none" : "#0a0a0a"}
      stroke={fillOnly ? "none" : "#0a0a0a"}
    />
  </svg>
);

const Links: React.FC<LinksProps> = ({
  links = [
    { label: "Facebook", href: "#facebook" },
    { label: "LinkedIn", href: "#linkedin" },
    { label: "Instagram", href: "#instagram" },
  ],
}) => {
  const leftFillRefs = useRef<(SVGSVGElement | null)[]>([]);
  const leftStrokeRefs = useRef<(SVGSVGElement | null)[]>([]);
  const rightFillRefs = useRef<(SVGSVGElement | null)[]>([]);
  const textRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const cleanups: Array<() => void> = [];

    links.forEach((_, i) => {
      const leftFill = leftFillRefs.current[i];
      const leftStroke = leftStrokeRefs.current[i];
      const rightFill = rightFillRefs.current[i];
      const text = textRefs.current[i];
      const link = linkRefs.current[i];

      if (!leftFill || !leftStroke || !rightFill || !text || !link) return;

      const leftStrokePaths = Array.from(
        leftStroke.querySelectorAll("path"),
      ) as SVGPathElement[];

      // Left fill: revealed by clip-path
      gsap.set(leftFill, { clipPath: "inset(0% 100% 0% 0%)", opacity: 1 });

      // Left stroke: same reveal + dash draw
      gsap.set(leftStroke, { clipPath: "inset(0% 100% 0% 0%)", opacity: 1 });

      leftStrokePaths.forEach((p) => {
        const len = p.getTotalLength();
        const dash = len + 1;
        gsap.set(p, {
          fill: "none",
          stroke: "#0a0a0a",
          strokeWidth: 2.5,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeDasharray: dash,
          strokeDashoffset: dash,
          opacity: 1,
        });
      });

      // Right fill: wipes away
      gsap.set(rightFill, { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 });

      gsap.set(text, { x: 0, opacity: 1 });

      const tl = gsap.timeline({ paused: true });

      tl.to(
        rightFill,
        {
          clipPath: "inset(0% 0% 0% 100%)",
          duration: 0.45,
          ease: "power2.inOut",
        },
        0,
      )
        .to(
          text,
          {
            x: 18,
            opacity: 0.65,
            duration: 0.45,
            ease: "power2.inOut",
          },
          0,
        )
        // Reveal left fill (solid)
        .to(
          leftFill,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.5,
            ease: "power2.out",
          },
          0.12,
        )
        // Reveal left stroke layer at same time
        .to(
          leftStroke,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.5,
            ease: "power2.out",
          },
          0.12,
        )
        // Draw stroke on top (hand-drawn feel)
        .to(
          leftStrokePaths,
          {
            strokeDashoffset: 0,
            duration: 0.6,
            stagger: 0.05,
            ease: "power2.out",
          },
          0.18,
        );

      const onEnter = () => tl.play();
      const onLeave = () => tl.reverse();

      link.addEventListener("mouseenter", onEnter);
      link.addEventListener("mouseleave", onLeave);

      cleanups.push(() => {
        link.removeEventListener("mouseenter", onEnter);
        link.removeEventListener("mouseleave", onLeave);
        tl.kill();
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [links]);

  return (
    <div className="flex flex-wrap gap-x-12 gap-y-4">
      {links.map((link, i) => (
        <a
          key={link.label}
          ref={(el) => (linkRefs.current[i] = el)}
          href={link.href}
          className="inline-flex items-center text-sm tracking-widest uppercase text-[#0a0a0a] py-2 relative"
        >
          {/* Left incoming arrow: fill + stroke stacked */}
          <span className="absolute left-0 w-5 h-5">
            <span className="absolute inset-0">
              <ArrowSVG
                svgRef={(el) => (leftFillRefs.current[i] = el)}
                fillOnly
              />
            </span>
            <span className="absolute inset-0">
              <ArrowSVG
                svgRef={(el) => (leftStrokeRefs.current[i] = el)}
                strokeOnly
              />
            </span>
          </span>

          {/* Text */}
          <span ref={(el) => (textRefs.current[i] = el)} className="ml-6">
            {link.label}
          </span>

          {/* Right arrow: fill only */}
          <span className="w-5 h-5 ml-3">
            <ArrowSVG
              svgRef={(el) => (rightFillRefs.current[i] = el)}
              fillOnly
            />
          </span>
        </a>
      ))}
    </div>
  );
};

export default Links;
