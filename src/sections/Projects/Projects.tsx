import React, { useLayoutEffect, useRef } from "react";
import ProjectItem from "./ProjectItem";
import { initGridAnimations } from "./Projects.anim";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const workHeadingData = [
  { char: "W", order: 1 },
  { char: "o", order: -1 },
  { char: "r", order: 2 },
  { char: "k", order: 3 },
];

const AnimatedLetter = ({ char, order }: { char: string; order: number }) => {
  if (order < 0) {
    return <span className="inline-block">{char}</span>;
  }
  return (
    <span className="relative inline-block overflow-hidden align-bottom h-[1em]">
      <span
        className="project-letter-inner block relative will-change-transform"
        data-order={order}
      >
        <span
          className="absolute bottom-full left-0 right-0 text-center pointer-events-none select-none opacity-0 transition-opacity duration-300"
          style={{ opacity: "var(--letter-opacity, 0)" }}
          aria-hidden="true"
        >
          {char}
        </span>
        <span className="block leading-none">{char}</span>
      </span>
    </span>
  );
};

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
  const workHeadingRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ctx = initGridAnimations(containerRef.current);

    // Scroll Animation for "Work" text
    if (workHeadingRef.current) {
      const animatedLetters = Array.from(
        workHeadingRef.current.querySelectorAll(".project-letter-inner"),
      ) as HTMLElement[];

      animatedLetters.sort((a, b) => {
        return (
          parseInt(a.dataset.order || "0") - parseInt(b.dataset.order || "0")
        );
      });

      gsap.to(animatedLetters, {
        yPercent: 100,
        stagger: 0.15,
        ease: "none",
        scrollTrigger: {
          trigger: workHeadingRef.current,
          start: "top 95%",
          end: "bottom 30%",
          scrub: 1.5,
          onUpdate: (self) => {
            // Set opacity based on progress so they don't show at the very top
            const opacity = self.progress > 0.01 ? 1 : 0;
            document.documentElement.style.setProperty(
              "--letter-opacity",
              opacity.toString(),
            );
          },
        },
      });
    }

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
        <div className="flex flex-col md:flex-row items-end justify-between gap-12 mb-8 md:mb-8 overflow-hidden">
          <div className="overflow-hidden flex-shrink-0">
            <h2
              ref={workHeadingRef}
              className="project-header-text text-5xl md:text-7xl lg:text-8xl xl:text-[10rem] w-full text-left font-aeonik font-semibold text-[#1c1d1e] leading-none tracking-tight whitespace-nowrap uppercase"
            >
              {workHeadingData.map((item, i) => (
                <AnimatedLetter key={i} char={item.char} order={item.order} />
              ))}
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
