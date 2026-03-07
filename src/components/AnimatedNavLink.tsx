import React, { useLayoutEffect, useRef, useEffect } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";

interface AnimatedNavLinkProps {
  label: string;
  to: string;
  isActive?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
  target?: string;
  rel?: string;
  textColor?: string;
  externalHover?: boolean; // New prop to trigger hover from parent
}

const AnimatedNavLink: React.FC<AnimatedNavLinkProps> = ({
  label,
  to,
  isActive = false,
  onClick,
  className = "",
  target,
  rel,
  textColor,
  externalHover = false,
}) => {
  const containerRef = useRef<HTMLAnchorElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const hoverLabelRef = useRef<HTMLSpanElement>(null);
  const splitRef = useRef<SplitType | null>(null);
  const hoverSplitRef = useRef<SplitType | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (labelRef.current && hoverLabelRef.current) {
        splitRef.current = new SplitType(labelRef.current, { types: "chars" });
        hoverSplitRef.current = new SplitType(hoverLabelRef.current, {
          types: "chars",
        });

        // Set initial state for hover characters
        gsap.set(hoverSplitRef.current.chars, { yPercent: 100 });
      }
    }, containerRef);

    return () => {
      ctx.revert();
      splitRef.current?.revert();
      hoverSplitRef.current?.revert();
    };
  }, [label]);

  const playHover = () => {
    if (isActive) return;
    gsap.to(splitRef.current?.chars || [], {
      yPercent: -100,
      duration: 0.4,
      stagger: 0.02,
      ease: "power2.inOut",
      overwrite: true,
    });
    gsap.to(hoverSplitRef.current?.chars || [], {
      yPercent: 0,
      duration: 0.4,
      stagger: 0.02,
      ease: "power2.inOut",
      overwrite: true,
    });
  };

  const reverseHover = () => {
    if (isActive) return;
    gsap.to(splitRef.current?.chars || [], {
      yPercent: 0,
      duration: 0.4,
      stagger: 0.02,
      ease: "power2.inOut",
      overwrite: true,
    });
    gsap.to(hoverSplitRef.current?.chars || [], {
      yPercent: 100,
      duration: 0.4,
      stagger: 0.02,
      ease: "power2.inOut",
      overwrite: true,
    });
  };

  // React to external hover changes
  useEffect(() => {
    if (externalHover) {
      playHover();
    } else {
      reverseHover();
    }
  }, [externalHover]);

  return (
    <a
      ref={containerRef}
      href={to}
      onClick={onClick}
      onMouseEnter={() => !externalHover && playHover()}
      onMouseLeave={() => !externalHover && reverseHover()}
      target={target}
      rel={rel}
      className={`${className} inline-block ${textColor ? "" : "text-[var(--foreground)]"} relative transition-opacity duration-300 ${
        isActive ? "cursor-default opacity-60" : "hover:opacity-100"
      }`}
      style={textColor ? { color: textColor } : {}}
    >
      <div className="relative overflow-hidden">
        <span ref={labelRef} className="block leading-none">
          {label}
        </span>
        <span
          ref={hoverLabelRef}
          className="absolute top-0 left-0 block w-full whitespace-nowrap pointer-events-none leading-none"
          aria-hidden="true"
        >
          {label}
        </span>
      </div>
    </a>
  );
};

export default AnimatedNavLink;
