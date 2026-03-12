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
  const [hasBeenHovered, setHasBeenHovered] = useState(false);
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

      // Sync this timeout with the 0.6s CSS transition duration
      setTimeout(() => {
        setFadingIndex(null);
      }, 600);
    }, 1600); // Snappier interval

    return () => clearInterval(interval);
  }, [isHovered, project.videoImages, activeIndex]);
  // GSAP Timeline Setup
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power4.out", duration: 0.9 },
      });

      // 1. Subtle Zoom on the background image
      tl.to(
        bgRef.current,
        {
          scale: 1.05,
          duration: 0.8,
          ease: "power2.out",
        },
        0,
      );

      // 2. Smoothly fade in the blur layer
      // (Overlay removed as requested)
      tl.to(
        ".blur-layer",
        {
          opacity: 1,
          duration: 0.6,
        },
        0,
      );

      // 3. Stacked Images Container
      tl.fromTo(
        imagesContainerRef.current,
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7 },
        0.05,
      );

      // 4. Masked Info Slide - No opacity changes
      const infoElements = infoRef.current?.querySelectorAll(
        ".overflow-hidden > *",
      );
      if (infoElements) {
        // Use a larger offset (130%) to clear any potential line-height or margin issues
        gsap.set(infoElements, { y: "130%" });

        tl.to(
          infoElements,
          {
            y: "0%",
            stagger: 0.05,
            duration: 0.6,
            ease: "power3.out",
          },
          0.1,
        );
      }

      tlRef.current = tl;
    }, itemRef);

    return () => ctx.revert();
  }, []);

  // Trigger Timeline on Hover
  useEffect(() => {
    if (isHovered) {
      tlRef.current?.play();
    } else {
      tlRef.current?.reverse();
    }
  }, [isHovered]);

  const handleProjectClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/projects/${project.slug}`);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!hasBeenHovered) {
      setHasBeenHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const videoImages = project.videoImages || [];

  return (
    <div
      ref={itemRef}
      className={`w-full relative group overflow-hidden rounded-[2rem] md:rounded-[2.5rem] cursor-pointer transform-gpu ${fillHeight ? "h-full flex flex-col" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleProjectClick}
    >
      {/* Background Layer */}
      <div
        ref={bgRef}
        className={`w-full h-full overflow-hidden ${fillHeight ? "" : aspectClassName}`}
        style={{
          maskImage: "-webkit-radial-gradient(white, black)", // Fixes sub-pixel rounding bleed
          WebkitMaskImage: "-webkit-radial-gradient(white, black)",
        }}
      >
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover transform-gpu scale-[1.01]" // Tiny scale to ensure no edge gaps
          loading="lazy"
        />

        {/* HIGH PERFORMANCE BLUR LAYER */}
        <div
          className="blur-layer absolute inset-0 opacity-0 pointer-events-none transform-gpu"
          style={{
            backdropFilter: "blur(12px)",
            backgroundColor: "rgba(0,0,0,0.05)", // Very subtle dark tint for text legibility
            willChange: "opacity",
          }}
        />
      </div>

      {/* Hover Info Container */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-end p-8"
      >
        {/* Project Info */}
        <div ref={infoRef} className="flex flex-col items-start text-left">
          <div className="overflow-hidden">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-300 mb-0 leading-none pb-2">
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
        className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center"
        style={{
          transformOrigin: "center center",
          opacity: 0,
        }}
      >
        <div className="relative w-[60%] aspect-[16/9] flex items-center justify-center">
          {hasBeenHovered &&
            videoImages.map((src, i) => {
              const stackPos =
                (i - activeIndex + videoImages.length) % videoImages.length;

              const isFadingOut = i === fadingIndex;

              // Show top 3 images normally, plus the one currently fading out in front
              if (stackPos > 2 && !isFadingOut) return null;

              // If it's fading out, keep it at 'front' visually (visualPos 0)
              const visualPos = isFadingOut ? 0 : stackPos;
              const zIndex = isFadingOut ? 40 : 30 - stackPos;

              // Tighter scale and larger translation to ensure all 3 layers are visible
              // 1.0 (front), 0.9 (middle), 0.8 (back)
              const scale = 1 - visualPos * 0.1;
              const opacity = isFadingOut ? 0 : 1;

              // More aggressive translation to clear the height of the images in front
              const translateY = visualPos * -85;

              // UNIFIED TRANSITION - Speed up to 0.6s
              let transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";

              if (isFadingOut) {
                transition = "opacity 0.4s ease-out, transform 0.4s ease-out";
              } else if (stackPos === 2 && fadingIndex === null) {
                transition =
                  "opacity 0.6s ease-in, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
              }

              // Dynamic shadow to help with depth perception
              const shadowIntensity = (1 - visualPos * 0.3) * 0.4;
              const shadowBlur = (1 - visualPos * 0.3) * 30;

              return (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="absolute object-contain rounded-2xl"
                  style={{
                    width: "100%",
                    height: "100%",
                    zIndex: zIndex,
                    opacity: opacity,
                    transform: `translate3d(0, ${translateY}px, 0)`,
                    scale: `${scale}`,
                    boxShadow:
                      visualPos === 0
                        ? `0 ${shadowBlur}px 60px -12px rgba(0,0,0,${shadowIntensity})`
                        : "none",
                    transition: transition,
                    willChange: isHovered
                      ? "transform, scale, opacity"
                      : "auto",
                    transformOrigin: "bottom center", // Anchor at bottom so they peek out the top
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
