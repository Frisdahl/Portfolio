import React, { useState, useRef, useEffect } from "react";
import AnimatedButton from "../../components/AnimatedButton";
import {
  initProjectParallax,
  initProjectItemAnimations,
} from "./Projects.anim";

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
  speed?: number;
  aspectClassName?: string;
}

const ProjectItem: React.FC<ProjectItemProps> = ({
  project,
  index,
  speed = 1,
  aspectClassName = "aspect-square",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isHoverPlaying, setIsHoverPlaying] = useState(false);
  const [isPreviewToggled, setIsPreviewToggled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const itemRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const titleTextRef = useRef<HTMLHeadingElement>(null);
  const categoriesTextRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  const videoSrc = project.video?.startsWith("/")
    ? project.video
    : `/${project.video}`;

  // 1. Master playback control
  useEffect(() => {
    setIsPlaying(isPreviewToggled || isHoverPlaying);
  }, [isPreviewToggled, isHoverPlaying]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsHoverPlaying(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleVideoEnded = () => {
    if (isPreviewToggled && videoRef.current) {
      videoRef.current.play().catch(() => undefined);
    } else {
      if (isHovered && videoRef.current) {
        videoRef.current.play().catch(() => undefined);
      } else {
        setIsHoverPlaying(false);
      }
    }
  };

  // 2. Parallax
  useEffect(() => {
    if (!itemRef.current || !parallaxRef.current) return;
    const ctx = initProjectParallax(itemRef.current, parallaxRef.current, speed);
    return () => ctx.revert();
  }, [speed]);

  // 3. Consolidated Animation Controller
  useEffect(() => {
    if (
      !titleTextRef.current ||
      !categoriesTextRef.current ||
      !actionsRef.current
    )
      return;

    const controller = initProjectItemAnimations(isPlaying, {
      video: videoRef.current,
      titleText: titleTextRef.current,
      categoriesText: categoriesTextRef.current,
      actions: actionsRef.current,
    });

    return () => {
      controller.revert();
    };
  }, [isPlaying]);

  const projectNumber = `00-${index + 1}`;

  return (
    <div ref={itemRef} className="w-full">
      <div ref={parallaxRef} className="w-full will-change-transform">
        <div
          className="flex justify-between items-center mb-6 font-granary uppercase tracking-wider text-base"
          style={{ color: "var(--foreground)" }}
        >
          <div style={{ color: "var(--foreground-muted)" }}>
            {projectNumber}
          </div>
          <button
            className="flex items-center gap-4 cursor-pointer group focus:outline-none z-30 relative"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const newState = !isPreviewToggled;
              setIsPreviewToggled(newState);
              if (!newState) setIsHoverPlaying(false);
            }}
          >
            <span
              className={`transition-all duration-300 ${isPlaying ? "opacity-100 font-medium" : "opacity-60 group-hover:opacity-100"}`}
            >
              PREVIEW
            </span>
            <div
              className="w-10 h-5 rounded-full border relative flex items-center px-0.5 transition-all duration-300"
              style={{
                borderColor: isPlaying ? "var(--foreground)" : "var(--divider)",
                backgroundColor: isPlaying
                  ? "var(--foreground)"
                  : "transparent",
              }}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full transition-all duration-500 ease-in-out transform ${isPlaying ? "translate-x-5" : "translate-x-0"}`}
                style={{
                  backgroundColor: isPlaying
                    ? "var(--background)"
                    : "var(--foreground)",
                  opacity: isPlaying ? 1 : 0.4,
                }}
              />
            </div>
          </button>
        </div>

        <div
          className={`relative w-full ${aspectClassName} overflow-hidden flex items-center justify-center text-gray-500 text-lg font-bold rounded-xl`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {project.video ? (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              src={videoSrc}
              muted
              playsInline
              loop={false}
              onEnded={handleVideoEnded}
              preload="metadata"
            />
          ) : (
            <img
              src={project.image}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          )}

          <div
            ref={actionsRef}
            className="absolute bottom-6 left-6 flex gap-3 z-20 pointer-events-auto"
            style={{ opacity: 0 }}
          >
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="block">
              <AnimatedButton
                text="See Live"
                padding="px-4 py-2"
                baseBgColor="bg-[var(--foreground)]"
                baseTextColor="text-[var(--background)]"
                hoverBgColor="bg-[var(--background)]"
                hoverTextColor="group-hover:text-[var(--foreground)]"
                hoverBorderColor="border-[var(--foreground)]"
                fontSize="text-[10px]"
              />
            </a>
            <a href={`/projects/${project.id}`} className="block">
              <AnimatedButton
                text="See Project"
                padding="px-4 py-2"
                baseBgColor="bg-transparent"
                baseTextColor="text-[var(--foreground)]"
                hoverBgColor="bg-[var(--foreground)]"
                hoverTextColor="group-hover:text-[var(--background)]"
                hoverBorderColor="border-[var(--foreground)]"
                fontSize="text-[10px]"
                showBorder={true}
              />
            </a>
          </div>
        </div>

        <div className="mt-6 text-left">
          <div className="overflow-hidden">
            <h3
              ref={titleTextRef}
              className="font-granary uppercase text-2xl text-[var(--foreground)] leading-tight"
            >
              {project.title}
            </h3>
          </div>
          <div className="overflow-hidden mt-1">
            <p
              ref={categoriesTextRef}
              className="font-granary uppercase text-xs tracking-widest text-[var(--foreground-muted)] opacity-80 leading-tight"
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
