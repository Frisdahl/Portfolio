import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface LinksProps {
  links?: Array<{ label: string; href: string }>;
}

type MaskedArrowProps = {
  maskId: string;
  svgRef?: (el: SVGSVGElement | null) => void;
  maskPathsRef?: (el: SVGGElement | null) => void;
  className?: string;
};

/**
 * Filled arrow is revealed by a MASK.
 * The mask uses the SAME paths, but as a white stroke that we dash-animate.
 * Result: looks "drawn" but stays solid (no white interior).
 */
const MaskedArrow = React.forwardRef<
  SVGSVGElement,
  Omit<MaskedArrowProps, "svgRef"> & {
    svgRef?: (el: SVGSVGElement | null) => void;
  }
>(({ maskId, svgRef, maskPathsRef, className = "" }, ref) => {
  return (
    <svg
      ref={(el) => {
        if (typeof ref === "function") ref(el);
        else if (ref)
          (ref as React.MutableRefObject<SVGSVGElement | null>).current = el;
        svgRef?.(el);
      }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 85.01 85.01"
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
      shapeRendering="geometricPrecision"
    >
      <defs>
        <mask id={maskId} maskUnits="objectBoundingBox">
          {/* Black = hidden */}
          <rect x="0" y="0" width="1" height="1" fill="black" />
          {/* White stroke drawing = revealed */}
          <g ref={maskPathsRef}>
            <path
              d="M6.62,0c-1.48,0-2.68,1.19-2.69,2.67l-.08,8.93c0,1.5,1.2,2.71,2.69,2.71h47.52c2.4,0,3.6,2.9,1.9,4.59L74.87,0H6.62Z"
              fill="none"
              stroke="white"
            />
            <path
              d="M85,2.69c0-1.49-1.2-2.69-2.69-2.69h-7.44l-18.9,18.9-4.1,4.1L.79,74.08c-1.05,1.05-1.05,2.75,0,3.81l6.33,6.33c1.05,1.05,2.75,1.05,3.81,0l55.18-55.18,18.9-18.9V2.69h-.01Z"
              fill="none"
              stroke="white"
            />
            <path
              d="M66.1,29.04c1.7-1.7,4.59-.49,4.59,1.9v47.52c0,1.5,1.22,2.7,2.71,2.69l8.93-.08c1.48-.01,2.67-1.21,2.67-2.69V10.13l-18.9,18.9h0Z"
              fill="none"
              stroke="white"
            />
          </g>
        </mask>
      </defs>

      {/* The filled arrow that will be revealed by the mask */}
      <g mask={`url(#${maskId})`}>
        <path
          d="M6.62,0c-1.48,0-2.68,1.19-2.69,2.67l-.08,8.93c0,1.5,1.2,2.71,2.69,2.71h47.52c2.4,0,3.6,2.9,1.9,4.59L74.87,0H6.62Z"
          fill="#0a0a0a"
        />
        <path
          d="M85,2.69c0-1.49-1.2-2.69-2.69-2.69h-7.44l-18.9,18.9-4.1,4.1L.79,74.08c-1.05,1.05-1.05,2.75,0,3.81l6.33,6.33c1.05,1.05,2.75,1.05,3.81,0l55.18-55.18,18.9-18.9V2.69h-.01Z"
          fill="#0a0a0a"
        />
        <path
          d="M66.1,29.04c1.7-1.7,4.59-.49,4.59,1.9v47.52c0,1.5,1.22,2.7,2.71,2.69l8.93-.08c1.48-.01,2.67-1.21,2.67-2.69V10.13l-18.9,18.9h0Z"
          fill="#0a0a0a"
        />
      </g>
    </svg>
  );
});
MaskedArrow.displayName = "MaskedArrow";

const Links: React.FC<LinksProps> = ({
  links = [
    { label: "Facebook", href: "#facebook" },
    { label: "LinkedIn", href: "#linkedin" },
    { label: "Instagram", href: "#instagram" },
  ],
}) => {
  const leftMaskGroupRefs = useRef<(SVGGElement | null)[]>([]);
  const rightMaskGroupRefs = useRef<(SVGGElement | null)[]>([]);
  const textRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const cleanups: Array<() => void> = [];

    links.forEach((_, i) => {
      const leftMaskGroup = leftMaskGroupRefs.current[i];
      const rightMaskGroup = rightMaskGroupRefs.current[i];
      const text = textRefs.current[i];
      const link = linkRefs.current[i];
      if (!leftMaskGroup || !rightMaskGroup || !text || !link) return;

      const leftMaskPaths = Array.from(
        leftMaskGroup.querySelectorAll("path"),
      ) as SVGPathElement[];

      const rightMaskPaths = Array.from(
        rightMaskGroup.querySelectorAll("path"),
      ) as SVGPathElement[];

      // Setup LEFT mask stroke (starts hidden, draws in)
      leftMaskPaths.forEach((p) => {
        const len = p.getTotalLength();
        const dash = len + 2;

        gsap.set(p, {
          strokeWidth: 14,
          strokeLinecap: "butt",
          strokeLinejoin: "round",
          strokeDasharray: dash,
          strokeDashoffset: dash, // hidden initially
        });
      });

      // Setup RIGHT mask stroke (starts visible, erases out)
      rightMaskPaths.forEach((p) => {
        const len = p.getTotalLength();
        const dash = len + 2;

        gsap.set(p, {
          strokeWidth: 14,
          strokeLinecap: "butt",
          strokeLinejoin: "round",
          strokeDasharray: dash,
          strokeDashoffset: 0, // fully visible initially
        });
      });

      // Hide left mask group initially
      gsap.set(leftMaskGroup, { opacity: 0 });
      // Right mask group stays visible
      gsap.set(rightMaskGroup, { opacity: 1 });

      // Timeline
      const tl = gsap.timeline({ paused: true });

      // Erase right arrow by "undrawing" strokes
      tl.to(
        rightMaskPaths,
        {
          strokeDashoffset: (index) => {
            const len = rightMaskPaths[index].getTotalLength();
            return len + 2;
          },
          duration: 0.45,
          stagger: 0.05,
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
        // turn left mask on BEFORE drawing
        .to(
          leftMaskGroup,
          {
            opacity: 1,
            duration: 0.01,
          },
          0.08,
        )
        // Draw-reveal left arrow via mask
        .to(
          leftMaskPaths,
          {
            strokeDashoffset: 0,
            duration: 0.7,
            stagger: 0.06,
            ease: "power2.out",
          },
          0.12,
        )
        // when reversing back to start, hide left mask group again
        .eventCallback("onReverseComplete", () => {
          gsap.set(leftMaskGroup, { opacity: 0 });
        });

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
      {links.map((link, i) => {
        const maskId = `arrow-mask-${i}`; // stable for this component
        return (
          <a
            key={link.label}
            ref={(el) => {
              linkRefs.current[i] = el;
            }}
            href={link.href}
            className="inline-flex items-center text-sm font-normal tracking-widest uppercase text-[#0a0a0a] py-2 relative"
          >
            {/* LEFT incoming arrow (true draw reveal via mask) */}
            <span className="absolute left-0 w-4 h-4 rotate-[45deg]">
              <MaskedArrow
                maskId={maskId}
                maskPathsRef={(el) => (leftMaskGroupRefs.current[i] = el)}
              />
            </span>

            {/* Text */}
            <span
              ref={(el) => {
                textRefs.current[i] = el;
              }}
              className="ml-5"
            >
              {link.label}
            </span>

            {/* RIGHT arrow (masked, gets erased via stroke) */}
            <span className="w-4 h-4 ml-2">
              <MaskedArrow
                maskId={`${maskId}-right`}
                maskPathsRef={(el) => (rightMaskGroupRefs.current[i] = el)}
              />
            </span>
          </a>
        );
      })}
    </div>
  );
};

export default Links;
