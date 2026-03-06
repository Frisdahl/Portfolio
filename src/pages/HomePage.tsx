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

const Manifesto = lazy(() => import("../sections/Manifesto/Manifesto"));
const Projects = lazy(() => import("../sections/Projects/Projects"));
const Services = lazy(() => import("../sections/Services/Services"));
const TechStack = lazy(() => import("../sections/TechStack/TechStack"));

type DeferredSectionProps = {
  className: string;
  containIntrinsicSize: string;
  fallbackClassName: string;
  children: ReactNode;
  forceMount?: boolean;
  sectionId?: string;
};

function DeferredSection({
  className,
  containIntrinsicSize,
  fallbackClassName,
  children,
  forceMount = false,
  sectionId,
}: DeferredSectionProps) {
  const [shouldMount, setShouldMount] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (forceMount) {
      setShouldMount(true);
      return;
    }

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
      style={{ contentVisibility: "auto", containIntrinsicSize }}
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

  useLayoutEffect(() => {
    const targetSection =
      location.hash ||
      sessionStorage.getItem("targetSection") ||
      (sessionStorage.getItem("pendingSectionScroll") === "true"
        ? "#projects"
        : null);
    if (!targetSection) return;

    const targetId = targetSection.replace("#", "");
    const projectsEl = typeof document !== "undefined" ? document.querySelector("#projects") : null;
    // #region agent log
    fetch("http://127.0.0.1:7485/ingest/c3600584-6a50-43cc-836a-dd52b7cba410", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "da1222" },
      body: JSON.stringify({
        sessionId: "da1222",
        location: "HomePage.tsx:useLayoutEffect(entry)",
        message: "HomePage scroll-to-section",
        data: {
          targetSection,
          targetId,
          forceMountProjects,
          projectsExists: !!projectsEl,
          scrollYBefore: typeof window !== "undefined" ? window.scrollY : 0,
        },
        timestamp: Date.now(),
        hypothesisId: "H-C,H-E",
      }),
    }).catch(() => {});
    // #endregion
    if (targetId === "projects" && !forceMountProjects) {
      setForceMountProjects(true);
      return;
    }

    const timeoutIds: Array<ReturnType<typeof setTimeout>> = [];
    let alignRafId = 0;

    const getHeaderOffset = () => {
      const headerElement = document.querySelector("header");
      if (!headerElement) return 0;

      // Measure only the main nav row height to avoid including dropdown if it's open/closing
      const navRow = headerElement.querySelector("div");
      const headerHeight = navRow
        ? navRow.getBoundingClientRect().height
        : headerElement.getBoundingClientRect().height;

      // Responsive padding check (approximate based on Header.tsx classes)
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
        const scrollYBefore = window.scrollY;
        alignToTargetTop(projectsSection);
        const scrollYAfter = window.scrollY;
        // #region agent log
        fetch("http://127.0.0.1:7485/ingest/c3600584-6a50-43cc-836a-dd52b7cba410", {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "da1222" },
          body: JSON.stringify({
            sessionId: "da1222",
            location: "HomePage.tsx:alignToTargetTop(projects) done",
            message: "Scrolled to #projects",
            data: { scrollYBefore, scrollYAfter },
            timestamp: Date.now(),
            hypothesisId: "H-E",
          }),
        }).catch(() => {});
        // #endregion
        sessionStorage.removeItem("targetSection");
        sessionStorage.removeItem("pendingSectionScroll");
        requestAnimationFrame(clearScrollPendingClass);
        timeoutIds.push(
          setTimeout(clearScrollPendingClass, 100),
        );

        // Refine scroll to heading when it exists (lazy content may mount after)
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
      } else {
        // Fallback: wait for section to appear (shouldn't happen with forceMount)
        let attempts = 0;
        const maxAttempts = 300;
        const alignWhenProjectsHeadingReady = () => {
          const section = document.querySelector("#projects");
          if (section) {
            alignToTargetTop(section);
            sessionStorage.removeItem("targetSection");
            sessionStorage.removeItem("pendingSectionScroll");
            requestAnimationFrame(clearScrollPendingClass);
            timeoutIds.push(setTimeout(clearScrollPendingClass, 100));
            return;
          }
          attempts += 1;
          if (attempts < maxAttempts) {
            alignRafId = window.requestAnimationFrame(
              alignWhenProjectsHeadingReady,
            );
          }
        };
        alignRafId = window.requestAnimationFrame(alignWhenProjectsHeadingReady);
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
      <Hero />

      {/* Manifesto */}
      <DeferredSection
        className="mb-32 md:mb-48 lg:mb-32 xl:mb-64"
        containIntrinsicSize="900px"
        fallbackClassName="w-full min-h-[700px] md:min-h-[900px]"
      >
        <Manifesto />
      </DeferredSection>

      {/* Projects Section */}
      <DeferredSection
        sectionId="projects"
        className="mb-32 md:mb-48 lg:mb-32 xl:mb-64"
        containIntrinsicSize="1400px"
        fallbackClassName="w-full min-h-[1000px] md:min-h-[1400px]"
        forceMount={forceMountProjects}
      >
        <Projects />
      </DeferredSection>

      {/* Services */}
      <DeferredSection
        className="mb-32 md:mb-48 lg:mb-32 xl:mb-64"
        containIntrinsicSize="1200px"
        fallbackClassName="w-full min-h-[900px] md:min-h-[1200px]"
      >
        <Services />
      </DeferredSection>

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
