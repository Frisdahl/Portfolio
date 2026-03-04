import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showComingSoon } from "../../utils/comingSoon";

export interface Project {
  id: number;
  title: string;
  description?: string;
  projectType: "Mobile Application" | "Website" | "Prototype";
  image: string;
  video?: string;
  link: string;
  year?: string;
  tags: string[];
}

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
  const [showTagPills, setShowTagPills] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
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
        // Ignore if browser blocks prewarm play; hover play still works.
      }
    };

    prewarm();
  }, [isInView, project.video]);

  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, []);

  const handleProjectClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (project.link && project.link !== "#" && project.link !== "") {
      if (project.link.startsWith("http")) {
        window.open(project.link, "_blank", "noopener,noreferrer");
      } else {
        navigate(project.link);
      }
      return;
    }

    showComingSoon();
  };

  const videoSrc = project.video?.startsWith("/")
    ? project.video
    : `/${project.video}`;

  const handleMediaMouseEnter = () => {
    setShowTagPills(true);

    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.play().catch(() => undefined);
    }
  };

  const handleMediaMouseLeave = () => {
    setShowTagPills(false);

    if (!videoRef.current) return;

    const video = videoRef.current;
    pauseTimeoutRef.current = setTimeout(() => {
      video.pause();
    }, 120);
  };

  const handleTitleMouseEnter = () => {
    setShowTagPills(true);
  };

  const handleTitleMouseLeave = () => {
    setShowTagPills(false);
  };

  return (
    <div
      ref={itemRef}
      className={`w-full group ${fillHeight ? "h-full flex flex-col" : ""}`}
    >
      {/* Media Container - Clickable and Hoverable */}
      <div
        className={`relative w-full overflow-hidden rounded-[1.5rem] md:rounded-xl cursor-pointer transform translate-z-0 ${fillHeight ? "h-full" : aspectClassName}`}
        onClick={handleProjectClick}
        onMouseEnter={handleMediaMouseEnter}
        onMouseLeave={handleMediaMouseLeave}
      >
        {project.video && isInView ? (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            playsInline
            loop={true}
            preload="metadata"
            disablePictureInPicture
          >
            <source src={videoSrc} type="video/mp4" />
            <source src={videoSrc.replace(".mp4", ".webm")} type="video/webm" />
          </video>
        ) : !project.video ? (
          <img
            src={project.image}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-900 animate-pulse" />
        )}

        <div className="absolute left-6 bottom-6 z-20 flex flex-wrap gap-2 pointer-events-none">
          {project.tags.map((tag, index) => (
            <span
              key={`${project.id}-${tag}`}
              className={`px-3 py-1 rounded-md bg-white/20 backdrop-blur-xl [backdrop-filter:saturate(150%)_blur(16px)] shadow-[0_6px_24px_rgba(0,0,0,0.22)] text-white text-[10px] md:text-xs font-medium uppercase tracking-[0.12em] transition-[opacity,transform,filter] duration-300 ease-out ${
                showTagPills
                  ? "opacity-100 translate-x-0 blur-0"
                  : "opacity-0 -translate-x-4 blur-sm"
              }`}
              style={{ transitionDelay: `${showTagPills ? index * 50 : 0}ms` }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-1 w-full text-[#1b1b1a]">
        <div className="flex items-start justify-between w-full">
          <div
            className="relative cursor-pointer overflow-hidden"
            onClick={handleProjectClick}
            onMouseEnter={handleTitleMouseEnter}
            onMouseLeave={handleTitleMouseLeave}
          >
            <div className="flex flex-col items-start">
              <h3 className="font-aeonik text-2xl md:text-2xl text-[#1b1b1a] font-medium leading-tight tracking-tight whitespace-nowrap capitalize">
                {project.title}
              </h3>
              <span className="font-aeonik text-xs md:text-sm font-thin uppercase tracking-[0.16em] text-black mt-1">
                {project.projectType}
              </span>
            </div>
          </div>

          <div className="pb-1 md:pb-1.5 md:pr-4">
            <span className="font-aeonik text-2xl md:text-2xl text-[#1b1b1a] font-medium leading-tight tracking-tight whitespace-nowrap capitalize">
              {project.year || "2024"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectItem;
