import React from "react";
import ProjectItem from "./ProjectItem";
import Marquee from "../../components/Marquee";

const projects = [
  {
    id: 1,
    title: "Bang & Olufsen",
    description: "Premium audio experience",
    categories: ["Design", "Interaction", "React"],
    image: "/images/Bang&Olufsen.webp",
    link: "#",
  },
  {
    id: 2,
    title: "Visuel Atelier",
    description: "Visual design studio",
    categories: ["Branding", "Creative Direction", "UI/UX"],
    image: "/images/Visuel-Atelier.webp",
    link: "#",
  },
  {
    id: 3,
    title: "Bang & Olufsen",
    description: "Featured project with video",
    categories: ["Animation", "3D", "Web Development"],
    image: "https://placehold.co/1200x600",
    video: "/projectVideos/bang-olufsen-iphone-trailer.mp4",
    link: "#",
  },
  {
    id: 4,
    title: "Project Four",
    description: "Creative portfolio piece",
    categories: ["Graphic Design", "Illustration"],
    image: "https://placehold.co/800x800",
    link: "#",
  },
  {
    id: 5,
    title: "Project Five",
    description: "Design concept",
    categories: ["Product Design", "Prototyping"],
    image: "https://placehold.co/400x400",
    link: "#",
  },
];

const Projects: React.FC = () => {
  return (
    <section id="projects" className="mb-64 w-full">
      {/* Section Header with Marquee */}
      <div className="w-full mb-24 md:mb-32">
        <div className="px-8 mb-8">
          <hr
            className="w-full h-[1px] border-0"
            style={{ backgroundColor: "var(--divider)" }}
          />
        </div>
        <Marquee
          text="Selected Projects°"
          className="pt-8 "
          itemClassName="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-granary font-semibold uppercase tracking-wide pr-20 text-[var(--foreground)] leading-none"
          speed={1}
        />
      </div>

                              <div className="w-full px-8 md:px-16 lg:px-24 mt-32 md:mt-64">
                                <div className="flex flex-col gap-48 md:gap-96">
                                  <div className="flex flex-col md:flex-row items-start justify-between gap-24 md:gap-48">
                                    <div className="md:w-3/12 md:mt-48">
                                      <ProjectItem project={projects[0]} index={0} speed={2.2} />
                                    </div>
                                    <div className="md:w-6/12">
                                      <ProjectItem project={projects[1]} index={1} speed={1.15} />
                                    </div>
                                  </div>
                        
                                  <div className="flex justify-start md:mt-32">
                                    <div className="w-full md:w-8/12">
                                      <ProjectItem
                                        project={projects[2]}
                                        index={2}
                                        speed={1.08}
                                        aspectClassName="aspect-video"
                                      />
                                    </div>
                                  </div>
                        
                                  <div className="flex flex-col md:flex-row items-start justify-between gap-24 md:gap-48">
                                    <div className="md:w-6/12">
                                      <ProjectItem project={projects[3]} index={3} speed={1.2} />
                                    </div>
                                    <div className="md:w-3/12 md:mt-80">
                                      <ProjectItem project={projects[4]} index={4} speed={2.5} />
                                    </div>
                                  </div>
                                </div>
                              </div>    </section>
  );
};

export default Projects;
