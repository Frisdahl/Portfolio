import React, { useLayoutEffect, useRef } from "react";
import ProjectItem from "./ProjectItem";
import { initGridAnimations } from "./Projects.anim";
import gsap from "gsap";
import SplitType from "split-type";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const projects = [
  {
    id: 1,
    title: "NordWear",
    categories: [
      "Tone",
      "voice",
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
];

const Projects: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subText = useRef<HTMLParagraphElement>(null);
  useLayoutEffect(() => {
    if (!headingRef.current || !containerRef.current || !subText.current)
      return;
    const ctx = initGridAnimations(containerRef.current);

    gsap.registerPlugin(ScrollTrigger);

    const subTextReveal = new SplitType(subText.current, {
      types: "lines",
      lineClass: "subtext-line",
    });

    if (!subTextReveal.lines?.length) {
      return () => {
        subTextReveal.revert();
        ctx.revert();
      };
    }

    subTextReveal.lines.forEach((line) => {
      const wrapper = document.createElement("div");
      wrapper.className = "overflow-hidden";
      line.parentNode?.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: headingRef.current,
        start: "top 80%",
        end: "bottom 60%",
        toggleActions: "play none none none",
        markers: false,
      },
    });

    tl.fromTo(
      headingRef.current,
      { yPercent: 100 },
      {
        yPercent: 0,
        ease: "power4.out",
        duration: 1.2,
      },
    ).fromTo(
      subTextReveal.lines,
      { yPercent: 100 },
      {
        yPercent: 0,
        ease: "power4.out",
        duration: 1.2,
        stagger: 0.1,
      },
      "-=1",
    );

    return () => {
      tl.kill();
      ctx.revert();
    };
  });

  // Helper to chunk projects into rows of 2
  const projectRows = [];
  for (let i = 0; i < projects.length; i += 2) {
    projectRows.push(projects.slice(i, i + 2));
  }

  return (
    <section className="w-full" ref={containerRef}>
      <div id="projects" className="w-full px-4 md:px-10 lg:px-4 xl:px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-12 mb-8 md:mb-8 overflow-hidden sm-flex">
          <div className="overflow-hidden flex-shrink-0">
            <h2
              ref={headingRef}
              className="project-header-text text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[10rem] w-full text-left font-aeonik font-semibold text-[#1c1d1e] leading-none tracking-tight whitespace-nowrap uppercase"
            >
              Work
            </h2>
          </div>
          <div className="max-w-sm text-left overflow-hidden">
            <p
              ref={subText}
              className="project-header-subtext uppercase font-aeonik text-lg md:text-md font-medium text-[#1c1d1e] leading-tight"
            >
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
