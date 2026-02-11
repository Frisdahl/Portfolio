import React, { useState, useRef } from "react";
import QuoteSVG from "../assets/quote.svg";
import CursorFollower from "./CursorFollower";

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

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Use viewport coordinates for fixed positioning
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div>
      <div
        ref={imageRef} // Attach ref here to the individual project's image container
        className="relative w-full aspect-square overflow-hidden cursor-pointer bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-lg font-bold"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <img src={project.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover" />
        {/* DEBUG: Display states - Removed in final version, kept for now */}
        <div className="absolute top-0 left-0 text-xs text-red-500 bg-black bg-opacity-70 p-1">
          Hovered: {isHovered ? "true" : "false"}
          <br />
          Mouse: {mousePosition.x.toFixed(0)}, {mousePosition.y.toFixed(0)}
        </div>
        {isHovered && (
          <CursorFollower
            x={mousePosition.x}
            y={mousePosition.y}
            isVisible={isHovered}
          />
        )}
      </div>
      <h3 className="text-base pt-6 font-bold text-left text-gray-900 mb-2">
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
