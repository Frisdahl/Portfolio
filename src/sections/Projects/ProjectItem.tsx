import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import type { Project } from "../../types/project";

interface ProjectItemProps {
  project: Project;
  index: number;
  speed?: number;
  aspectClassName?: string;
  fillHeight?: boolean;
}

const ProjectItem: React.FC<ProjectItemProps> = ({
  project,
  fillHeight = false,
  aspectClassName = "aspect-square",
}) => {
  const navigate = useNavigate();
  const [isInView, setIsInView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasPrewarmedRef = useRef(false);

  useEffect(() => {
    const el = itemRef.current;
    if (!el || !project.video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [project.video]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !project.video || !isInView || hasPrewarmedRef.current)
      return;

    hasPrewarmedRef.current = true;

    const prewarm = async () => {
      try {
        video.currentTime = 0;
        await video.play();
        video.pause();
      } catch {
        // Ignore prewarm failures
      }
    };

    prewarm();
  }, [isInView, project.video]);

  // Smoother Cursor Trail
  useEffect(() => {
    if (!isHovered || !cursorRef.current || !itemRef.current) return;

    const cursor = cursorRef.current;
    const item = itemRef.current;

    const onMouseMove = (e: MouseEvent) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      gsap.to(cursor, {
        x,
        y,
        duration: 0.5, // Increased for a more viscous, premium feel
        ease: "power4.out",
        overwrite: "auto",
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [isHovered]);

  // GSAP Timeline Setup
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Using Power4 for that high-end motion design feel
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power4.out", duration: 0.9 },
      });

      // 1. Background Blur & Subtle Zoom (Power2 for background to keep it calm)
      tl.to(
        bgRef.current,
        {
          filter: "blur(15px)",
          scale: 1.15,
          duration: 1.1,
          ease: "power2.out",
        },
        0,
      );

      // 2. Dark Overlay
      tl.to(
        overlayRef.current,
        {
          opacity: 1,
          duration: 0.7,
        },
        0,
      );

      // 3. Tags & Trailer - More overlapping for fluidity
      tl.fromTo(
        tagsRef.current,
        { y: -25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        0.05,
      ).fromTo(
        videoContainerRef.current,
        { scale: 0.45, opacity: 0 },
        { scale: 0.6, opacity: 1, duration: 0.85 },
        0.05,
      );

      // 4. Masked Info Slide - Minimal stagger
      const infoElements = infoRef.current?.querySelectorAll(
        ".overflow-hidden > *",
      );
      if (infoElements) {
        tl.fromTo(
          infoElements,
          { y: "105%" },
          { y: "0%", stagger: 0.04, duration: 0.8 },
          0.12,
        );
      }

      // 5. Cursor Entrance - Perfectly timed to arrive with the rest
      tl.fromTo(
        cursorRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1.5)",
        },
        0.35,
      );

      tlRef.current = tl;
    }, itemRef);

    return () => ctx.revert();
  }, []);

  // Trigger Timeline on Hover
  useEffect(() => {
    if (isHovered) {
      tlRef.current?.timeScale(1).play();
    } else {
      // Balanced exit speed - snappy but smooth
      tlRef.current?.timeScale(1.3).reverse();
    }
  }, [isHovered]);

  const handleProjectClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/projects/${project.slug}`);
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    setIsHovered(true);

    if (cursorRef.current && itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      gsap.set(cursorRef.current, {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        xPercent: -50,
        yPercent: -50,
      });
    }

    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.play().catch(() => undefined);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!videoRef.current) return;
    const video = videoRef.current;
    pauseTimeoutRef.current = setTimeout(() => {
      video.pause();
    }, 200);
  };

  const videoSrc = project.video?.startsWith("/")
    ? project.video
    : `/${project.video}`;

  return (
    <div
      ref={itemRef}
      className={`w-full relative group overflow-hidden rounded-[1.5rem] md:rounded-xl cursor-pointer ${fillHeight ? "h-full flex flex-col" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleProjectClick}
    >
      {/* Interactive Cursor Follower */}
      <div
        ref={cursorRef}
        className="pointer-events-none absolute left-0 top-0 z-50 opacity-0 flex items-center justify-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl"
        style={{
          willChange: "transform",
        }}
      >
        <span className="text-white text-sm font-cabinet font-medium uppercase tracking-widest whitespace-nowrap">
          See Case
        </span>
      </div>

      {/* Background Layer */}
      <div
        ref={bgRef}
        className={`w-full h-full overflow-hidden bg-neutral-200 ${fillHeight ? "" : aspectClassName}`}
        style={{ willChange: "filter, transform" }}
      >
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
          style={{ imageRendering: "-webkit-optimize-contrast" }}
          loading="lazy"
        />
      </div>

      {/* Hover Overlay Container */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-30 opacity-0 pointer-events-none flex flex-col justify-end p-8"
        style={{
          background:
            "radial-gradient(circle at center, rgba(13, 13, 13, 0.4) 0%, rgba(13, 13, 13, 0.8) 100%)",
        }}
      >
        {/* Project Info - Bottom Aligned with slide animation */}
        <div ref={infoRef} className="flex flex-col items-start text-left">
          <div className="overflow-hidden">
            <p className="text-xs uppercase tracking-[0.3em] text-white/70 mb-2 transition-transform duration-500 ease-out translate-y-full group-hover:translate-y-0 delay-75">
              {project.projectType}
            </p>
          </div>
          <div className="overflow-hidden">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-cabinet font-medium text-white uppercase leading-none transition-transform duration-500 ease-out translate-y-full group-hover:translate-y-0 delay-150">
              {project.title}
            </h3>
          </div>
        </div>
      </div>

      {/* Center: Video Trailer Container */}
      <div
        ref={videoContainerRef}
        className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center overflow-hidden"
        style={{
          transformOrigin: "center center",
          opacity: 0,
        }}
      >
        {project.video && isInView && (
          <video
            ref={videoRef}
            className="w-full h-full max-h-[70%] object-contain will-change-transform"
            muted
            playsInline
            loop={true}
            preload="metadata"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}
      </div>
    </div>
  );
};

export default ProjectItem;
