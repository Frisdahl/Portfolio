import React, { useLayoutEffect, useRef } from "react";
import ProjectItem from "./ProjectItem";
import { initGridAnimations } from "./Projects.anim";

const projects = [
  {
    id: 1,
    title: "NordWear",
    categories: [
      "Tone & voice",
      "Tailwind CSS",
      "Lenis",
      "UI",
      "UX",
      "Next.js",
      "gsap",
      "motion",
    ],
    image: "/images/Bang&Olufsen.webp",
    video: "/projectVideos/NordWear/NordWear-trailer-web.mp4",
    link: "https://nordwear-shop.dk/",
    year: "2024",
    tags: ["Portfolio", "Project", "Design"],
  },
  {
    id: 2,
    title: "Visuel Atelier",
    categories: ["UI", "UX", "gsap", "motion", "Tailwind CSS", "Lenis"],
    image: "/images/Visuel-Atelier.webp",
    link: "",
    year: "2023",
    tags: ["Portfolio", "Project", "Design"],
  },
  {
    id: 3,
    title: "Bang & Olufsen",
    categories: [
      "Next.js",
      "gsap",
      "motion",
      "Tailwind CSS",
      "Lenis",
      "UI",
      "UX",
    ],
    image: "/images/Bang&Olufsen.webp",
    video: "/projectVideos/bang-olufsen-iphone-trailer.mp4",
    link: "#",
    year: "2024",
    tags: ["Portfolio", "Project", "Design"],
  },
  {
    id: 4,
    title: "Project Four",
    categories: ["Tone & voice", "UI", "UX", "Next.js", "gsap", "motion"],
    image: "https://placehold.co/1200x800",
    link: "#",
    year: "2023",
    tags: ["Portfolio", "Project", "Design"],
  },
  {
    id: 5,
    title: "Project Five",
    categories: ["gsap", "motion", "Tailwind CSS", "Lenis", "UI", "UX"],
    image: "https://placehold.co/1200x800",
    link: "#",
    year: "2022",
    tags: ["Portfolio", "Project", "Design"],
  },
  {
    id: 6,
    title: "Project Six",
    categories: ["Next.js", "Tailwind CSS", "Lenis", "UI", "UX", "motion"],
    image: "https://placehold.co/1200x800",
    link: "#",
    year: "2022",
    tags: ["Portfolio", "Project", "Design"],
  },
];

const Projects: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ctx = initGridAnimations(containerRef.current);
    return () => ctx.revert();
  }, []);

  // Helper to chunk projects into rows of 2
  const projectRows = [];
  for (let i = 0; i < projects.length; i += 2) {
    projectRows.push(projects.slice(i, i + 2));
  }

  return (
    <section className="w-full" ref={containerRef}>
      <div id="projects" className="w-full px-6 md:px-10 lg:px-4 xl:px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-12 mb-16 md:mb-24 overflow-hidden">
          <div className="overflow-hidden flex-shrink-0">
            <h2 className="project-header-text text-5xl md:text-7xl lg:text-8xl xl:text-9xl w-full text-left font-aeonik font-medium text-[#1c1d1e] leading-none tracking-tight whitespace-nowrap uppercase">
              featured Work
            </h2>
          </div>
          <div className="max-w-sm text-left overflow-hidden">
            <p className="project-header-subtext uppercase font-aeonik text-lg md:text-md text-[#1c1d1e] opacity-60 leading-tight">
              a selection of my most passionately crafted works with
              forward-thinking clients and friends over the years.
            </p>
          </div>
        </div>

        {/* Project Grid */}
        <div className="space-y-16 md:space-y-24">
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
