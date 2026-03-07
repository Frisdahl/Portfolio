import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";

interface AnimatedNavLinkProps {
  label: string;
  to: string;
  isActive?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  className?: string;
  target?: string;
  rel?: string;
}

const AnimatedNavLink: React.FC<AnimatedNavLinkProps> = ({
  label,
  to,
  isActive = false,
  onClick,
  className = "header-nav-link text-md md:text-xl font-cabinet font-regular tracking-tight",
  target,
  rel,
}) => {
  const containerRef = useRef<HTMLAnchorElement>(null);
  const primaryRef = useRef<HTMLSpanElement>(null);
  const secondaryRef = useRef<HTMLSpanElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    if (!primaryRef.current || !secondaryRef.current) return;

    const ctx = gsap.context(() => {
      const primarySplit = new SplitType(primaryRef.current!, {
        types: "chars",
      });
      const secondarySplit = new SplitType(secondaryRef.current!, {
        types: "chars",
      });

      // Set initial position for secondary chars
      gsap.set(secondarySplit.chars, { yPercent: 100 });

      const tl = gsap.timeline({
        paused: true,
        defaults: {
          duration: 0.35,
          ease: "power3.inOut",
          stagger: 0.03,
        },
      });

      tl.to(
        primarySplit.chars,
        {
          yPercent: -100,
        },
        0,
      ).to(
        secondarySplit.chars,
        {
          yPercent: 0,
        },
        0,
      );

      timelineRef.current = tl;

      return () => {
        primarySplit.revert();
        secondarySplit.revert();
      };
    }, containerRef);

    return () => ctx.revert();
  }, [label]);

  const handleMouseEnter = () => {
    if (!isActive) {
      timelineRef.current?.play();
    }
  };

  const handleMouseLeave = () => {
    if (!isActive) {
      timelineRef.current?.reverse();
    }
  };

  return (
    <a
      ref={containerRef}
      href={to}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      target={target}
      rel={rel}
      className={`${className} inline-block text-[var(--foreground)] relative transition-opacity duration-300 ${
        isActive ? "cursor-default opacity-60" : "hover:opacity-100"
      }`}
    >
      <div className="relative overflow-hidden leading-none h-[1em] flex items-center">
        <span ref={primaryRef} className="block leading-none">
          {label}
        </span>
        <span
          ref={secondaryRef}
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
