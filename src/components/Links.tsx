import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface LinksProps {
  links?: Array<{ 
    label: string; 
    href: string;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  }>;
  className?: string;
  linkClassName?: string;
  textColor?: string;
  underlineColor?: string;
}

const Links: React.FC<LinksProps> = ({
  links = [
    { label: "Facebook", href: "#facebook" },
    { label: "LinkedIn", href: "#linkedin" },
    { label: "Instagram", href: "#instagram" },
  ],
  className = "flex flex-wrap gap-x-12 gap-y-4",
  linkClassName = "text-xs uppercase font-semibold tracking-[0.3em] py-1",
  textColor = "text-[#1c1d1e]",
  underlineColor = "bg-[#1c1d1e]",
}) => {
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const introTimelineRefs = useRef<(gsap.core.Timeline | null)[]>([]);
  const outroTimelineRefs = useRef<(gsap.core.Timeline | null)[]>([]);
  const isPointerInsideRefs = useRef<boolean[]>([]);
  const leaveQueuedRefs = useRef<boolean[]>([]);

  useEffect(() => {
    const cleanups: Array<() => void> = [];

    links.forEach((_, i) => {
      const line = lineRefs.current[i];
      const link = linkRefs.current[i];
      if (!line || !link) return;

      // Set initial state
      gsap.set(line, { scaleX: 0, transformOrigin: "left" });

      // Initialize state trackers
      isPointerInsideRefs.current[i] = false;
      leaveQueuedRefs.current[i] = false;

      // Create intro timeline (expand from left)
      const introTimeline = gsap.timeline({
        paused: true,
        onComplete: () => {
          if (leaveQueuedRefs.current[i]) {
            leaveQueuedRefs.current[i] = false;
            scheduleOutro(i);
          }
        },
      });

      introTimeline.to(line, {
        scaleX: 1,
        transformOrigin: "left",
        duration: 0.5,
        ease: "power2.out",
      });

      // Create outro timeline (exit to the right)
      const outroTimeline = gsap.timeline({
        paused: true,
      });

      outroTimeline.to(line, {
        scaleX: 0,
        transformOrigin: "right",
        duration: 0.5,
        ease: "power2.in",
      });

      introTimelineRefs.current[i] = introTimeline;
      outroTimelineRefs.current[i] = outroTimeline;

      const scheduleOutro = (index: number) => {
        const outro = outroTimelineRefs.current[index];
        if (outro && !outro.isActive()) {
          outro.restart();
        }
      };

      const handleMouseEnter = () => {
        isPointerInsideRefs.current[i] = true;
        leaveQueuedRefs.current[i] = false;

        const intro = introTimelineRefs.current[i];
        const outro = outroTimelineRefs.current[i];

        if (outro?.isActive()) {
          outro.kill();
        }

        if (intro && !intro.isActive()) {
          intro.restart();
        }
      };

      const handleMouseLeave = () => {
        isPointerInsideRefs.current[i] = false;
        const intro = introTimelineRefs.current[i];

        if (intro?.isActive()) {
          leaveQueuedRefs.current[i] = true;
        } else {
          scheduleOutro(i);
        }
      };

      link.addEventListener("mouseenter", handleMouseEnter);
      link.addEventListener("mouseleave", handleMouseLeave);

      cleanups.push(() => {
        link.removeEventListener("mouseenter", handleMouseEnter);
        link.removeEventListener("mouseleave", handleMouseLeave);
        if (introTimelineRefs.current[i]) introTimelineRefs.current[i]?.kill();
        if (outroTimelineRefs.current[i]) outroTimelineRefs.current[i]?.kill();
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [links]);

  return (
    <div className={className}>
      {links.map((link, i) => {
        return (
          <a
            key={link.label + i}
            ref={(el) => {
              linkRefs.current[i] = el;
            }}
            href={link.href}
            onClick={link.onClick}
            className={`inline-flex items-center ${linkClassName} ${textColor}`}
          >
            <span className="relative">
              {link.label}
              <span
                ref={(el) => {
                  lineRefs.current[i] = el;
                }}
                className={`absolute -bottom-1 left-0 w-full h-[1px] ${underlineColor}`}
              ></span>
            </span>
          </a>
        );
      })}
    </div>
  );
};

export default Links;
