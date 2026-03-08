import React, { useLayoutEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import ArrowIcon from "../components/ArrowIcon";
import CtaButton from "../components/CtaButton";
import CurvedMarquee from "../components/CurvedMarquee";
import CurvedTransition from "../components/CurvedTransition";

type Project = {
  title: string;
  description: string;
  image: string;
  smallImages: string[];
  year: string;
  type: string;
  workedOn?: Record<string, string[]>;
  tagsByCategory?: Record<string, string[]>;
  location: string;
  services: string[];
};
// ... rest of the file stays the same until the return ...

const PROJECTS: { [key: string]: Project } = {
  nordwear: {
    title: "Nordwear",
    description:
      "NordWear is a modern e-commerce platform inspired by Scandinavian minimalism, focused on performance, clean design, and seamless shopping.",
    image: "/images/projectImages/NordWear/NordWear-img-opt.webp",
    smallImages: [
      "/images/projectImages/NordWear/Nordwear-mobile.webp",
      "/images/projectImages/NordWear/Nordwear-mobile2.webp",
      "/images/projectImages/NordWear/Nordwear-category.webp",
      "/images/projectImages/NordWear/Nordwear-cart.webp",
      "/images/projectImages/NordWear/Nordwear-production.webp",
    ],
    year: "2025",
    type: "Website",
    workedOn: {
      Frontend: [
        "Responsive UI built with React and TypeScript",
        "Product listings and filtering",
        "Shopping cart and checkout interface",
        "Animations with GSAP",
      ],
      Backend: [
        "REST API built with Node.js and Express",
        "Authentication and session handling",
        "Stripe payment integration",
        "Admin panel with CRUD functionality",
      ],
      Database: [
        "Relational database design in MySQL",
        "Data modeling with Prisma ORM",
        "Products, users and orders schema",
      ],
    },
    location: "Denmark",
    services: [
      "Frontend",
      "backend",
      "Security",
      "Image Ai Generation",
      "UI/UX Design",
      "Performance Optimization",
    ],
    tagsByCategory: {
      Frontend: [
        "React",
        "TypeScript",
        "Taildwind CSS",
        "Vite",
        "GSAP",
        "Axios",
      ],
      Backend: ["Node.js", "Express"],
      Database: ["MySQL", "Prisma ORM"],
      "DevOps / Deployment": [
        "Docker",
        "DigitalOcean App Platform",
        "Cloudinary (image hosting)",
        "GitHub",
        "Github actions (CI/CD)",
        "Postman",
        "Git",
      ],
      "Payment & Services": [
        "Stripe (payments)",
        "Shipmondo (shipping)",
        "Resend (emails)",
      ],
      Design: ["Figma (UI design)"],
    },
  },
  "visuel-atelier": {
    title: "Visuel Atelier",
    description:
      "A prototype exploring high-end visual storytelling and motion-driven user interfaces for digital studios.",
    image: "/images/Visuel-Atelier.webp",
    smallImages: [
      "/images/projectImages/NordWear/Nordwear-mobile.webp",
      "/images/projectImages/NordWear/Nordwear-mobile2.webp",
    ],
    year: "2023",
    type: "Prototype",
    location: "france",
    services: ["UI/UX Design", "Prototyping"],
    tags: ["Three.js", "GSAP", "Vite", "React"],
  },
  "bang-olufsen": {
    title: "Bang & Olufsen",
    description:
      "A mobile application concept for Bang & Olufsen, focusing on premium audio control and seamless hardware integration.",
    image: "/images/Bang&Olufsen.webp",
    smallImages: [
      "/images/projectImages/NordWear/Nordwear-mobile.webp",
      "/images/projectImages/NordWear/Nordwear-mobile2.webp",
    ],
    year: "2024",
    type: "Mobile Application",
    location: "denmark",
    services: ["Mobile Development", "UI/UX Design"],
    tags: ["React Native", "TypeScript", "UI/UX", "Prototype"],
  },
};

const ProjectPage: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = PROJECTS[slug || "nordwear"] || PROJECTS["nordwear"];

  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const scrollPromptRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const workedOnRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // ... existing entrance animations ...
      const tl = gsap.timeline({
        defaults: { ease: "power4.out", duration: 1.4 },
      });

      tl.from(headingRef.current, {
        y: 150,
        opacity: 0,
        delay: 0.4,
      })
        .from(
          descRef.current,
          {
            y: 50,
            opacity: 0,
          },
          "-=1.1",
        )
        .from(
          scrollPromptRef.current,
          {
            y: 30,
            opacity: 0,
          },
          "-=1",
        )
        .from(
          imageRef.current,
          {
            y: 100,
            opacity: 0,
            scale: 1.05,
            duration: 1.6,
          },
          "-=1.2",
        );

      // 1. Theme Transition: Light to Dark (at the top)
      const topTrigger = gsap.timeline({
        scrollTrigger: {
          trigger: imageRef.current,
          start: "bottom 60%",
          end: "bottom 20%",
          scrub: 1,
        },
      });

      topTrigger.to(":root", {
        "--background": "#131313",
        "--foreground": "rgb(230, 230, 231)",
        "--foreground-muted": "#a1a1a1",
        "--menu-bg": "rgb(230, 230, 231)",
        "--menu-text": "#131313",
        ease: "none",
      });

      // 2. Theme Transition: Back to Light (at the bottom)
      const bottomTrigger = gsap.timeline({
        scrollTrigger: {
          trigger: workedOnRef.current,
          start: "top 85%",
          end: "top 45%",
          scrub: 1,
        },
      });

      bottomTrigger.to(":root", {
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

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen bg-[var(--background)] text-[var(--foreground)] mt-42"
    >
      <div className="px-4 md:px-10 lg:px-4 xl:px-6">
        {/* Hero Content Grid */}
        <div className="items-start">
          {/* Main Column: Heading, Description & Scroll Prompt */}
          <div className="w-full flex justify-between items-end mb-16">
            <h1
              ref={headingRef}
              className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-regular font-cabinet leading-[0.8] tracking-tighter uppercase"
            >
              {project.title}
            </h1>
            <p
              ref={descRef}
              className="text-xl font-cabinet max-w-md italic leading-snug text-right"
            >
              {project.description}
            </p>
          </div>
          <div className="overflow-hidden mb-16">
            {/* Scroll Explore Prompt */}
            <div ref={scrollPromptRef} className="flex items-center gap-4">
              <div className="rotate-90">
                <ArrowIcon className="w-4 h-4" />
              </div>
              <span className="text-sm tracking-[0.3em] font-thin uppercase">
                Scroll To Explore
              </span>
            </div>
          </div>
        </div>

        {/* Hero Full Width Image - MINIMAL ROUNDED CORNERS */}
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

        {/* Divider and Details Section */}
        <div className="w-full border-t border-[var(--foreground)] border-opacity-10 my-16" />

        <div className="w-full flex flex-col lg:flex-row justify-between items-start gap-10 lg:gap-32 mb-32">
          {/* Left: Paragraph and CTA */}
          <div className="flex-1 flex flex-col items-start max-w-xl">
            <p className="text-2xl md:text-2xl text-[var(--foreground)] text-left max-w-xl leading-tight mb-8">
              This project demonstrates a modern approach to digital
              experiences, focusing on performance, accessibility, and beautiful
              design.
            </p>
            <p className="text-md md:text-md italic text-[var(--foreground)] opacity-60 text-left max-w-3xl leading-tight mb-16">
              This project is a conceptual case study. Visual direction and
              stylistic inspiration were drawn from Errant.dk.
            </p>
            <CtaButton
              text="Visit Website"
              href={
                project.title === "Nordwear" ? "https://nordwear-shop.dk/" : "#"
              }
              target="_blank"
              rel="noopener noreferrer"
            />
          </div>

          {/* Right: Details, Services, Tags */}
          <div className="flex flex-col min-w-[240px] gap-16 text-left">
            {/* Year, Type, Location */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-32">
                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--foreground)] opacity-40 mb-1">
                    Year
                  </h3>
                  <p className="text-lg text-[var(--foreground)] font-aeonik leading-relaxed">
                    {project.year}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--foreground)] opacity-40 mb-1">
                    Type
                  </h3>
                  <p className="text-lg text-[var(--foreground)] font-aeonik leading-relaxed">
                    {project.type}
                  </p>
                </div>
                {project.location && (
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--foreground)] opacity-40 mb-1">
                      Location
                    </h3>
                    <p className="text-lg text-[var(--foreground)] font-aeonik leading-relaxed">
                      {project.location}
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* Services */}
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--foreground)] opacity-40 mb-4">
                Services
              </h3>
              <div className="flex flex-wrap gap-x-4 gap-y-3 max-w-xl">
                {project.services?.map((service) => (
                  <span
                    key={service}
                    className="inline-block whitespace-nowrap px-4 py-1.5 rounded-full bg-[rgb(230,230,231)] text-[#131313] text-base font-medium transition-all duration-300 hover:translate-y-[-3px] hover:shadow-[0_6px_16px_rgba(227,82,57,0.25)]"
                    style={{ width: "fit-content" }}
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detail Images - MINIMAL ROUNDED CORNERS & HORIZONTAL ASPECT */}
        {project.smallImages && project.smallImages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-32">
            {project.smallImages.slice(0, 2).map((img, i) => (
              <div
                key={i}
                className="aspect-[4/3] w-full overflow-hidden bg-neutral-200 rounded-sm"
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

        <div className="w-full flex flex-col lg:flex-row gap-16 justify-between items-start mb-32">
          <div className="text-left lg:w-[30%]">
            <h1 className="project-header-text text-5xl md:text-6xl lg:text-7xl w-full max-w-xl text-left font-cabinet font-medium text-[var(--foreground)] leading-none tracking-tight mb-8">
              Tech Stack
            </h1>
            <p className="text-2xl text-[var(--foreground)] text-left max-w-md leading-tight opacity-60">
              Technologies and tools used to bring this project to life
            </p>
          </div>

          {/* Right side: Organized Grid but pushed to the right edge */}
          <div className="lg:w-[65%] grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-16 text-left">
            {project.tagsByCategory &&
              Object.entries(project.tagsByCategory).map(([category, tags]) => (
                <div
                  key={category}
                  className="flex flex-col items-start h-full"
                >
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--foreground)] opacity-40 mb-6 border-b border-[var(--foreground)] border-opacity-10 w-full pb-2">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block whitespace-nowrap px-4 py-1.5 rounded-full bg-[rgb(230,230,231)] text-[#131313] text-base font-medium transition-all duration-300 hover:translate-y-[-3px] hover:shadow-[0_6px_16px_rgba(227,82,57,0.25)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Detail Images - MINIMAL ROUNDED CORNERS & HORIZONTAL ASPECT */}
        {project.smallImages && project.smallImages.length >= 3 && (
          <div className="w-full mb-32 flex flex-col gap-8">
            {/* First row: single image, 16/9 aspect */}
            <div className="w-full aspect-[16/9] overflow-hidden bg-neutral-200 rounded-sm">
              <img
                className="w-full h-full object-cover"
                src={project.smallImages[2]}
                alt={`${project.title} detail 1`}
              />
            </div>
            {/* Second row: two images, 4/3 aspect */}
            <div className="grid grid-cols-2 gap-8 w-full">
              {[project.smallImages[3], project.smallImages[4]].map(
                (img, i) => (
                  <div
                    key={i}
                    className="aspect-[1/1] w-full overflow-hidden bg-neutral-200 rounded-sm"
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

        <div 
          ref={workedOnRef}
          className="w-full flex flex-col lg:flex-row justify-between items-start gap-10 lg:gap-32 mb-32"
        >
          {/* Left: Paragraph and CTA */}
          <div className="flex-1 flex flex-col items-start max-w-xl">
            <p className="text-2xl md:text-2xl text-[var(--foreground)] text-left max-w-xl leading-tight mb-8">
              My work on NordWear covered several areas of the product,
              including frontend development, backend architecture and interface
              design, with a focus on performance, usability and a refined
              shopping experience.
            </p>
            <p className="text-md md:text-md italic text-[var(--foreground)] opacity-60 text-left max-w-3xl leading-tight mb-16">
              Not all aspects of my work will be displayed here, but here are
              some of the main aspects
            </p>
          </div>

          {/* Right: Details, Services, Tags */}
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

      {/* Curved Marquee Section */}
      <div className="w-full mt-10 mb-[-120px] cursor-default">
        <CurvedMarquee
          text={marqueeText}
          speed={100}
          fontSize="3rem"
          className="w-full"
        />
      </div>
    </div>
  );
};

export default ProjectPage;
