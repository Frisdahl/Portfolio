import React from "react";
import HeroSection from "../components/HeroSection";
import Projects from "../components/Projects";
import ServicesSection from "../components/ServicesSection";
import ExpectationSection from "../components/ExpectationSection";
import CollaborationSection from "../components/CollaborationSection";
import VideoShowcase from "../components/VideoShowcase";

function HomePage() {
  return (
    <div className="HomePage">
      <HeroSection />
      <VideoShowcase />
      <Projects />
      
      <ServicesSection />
      
      <ExpectationSection />
      <CollaborationSection />
    </div>
  );
}

export default HomePage;
