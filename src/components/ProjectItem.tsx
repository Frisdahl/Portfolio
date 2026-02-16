import React, { useState, useRef, useEffect } from "react";
import QuoteSVG from "../assets/quote.svg";
import CursorFollower from "./CursorFollower";
import { gsap } from "gsap"; // GSAP import
import { ScrollTrigger } from "gsap/ScrollTrigger"; // ScrollTrigger import

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
}

interface ProjectItemProps {
  project: Project;
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null); // Ref for this specific image container
  const itemRef = useRef(null); // Ref for GSAP animation

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
    if (!itemRef.current) return; // Add this check

    // Create a GSAP context to manage animations, preventing conflicts
    let ctx = gsap.context(() => {
      gsap.fromTo(
        itemRef.current,
        { opacity: 0, y: 50 }, // from these values
        {
          // to these values
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: itemRef.current,
            start: "top bottom-=100", // Start animation when top of element hits 100px from bottom of viewport
            toggleActions: "play none none none", // Play once on enter
            // markers: true, // For debugging scroll trigger positions
          },
        },
      );
    }, itemRef); // <- scope the context to the component's ref

    return () => ctx.revert(); // <- revert all animations in this context on component unmount
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div ref={itemRef}>
      <div
        ref={imageRef} // Attach ref here to the individual project's image container
        className="relative w-full aspect-square overflow-hidden cursor-none bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-lg font-bold"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <img
          src={project.image}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {isHovered && (
          <CursorFollower
            x={mousePosition.x}
            y={mousePosition.y}
            isVisible={isHovered}
          />
        )}
      </div>
      <h3 className="text-2xl pt-6 font-semibold text-left text-gray-900 mb-2">
        {project.title}
      </h3>

      <div className="py-6  text-left flex-col justify-start">
        <div className="flex justify-center ">
          <div className="flex flex-col justify-center items-center pr-6">
            <img src={QuoteSVG} alt="Quote symbol" className="w-8 h-8 mb-2" />
            <div
              className="h-full w-[2px]"
              style={{ backgroundColor: "#d2d5e1" }}
            ></div>
          </div>
          <div>
            <p className="text-gray-600 mb-4 text-[1.25rem]">
              {project.description}
            </p>
            <p className="font-bold mt-4 text-base">John Doe</p>
            <p className="text-gray-500 text-sm">Project Lead</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectItem;
