import React, { useLayoutEffect, useRef } from "react";
import ProjectItem from "./ProjectItem";
import type { Project } from "./ProjectItem";
import { initGridAnimations } from "./Projects.anim";

const projects: Project[] = [
  {
    id: 1,
    title: "NordWear",
    projectType: "Website",
    image: "/images/Bang&Olufsen.webp",
    video: "/projectVideos/NordWear/NordWear-trailer-web.mp4",
    link: "https://nordwear-shop.dk/",
    year: "2025",
    tags: ["React", "Typescript", "Next.js", "Gsap"],
  },
  {
    id: 2,
    title: "Visuel Atelier",
    projectType: "Prototype",
    image: "/images/Visuel-Atelier.webp",
    link: "",
    year: "2023",
    tags: ["React", "Typescript", "Vite", "Gsap"],
  },
  {
    id: 3,
    title: "Bang & Olufsen",
    projectType: "Mobile Application",
    image: "/images/Bang&Olufsen.webp",
    video: "/projectVideos/bang-olufsen-iphone-trailer.mp4",
    link: "#",
    year: "2024",
    tags: ["React", "Typescript", "Express", "Gsap"],
  },
  {
    id: 4,
    title: "Project Four",
    projectType: "Website",
    image: "https://placehold.co/1200x800",
    link: "#",
    year: "2023",
    tags: ["React", "Typescript", "Express", "Vite"],
  },
];

const Projects: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = initGridAnimations(containerRef.current);

    return () => {
      ctx.revert();
    };
  }, []);

  // Helper to chunk projects into rows of 2
  const projectRows = [];
  for (let i = 0; i < projects.length; i += 2) {
    projectRows.push(projects.slice(i, i + 2));
  }

  return (
    <section className="w-full" ref={containerRef}>
      <div className="w-full px-4 md:px-10 lg:px-4 xl:px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-12 mb-8 md:mb-8 overflow-hidden sm-flex">
          <div className="overflow-hidden flex-shrink-0">
            <h2 className="project-header-text text-5xl sm:text-6xl md:text-7xl lg:text-9xl w-full text-left font-aeonik font-semibold text-[#1b1b1a] leading-none tracking-tight whitespace-nowrap uppercase">
              Work
            </h2>
          </div>
          <div className="max-w-sm text-left overflow-hidden">
            <p className="project-header-subtext uppercase font-aeonik text-lg md:text-md font-medium text-[#1b1b1a] leading-tight">
              a selection of my most passionately crafted works with
              forward-thinking clients and friends over the years.
            </p>
          </div>
        </div>

        {/* Project Grid */}
        <div className="space-y-16 md:space-y-24 pt-16">
          {projectRows.map((rowItems, rowIndex) => (
            <div
              key={rowIndex}
              className="project-row grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 md:gap-y-24"
            >
              {rowItems.map((project, index) => (
                <div key={project.id} className="project-card">
                  <ProjectItem
                    project={project}
                    index={rowIndex * 2 + index}
                    aspectClassName="aspect-[4/3]"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
