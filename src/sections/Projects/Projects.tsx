import React, { useLayoutEffect, useRef } from "react";
import ProjectItem from "./ProjectItem";
import { initGridAnimations } from "./Projects.anim";

const projects = [
  {
    id: 1,
    title: "NordWear",
    categories: ["design", "frontend", "backend", "database"],
    image: "/images/Bang&Olufsen.webp",
    video: "/projectVideos/NordWear/NordWear-trailer-web.mp4",
    link: "https://nordwear-shop.dk/",
  },
  {
    id: 2,
    title: "Visuel Atelier",
    categories: ["Branding", "Creative Direction", "UI/UX"],
    image: "/images/Visuel-Atelier.webp",
    link: "",
  },
  {
    id: 3,
    title: "Bang & Olufsen",
    categories: ["Animation", "3D", "Web Development"],
    image: "/images/Bang&Olufsen.webp",
    video: "/projectVideos/bang-olufsen-iphone-trailer.mp4",
    link: "#",
  },
  {
    id: 4,
    title: "Project Four",
    categories: ["Graphic Design", "Illustration"],
    image: "https://placehold.co/1200x800",
    link: "#",
  },
  {
    id: 5,
    title: "Project Five",
    categories: ["Product Design", "Prototyping"],
    image: "https://placehold.co/1200x800",
    link: "#",
  },
  {
    id: 6,
    title: "Project Six",
    categories: ["Branding", "Web Design"],
    image: "https://placehold.co/1200x800",
    link: "#",
  },
];

const Projects: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ctx = initGridAnimations(containerRef.current);
    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" className="mb-64 w-full" ref={containerRef}>
      <div className="w-full px-8 md:px-16 lg:px-24 mt-32 md:mt-64">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-8 overflow-hidden">
          <div className="max-w-md overflow-hidden">
            <h2 className="project-header-text text-2xl md:text-3xl lg:text-5xl text-left font-newroman text-white leading-tight">
              Take a look at some of <br className="hidden md:block" />
              my earlier work
            </h2>
          </div>
          <div className="max-w-sm md:text-right overflow-hidden">
            <p className="project-header-subtext font-switzer text-base md:text-lg text-[var(--foreground)] opacity-70 leading-relaxed">
              Handcrafted Experiences for <br className="hidden md:block" />
              Brands of All Sizes, Worldwide
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Row 1: Large horizontal video row */}
          <section className="project-row project-row--large grid grid-cols-1 md:grid-cols-12">
            <article className="project-card md:col-span-12 h-auto">
              <ProjectItem
                project={projects[0]}
                index={0}
                fillHeight={false}
                aspectClassName="aspect-video"
              />
            </article>
          </section>

          {/* Row 2: Alternating Narrow (Left) and Wide (Right) */}
          <section className="project-row grid grid-cols-1 md:grid-cols-12 gap-8">
            <article className="project-card md:col-span-4 h-[50vh] md:h-[80vh]">
              <ProjectItem project={projects[1]} index={1} fillHeight={true} />
            </article>
            <article className="project-card md:col-span-8 h-[50vh] md:h-[80vh]">
              <ProjectItem project={projects[2]} index={2} fillHeight={true} />
            </article>
          </section>

          {/* Row 3: Single wide width (Full width) */}
          <section className="project-row project-row--large grid grid-cols-1 md:grid-cols-12">
            <article className="project-card md:col-span-12 h-[50vh] md:h-[80vh]">
              <ProjectItem project={projects[3]} index={3} fillHeight={true} />
            </article>
          </section>

          {/* Row 4: Alternating Wide (Left) and Narrow (Right) */}
          <section className="project-row grid grid-cols-1 md:grid-cols-12 gap-8">
            <article className="project-card md:col-span-8 h-[50vh] md:h-[80vh]">
              <ProjectItem project={projects[4]} index={4} fillHeight={true} />
            </article>
            <article className="project-card md:col-span-4 h-[50vh] md:h-[80vh]">
              <ProjectItem project={projects[5]} index={5} fillHeight={true} />
            </article>
          </section>
        </div>
      </div>
    </section>
  );
};

export default Projects;
