import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
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
        delay: 0,
        onStart: () => {
          animationTriggeredRef.current = true;
        },
      });

      const headingTargets = gsap.utils.toArray<HTMLElement>(".about-heading");
      const rightTextTargets =
        gsap.utils.toArray<HTMLElement>(".about-right-text");
      const buttonTarget =
        containerRef.current?.querySelector<HTMLElement>(".about-button-fade");
      const paragraphSplits: SplitType[] = [];
      const paragraphLines: HTMLElement[] = [];

      if (headingTargets.length) {
        gsap.set(headingTargets, { y: 90, autoAlpha: 0 });

        entranceTl.fromTo(
          headingTargets,
          {
            y: 90,
            autoAlpha: 0,
          },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.9,
            ease: "power4.out",
            force3D: true,
          },
          0,
        );
      }

      if (rightTextTargets.length) {
        rightTextTargets.forEach((paragraph) => {
          const split = new SplitType(paragraph, {
            types: "lines",
            lineClass: "about-line",
          });

          paragraphSplits.push(split);

          (split.lines ?? []).forEach((line) => {
            const wrapper = document.createElement("div");
            wrapper.className = "overflow-hidden";
            line.parentNode?.insertBefore(wrapper, line);
            wrapper.appendChild(line);
            paragraphLines.push(line as HTMLElement);
          });
        });

        gsap.set(paragraphLines, { y: 40, autoAlpha: 0 });

        entranceTl.fromTo(
          paragraphLines,
          {
            y: 40,
            autoAlpha: 0,
          },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.72,
            stagger: 0.045,
            ease: "power3.out",
            force3D: true,
          },
          0.08,
        );
      }

      if (buttonTarget) {
        gsap.set(buttonTarget, { autoAlpha: 0, y: 10 });

        entranceTl.fromTo(
          buttonTarget,
          {
            autoAlpha: 0,
            y: 10,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          0.48,
        );
      }

      // --- SCROLL ANIMATIONS FOR SERVICES AND EXPERIENCE ---

      // Section Titles reveal
      const sectionTitles = gsap.utils.toArray<HTMLElement>(
        ".about-section-title",
      );
      sectionTitles.forEach((title) => {
        gsap.fromTo(
          title,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: title,
              start: "top 90%",
              once: true,
            },
          },
        );
      });

      // Unified helper for item animations (Service and Experience)
      const animateItem = (
        selector: string,
        titleSelector: string,
        descriptionSelector: string,
        extraSelectors: string[] = [],
      ) => {
        const items = gsap.utils.toArray<HTMLElement>(selector);

        items.forEach((item) => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: item,
              start: "top 88%",
              once: true,
            },
          });

          const title = item.querySelector(titleSelector);
          const description = item.querySelector(descriptionSelector);
          const extras = extraSelectors
            .map((s) => item.querySelector(s))
            .filter(Boolean);

          // 1. Slide up the whole item container slightly if needed, or just children
          // We'll slide up the title and extras first
          if (title) {
            tl.fromTo(
              title,
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
              0,
            );
          }

          if (extras.length) {
            tl.fromTo(
              extras,
              { y: 20, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.7,
                stagger: 0.05,
                ease: "power3.out",
              },
              0.1,
            );
          }

          // 2. Split lines for description
          if (description) {
            const split = new SplitType(description as HTMLElement, {
              types: "lines",
            });
            paragraphSplits.push(split);

            const lines: HTMLElement[] = [];
            (split.lines ?? []).forEach((line) => {
              const wrapper = document.createElement("div");
              wrapper.className = "overflow-hidden py-0.5 -my-0.5"; // Small padding to prevent clipping
              line.parentNode?.insertBefore(wrapper, line);
              wrapper.appendChild(line);
              lines.push(line as HTMLElement);
            });

            tl.fromTo(
              lines,
              { y: 30, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.7,
                stagger: 0.04,
                ease: "power3.out",
              },
              0.2,
            );
          }
        });
      };

      // Apply animations
      animateItem(
        ".about-service-item",
        ".about-service-title",
        ".about-service-description",
      );
      animateItem(
        ".about-experience-item",
        ".about-experience-title",
        ".about-experience-description",
        [
          ".about-experience-subtitle",
          ".about-experience-date",
          ".about-experience-subtitle-wrap",
        ],
      );

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

      if (!isLoaderActive && (isInitialLoaderDone || !isNavigating)) {
        requestAnimationFrame(() => startEntranceAnimation());
      }

      const safetyTimeout = setTimeout(
        () => {
          if (!animationTriggeredRef.current) startEntranceAnimation();
        },
        isLoaderActive ? 900 : 320,
      );

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
        paragraphSplits.forEach((split) => split.revert());
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
          <div className="overflow-hidden mb-10">
            <h1 className="about-heading project-header-text text-5xl sm:text-6xl md:text-7xl lg:text-9xl w-full text-left font-aeonik font-medium text-[#1b1b1a] leading-[1.25] tracking-tight whitespace-normal md:whitespace-nowrap">
              About Me
            </h1>
          </div>

          <div className=" grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 lg:gap-16 items-start lg:items-stretch">
            <div className="overflow-hidden rounded-[2rem]">
              <div className="about-image-reveal w-full max-w-lg lg:max-w-none aspect-[3/4] lg:aspect-auto lg:h-full overflow-hidden rounded-[2rem] border border-[#1b1b1a]/10 bg-[#1b1b1a]/5">
                <img
                  src="/images/portrait-about.webp"
                  alt="Alexander - Product Designer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="w-full flex flex-col items-start text-left">
              <div className="overflow-hidden">
                <p className="about-right-text font-aeonik text-sm md:text-base uppercase tracking-[0.2em] text-[#1b1b1a]/70">
                  my story
                </p>
              </div>

              <div className="overflow-hidden mt-4">
                <div className="overflow-hidden">
                  <p className="about-right-text text-2xl md:text-3xl lg:text-4xl font-aeonik text-[#1b1b1a] leading-tight mb-8 font-regular">
                    Based in Copenhagen , I’m a frontend developer focused on
                    crafting modern web experiences.
                  </p>
                </div>
                <div className="overflow-hidden">
                  <p className="about-right-text text-2xl md:text-3xl lg:text-4xl font-aeonik text-[#1b1b1a] leading-tight font-regular">
                    I work primarily with React, TypeScript and GSAP —
                    combining performance, motion, and thoughtful design to
                    build interfaces that feel fast, refined, and engaging.
                  </p>
                </div>
              </div>

              <div className="about-button-fade mt-8">
                <AnimatedButton
                  text="download resume"
                  padding="px-8 py-4"
                  fontSize="text-lg md:text-xl"
                  baseBgColor="bg-[#1b1b1a]"
                  baseTextColor="text-white"
                  hoverBgColor="bg-[#f5f5f3]"
                  hoverTextColor="text-[#1b1b1a]"
                  baseBorderColor="border-[#1b1b1a]"
                  hoverBorderColor="border-[#1b1b1a]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stuff I Do Section: Two Columns (Left Aligned) */}
        <section className="stuff-i-do-section w-full flex flex-col md:flex-row text-left gap-16 md:gap-0 pt-24 px-6 md:px-10 lg:px-12 xl:px-16">
          {/* Left Column: Section Title */}
          <div className="w-full md:w-1/3">
            <h2 className="about-section-title text-4xl md:text-5xl font-aeonik font-bold text-[#1b1b1a] uppercase md:sticky md:top-32">
              stuff i do
            </h2>
          </div>

          {/* Right Column: Service List */}
          <div className="w-full md:w-2/3 md:pl-12 lg:pl-24">
            <ServiceItem
              title="Frontend Engineering"
              description="Building performant, scalable user interfaces with React and TypeScript. I focus on scalable architecture, maintainable systems, and thoughtful user experience."
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
            <h2 className="about-section-title text-4xl md:text-5xl font-aeonik font-bold text-[#1b1b1a] uppercase md:sticky md:top-32">
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
