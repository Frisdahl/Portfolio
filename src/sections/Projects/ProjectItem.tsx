import React, { useRef, useLayoutEffect, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { showComingSoon } from "../../utils/comingSoon";

interface Project {
  id: number;
  title: string;
  description?: string;
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
  fillHeight?: boolean;
}

const ProjectItem: React.FC<ProjectItemProps> = ({
  project,
  fillHeight = false,
  aspectClassName = "aspect-square",
}) => {
  const navigate = useNavigate();
  const [isInView, setIsInView] = React.useState(false);

  const itemRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoOverlayRef = useRef<HTMLDivElement>(null); // New ref for the dark video overlay
  const contentOverlayRef = useRef<HTMLDivElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const descContainerRef = useRef<HTMLDivElement>(null);

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
      { rootMargin: "400px" }, // Load early for smoother experience
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [project.video]);

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

  useLayoutEffect(() => {
    if (!itemRef.current) return;

    gsap.set(contentOverlayRef.current, { opacity: 0 });
    gsap.set([titleContainerRef.current, descContainerRef.current], {
      y: 30,
      opacity: 0,
    });

    return () => {};
  }, []);

  const handleMouseEnter = () => {
    // Play video
    if (videoRef.current) {
      videoRef.current.play().catch(() => undefined);
    }

    // Fade out dark video overlay
    if (videoOverlayRef.current) {
      gsap.to(videoOverlayRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
      });
    }

    // Show content capsules
    if (contentOverlayRef.current) {
      gsap.to(contentOverlayRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });

      gsap.to([titleContainerRef.current, descContainerRef.current], {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.08,
        ease: "power4.out",
        delay: 0.05,
      });
    }
  };

  const handleMouseLeave = () => {
    // Pause video
    if (videoRef.current) {
      videoRef.current.pause();
    }

    // Fade in dark video overlay
    if (videoOverlayRef.current) {
      gsap.to(videoOverlayRef.current, {
        opacity: 1,
        duration: 0.6,
        ease: "power2.inOut",
      });
    }

    // Hide content capsules
    if (contentOverlayRef.current) {
      gsap.to([descContainerRef.current, titleContainerRef.current], {
        y: 15,
        opacity: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.in",
      });

      gsap.to(contentOverlayRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
        delay: 0.2,
      });
    }
  };

  return (
    <div
      ref={itemRef}
      className={`w-full cursor-pointer group ${fillHeight ? "h-full flex flex-col" : ""}`}
      onClick={handleProjectClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`relative w-full overflow-hidden rounded-2xl bg-neutral-900 ${fillHeight ? "h-full" : aspectClassName}`}
      >
        {project.video && isInView ? (
          <>
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              muted
              playsInline
              loop={true}
              preload="metadata"
            >
              <source src={videoSrc} type="video/mp4" />
              <source
                src={videoSrc.replace(".mp4", ".webm")}
                type="video/webm"
              />
            </video>
            {/* Dark Video Overlay */}
            <div
              ref={videoOverlayRef}
              className="absolute inset-0 bg-black/20 z-10 pointer-events-none transition-transform duration-1000 group-hover:scale-105"
            />
          </>
        ) : !project.video ? (
          <>
            <img
              src={project.image}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              loading="lazy"
            />
            {/* Dark Image Overlay */}
            <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none transition-opacity duration-700 group-hover:opacity-0" />
          </>
        ) : (
          <div className="absolute inset-0 bg-neutral-900 animate-pulse" />
        )}

        {/* Dual Capsule Overlay */}
        <div
          ref={contentOverlayRef}
          className="absolute inset-0 flex items-end justify-start p-6 md:p-8 z-20 pointer-events-none"
        >
          <div className="flex flex-wrap items-center gap-3 w-full">
            {/* Title Capsule - Dark Glass */}
            <div
              ref={titleContainerRef}
              className="backdrop-blur-md bg-black/50 border border-white/10 px-5 py-3 rounded-full flex items-center gap-3 shadow-2xl"
            >
              <div className="w-2 h-2 rounded-full bg-white flex-shrink-0 animate-pulse-fast" />
              <h3 className="font-switzer font-medium uppercase text-sm md:text-base text-white tracking-wider leading-none">
                {project.title}
              </h3>
            </div>

            {/* Description Capsule - White Glass */}
            <div
              ref={descContainerRef}
              className="backdrop-blur-md bg-white/20 border border-white/30 px-5 py-3 rounded-full shadow-2xl"
            >
              <p className="font-switzer uppercase text-[10px] md:text-[11px] font-medium tracking-[0.15em] text-white/90 leading-none">
                {project.categories.join(" — ")}
              </p>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes pulse-fast {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .animate-pulse-fast {
          animation: pulse-fast 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default ProjectItem;
