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
};

function DeferredSection({
  className,
  containIntrinsicSize,
  fallbackClassName,
  children,
}: DeferredSectionProps) {
  const [shouldMount, setShouldMount] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, [shouldMount]);

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

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="HomePage">
      {/* Hero Section */}
      <div className="mb-32 md:mb-48 lg:mb-32">
        <Hero />
      </div>

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
