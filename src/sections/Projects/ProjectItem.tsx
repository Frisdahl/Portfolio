import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import AnimatedButton from "../../components/AnimatedButton";
import { initProjectReveal } from "./Projects.anim";
import { gsap } from "gsap";

interface Project {
  id: number;
  title: string;
  description: string;
  categories: string[];
  image: string;
  video?: string;
  link: string;
}

interface ProjectItemProps {
  project: Project;
  index: number;
  speed?: number; // Kept for prop compatibility but unused
  aspectClassName?: string;
}

const TEXT_HIDDEN_Y_PERCENT = 120;

const ProjectItem: React.FC<ProjectItemProps> = ({
  project,
  index,
  aspectClassName = "aspect-square",
}) => {
  const [isInView, setIsInView] = useState(false);

  const itemRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleTextRef = useRef<HTMLHeadingElement>(null);
  const categoriesTextRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  const videoSrc = project.video?.startsWith("/")
    ? project.video
    : `/${project.video}`;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  // Video logic: autoplay and loop at all times
  useEffect(() => {
    if (videoRef.current && isInView) {
      videoRef.current.play().catch(() => undefined);
    } else if (videoRef.current && !isInView) {
      videoRef.current.pause();
    }
  }, [isInView]);

  // Reveal animation & Initial state for actions
  useLayoutEffect(() => {
    if (!itemRef.current || !actionsRef.current) return;

    // Reveal item
    const ctx = initProjectReveal(itemRef.current);

    // Initial state for actions overlay
    gsap.set(actionsRef.current, {
      opacity: 0,
    });

    // Initial state for text/buttons (to be animated by the other effect)
    const buttons = actionsRef.current.querySelectorAll("button, a");
    gsap.set(buttons, {
      opacity: 0,
      y: 30,
    });
    gsap.set([titleTextRef.current, categoriesTextRef.current], {
      yPercent: TEXT_HIDDEN_Y_PERCENT,
    });

    return () => ctx.revert();
  }, []);

  const introTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const outroTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPointerInsideRef = useRef(false);
  const leaveQueuedRef = useRef(false);

  const scheduleOutro = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }

    leaveTimeoutRef.current = setTimeout(() => {
      if (isPointerInsideRef.current) return;
      outroTimelineRef.current?.restart(true);
    }, 400);
  };

  // Build intro and outro timelines once
  useEffect(() => {
    if (
      !titleTextRef.current ||
      !categoriesTextRef.current ||
      !actionsRef.current
    )
      return;

    const buttons = actionsRef.current.querySelectorAll("button, a");

    const ctx = gsap.context(() => {
      const introTl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out", duration: 0.6 },
      });

      introTl
        .to(
          actionsRef.current,
          {
            opacity: 1,
            duration: 0.25,
            ease: "power2.out",
          },
          0,
        )
        .to(
          titleTextRef.current,
          {
            yPercent: 0,
          },
          0.1,
        )
        .to(
          categoriesTextRef.current,
          {
            yPercent: 0,
          },
          0.2,
        )
        .to(
          buttons,
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
          },
          0.25,
        )
        .eventCallback("onComplete", () => {
          if (leaveQueuedRef.current && !isPointerInsideRef.current) {
            leaveQueuedRef.current = false;
            scheduleOutro();
          }
        });

      const outroTl = gsap.timeline({ paused: true });

      outroTl
        .to(buttons, {
          opacity: 0,
          duration: 0.4,
          stagger: { each: 0.05, from: "end" },
          ease: "power3.in",
        })
        .to(
          titleTextRef.current,
          {
            yPercent: TEXT_HIDDEN_Y_PERCENT,
            duration: 0.45,
            ease: "power3.in",
          },
          ">",
        )
        .to(
          categoriesTextRef.current,
          {
            yPercent: TEXT_HIDDEN_Y_PERCENT,
            duration: 0.45,
            ease: "power3.in",
          },
          "<+0.04",
        )
        .to(
          actionsRef.current,
          {
            opacity: 0,
            duration: 0.2,
            ease: "power2.in",
          },
          ">-0.05",
        );

      introTimelineRef.current = introTl;
      outroTimelineRef.current = outroTl;
    });

    return () => {
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
        leaveTimeoutRef.current = null;
      }
      ctx.revert();
    };
  }, []);

  const handleMouseEnter = () => {
    isPointerInsideRef.current = true;
    leaveQueuedRef.current = false;

    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }

    if (!isInView || !introTimelineRef.current || !outroTimelineRef.current)
      return;

    outroTimelineRef.current.pause(0);
    introTimelineRef.current.restart(true);
  };

  const handleMouseLeave = () => {
    isPointerInsideRef.current = false;

    if (!isInView || !introTimelineRef.current) return;

    if (
      introTimelineRef.current.isActive() ||
      introTimelineRef.current.progress() < 1
    ) {
      leaveQueuedRef.current = true;
      return;
    }

    scheduleOutro();
  };

  // If the card leaves viewport, reset sequence to base state
  useEffect(() => {
    if (isInView || !actionsRef.current) return;

    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }

    const buttons = actionsRef.current.querySelectorAll("button, a");
    introTimelineRef.current?.pause(0);
    outroTimelineRef.current?.pause(0);
    gsap.set(actionsRef.current, { opacity: 0 });
    gsap.set(buttons, {
      opacity: 0,
      y: 30,
    });
    gsap.set([titleTextRef.current, categoriesTextRef.current], {
      yPercent: TEXT_HIDDEN_Y_PERCENT,
    });
  }, [isInView]);

  return (
    <div ref={itemRef} className="w-full">
      <div className="w-full">
        <div
          className={`relative w-full ${aspectClassName} overflow-hidden flex items-center justify-center bg-neutral-900 rounded-xl cursor-default group`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {project.video ? (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              src={videoSrc}
              muted
              playsInline
              loop={true}
              autoPlay
              preload="metadata"
            />
          ) : (
            <img
              src={project.image}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              loading="lazy"
            />
          )}

          {/* Action Overlay */}
          <div
            ref={actionsRef}
            className="absolute inset-0 bg-black/10 flex items-end justify-start p-8 z-20 pointer-events-none"
          >
            <div className="flex gap-3 pointer-events-auto">
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                <AnimatedButton
                  text="See Live"
                  padding="px-5 py-2.5"
                  baseBgColor="bg-white"
                  baseTextColor="text-black"
                  hoverBgColor="bg-black"
                  hoverTextColor="group-hover/btn:text-white"
                  hoverBorderColor="border-white"
                />
              </a>
              <a href={`/projects/${project.id}`}>
                <AnimatedButton
                  text="See Project"
                  padding="px-5 py-2.5"
                  baseBgColor="bg-transparent"
                  baseTextColor="text-white"
                  hoverBgColor="bg-white"
                  hoverTextColor="group-hover/btn:text-black"
                  hoverBorderColor="border-white"
                  showBorder={true}
                />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 text-left">
          <div className="overflow-hidden">
            <h3
              ref={titleTextRef}
              className="font-switzer uppercase text-2xl mb-2 text-white leading-tight"
            >
              {project.title}
            </h3>
          </div>
          <div className="overflow-hidden mt-1">
            <p
              ref={categoriesTextRef}
              className="font-switzer uppercase text-xs tracking-widest text-white/60 leading-tight"
            >
              {project.categories.join(" — ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectItem;
