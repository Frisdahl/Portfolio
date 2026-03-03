import {
  Suspense,
  lazy,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import Hero from "../sections/Hero/Hero";
import { scrollTo } from "../utils/smoothScroll";
// import VideoShowcase from "../sections/VideoShowcase/VideoShowcase";
// import Expectations from "../sections/Expectations/Expectations";
// import Collaboration from "../sections/Collaboration/Collaboration";

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
};

function DeferredSection({
  className,
  containIntrinsicSize,
  fallbackClassName,
  children,
  forceMount = false,
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
  const [forceMountProjects, setForceMountProjects] = useState(false);

  useEffect(() => {
    const targetSection =
      location.hash || sessionStorage.getItem("targetSection");
    if (!targetSection) return;

    const targetId = targetSection.replace("#", "");
    if (targetId === "projects") {
      setForceMountProjects(true);
    }

    let rafId = 0;
    const alignTimeoutIds: Array<ReturnType<typeof setTimeout>> = [];
    let attempts = 0;
    const maxAttempts = 180;

    const getHeaderOffset = () => {
      const headerElement = document.querySelector("header");
      if (!headerElement) return 0;

      const headerHeight = headerElement.getBoundingClientRect().height;
      const extraGap = 8;
      return -(headerHeight + extraGap);
    };

    const alignToTargetTop = () => {
      scrollTo(targetSection, 0, getHeaderOffset(), true);
    };

    const scheduleAlignmentPasses = () => {
      const settleDelays = [0, 80, 180, 320, 520, 820, 1200, 1800];

      settleDelays.forEach((delay) => {
        const timeoutId = setTimeout(() => {
          alignToTargetTop();
        }, delay);

        alignTimeoutIds.push(timeoutId);
      });
    };

    const scrollWhenReady = () => {
      const target = document.querySelector(targetSection);
      if (target) {
        scheduleAlignmentPasses();
        sessionStorage.removeItem("targetSection");
        return;
      }

      attempts += 1;
      if (attempts < maxAttempts) {
        rafId = window.requestAnimationFrame(scrollWhenReady);
      }
    };

    rafId = window.requestAnimationFrame(scrollWhenReady);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      alignTimeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
    };
  }, [location]);

  return (
    <div className="HomePage">
      {/* Hero Section */}

      <Hero />

      {/* Video Showcase (Commented out) */}
      {/* <div className="mb-32 md:mb-48 lg:mb-64">
        <VideoShowcase />
      </div> */}

      {/* Manifesto Section */}
      <DeferredSection
        className="mb-32 md:mb-48 lg:mb-32 xl:mb-64"
        containIntrinsicSize="900px"
        fallbackClassName="w-full min-h-[700px] md:min-h-[900px]"
      >
        <Manifesto />
      </DeferredSection>

      {/* Projects Section */}
      <DeferredSection
        className="mb-32 md:mb-48 lg:mb-32 xl:mb-64"
        containIntrinsicSize="1400px"
        fallbackClassName="w-full min-h-[1000px] md:min-h-[1400px]"
        forceMount={forceMountProjects}
      >
        <Projects />
      </DeferredSection>

      {/* Services Section */}
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

      {/* Brands Marquee Section */}
      {/*       <div className="mb-32 md:mb-48 lg:mb-64">
        <BrandsMarquee />
      </div> */}

      {/* <Expectations />
      <Collaboration /> */}
    </div>
  );
}

export default HomePage;
