import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedButton from "../components/AnimatedButton";
import ServiceItem from "../components/ServiceItem";
import ExperienceItem from "../components/ExperienceItem";

gsap.registerPlugin(ScrollTrigger);

const AboutPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationTriggeredRef = useRef(false);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Create the entrance timeline (initially paused)
      const entranceTl = gsap.timeline({
        paused: true,
        delay: 0.08,
        onStart: () => {
          animationTriggeredRef.current = true;
        },
      });

      const entranceTargets = gsap.utils.toArray<HTMLElement>(".about-item");

      if (entranceTargets.length) {
        entranceTl.fromTo(
          entranceTargets,
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            stagger: 0.1,
            ease: "power3.out",
          },
        );
      }

      const animatedItems = gsap.utils.toArray<HTMLElement>(
        ".about-animate-item",
      );

      gsap.set(animatedItems, { y: 24, autoAlpha: 0 });

      animatedItems.forEach((item) => {
        gsap.to(item, {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 88%",
            once: true,
          },
        });
      });

      const startEntranceAnimation = () => {
        if (animationTriggeredRef.current) return;
        entranceTl.play();
        sessionStorage.removeItem("isNavigating");
      };

      // 2. Coordination logic
      const handleTransitionComplete = () => startEntranceAnimation();
      window.addEventListener(
        "initial-loader-complete",
        handleTransitionComplete,
      );
      window.addEventListener(
        "page-transition-complete",
        handleTransitionComplete,
      );

      const isInitialLoaderDone =
        sessionStorage.getItem("hasSeenInitialLoader") === "true";
      const isLoaderActive = !!document.querySelector(".initial-loader-wrap");
      const isNavigating = sessionStorage.getItem("isNavigating") === "true";

      if (!isNavigating && isInitialLoaderDone && !isLoaderActive) {
        startEntranceAnimation();
      }

      const safetyTimeout = setTimeout(() => {
        if (!animationTriggeredRef.current) startEntranceAnimation();
      }, 1500);

      return () => {
        window.removeEventListener(
          "initial-loader-complete",
          handleTransitionComplete,
        );
        window.removeEventListener(
          "page-transition-complete",
          handleTransitionComplete,
        );
        clearTimeout(safetyTimeout);
        entranceTl.kill();
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen pt-28 flex flex-col items-center bg-transparent overflow-x-hidden"
    >
      <div className="w-full flex flex-col items-center pb-64">
        {/* Top Section */}
        <div className="w-full mb-48 px-6 md:px-10 lg:px-12 xl:px-48">
          <h1 className="project-header-text text-5xl sm:text-6xl md:text-7xl lg:text-9xl w-full text-left font-aeonik font-medium text-[#1c1d1e] leading-[1.25] tracking-tight whitespace-normal md:whitespace-nowrap mb-10">
            About Me
          </h1>

          <div className=" grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 lg:gap-16 items-start lg:items-stretch">
            <div className="w-full max-w-lg lg:max-w-none aspect-[3/4] lg:aspect-auto lg:h-full overflow-hidden rounded-[2rem] border border-[#1c1d1e]/10 bg-[#1c1d1e]/5">
              <img
                src="/images/portrait-about.webp"
                alt="Alexander - Product Designer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="w-full flex flex-col items-start text-left">
              <p className="font-aeonik text-sm md:text-base uppercase tracking-[0.2em] text-[#1c1d1e]/70">
                my story
              </p>

              <p className="mt-4 text-2xl md:text-3xl lg:text-5xl font-aeonik text-[#1c1d1e] leading-tight font-regular">
                Based in Copenhagen{" "}
                <img
                  src="/images/danish-flag.svg"
                  alt="Danish Flag"
                  className="inline-block h-[0.7em] md:h-[0.8em] align-middle ml-1 mb-[0.15em] rounded-full"
                />
                , I’m a frontend-focused developer with a passion for motion and
                performance.
                <br></br> <br></br> I specialize in React, TypeScript and GSAP —
                building immersive, high-end digital experiences that feel as
                refined as they look.
              </p>

              <div className="mt-8">
                <AnimatedButton
                  text="download resume"
                  padding="px-12 py-7"
                  fontSize="text-lg md:text-xl"
                  baseBgColor="bg-[#1c1d1e]"
                  baseTextColor="text-white"
                  hoverBgColor="bg-[#f4f4f5]"
                  hoverTextColor="text-[#1c1d1e]"
                  baseBorderColor="border-[#1c1d1e]"
                  hoverBorderColor="border-[#1c1d1e]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stuff I Do Section: Two Columns (Left Aligned) */}
        <section className="stuff-i-do-section w-full flex flex-col md:flex-row text-left gap-16 md:gap-0 pt-24 px-6 md:px-10 lg:px-12 xl:px-16">
          {/* Left Column: Section Title */}
          <div className="w-full md:w-1/3">
            <h2 className="text-4xl md:text-5xl font-aeonik font-bold text-[#1c1d1e] uppercase md:sticky md:top-32">
              stuff i do
            </h2>
          </div>

          {/* Right Column: Service List */}
          <div className="w-full md:w-2/3 md:pl-12 lg:pl-24">
            <ServiceItem
              title="Frontend Engineering"
              description="Building performant, scalable user interfaces with React and TypeScript. I focus on clean architecture, maintainable code, and thoughtful UX."
            />
            <ServiceItem
              title="Motion & Interaction"
              description="Crafting immersive interactions using GSAP and modern animation techniques. Motion isn’t decoration — it’s communication."
              showDivider={true}
            />
            <ServiceItem
              title="Backend Fundamentals"
              description="Understanding APIs, databases and server-side logic to build complete digital products. I enjoy working with Node, Express and relational databases — and I’m continuously expanding my backend knowledge."
              showDivider={true}
            />
          </div>
        </section>

        {/* Experience & Education Section: Two Columns */}
        <section className="experience-section w-full flex flex-col md:flex-row text-left gap-16 md:gap-0 pt-32 px-6 md:px-10 lg:px-12 xl:px-16">
          {/* Left Column: Section Title */}
          <div className="w-full md:w-1/3">
            <h2 className="text-4xl md:text-5xl font-aeonik font-bold text-[#1c1d1e] uppercase md:sticky md:top-32">
              EXPERIENCE & <br /> EDUCATION
            </h2>
          </div>
          {/* Right Column: Experience/Education List */}
          <div className="w-full md:w-2/3 md:pl-12 lg:pl-24">
            <ExperienceItem
              title="Erhvervsakademiet København"
              subtitle="Education - Web developer"
              dates="2024-2026"
              description="Focused on full-stack development, modern web technologies, and software architecture. Gaining deep insights into creating scalable digital solutions and mastering the craft of modern web development."
              showDivider={true}
            />
            <ExperienceItem
              title="internship DemensAI"
              subtitle="Fullstack developer"
              dates="2025 - 2025"
              description="Led the design and development of DemensAI’s official website as part of my bachelor project, focusing on performance, accessibility and scalable architecture. Focused on creating a high-performance, accessible digital presence that effectively communicates their mission in the healthcare technology space."
              showDivider={true}
            />
            <ExperienceItem
              title="University College Lillebælt"
              subtitle="education - multimedia designer"
              dates="2023-2024"
              description="Studied the intersection of design, technology, and business. Developed core skills in UI/UX design, front-end development, and digital content creation, laying the foundation for my career in product design."
              showDivider={true}
            />
            <ExperienceItem
              title="CryoByBreum"
              subtitle="design & development - freelance"
              dates="2024-present"
              description="Collaborated with CryoByBreum to build their entire digital identity. This included the strategic design and development of their website, as well as the creation of their visual identity and custom logo design."
              showDivider={true}
            />
            <ExperienceItem
              title="Internship OnlinePlus"
              subtitle="developer"
              dates="2023-2023"
              description="Gained valuable hands-on experience in a professional development environment. Focused on strengthening my backend skills while learning to navigate complex workflows and collaborative team structures."
              showDivider={true}
            />
          </div>{" "}
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
