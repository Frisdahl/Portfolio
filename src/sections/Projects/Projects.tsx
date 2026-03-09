import React, { useLayoutEffect, useRef } from "react";
import ProjectItem from "./ProjectItem";
import { initGridAnimations } from "./Projects.anim";
import CtaButton from "../../components/CtaButton";
import { projects } from "../../data/projects";

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
        const visible = entries
          .filter((e) => e.isIntersecting)
          .map((e) => ({
            index: Number(e.target.getAttribute("data-index")),
            top: e.boundingClientRect.top,
          }));

        if (visible.length > 0) {
          const center = window.innerHeight / 2;
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
        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-y-16 lg:gap-x-12 xl:gap-x-16"
          style={{ alignItems: "stretch" }}
        >
          <div className="lg:col-span-4 relative h-full">
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
                  <p className="project-header-subtext text-xl md:text-2xl text-[var(--foreground-muted)] font-cabinet font-regular leading-[1.2] tracking-tight">
                    A selection of my most passionately crafted works with
                    forward-thinking clients and friends over the years.
                  </p>
                </div>
              </div>

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
                      className={`w-42 aspect-[16/9] cursor-pointer object-cover transition-all duration-300 rounded-sm ${
                        index === activeIndex
                          ? "grayscale-0"
                          : "grayscale group-hover/thumb:grayscale-0"
                      }`}
                    />
                  </div>
                ))}

                <div
                  className="absolute w-2 h-2 rounded-full bg-[#E35239] pointer-events-none"
                  style={{
                    left: "calc(10.5rem + 1rem)",
                    transform: `translateY(${indicatorOffset}px)`,
                    transition: "transform 0.5s cubic-bezier(0, 0, 0.58, 1)",
                  }}
                />
              </div>

              <div className="mt-12">
                <CtaButton
                  text="See all projects"
                  bgColor="bg-[#e35338]"
                  textColor="text-[var(--background)]"
                  dotColor="bg-[var(--background)]"
                  onClick={() => {
                    window.location.href = "/projects";
                  }}
                />
              </div>
            </div>
          </div>

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
