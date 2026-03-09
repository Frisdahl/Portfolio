import React, { useLayoutEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { gsap, ScrollTrigger, splitLinesAndAnimate } from "../utils/animations";
import ArrowIcon from "../components/ArrowIcon";
import CtaButton from "../components/CtaButton";
import CurvedMarquee from "../components/CurvedMarquee";

import { projects, getProjectBySlug } from "../data/projects";

const ProjectPage: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = getProjectBySlug(slug || "nordwear") || projects[0];

  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const scrollPromptRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const workedOnRef = useRef<HTMLDivElement>(null);
  const btnContainerRef = useRef<HTMLAnchorElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);
  const sharedThumbCtaRef = useRef<HTMLDivElement>(null);
  const marqueeContainerRef = useRef<HTMLDivElement>(null);
  const ctaBtnRef = useRef<HTMLDivElement>(null);

  const [isBtnAreaHovered, setIsBtnAreaHovered] = useState(false);
  const [isGalleryHovered, setIsGalleryHovered] = useState(false);
  const [activeHoveredIndex, setActiveHoveredIndex] = useState<number | null>(
    null,
  );

  const lastSlugRef = useRef<string | undefined>(slug);

  useLayoutEffect(() => {
    if (lastSlugRef.current !== slug) {
      window.scrollTo(0, 0);
      lastSlugRef.current = slug;
    }

    if (btnContainerRef.current && btnRef.current) {
      const container = btnContainerRef.current;
      const button = btnRef.current;

      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = container.getBoundingClientRect();
        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);

        gsap.to(button, {
          x: x * 0.85,
          y: y * 0.85,
          duration: 0.8,
          ease: "power3.out",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(button, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "back.out(1.2)",
        });
      };

      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [slug]);

  const handleGalleryMouseMove = (e: React.MouseEvent) => {
    const cta = sharedThumbCtaRef.current;
    if (!cta) return;

    const { clientX, clientY, currentTarget } = e;
    const { left, top } = currentTarget.getBoundingClientRect();

    const x = clientX - left;
    const y = clientY - top;

    gsap.to(cta, {
      x: x,
      y: y,
      xPercent: -50,
      yPercent: -50,
      duration: 0.6,
      ease: "power2.out",
      overwrite: true,
    });
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.out", duration: 1.4 },
      });

      // Heading letters stagger
      tl.from(".heading-letter", {
        yPercent: 110,
        stagger: 0.03,
        duration: 1.2,
        delay: 0.4,
        ease: "power4.out",
      });

      // Apply the smart split-line animation to all elements with .split-line
      splitLinesAndAnimate(".split-line", {
        scrollTrigger: true,
        start: "top 90%",
      });

      tl.from(scrollPromptRef.current, { opacity: 0, duration: 1.2 }, "-=1");

      // CTA button fade-in
      if (ctaBtnRef.current) {
        gsap.from(ctaBtnRef.current, {
          scrollTrigger: {
            trigger: ctaBtnRef.current,
            start: "top 95%",
          },
          opacity: 0,
          y: 20,
          duration: 1.2,
          ease: "power3.out",
        });
      }

      // Dynamic entrance animation for images
      const allImageWrappers = containerRef.current?.querySelectorAll(".image-animate-wrapper");
      if (allImageWrappers) {
        allImageWrappers.forEach((wrapper) => {
          const isLeft = wrapper.classList.contains("rotate-left-start");
          const isRight = wrapper.classList.contains("rotate-right-start");
          
          gsap.fromTo(wrapper, 
            { 
              opacity: 0, 
              y: 60,
              rotate: isLeft ? -2 : isRight ? 2 : 0,
              scale: 0.98
            },
            {
              scrollTrigger: {
                trigger: wrapper,
                start: "top 92%",
              },
              opacity: 1,
              y: 0,
              rotate: 0,
              scale: 1,
              duration: 1.6,
              ease: "power3.out"
            }
          );
        });
      }

      // Special handling for the single full-width detail image
      const fullWidthDetail = containerRef.current?.querySelector(".full-width-detail");
      if (fullWidthDetail) {
        gsap.fromTo(fullWidthDetail,
          { opacity: 0, y: 40, scale: 1.02 },
          {
            scrollTrigger: {
              trigger: fullWidthDetail,
              start: "top 90%",
            },
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.4,
            ease: "power2.out"
          }
        );
      }

      // Improved, smooth arrow loop
      const arrowTl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });
      arrowTl
        .fromTo(
          ".scroll-arrow",
          { x: -15, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        )
        .to(
          ".scroll-arrow",
          { x: 15, opacity: 0, duration: 0.6, ease: "power2.in" },
          "+=0.4",
        );

      gsap
        .timeline({
          scrollTrigger: {
            trigger: imageRef.current,
            start: "center 90%",
            end: "center 40%",
            scrub: 1,
          },
        })
        .to(":root", {
          "--background": "#131313",
          "--foreground": "rgb(230, 230, 231)",
          "--foreground-muted": "#a1a1a1",
          "--menu-bg": "rgb(230, 230, 231)",
          "--menu-text": "#131313",
          ease: "none",
        });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: marqueeContainerRef.current,
            start: "center 90%",
            end: "center 40%",
            scrub: 1,
          },
        })
        .to(":root", {
          "--background": "#e7e7e7",
          "--foreground": "#1b1b1a",
          "--foreground-muted": "#666",
          "--menu-bg": "#131313",
          "--menu-text": "#e7e7e7",
          ease: "none",
        });
    });

    return () => ctx.revert();
  }, [slug]);

  const marqueeText = "Other Projects ✦ Explore More ✦ Creative Work ✦ ";

  const otherProjects = projects
    .filter((p) => p.slug !== (slug || "nordwear"))
    .map((p) => ({ ...p }));

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen bg-[var(--background)] text-[var(--foreground)] mt-42"
    >
      <div className="px-4 md:px-10 lg:px-4 xl:px-6">
        {/* Hero Content */}
        <div className="items-start">
          <div className="w-full flex justify-between items-end mb-8">
            <div className="overflow-hidden pr-4">
              <h1
                ref={headingRef}
                className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-regular font-cabinet leading-[0.8] tracking-tighter flex flex-wrap"
              >
                {project.title.split("").map((letter, i) => (
                  <span
                    key={i}
                    className="inline-block overflow-hidden px-[0.05em] -mr-[0.05em]"
                  >
                    <span className="heading-letter inline-block">
                      {letter === " " ? "\u00A0" : letter}
                    </span>
                  </span>
                ))}
              </h1>
            </div>
            <div className="overflow-hidden">
              <p className="split-line text-xl font-cabinet max-w-md italic leading-tight text-right">
                {project.description}
              </p>
            </div>
          </div>
          <div className="overflow-hidden mb-4">
            <div ref={scrollPromptRef} className="flex items-center gap-4">
              <span className="text-sm tracking-[0.3em] font-thin lowercase">
                scroll to explore
              </span>
              <div className="rotate-90">
                <div className="scroll-arrow">
                  <ArrowIcon className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div
          ref={imageRef}
          className="w-full aspect-[16/9] overflow-hidden mb-32 rounded-sm"
        >
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full border-t border-[var(--foreground)] border-opacity-10 my-16" />

        {/* Details Section */}
        <div className="w-full flex flex-col lg:flex-row justify-between items-start mb-32 gap-y-16">
          <div className="flex-1 flex flex-col items-start max-w-xl lg:w-[25%]">
            <p className="split-line text-2xl md:text-2xl text-[var(--foreground)] text-left max-w-xl leading-tight mb-8">
              This project demonstrates a modern approach to digital
              experiences, focusing on performance, accessibility, and beautiful
              design.
            </p>
            <p className="split-line text-md md:text-md italic text-[var(--foreground)] opacity-60 text-left max-w-3xl leading-tight mb-16">
              This project is a conceptual case study. Visual direction and
              stylistic inspiration were drawn from Errant.dk.
            </p>
            <div ref={ctaBtnRef}>
              <CtaButton
                text="Visit Website"
                href={
                  project.title === "Nordwear" ? "https://nordwear-shop.dk/" : "#"
                }
                target="_blank"
                rel="noopener noreferrer"
              />
            </div>
          </div>

          <div className="lg:w-[65%] flex justify-end">
            <div className="flex flex-col items-start gap-16 w-full lg:max-w-[588px]">
              {/* Meta Row: Year, Type, Location */}
              <div className="flex flex-wrap justify-start gap-x-6 gap-y-8 w-full">
                <div className="flex flex-col items-start text-left w-[170px]">
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--foreground)] opacity-40 mb-4 border-b border-[var(--foreground)] border-opacity-10 w-full pb-2">
                    Year
                  </h3>
                  <p className="text-lg font-aeonik">{project.year}</p>
                </div>
                <div className="flex flex-col items-start text-left w-[170px]">
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--foreground)] opacity-40 mb-4 border-b border-[var(--foreground)] border-opacity-10 w-full pb-2">
                    Type
                  </h3>
                  <p className="text-lg font-aeonik">{project.projectType}</p>
                </div>
                {project.location && (
                  <div className="flex flex-col items-start text-left w-[170px]">
                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--foreground)] opacity-40 mb-4 border-b border-[var(--foreground)] border-opacity-10 w-full pb-2">
                      Location
                    </h3>
                    <p className="text-lg font-aeonik">{project.location}</p>
                  </div>
                )}
              </div>

              {/* Services Row */}
              <div className="flex flex-col items-start text-left w-full">
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--foreground)] opacity-40 mb-6 border-b border-[var(--foreground)] border-opacity-10 w-full pb-2">
                  Services
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.services?.map((service) => (
                    <span
                      key={service}
                      className="inline-block whitespace-nowrap px-6 py-1.5 rounded-full bg-[rgb(230,230,231)] text-[#131313] text-base font-medium transition-all duration-300 hover:translate-y-[-3px] hover:shadow-[0_6px_16px_rgba(227,82,57,0.25)]"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Small Images */}
        {project.smallImages && project.smallImages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-32">
            {project.smallImages.slice(0, 2).map((img, i) => (
              <div
                key={i}
                className={`image-animate-wrapper ${i === 0 ? "rotate-left-start" : "rotate-right-start"} aspect-[4/3] w-full overflow-hidden bg-neutral-200 rounded-sm shadow-xl origin-bottom`}
              >
                <img
                  className="w-full h-full object-cover"
                  src={img}
                  alt={`${project.title} detail ${i + 1}`}
                />
              </div>
            ))}
          </div>
        )}

        {/* Tech Stack */}
        <div className="w-full flex flex-col lg:flex-row justify-between items-start mb-32 gap-y-16">
          <div className="text-left lg:w-[25%]">
            <h1 className="project-header-text text-5xl md:text-6xl lg:text-7xl w-full max-w-xl text-left font-cabinet font-medium text-[var(--foreground)] leading-none tracking-tight mb-8">
              Tech Stack
            </h1>
            <p className="text-xl md:text-2xl text-[var(--foreground)] text-left max-w-sm leading-tight opacity-60">
              Technologies and tools used to bring this project to life
            </p>
          </div>
          <div className="lg:w-[65%] flex flex-wrap justify-end gap-x-12 gap-y-16">
            {project.tagsByCategory &&
              Object.entries(project.tagsByCategory).map(([category, tags]) => (
                <div
                  key={category}
                  className="flex flex-col items-start text-left w-[280px]"
                >
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--foreground)] opacity-40 mb-6 border-b border-[var(--foreground)] border-opacity-10 w-full pb-2">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block whitespace-nowrap px-6 py-1.5 rounded-full bg-[rgb(230,230,231)] text-[#131313] text-base font-medium transition-all duration-300 hover:translate-y-[-3px] hover:shadow-[0_6px_16px_rgba(227,82,57,0.25)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Restore Missing Detail Images Section */}
        {project.smallImages && project.smallImages.length >= 3 && (
          <div className="w-full mb-32 flex flex-col gap-8">
            <div className="full-width-detail w-full aspect-[16/9] overflow-hidden bg-neutral-200 rounded-sm shadow-2xl">
              <img
                className="w-full h-full object-cover"
                src={project.smallImages[2]}
                alt={`${project.title} detail 1`}
              />
            </div>
            <div className="grid grid-cols-2 gap-8 w-full">
              {[project.smallImages[3], project.smallImages[4]].map(
                (img, i) => (
                  <div
                    key={i}
                    className={`image-animate-wrapper ${i === 0 ? "rotate-left-start" : "rotate-right-start"} aspect-[1/1] w-full overflow-hidden bg-neutral-200 rounded-sm shadow-xl origin-bottom`}
                  >
                    <img
                      className="w-full h-full object-cover"
                      src={img}
                      alt={`${project.title} detail ${i + 2}`}
                    />
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        {/* Worked On Section */}
        <div
          ref={workedOnRef}
          className="w-full flex flex-col lg:flex-row justify-between items-start gap-10 lg:gap-32 mb-32"
        >
          <div className="flex-1 flex flex-col items-start max-w-xl">
            <p className="text-2xl md:text-2xl text-[var(--foreground)] text-left max-w-xl leading-tight mb-8">
              My work covering frontend development, backend architecture and
              interface design.
            </p>
          </div>
          <div className="flex gap-16 text-left">
            {project.workedOn &&
              Object.entries(project.workedOn).map(([category, skills]) => (
                <div
                  key={category}
                  className="mb-4 min-w-[240px] border-[var(--foreground)] p-6 flex flex-col"
                >
                  <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--foreground)] opacity-40 mb-4 border-b border-[var(--foreground)] border-opacity-10 w-full pb-2">
                    {category}
                  </h4>
                  <ul className="list-disc list-inside text-[var(--foreground)] opacity-80 text-base font-medium mt-2">
                    {skills.map((skill, i) => (
                      <li key={i} className="mb-1">
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div
        ref={marqueeContainerRef}
        className="w-full mt-10 mb-[-140px] cursor-default"
      >
        <CurvedMarquee
          text={marqueeText}
          speed={100}
          fontSize="3rem"
          className="w-full"
        />
      </div>

      {/* Featured Work Grid Section */}
      <section className="px-4 md:px-10 lg:px-4 xl:px-6 pb-32 mt-16">
        <div className="flex flex-col md:flex-row gap-4 pt-16 items-start h-auto md:h-[900px] relative">
          {/* Main Card */}
          <div
            className={`flex flex-col gap-1 transition-all duration-700 ease-in-out ${activeHoveredIndex === null || activeHoveredIndex === 0 ? "flex-[1.6]" : "flex-1"}`}
          >
            <div className="h-8" />
            <div
              onMouseEnter={() => setActiveHoveredIndex(0)}
              onMouseLeave={() => setActiveHoveredIndex(null)}
              className={`flex flex-col bg-[#131313] text-[rgb(230,230,231)] rounded-sm text-left overflow-hidden transition-all duration-700 ease-in-out ${activeHoveredIndex === null || activeHoveredIndex === 0 ? "h-[750px]" : "h-[550px]"}`}
            >
              <div className="flex-[1.8] p-8 md:p-12">
                <h2 className="text-4xl md:text-5xl lg:text-5xl font-cabinet font-medium leading-[0.9] tracking-tighter w-full mb-6">
                  Featured Work
                </h2>
                <p className="text-sm md:text-base tracking-[0.2em] font-aeonik font-regular text-[#a1a1a1] max-w-md">
                  Design without compromise. Explore my blend of digital product
                  design, website design, and branding.
                </p>
              </div>
              <div className="flex-1 w-full px-4 pb-4 flex">
                <div
                  ref={btnContainerRef}
                  onClick={() => navigate("/projects")}
                  onMouseEnter={() => setIsBtnAreaHovered(true)}
                  onMouseLeave={() => setIsBtnAreaHovered(false)}
                  className="group flex-1 w-full bg-[#1c1c1c] flex items-center justify-center rounded-sm relative overflow-hidden cursor-pointer"
                >
                  <div className="absolute top-0 left-0 w-full h-full bg-[#E35239] transition-transform duration-500 origin-top scale-y-0 group-hover:scale-y-100" />
                  <div
                    ref={btnRef}
                    className="relative z-10 pointer-events-none"
                  >
                    <CtaButton
                      text="All Work"
                      to="/projects"
                      bgColor="bg-[#1c1c1c]"
                      textColor="text-white"
                      dotColor="bg-[#E35239]"
                      arrowColor="text-[#E35239]"
                      magneticStrength={0}
                      forceHover={isBtnAreaHovered}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Container */}
          <div
            onMouseMove={handleGalleryMouseMove}
            onMouseEnter={() => setIsGalleryHovered(true)}
            onMouseLeave={() => {
              setIsGalleryHovered(false);
              setActiveHoveredIndex(null);
            }}
            className="flex-[3] flex flex-col md:flex-row gap-4 h-full relative"
          >
            <div
              ref={sharedThumbCtaRef}
              className={`absolute top-0 left-0 pointer-events-none z-50 transition-opacity duration-300 ${isGalleryHovered && activeHoveredIndex !== 0 && activeHoveredIndex !== null ? "opacity-100" : "opacity-0"}`}
            >
              <CtaButton
                text="View Project"
                bgColor="bg-[#1c1c1c]"
                textColor="text-white"
                dotColor="bg-[#E35239]"
                arrowColor="text-[#E35239]"
                showArrow={true}
                magneticStrength={0}
                forceHover={true}
                fontSize="text-xs md:text-sm"
                className="py-2.5 px-6 whitespace-nowrap shadow-2xl border border-[#262626]"
              />
            </div>

            {otherProjects.map((p, index) => (
              <div
                key={p.slug}
                className={`hidden md:flex flex-col gap-1 transition-all duration-700 ease-in-out ${activeHoveredIndex === index + 1 ? "flex-[1.6]" : "flex-1"}`}
              >
                <div className="overflow-hidden text-left w-full h-8">
                  <span
                    className={`block text-2xl font-cabinet font-light text-[var(--foreground)] transition-all duration-500 ease-out ${activeHoveredIndex === index + 1 ? "translate-y-0 opacity-100" : "translate-y-[110%] opacity-0"}`}
                  >
                    0{index + 1}
                  </span>
                </div>
                <Link
                  to={`/projects/${p.slug}`}
                  onMouseEnter={() => setActiveHoveredIndex(index + 1)}
                  onMouseLeave={() => setActiveHoveredIndex(null)}
                  className={`w-full bg-[#dbdbdb] rounded-sm overflow-hidden group/thumb relative transition-all duration-700 ease-in-out cursor-pointer ${activeHoveredIndex === index + 1 ? (index === 0 ? "h-[800px]" : "h-[750px]") : index === 0 ? "h-[600px]" : "h-[550px]"} backface-hidden transform-gpu`}
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/thumb:scale-105 will-change-transform scale-[1.01]"
                  />
                  <div className="absolute inset-0 bg-[#131313]/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                    <div className="overflow-hidden">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/70 mb-2 transition-transform duration-500 ease-out translate-y-full group-hover/thumb:translate-y-0 delay-75">
                        {p.projectType}
                      </p>
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="text-2xl md:text-3xl font-cabinet text-white uppercase leading-none transition-transform duration-500 ease-out translate-y-full group-hover/thumb:translate-y-0 delay-150">
                        {p.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>
            ))}

            {[...Array(Math.max(0, 3 - otherProjects.length))].map((_, i) => (
              <div
                key={`empty-${i}`}
                className="hidden md:flex flex-col gap-1 flex-1 transition-all duration-700 ease-in-out"
              >
                <div className="h-8" />
                <div className="w-full bg-[#dbdbdb] rounded-sm h-[550px]" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectPage;
