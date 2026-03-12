import {
  Suspense,
  lazy,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import Hero from "../sections/Hero/Hero";
import { scrollTo } from "../utils/smoothScroll";
import VideoShowCase from "../components/VideoShowCase";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Manifesto = lazy(() => import("../sections/Manifesto/Manifesto"));
const Projects = lazy(() => import("../sections/Projects/Projects"));
// const Services = lazy(() => import("../sections/Services/Services"));
const TechStack = lazy(() => import("../sections/TechStack/TechStack"));

type DeferredSectionProps = {
  className: string;
  containIntrinsicSize: string;
  fallbackClassName: string;
  children: ReactNode;
  forceMount?: boolean;
  sectionId?: string;
};

function ThemeTransition() {
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial theme
      document.documentElement.setAttribute("data-theme", "light");

      ScrollTrigger.create({
        trigger: "#projects",
        start: "top 80%",
        end: "bottom 100%",
        onToggle: (self) => {
          document.documentElement.setAttribute(
            "data-theme",
            self.isActive ? "dark" : "light",
          );
        },
      });
    });
    return () => {
      ctx.revert();
      document.documentElement.removeAttribute("data-theme");
    };
  }, []);

  return null;
}

function DeferredSection({
  className,
  containIntrinsicSize,
  fallbackClassName,
  children,
  forceMount = false,
  sectionId,
}: DeferredSectionProps) {
  const [shouldMount, setShouldMount] = useState(forceMount);
  const sectionRef = useRef<HTMLDivElement>(null);

  if (forceMount && !shouldMount) {
    setShouldMount(true);
  }

  useEffect(() => {
    if (forceMount) return;

    const element = sectionRef.current;
    if (!element || shouldMount) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldMount(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [shouldMount, forceMount]);

  return (
    <div
      id={sectionId}
      ref={sectionRef}
      className={className}
      style={{ containIntrinsicSize }}
    >
      {shouldMount ? (
        <Suspense fallback={<div className={fallbackClassName} />}>
          {children}
        </Suspense>
      ) : (
        <div className={fallbackClassName} />
      )}
    </div>
  );
}

function HomePage() {
  const location = useLocation();
  const [forceMountProjects, setForceMountProjects] = useState(() => {
    if (typeof window === "undefined") return false;
    const targetSection =
      window.location.hash || sessionStorage.getItem("targetSection");
    return targetSection?.replace("#", "") === "projects";
  });

  useEffect(() => {
    const targetSection =
      location.hash ||
      sessionStorage.getItem("targetSection") ||
      (sessionStorage.getItem("pendingSectionScroll") === "true"
        ? "#projects"
        : null);
    if (!targetSection) return;
    const targetId = targetSection.replace("#", "");

    if (targetId === "projects" && !forceMountProjects) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForceMountProjects(true);
    }
  }, [location, forceMountProjects]);

  useLayoutEffect(() => {
    const targetSection =
      location.hash ||
      sessionStorage.getItem("targetSection") ||
      (sessionStorage.getItem("pendingSectionScroll") === "true"
        ? "#projects"
        : null);
    if (!targetSection) return;

    const targetId = targetSection.replace("#", "");
    
    // If we need to force mount but haven't yet, let the useEffect handle it
    if (targetId === "projects" && !forceMountProjects) {
      return;
    }

    const timeoutIds: Array<ReturnType<typeof setTimeout>> = [];
    let alignRafId = 0;

    const getHeaderOffset = () => {
      const headerElement = document.querySelector("header");
      if (!headerElement) return 0;

      const navRow = headerElement.querySelector("div");
      const headerHeight = navRow
        ? navRow.getBoundingClientRect().height
        : headerElement.getBoundingClientRect().height;

      const isMobile = window.innerWidth < 768;
      const topPadding = isMobile ? 24 : 40;
      const extraGap = 8;
      return -(headerHeight + topPadding + extraGap);
    };

    const alignToTargetTop = (targetElement: Element) => {
      const headerOffset = getHeaderOffset();
      scrollTo(targetElement, 0, headerOffset, true);
    };

    const clearScrollPendingClass = () => {
      document.documentElement.classList.remove("scroll-to-section-pending");
    };

    if (targetId === "projects") {
      document.documentElement.classList.add("scroll-to-section-pending");
      sessionStorage.setItem("projectsFromNav", "true");
      const projectsSection = document.querySelector("#projects");
      if (projectsSection) {
        alignToTargetTop(projectsSection);
        sessionStorage.removeItem("targetSection");
        sessionStorage.removeItem("pendingSectionScroll");
        requestAnimationFrame(clearScrollPendingClass);
        timeoutIds.push(setTimeout(clearScrollPendingClass, 100));

        const refineToHeading = () => {
          const headingTarget = document.querySelector(
            "#projects .project-header-text",
          );
          if (headingTarget) {
            setTimeout(() => {
              alignToTargetTop(headingTarget);
              const driftCorrectionId = setTimeout(() => {
                const currentHeading = document.querySelector(
                  "#projects .project-header-text",
                );
                if (!currentHeading) return;
                const headerOffset = getHeaderOffset();
                const currentTop = currentHeading.getBoundingClientRect().top;
                const remainingDrift = currentTop + headerOffset;
                if (Math.abs(remainingDrift) > 4) {
                  alignToTargetTop(currentHeading);
                }
              }, 300);
              timeoutIds.push(driftCorrectionId);
            }, 50);
          }
        };
        alignRafId = window.requestAnimationFrame(refineToHeading);
      }
    } else {
      const target = document.querySelector(targetSection);
      if (target) {
        alignToTargetTop(target);
      }
      requestAnimationFrame(clearScrollPendingClass);
      timeoutIds.push(setTimeout(clearScrollPendingClass, 100));
      sessionStorage.removeItem("targetSection");
      sessionStorage.removeItem("pendingSectionScroll");
    }

    return () => {
      if (alignRafId) {
        window.cancelAnimationFrame(alignRafId);
      }
      timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
      document.documentElement.classList.remove("scroll-to-section-pending");
    };
  }, [location, forceMountProjects]);

  return (
    <div className="HomePage">
      <ThemeTransition />
      <Hero />

      <DeferredSection
        className="mb-32 md:mb-48 lg:mb-32 xl:mb-64"
        containIntrinsicSize="500px"
        fallbackClassName="w-full min-h-[700px] md:min-h-[900px]"
      >
        <VideoShowCase />
      </DeferredSection>

      {/* Manifesto - Symmetrical padding for better balance */}
      <DeferredSection
        sectionId="manifesto"
        className="py-32 md:py-48 lg:py-32 xl:py-64"
        containIntrinsicSize="900px"
        fallbackClassName="w-full min-h-[700px] md:min-h-[900px]"
      >
        <Manifesto />
      </DeferredSection>

      {/* Projects Section - Added significant padding for cleaner transitions */}
      <div id="projects" className="py-64 md:py-96">
        <Suspense
          fallback={<div className="w-full min-h-[1000px] md:min-h-[1400px]" />}
        >
          <Projects />
        </Suspense>
      </div>

      {/* Tech Stack Section */}
      <DeferredSection
        className="mb-32 md:mb-48 lg:mb-32 xl:mb-64"
        containIntrinsicSize="900px"
        fallbackClassName="w-full min-h-[700px] md:min-h-[900px]"
      >
        <TechStack />
      </DeferredSection>
    </div>
  );
}

export default HomePage;
