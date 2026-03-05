import React, { useCallback, useRef, useEffect, useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SplitType from "split-type";
import ProjectTag from "../components/projectTag";
import ProjectGallerySection, {
  type GallerySlide,
} from "../sections/ProjectGallery/ProjectGallerySection";
import { gsap } from "../utils/animations";

type Project = {
  title: string;
  description: string;
  textSlide: {
    heading: string;
    text: string;
    smallImg: Array<{ src: string; alt: string }>;
    img: string;
    slideTexts?: string[];
  };
  tags: { label: string; type: string; url?: string }[];
};

const PROJECTS: { [key: string]: Project } = {
  "nordwear-shop": {
    title: "Nordwear",
    textSlide: {
      heading: "NordWear — Scandinavian Inspired E-Commerce",
      text: "NordWear is a modern e-commerce platform inspired by Scandinavian minimalism. The project focuses on performance, clean design, and a seamless shopping experience across devices. Built as a full-stack web application, NordWear combines a modern React frontend with a scalable backend architecture.",
      slideTexts: [
        "NordWear is a modern e-commerce platform inspired by Scandinavian minimalism. The project focuses on performance, clean design, and a seamless shopping experience across devices.",
        "Built as a full-stack web application, NordWear combines a modern React frontend with a scalable backend architecture.",
        "The design system emphasizes clarity and usability, with a focus on fast load times and accessible interactions.",
        "From product discovery to checkout, every touchpoint is crafted for a premium online shopping experience.",
        "Backend services handle inventory, orders, and analytics with a scalable Node.js stack.",
        "The project explores how clean design, performance-focused development, and subtle motion can create a premium experience.",
        "Built with React, TypeScript and a Node.js backend, the platform focuses on speed, usability, and scalable architecture.",
      ],
      smallImg: [
        { src: "https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&w=600", alt: "Laptop on desk" },
        { src: "https://images.pexels.com/photos/3182766/pexels-photo-3182766.jpeg?auto=compress&w=600", alt: "People collaborating" },
        { src: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&w=600", alt: "Office workspace" },
        { src: "https://images.pexels.com/photos/2102416/pexels-photo-2102416.jpeg?auto=compress&w=600", alt: "Coffee and notebook" },
        { src: "https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg?auto=compress&w=600", alt: "Team meeting" },
        { src: "https://images.pexels.com/photos/267614/pexels-photo-267614.jpeg?auto=compress&w=600", alt: "Workspace with plant" },
        { src: "https://images.pexels.com/photos/196652/pexels-photo-196652.jpeg?auto=compress&w=600", alt: "Modern office" },
      ],
      img: "https://images.pexels.com/photos/3184435/pexels-photo-3184435.jpeg?auto=compress&w=600",
    },
    description: "NordWear is a modern e-commerce concept inspired by Scandinavian minimalism.",
    tags: [
      { label: "Product", type: "website/e-commerce" },
      { label: "year", type: "2025" },
      { label: "deliverables", type: "design, frontend, backend, database, devops" },
      { label: "see live", type: "Nordwear-shop.dk", url: "https://nordwear-shop.dk" },
      { label: "GitHub", type: "github", url: "https://github.com/yourorg/nordwear-shop" },
    ],
  },
};

function projectToGallerySlides(project: Project): GallerySlide[] {
  const { text, smallImg, slideTexts } = project.textSlide;
  return smallImg.map((item, i) => ({
    image: item.src,
    alt: item.alt,
    text: slideTexts?.[i] ?? text,
  }));
}

const ProjectPage: React.FC = () => {
  const { slug } = useParams();
  const project = PROJECTS[slug || "nordwear-shop"] ?? PROJECTS["nordwear-shop"];
  const gallerySlides = projectToGallerySlides(project);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const slideTextRef = useRef<HTMLSpanElement>(null);

  const goTo = useCallback((delta: number) => {
    setActiveIndex((prev) => {
      const next = Math.max(0, Math.min(gallerySlides.length - 1, prev + delta));
      activeIndexRef.current = next;
      return next;
    });
  }, [gallerySlides.length]);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useLayoutEffect(() => {
    const el = slideTextRef.current;
    if (!el || !el.textContent?.trim()) return;

    const split = new SplitType(el, { types: "lines" });
    gsap.from(split.lines, {
      yPercent: 100,
      opacity: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: "power2.out",
    });

    return () => {
      split.revert();
    };
  }, [activeIndex]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || gallerySlides.length <= 1) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) goTo(1);
      else if (e.deltaY < 0) goTo(-1);
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, [gallerySlides.length, goTo]);

  return (
    <div
      ref={containerRef}
      className="project-page-root px-4 md:px-10 lg:px-4 xl:px-6"
      style={{
        boxSizing: "border-box",
        minHeight: "calc(100vh - 7rem)",
        height: "calc(100vh - 7rem)",
        overflow: "hidden",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        paddingTop: "3rem",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gridTemplateRows: "minmax(16rem, auto) auto",
          gap: "0 1.5rem",
          alignItems: "start",
        }}
      >
        <div className="mb-8" style={{ gridColumn: "1 / 9", gridRow: "1", display: "flex", flexDirection: "column", flexShrink: 0, alignSelf: "start" }}>
          <h1 className="text-left text-4xl md:text-6xl lg:text-5xl xl:text-6xl 2xl:text-8xl text-[#1b1b1a] md:max-w-6xl 2xl:max-w-7xl font-aeonik font-medium leading-[1.2] tracking-tight uppercase">
            {project.title}
          </h1>
          <p className="project-page-slide-text mt-4 text-lg text-left text-gray-700 leading-relaxed max-w-2xl">
            <span ref={slideTextRef} key={activeIndex}>
              {gallerySlides[activeIndex]?.text ?? gallerySlides[0]?.text}
            </span>
          </p>
        </div>

        <div style={{ gridColumn: "9 / -1", gridRow: "1", display: "flex", flexDirection: "column", flexShrink: 0, alignSelf: "start" }}>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <ProjectTag key={tag.label} label={tag.label} type={tag.type} />
            ))}
          </div>
        </div>

        <div
          style={{
            gridColumn: "1 / 9",
            gridRow: "2",
            display: "flex",
            alignItems: "flex-end",
            flexShrink: 0,
            alignSelf: "end",
          }}
          className="project-page-gallery-left-cell"
        >
          <ProjectGallerySection
            id="gallery"
            slides={gallerySlides}
            activeIndex={activeIndex}
            className="project-page-gallery"
          />
        </div>

        <div style={{ gridColumn: "9 / -1", gridRow: "2" }} />
      </div>
    </div>
  );
};

export default ProjectPage;
