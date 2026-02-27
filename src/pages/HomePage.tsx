import React, { useLayoutEffect, useState } from "react";
import Hero from "../sections/Hero/Hero";
import Projects from "../sections/Projects/Projects";
import Services from "../sections/Services/Services";
import VideoShowcase from "../sections/VideoShowcase/VideoShowcase";
import BrandsMarquee from "../sections/Collaboration/BrandsMarquee";
import { scrollTo } from "../utils/smoothScroll";

function HomePage() {
  const [isVisible, setIsVisible] = useState(() => {
    // Initial state based on whether we are navigating to works
    return sessionStorage.getItem("isWorksNav") !== "true";
  });

  useLayoutEffect(() => {
    const isWorksNav = sessionStorage.getItem("isWorksNav") === "true";
    if (isWorksNav) {
      const handleTransitionComplete = () => {
        // Jump immediately
        scrollTo("#projects", 0, 0, true);
        
        // Short delay to ensure scroll happened before showing
        setTimeout(() => {
          setIsVisible(true);
          sessionStorage.removeItem("isWorksNav");
        }, 50);
      };

      window.addEventListener("page-transition-complete", handleTransitionComplete);
      return () => window.removeEventListener("page-transition-complete", handleTransitionComplete);
    }
  }, []);

  return (
    <div className={`HomePage transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}>
      <Hero />
      <VideoShowcase />
      <Services />
      <Projects />
      <BrandsMarquee />
      {/* <Expectations />
      <Collaboration /> */}
    </div>
  );
}

export default HomePage;
