import React from "react";
import ProjectItem from "./ProjectItem"; // Import the new ProjectItem component

const projects = [
  {
    id: 1,
    title: "Bang & Olufsen",
    description:
      "A brief description of Project One, highlighting its key features and technologies used.",
    image: "/images/Bang&Olufsen.webp", // New image
    link: "#",
  },
  {
    id: 2,
    title: "Visuel Atelier",
    description:
      "A brief description of Project Two, highlighting its key features and technologies used.",
    image: "/images/Visuel-Atelier.webp", // New image
    link: "#",
  },
  {
    id: 3,
    title: "Project Three",
    description:
      "A brief description of Project Three, highlighting its key features and technologies used.",
    image: "https://via.placeholder.com/400x300/00FF00/FFFFFF?text=Project+3", // Placeholder image
    link: "#",
  },
  {
    id: 4,
    title: "Project Four",
    description:
      "A brief description of Project Four, highlighting its key features and technologies used.",
    image: "https://via.placeholder.com/400x300/FFFF00/000000?text=Project+4", // Placeholder image
    link: "#",
  },
];

const Projects: React.FC = () => {
  const mid = Math.ceil(projects.length / 2);
  const leftColumnProjects = projects.slice(0, mid);
  const rightColumnProjects = projects.slice(mid);

  return (
    <section id="projects" className={`py-16 text-gray-800`}>
      <div className="max-w-[1600px] mx-auto px-16 sm:px-24 lg:px-36">
        <div className="flex flex-col md:flex-row justify-between gap-16 md:gap-36 items-start">
          {/* Left Column */}
          <div className="flex flex-col gap-16 md:gap-36 md:w-1/2">
            {leftColumnProjects.map((project) => (
              <ProjectItem
                key={project.id}
                project={project}
              />
            ))}
          </div>

          {/* Right Column - Staggered */}
          <div className="flex flex-col gap-16 md:gap-36 md:w-1/2 md:mt-[300px]"> {/* Apply stagger here */}
            {rightColumnProjects.map((project) => (
              <ProjectItem
                key={project.id}
                project={project}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
