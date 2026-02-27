import { useLayoutEffect, useState } from "react";
import Hero from "../sections/Hero/Hero";
import Projects from "../sections/Projects/Projects";
import Services from "../sections/Services/Services";
import VideoShowcase from "../sections/VideoShowcase/VideoShowcase";
import BrandsMarquee from "../sections/Collaboration/BrandsMarquee";
import { scrollTo } from "../utils/smoothScroll";

function HomePage() {
  const [isVisible, setIsVisible] = useState(() => {
    // Initial state based on whether we are navigating to specific sections
    return !sessionStorage.getItem("targetSection") && !sessionStorage.getItem("isHomeNav");
  });

  useLayoutEffect(() => {
    const targetSection = sessionStorage.getItem("targetSection");
    const isHomeNav = sessionStorage.getItem("isHomeNav") === "true";
    
    if (targetSection || isHomeNav) {
      const reveal = () => {
        // 1. Force the scroll jump while invisible
        if (targetSection) {
          scrollTo(targetSection, 0, -120, true);
        } else if (isHomeNav) {
          scrollTo(0, 0, 0, true);
        }
        
        // 2. Clear flags and show page
        sessionStorage.removeItem("targetSection");
        sessionStorage.removeItem("isHomeNav");
        
        // Small delay to ensure browser handled the jump before fading in
        setTimeout(() => setIsVisible(true), 50);
      };

      const handleTransitionComplete = () => {
        reveal();
      };

      window.addEventListener("page-transition-complete", handleTransitionComplete);
      
      const safetyTimeout = setTimeout(reveal, 1000);

      return () => {
        window.removeEventListener("page-transition-complete", handleTransitionComplete);
        clearTimeout(safetyTimeout);
      };
    } else {
      setIsVisible(true);
    }
  }, []);

  return (
    <div className="HomePage">
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
