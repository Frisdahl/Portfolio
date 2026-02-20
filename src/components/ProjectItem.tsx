import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap"; // GSAP import
import { ScrollTrigger } from "gsap/ScrollTrigger"; // ScrollTrigger import

gsap.registerPlugin(ScrollTrigger);

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
  const [isPreviewToggled, setIsPreviewToggled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef(null);
  const parallaxRef = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const titleRevealRef = useRef<HTMLDivElement>(null);
  const categoriesRevealRef = useRef<HTMLDivElement>(null);
  const titleTextRef = useRef<HTMLHeadingElement>(null);
  const categoriesTextRef = useRef<HTMLParagraphElement>(null);

  const getVideoSrc = (src?: string) => {
    if (!src) return undefined;
    return src.startsWith("/") ? src : `/${src}`;
  };

  const videoSrc = getVideoSrc(project.video);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Master playback control
  useEffect(() => {
    if (isHovered || isPreviewToggled) {
      setIsPlaying(true);
    } else if (!videoSrc) {
      // Immediate stop if no video
      setIsPlaying(false);
    }
    // If there is a video, we let handleVideoEnded manage the stop
  }, [isHovered, isPreviewToggled, videoSrc]);

  const handleVideoEnded = () => {
    if (isHovered || isPreviewToggled) {
      videoRef.current?.play().catch(() => undefined);
    } else {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (!itemRef.current) return;

    let ctx = gsap.context(() => {
      if (parallaxRef.current) {
        gsap.to(parallaxRef.current, {
          y: (i, target) => -((speed - 1) * 400),
          ease: "none",
          scrollTrigger: {
            trigger: itemRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      gsap.fromTo(
        itemRef.current,
        { opacity: 1, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: itemRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none",
          },
        },
      );
    }, itemRef);

    return () => ctx.revert();
  }, [speed]);

  // Consolidated Video and Animation Logic
  useEffect(() => {
    const video = videoRef.current;
    const titleText = titleTextRef.current;
    const categoriesText = categoriesTextRef.current;
    const titleReveal = titleRevealRef.current;
    const categoriesReveal = categoriesRevealRef.current;

    if (!titleText || !categoriesText || !titleReveal || !categoriesReveal)
      return;

    // Kill any stray animations on these specific elements before starting new ones
    gsap.killTweensOf([
      titleText,
      categoriesText,
      titleReveal,
      categoriesReveal,
    ]);
    if (tlRef.current) tlRef.current.kill();

    if (isPlaying) {
      // Handle Video Playback
      if (video) {
        video.play().catch(() => undefined);
      }

      // Create a new timeline
      const tl = gsap.timeline({
        repeat: isPreviewToggled ? -1 : 0,
        repeatDelay: 3,
      });
      tlRef.current = tl;

      // Reset to initial state immediately
      tl.set([titleText, categoriesText], { opacity: 0, y: "0%", x: "0%" })
        .set([titleReveal, categoriesReveal], { x: "100%" })

        // Sequential Entry
        .to(titleReveal, {
          x: "0%",
          duration: 0.4,
          ease: "power2.inOut",
        })
        .set(titleText, { opacity: 1 })
        .to(titleReveal, {
          x: "-105%",
          duration: 0.4,
          ease: "power2.inOut",
        })

        // Categories reveal sequence
        .to(categoriesReveal, {
          x: "0%",
          duration: 0.4,
          ease: "power2.inOut",
        })
        .set(categoriesText, { opacity: 1 })
        .to(categoriesReveal, {
          x: "-105%",
          duration: 0.4,
          ease: "power2.inOut",
        });
    } else {
      // Handle Video Stop
      if (video) {
        video.pause();
        video.currentTime = 0;
      }

      // Sequential Exit: Title first, then categories
      // Ensure text is visible for the cover animation if it was already showing
      const exitTl = gsap.timeline();

      exitTl
        .set([titleReveal, categoriesReveal], { x: "100%" })
        // 1. Cover Title
        .to(titleReveal, {
          x: "0%",
          duration: 0.3,
          ease: "power2.inOut",
        })
        // 2. Slide Title Out Left
        .to([titleReveal, titleText], {
          x: "-105%",
          duration: 0.3,
          ease: "power2.in",
        })
        // 3. Cover Categories
        .to(
          categoriesReveal,
          {
            x: "0%",
            duration: 0.3,
            ease: "power2.inOut",
          },
          "-=0.1",
        )
        // 4. Slide Categories Out Left
        .to([categoriesReveal, categoriesText], {
          x: "-105%",
          duration: 0.3,
          ease: "power2.in",
        })
        .set([titleText, categoriesText], { opacity: 0, x: "0%" })
        .set([titleReveal, categoriesReveal], { x: "100%" });
    }

    return () => {
      if (tlRef.current) tlRef.current.kill();
    };
  }, [isPlaying, isPreviewToggled]);

  const projectNumber = `00-${index + 1}`;

  return (
    <div ref={itemRef} className="w-full">
      <div ref={parallaxRef} className="w-full will-change-transform">
        {/* Top Header */}
        <div
          className="flex justify-between items-center mb-6 font-granary uppercase tracking-wider text-base"
          style={{ color: "var(--foreground)" }}
        >
          <div style={{ color: "var(--foreground-muted)" }}>
            {projectNumber}
          </div>
          <button
            className="flex items-center gap-4 cursor-pointer group focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              setIsPreviewToggled(!isPreviewToggled);
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
                className={`w-3.5 h-3.5 rounded-full transition-all duration-500 ease-in-out transform ${
                  isPlaying ? "translate-x-5" : "translate-x-0"
                }`}
                style={{
                  backgroundColor: isPlaying
                    ? "var(--background)"
                    : "var(--foreground)",
                  opacity: isPlaying ? 1 : 0.4,
                }}
              ></div>
            </div>
          </button>
        </div>

        <div
          ref={imageRef}
          className={`relative w-full ${aspectClassName} overflow-hidden flex items-center justify-center text-gray-500 text-lg font-bold rounded-md`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {videoSrc ? (
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
        </div>

        {/* Project Info Underneath */}
        <div className="mt-6 text-left">
          <div className="relative inline-block overflow-hidden">
            <h3
              ref={titleTextRef}
              className="font-granary uppercase text-2xl text-[var(--foreground)] leading-tight opacity-0"
            >
              {project.title}
            </h3>
            <div
              ref={titleRevealRef}
              className="absolute inset-0 bg-[#606060] translate-x-full z-10"
            />
          </div>
          <br />
          <div className="relative inline-block overflow-hidden">
            <p
              ref={categoriesTextRef}
              className="font-granary uppercase text-xs tracking-widest text-[var(--foreground-muted)] opacity-80 leading-tight opacity-0"
            >
              {project.categories.join(" — ")}
            </p>
            <div
              ref={categoriesRevealRef}
              className="absolute inset-0 bg-[#606060] translate-x-full z-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectItem;
