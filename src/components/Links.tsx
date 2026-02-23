import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface LinksProps {
  links?: Array<{ label: string; href: string }>;
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
  linkClassName = "text-xs uppercase font-semibold tracking-[0.1em] py-1",
  textColor = "text-[#0a0a0a]",
  underlineColor = "bg-[#0a0a0a]",
}) => {
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const textSpanRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const introTimelineRefs = useRef<(gsap.core.Timeline | null)[]>([]);
  const outroTimelineRefs = useRef<(gsap.core.Timeline | null)[]>([]);
  const isPointerInsideRefs = useRef<boolean[]>([]);
  const leaveQueuedRefs = useRef<boolean[]>([]);

  useEffect(() => {
    const cleanups: Array<() => void> = [];

    links.forEach((_, i) => {
      const line = lineRefs.current[i];
      const link = linkRefs.current[i];
      const textSpan = textSpanRefs.current[i];
      if (!line || !link || !textSpan) return;

      // Measure text width and set the underline width
      const textWidth = textSpan.offsetWidth;
      gsap.set(line, { width: textWidth, scaleX: 0, transformOrigin: "left" });

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

        // If outro is active, wait for it to complete before starting intro
        if (outro?.isActive()) {
          outro.eventCallback("onComplete", () => {
            if (isPointerInsideRefs.current[i]) {
              intro?.restart();
            }
          });
        } else if (intro && !intro.isActive()) {
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

      // Handle window resize to re-measure text
      const handleResize = () => {
        const newTextWidth = textSpan.offsetWidth;
        gsap.set(line, { width: newTextWidth });
      };

      window.addEventListener("resize", handleResize);

      cleanups.push(() => {
        link.removeEventListener("mouseenter", handleMouseEnter);
        link.removeEventListener("mouseleave", handleMouseLeave);
        window.removeEventListener("resize", handleResize);
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
            className={`relative inline-block ${linkClassName} ${textColor}`}
          >
            <span
              ref={(el) => {
                textSpanRefs.current[i] = el;
              }}
            >
              {link.label}
            </span>
            <span
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
              className={`absolute bottom-0 left-0 h-[1px] ${underlineColor}`}
            ></span>
          </a>
        );
      })}
    </div>
  );
};

export default Links;
