import React, { useState, useRef, useEffect } from "react";
import CursorFollower from "./CursorFollower";
import { gsap } from "gsap"; // GSAP import
import { ScrollTrigger } from "gsap/ScrollTrigger"; // ScrollTrigger import

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
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
  const [isPreviewOn, setIsPreviewOn] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null); // Ref for this specific image container
  const itemRef = useRef(null); // Ref for GSAP animation
  const parallaxRef = useRef(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
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
            <button
              onClick={() => setIsPreviewOn(!isPreviewOn)}
              className="w-10 h-5 rounded-full border relative flex items-center px-0.5 cursor-pointer transition-colors duration-300"
              style={{ borderColor: "var(--divider)" }}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full transition-all duration-300 transform ${
                  isPreviewOn ? "translate-x-5" : "translate-x-0 opacity-40"
                }`}
                style={{ backgroundColor: "var(--foreground)" }}
              ></div>
            </button>
          </div>
        </div>

        <div
          ref={imageRef}
          className={`relative w-full ${aspectClassName} overflow-hidden cursor-none flex items-center justify-center text-gray-500 text-lg font-bold`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          <img
            src={project.image}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover rounded-md"
          />

          {isHovered && (
            <CursorFollower
              x={mousePosition.x}
              y={mousePosition.y}
              isVisible={isHovered}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectItem;
