import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { showComingSoon } from "../../utils/comingSoon";
import Marquee from "../../components/Marquee";
import ArrowIcon from "../../components/ArrowIcon";

interface Project {
  id: number;
  title: string;
  description?: string;
  categories: string[];
  image: string;
  video?: string;
  link: string;
  year?: string;
  tags?: string[];
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
  const itemRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
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

  useLayoutEffect(() => {
    if (arrowRef.current) {
      gsap.set(arrowRef.current, { x: -35, opacity: 0 });
    }
    if (titleContainerRef.current) {
      gsap.set(titleContainerRef.current, { x: 0 });
    }
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

  const handleMouseEnter = () => {
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.play().catch(() => undefined);
    }

    if (arrowRef.current && titleContainerRef.current) {
      gsap.to(arrowRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power4.inOut",
        overwrite: "auto",
      });
      gsap.to(titleContainerRef.current, {
        x: 35,
        duration: 0.6,
        ease: "power4.inOut",
        overwrite: "auto",
      });
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      pauseTimeoutRef.current = setTimeout(() => {
        video.pause();
      }, 120);
    }

    if (arrowRef.current && titleContainerRef.current) {
      gsap.to(arrowRef.current, {
        x: -35,
        opacity: 0,
        duration: 0.5,
        ease: "power4.inOut",
        overwrite: "auto",
      });
      gsap.to(titleContainerRef.current, {
        x: 0,
        duration: 0.5,
        ease: "power4.inOut",
        overwrite: "auto",
      });
    }
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
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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

        {/* Marquee at the bottom of the video */}
        <div className="absolute bottom-0 left-0 w-full bg-[#1c1d1e] py-3 z-20 overflow-hidden">
          {/* Side Fades */}
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#1c1d1e] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#1c1d1e] to-transparent z-10 pointer-events-none" />

          <Marquee
            text={`${project.categories.join(' <span class="inline-block scale-[2.2] mx-3 text-white">•</span> ')} <span class="inline-block scale-[2.2] mx-3 text-white">•</span> `}
            speed={0.3}
            repeat={12}
            paddingRight={0}
            direction={-1}
            itemClassName="text-[10px] md:text-xs uppercase tracking-[0.2em] font-light pr-4 text-white opacity-100 flex items-center"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-1 w-full text-[#1c1d1e]">
        {/* Row 1: Title (left) | Year (right) */}
        <div className="flex items-end justify-between w-full">
          <div
            className="relative flex items-center h-8 md:h-10 cursor-pointer overflow-hidden pr-12"
            onClick={handleProjectClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              ref={arrowRef}
              className="absolute left-0 opacity-0 pointer-events-none flex items-center z-10 will-change-[transform,opacity]"
            >
              <ArrowIcon className="w-5 h-5 md:w-6 md:h-6 text-[#1c1d1e]" />
            </div>

            <div ref={titleContainerRef} className="will-change-transform">
              <h3 className="font-aeonik text-2xl md:text-3xl text-[#1c1d1e] font-medium leading-tight tracking-tight whitespace-nowrap uppercase">
                {project.title}
              </h3>
            </div>
          </div>

          <div className="pb-1 md:pb-1.5 md:pr-4">
            <span className="font-aeonik text-sm md:text-base font-regular uppercase tracking-widest text-[#1c1d1e]">
              {project.year || "2024"}
            </span>
          </div>
        </div>

        {/* Row 2: Tags (Plain text) */}
        <div className="flex items-center gap-2 opacity-60">
          <p className=" md:text-sm font-medium uppercase tracking-[0.15em]">
            {project.tags?.join(" • ")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectItem;
