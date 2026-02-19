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
  const [isPlaying, setIsPlaying] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null); // Ref for this specific image container
  const itemRef = useRef(null); // Ref for GSAP animation
  const parallaxRef = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const getVideoSrc = (src?: string) => {
    if (!src) return undefined;
    // Ensure the path starts with a single /
    return src.startsWith("/") ? src : `/${src}`;
  };

  const videoSrc = getVideoSrc(project.video);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    if (!itemRef.current) return;

    let ctx = gsap.context(() => {
      // Parallax effect
      if (parallaxRef.current) {
        gsap.to(parallaxRef.current, {
          y: (i, target) => -((speed - 1) * 400), // Reduced multiplier from 1000 to 400
          ease: "none",
          scrollTrigger: {
            trigger: itemRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Initial fade-in
      gsap.fromTo(
        itemRef.current,
        { opacity: 100, y: 50 },
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isHovered) {
      setIsPlaying(true);
      video.play().catch(() => undefined);
    }
  }, [isHovered]);

  const handleVideoEnded = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!isHovered) {
      video.pause();
      video.currentTime = 0;
      setIsPlaying(false);
    } else {
      video.play().catch(() => undefined);
    }
  };

  const titleRevealRef = useRef<HTMLDivElement>(null);
  const categoriesRevealRef = useRef<HTMLDivElement>(null);
  const titleTextRef = useRef<HTMLHeadingElement>(null);
  const categoriesTextRef = useRef<HTMLParagraphElement>(null);

  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (
      !titleRevealRef.current ||
      !categoriesRevealRef.current ||
      !titleTextRef.current ||
      !categoriesTextRef.current
    )
      return;

    if (isPlaying) {
      if (tlRef.current) tlRef.current.kill();
      
      const tl = gsap.timeline();
      tlRef.current = tl;

      // Initial state
      tl.set([titleTextRef.current, categoriesTextRef.current], {
        opacity: 0,
        y: "0%",
      })
      .set([titleRevealRef.current, categoriesRevealRef.current], {
        x: "100%",
      })
      // Title Animation
      .to(titleRevealRef.current, {
        x: "0%",
        duration: 0.4,
        ease: "power2.inOut",
      })
      .set(titleTextRef.current, { opacity: 1 })
      .to(titleRevealRef.current, {
        x: "-105%", // Increased to -105% to ensure it's fully hidden
        duration: 0.4,
        ease: "power2.inOut",
      })
      // Categories Animation
      .to(
        categoriesRevealRef.current,
        {
          x: "0%",
          duration: 0.4,
          ease: "power2.inOut",
        },
        "-=0.2",
      )
      .set(categoriesTextRef.current, { opacity: 1 })
      .to(categoriesRevealRef.current, {
        x: "-105%", // Increased to -105% to ensure it's fully hidden
        duration: 0.4,
        ease: "power2.inOut",
      });
    } else {
      // Exit animation: slide down and fade out
      gsap.to([titleTextRef.current, categoriesTextRef.current], {
        y: "150%",
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
        stagger: 0.05,
      });
    }
  }, [isPlaying]);

  const projectNumber = `00-${index + 1}`;

  return (
    <div ref={itemRef} className="w-full">
      <div ref={parallaxRef} className="w-full">
        {/* Top Header */}
        <div
          className="flex justify-between items-center mb-6 font-granary uppercase tracking-wider text-base"
          style={{ color: "var(--foreground)" }}
        >
          <div style={{ color: "var(--foreground-muted)" }}>
            {projectNumber}
          </div>
          <div className="flex items-center gap-4">
            <span className="opacity-60">PREVIEW</span>
            <div
              className="w-10 h-5 rounded-full border relative flex items-center px-0.5 transition-colors duration-300"
              style={{ borderColor: "var(--divider)" }}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full transition-all duration-700 ease-in-out transform ${
                  isPlaying ? "translate-x-5" : "translate-x-0 opacity-40"
                }`}
                style={{ backgroundColor: "var(--foreground)" }}
              ></div>
            </div>
          </div>
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
              preload="auto"
              onEnded={handleVideoEnded}
            />
          ) : (
            <img
              src={project.image}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </div>

        {/* Project Info Underneath */}
        <div className="mt-4 text-left">
          <div className="relative inline-block overflow-hidden py-1">
            <h3
              ref={titleTextRef}
              className="font-granary uppercase text-2xl mb-1 text-[var(--foreground)] leading-tight opacity-0"
            >
              {project.title}
            </h3>
            <div
              ref={titleRevealRef}
              className="absolute inset-0 bg-[#606060] translate-x-full z-10"
            />
          </div>
          <br />
          <div className="relative inline-block overflow-hidden py-1">
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
