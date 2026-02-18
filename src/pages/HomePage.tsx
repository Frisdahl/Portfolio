import React, { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import Projects from "../components/Projects";
import ServicesSection from "../components/ServicesSection";
import ExpectationSection from "../components/ExpectationSection";
import CollaborationSection from "../components/CollaborationSection";
import VideoShowcase from "../components/VideoShowcase";

function HomePage() {
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setIsVideoExpanded(true);
      } else {
        setIsVideoExpanded(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="HomePage">
      <HeroSection />
      <VideoShowcase isExpanded={isVideoExpanded} />
      <Projects />
      
      <ServicesSection />
      
      <ExpectationSection />
      <CollaborationSection />
    </div>
  );
}

export default HomePage;
