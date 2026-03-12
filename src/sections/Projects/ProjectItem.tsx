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
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [fadingIndex, setFadingIndex] = useState<number | null>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const imagesContainerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Carousel loop
  useEffect(() => {
    if (!isHovered || !project.videoImages || project.videoImages.length === 0)
      return;

    const interval = setInterval(() => {
      setFadingIndex(activeIndex);
      setActiveIndex((prev) => (prev + 1) % project.videoImages!.length);
      
      // Reset fading state after the fade duration
      setTimeout(() => {
        setFadingIndex(null);
      }, 600);
    }, 2000);

    return () => clearInterval(interval);
  }, [isHovered, project.videoImages, activeIndex]);

  // GSAP Timeline Setup
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power4.out", duration: 0.9 },
      });

      // 1. Background Blur & Subtle Zoom
      tl.to(
        bgRef.current,
        {
          filter: "blur(15px)",
          scale: 1.1,
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

      // 3. Stacked Images Container
      tl.fromTo(
        imagesContainerRef.current,
        { scale: 0.45, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.85 },
        0.05,
      );

      // 4. Masked Info Slide
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

      tlRef.current = tl;
    }, itemRef);

    return () => ctx.revert();
  }, []);

  // Trigger Timeline on Hover
  useEffect(() => {
    if (isHovered) {
      tlRef.current?.timeScale(1).play();
    } else {
      tlRef.current?.timeScale(1.3).reverse();
    }
  }, [isHovered]);

  const handleProjectClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/projects/${project.slug}`);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const videoImages = project.videoImages || [];

  return (
    <div
      ref={itemRef}
      className={`w-full relative group overflow-hidden rounded-[2rem] md:rounded-[2.5rem] cursor-pointer ${fillHeight ? "h-full flex flex-col" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleProjectClick}
    >
      {/* Background Layer */}
      <div
        ref={bgRef}
        className={`w-full h-full overflow-hidden bg-neutral-200 ${fillHeight ? "" : aspectClassName}`}
        style={{ willChange: "filter, transform" }}
      >
        <img
          src={project.thumbnail}
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
        {/* Project Info */}
        <div ref={infoRef} className="flex flex-col items-start text-left">
          <div className="overflow-hidden">
            <p className="text-xs uppercase tracking-[0.3em] text-white/70 mb-2">
              {project.projectType}
            </p>
          </div>
          <div className="overflow-hidden">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-cabinet font-medium text-white uppercase leading-none">
              {project.title}
            </h3>
          </div>
        </div>
      </div>

      {/* Center: Stacked Images Container */}
      <div
        ref={imagesContainerRef}
        className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center overflow-hidden"
        style={{
          transformOrigin: "center center",
          opacity: 0,
        }}
      >
        <div className="relative w-[60%] aspect-[16/9] flex items-center justify-center">
          {videoImages.map((src, i) => {
            const stackPos =
              (i - activeIndex + videoImages.length) % videoImages.length;

            const isFadingOut = i === fadingIndex;

            // Show top 3 images normally, plus the one currently fading out in front
            if (stackPos > 2 && !isFadingOut) return null;

            // If it's fading out, keep it at 'front' visually (visualPos 0)
            const visualPos = isFadingOut ? 0 : stackPos;
            const zIndex = isFadingOut ? 40 : 30 - stackPos;
            const scale = 1 - visualPos * 0.1;
            const opacity = isFadingOut ? 0 : 1; 
            const translateY = visualPos * -45;
            const blur = visualPos * 3;

            // Determine transition:
            // - If fading out: only transition opacity
            // - If it just finished fading out and is now at the back: snap instantly (no transition)
            // - Otherwise: smooth slide forward
            let transition = "all 1.2s cubic-bezier(0.7, 0, 0.3, 1)";
            if (isFadingOut) {
              transition = "opacity 0.6s ease-out";
            } else if (stackPos === 2 && fadingIndex === null) {
              transition = "none";
            }

            return (
              <img
                key={src}
                src={src}
                alt=""
                className="absolute object-contain rounded-2xl shadow-2xl"
                style={{
                  width: "100%",
                  height: "100%",
                  zIndex: zIndex,
                  opacity: opacity,
                  transform: `translateY(${translateY}px) scale(${scale})`,
                  filter: `blur(${blur}px)`,
                  transition: transition,
                  willChange: "transform, opacity, filter",
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectItem;
