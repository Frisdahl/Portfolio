import React, { useLayoutEffect, useRef } from "react";
import ProjectItem from "./ProjectItem";
import type { Project } from "./ProjectItem";
import { initGridAnimations } from "./Projects.anim";
import AnimatedButton from "../../components/AnimatedButton";

const projects: Project[] = [
  {
    id: 1,
    title: "NordWear",
    projectType: "Website",
    image: "/images/projectImages/NordWear-img-opt.webp",
    video: "/projectVideos/NordWear/NordWear-trailer.webm",
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
  const [activeIndex, setActiveIndex] = React.useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const thumbRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [indicatorOffset, setIndicatorOffset] = React.useState(0);

  useLayoutEffect(() => {
    const updateOffset = () => {
      const activeThumb = thumbRefs.current[activeIndex];
      if (activeThumb) {
        setIndicatorOffset(
          activeThumb.offsetTop + activeThumb.offsetHeight / 2 - 4,
        );
      }
    };

    updateOffset();
    window.addEventListener("resize", updateOffset);
    return () => window.removeEventListener("resize", updateOffset);
  }, [activeIndex]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = initGridAnimations(containerRef.current);

    const observer = new IntersectionObserver(
      (entries) => {
        // Build array of visible entries with index and top
        const visible = entries
          .filter((e) => e.isIntersecting)
          .map((e) => ({
            index: Number(e.target.getAttribute("data-index")),
            top: e.boundingClientRect.top,
          }));

        if (visible.length > 0) {
          const center = window.innerHeight / 2;
          // Find the entry closest to the center
          const closest = visible.reduce((a, b) =>
            Math.abs(b.top - center) < Math.abs(a.top - center) ? b : a,
          );
          setActiveIndex(closest.index);
        }
      },
      { threshold: 0.5 },
    );

    cardRefs.current.forEach((ref) => ref && observer.observe(ref));

    return () => {
      observer.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <section
      className="w-full"
      ref={containerRef}
      style={{ overflow: "visible" }}
    >
      <div className="w-full px-4 md:px-10 lg:px-4 xl:px-6">
        {/* Main 12-Column Grid Container */}
        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-y-16 lg:gap-x-12 xl:gap-x-16"
          style={{ alignItems: "stretch" }}
        >
          {/* Left Column Container */}
          <div className="lg:col-span-4 relative h-full">
            {/* Sticky Wrapper - Forced sticky with inline styles and a high z-index */}
            <div
              className="flex flex-col h-[90svh] items-start justify-between mb-12 lg:mb-0"
              style={{
                position: "sticky",
                top: "8vh",
                zIndex: 10,
              }}
              data-lenis-sticky
            >
              <div>
                <div className="overflow-hidden mb-8">
                  <h2 className="project-header-text text-5xl md:text-6xl lg:text-7xl w-full text-left font-cabinet font-medium text-[var(--foreground)] leading-none tracking-tight">
                    Featured work
                  </h2>
                </div>
                <div className="max-w-md text-left overflow-hidden">
                  <p className="text-xl md:text-2xl text-[var(--foreground-muted)] font-cabinet font-regular leading-[1.2] tracking-tight">
                    A selection of my most passionately crafted works with
                    forward-thinking clients and friends over the years.
                  </p>
                </div>
              </div>

              {/* Thumbnail Navigation */}
              <div className="hidden lg:flex flex-col gap-y-3 mt-12 w-fit relative">
                {projects.map((project, index) => (
                  <div
                    key={project.id}
                    ref={(el) => {
                      thumbRefs.current[index] = el;
                    }}
                    className="relative flex items-center group/thumb"
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      onClick={() => {
                        const el = document.getElementById(
                          `project-${project.id}`,
                        );
                        if (el) {
                          const headerOffset = 120;
                          const elementPosition =
                            el.getBoundingClientRect().top;
                          const offsetPosition =
                            elementPosition + window.pageYOffset - headerOffset;
                          window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth",
                          });
                        }
                      }}
                      className="w-32 aspect-[16/9] cursor-pointer object-cover grayscale group-hover/thumb:grayscale-0 transition-all duration-300 rounded-sm"
                    />
                  </div>
                ))}

                {/* Sliding Indicator */}
                <div
                  className="absolute w-2 h-2 rounded-full bg-[#E35239] pointer-events-none"
                  style={{
                    left: "calc(8rem + 1rem)", // Thumbnail width (w-32 = 8rem) + gap (1rem)
                    transform: `translateY(${indicatorOffset}px)`,
                    transition: "transform 0.5s cubic-bezier(0, 0, 0.58, 1)",
                  }}
                />
              </div>

              <div className="mt-12">
                <AnimatedButton
                  text="See all projects"
                  baseBgColor="bg-[#e35338]"
                  baseBorderColor="border-[#e35338]"
                  hoverBorderColor="border-[#e35338]"
                  hoverBgColor="bg-[#131313]"
                  baseTextColor="text-[var(--background)]"
                  hoverTextColor="text-[#E35239]"
                  fontSize="text-lg md:text-xl"
                  showBorder={false}
                  onClick={() => {
                    window.location.href = "/projects";
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Project List */}
          <div className="lg:col-span-8 flex flex-col gap-y-8 md:gap-y-24">
            {projects.map((project, index) => (
              <div
                id={`project-${project.id}`}
                key={project.id}
                className="project-card w-full"
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                data-index={index}
              >
                <ProjectItem
                  project={project}
                  index={index}
                  aspectClassName="aspect-[16/9]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
