import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";
import AnimatedButton from "../components/AnimatedButton";
import ServiceItem from "../components/ServiceItem";
import ExperienceItem from "../components/ExperienceItem";
import { initAboutItemsAnimation } from "./About.anim";

const AboutPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const animationTriggeredRef = useRef(false);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    // Synchronously hide elements that will be animated in
    gsap.set([headingRef.current, ".about-item"], { 
      autoAlpha: 0 
    });

    const ctx = gsap.context(() => {
      const startEntranceAnimation = () => {
        if (animationTriggeredRef.current) return;
        animationTriggeredRef.current = true;
        console.log("AboutPage: Running entrance animation");

        // Show elements for animation
        gsap.set([headingRef.current, ".about-item"], { 
          autoAlpha: 1 
        });

        // Heading animation (Hero/Contact Style)
        if (headingRef.current) {
          const split = new SplitType(headingRef.current, { 
            types: "lines,words" 
          });
          gsap.set(split.lines, { overflow: "hidden" });
          
          gsap.fromTo(split.words, {
            yPercent: 100,
            opacity: 0,
          }, {
            yPercent: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.03,
            ease: "power4.out",
          });
        }

        // Content elements staggered reveal (Tightened)
        gsap.fromTo(".about-item", {
          y: 30,
          opacity: 0,
        }, {
          y: 0,
          opacity: 1,
          duration: 1.0,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.4,
        });
      };

      // 1. Line-reveal animations for all service/experience items
      // Add a tiny delay to ensure children are rendered
      const aboutItemsTimeout = setTimeout(() => {
        if (containerRef.current) {
          initAboutItemsAnimation(containerRef.current);
        }
      }, 100);

      // Listen for transition completion (both initial and page-to-page)
      const handleTransitionComplete = () => {
        console.log("AboutPage: Transition complete event received");
        startEntranceAnimation();
      };
      
      window.addEventListener("initial-loader-complete", handleTransitionComplete);
      window.addEventListener("page-transition-complete", handleTransitionComplete);

      // Check if we should reveal immediately (if loader is already gone)
      const isInitialLoaderDone = sessionStorage.getItem("hasSeenInitialLoader") === "true";
      const isLoaderActive = !!document.querySelector('.initial-loader-wrap');
      const isNavigating = sessionStorage.getItem("isNavigating") === "true";

      if ((isInitialLoaderDone && !isLoaderActive) || isNavigating) {
        // Use a tiny delay to ensure everything is mounted
        const id = setTimeout(() => {
          startEntranceAnimation();
          sessionStorage.removeItem("isNavigating");
        }, 100);
        return () => clearTimeout(id);
      }

      // Safety timeout
      const safetyTimeout = setTimeout(() => {
        if (!animationTriggeredRef.current) {
          console.log("AboutPage: Safety reveal triggered");
          startEntranceAnimation();
        }
      }, 2000);

      // Stuff I Do section reveal
      gsap.from(".stuff-i-do-section", {
        opacity: 0,
        y: 60,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".stuff-i-do-section",
          start: "top 80%",
        },
      });

      return () => {
        window.removeEventListener("initial-loader-complete", handleTransitionComplete);
        window.removeEventListener("page-transition-complete", handleTransitionComplete);
        clearTimeout(safetyTimeout);
        clearTimeout(aboutItemsTimeout);
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen pt-48 flex flex-col items-center bg-transparent overflow-x-hidden"
    >
      <div className="w-full flex flex-col items-center pb-64">
        {/* Top Section: Hero-ish Centered Single Column */}
        <div className="w-full flex flex-col items-center text-center gap-16 md:gap-24 mb-48 px-8">
          <h1
            ref={headingRef}
            className="text-6xl md:text-8xl lg:text-9xl font-instrumentsans font-bold text-[#1c1d1e] uppercase tracking-tight leading-none"
          >
            who am i?
          </h1>

          <div className="about-item w-full max-w-lg aspect-[3/4] rounded-[2rem] md:rounded-full overflow-hidden border border-[#1c1d1e]/10 bg-[#1c1d1e]/5">
            <img
              src="https://placehold.co/800x1066/fefffe/1c1d1e?text=Portrait"
              alt="Alexander - Product Designer"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out scale-105 hover:scale-100"
            />
          </div>

          <div className="about-item w-full flex justify-center text-center">
            <p className="text-2xl md:text-3xl lg:text-4xl font-instrumentsans max-w-6xl mx-auto text-[#1c1d1e] leading-tight font-light text-center">
              Based in{" "}
              <img
                src="/images/danish-flag.svg"
                alt="Danish Flag"
                className="inline-block h-[0.7em] md:h-[0.8em] align-middle ml-1 mb-[0.15em] rounded-full"
              />
              , Copenhagen, I’m a product designer with a serious obsession for
              User Experience design. I specialize in ideation, visual design,
              and interactions—basically, turning your ideas into something you
              can actually use without needing a manual the size of a
              dictionary.
            </p>
          </div>

          <div className="about-item">
            <AnimatedButton
              text="download resume"
              padding="px-12 py-7"
              fontSize="text-lg md:text-xl"
              baseBgColor="bg-[#1c1d1e]"
              baseTextColor="text-white"
              hoverBgColor="bg-[#fffefe]"
              hoverTextColor="text-[#1c1d1e]"
              baseBorderColor="border-[#1c1d1e]"
              hoverBorderColor="border-[#1c1d1e]"
            />
          </div>
        </div>

        {/* Stuff I Do Section: Two Columns (Left Aligned) */}
        <section className="stuff-i-do-section w-full flex flex-col md:flex-row text-left gap-16 md:gap-0 pt-24 px-8">
          {/* Left Column: Section Title */}
          <div className="w-full md:w-1/3">
            <h2 className="text-4xl md:text-5xl font-instrumentsans font-bold text-[#1c1d1e] uppercase md:sticky md:top-32">
              stuff i do
            </h2>
          </div>

          {/* Right Column: Service List */}
          <div className="w-full md:w-2/3 md:pl-12 lg:pl-24">
            <ServiceItem
              title="web design"
              description="Creating visually stunning and highly functional websites that prioritize user experience and simplicity. By focusing on clean, minimal designs, I ensure that every interaction is seamless and intuitive."
            />
            <ServiceItem
              title="branding & graphic design"
              description="Designing visual identities that make your brand the Beyoncé of your industry. From logos to marketing stuff, I make sure you’re not just seen, but remembered."
              showDivider={true}
            />
            <ServiceItem
              title="football"
              description="hobby? naaah im going pro next week, you can catch me on the field ;)"
              showDivider={true}
            />
          </div>
        </section>

        {/* Experience & Education Section: Two Columns */}
        <section className="experience-section w-full flex flex-col md:flex-row text-left gap-16 md:gap-0 pt-32 px-8">
          {/* Left Column: Section Title */}
          <div className="w-full md:w-1/3">
            <h2 className="text-4xl md:text-5xl font-instrumentsans font-bold text-[#1c1d1e] uppercase md:sticky md:top-32">
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
              description="Designed and developed their official website as part of my bachelor's project. Focused on creating a high-performance, accessible digital presence that effectively communicates their mission in the healthcare technology space."
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
