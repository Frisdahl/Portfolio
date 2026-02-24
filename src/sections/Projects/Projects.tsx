import React from "react";
import ProjectItem from "./ProjectItem";

const projects = [
  {
    id: 1,
    title: "NordWear",
    description: "design, frontend, backend, database",
    categories: ["design", "frontend", "backend", "database"],
    image: "/images/Bang&Olufsen.webp",
    video: "/projectVideos/NordWear/NordWear-trailer-web.mp4",
    link: "https://nordwear-shop.dk/",
  },
  {
    id: 2,
    title: "Visuel Atelier",
    description: "Visual design studio",
    categories: ["Branding", "Creative Direction", "UI/UX"],
    image: "/images/Visuel-Atelier.webp",
    link: "",
  },
  {
    id: 3,
    title: "Bang & Olufsen",
    description: "Featured project with video",
    categories: ["Animation", "3D", "Web Development"],
    image: "/images/Bang&Olufsen.webp",
    video: "/projectVideos/bang-olufsen-iphone-trailer.mp4",
    link: "#",
  },
  {
    id: 4,
    title: "Project Four",
    description: "Creative portfolio piece",
    categories: ["Graphic Design", "Illustration"],
    image: "https://placehold.co/1200x800",
    link: "#",
  },
  {
    id: 5,
    title: "Project Five",
    description: "Design concept",
    categories: ["Product Design", "Prototyping"],
    image: "https://placehold.co/1200x800",
    link: "#",
  },
  {
    id: 6,
    title: "Project Six",
    description: "Minimalist design",
    categories: ["Branding", "Web Design"],
    image: "https://placehold.co/1200x800",
    link: "#",
  },
];

const Projects: React.FC = () => {
  return (
    <section id="projects" className="mb-64 w-full">
      <div className="w-full px-8 md:px-16 lg:px-24 mt-32 md:mt-64">
        {/* Grid Container with gap 32px (gap-8) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Row 1: First row should be full width */}
          <div className="md:col-span-12 h-auto">
            <ProjectItem
              project={projects[0]}
              index={0}
              fillHeight={false}
              aspectClassName="aspect-video"
            />
          </div>

          {/* Row 2: Small width and a little wider width */}
          <div className="md:col-span-4 h-[50vh] md:h-[80vh]">
            <ProjectItem project={projects[1]} index={1} fillHeight={true} />
          </div>
          <div className="md:col-span-8 h-[50vh] md:h-[80vh]">
            <ProjectItem project={projects[2]} index={2} fillHeight={true} />
          </div>

          {/* Row 3: Single wide width (Full width) */}
          <div className="md:col-span-12 h-[50vh] md:h-[80vh]">
            <ProjectItem project={projects[3]} index={3} fillHeight={true} />
          </div>

          {/* Row 4: One wide and one smaller */}
          <div className="md:col-span-8 h-[50vh] md:h-[80vh]">
            <ProjectItem project={projects[4]} index={4} fillHeight={true} />
          </div>
          <div className="md:col-span-4 h-[50vh] md:h-[80vh]">
            <ProjectItem project={projects[5]} index={5} fillHeight={true} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
