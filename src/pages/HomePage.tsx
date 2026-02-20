import React, { useState, useLayoutEffect } from "react";
import HeroSection from "../components/HeroSection";
import Projects from "../components/Projects";
import ServicesSection from "../components/ServicesSection";
import ExpectationSection from "../components/ExpectationSection";
import CollaborationSection from "../components/CollaborationSection";
import VideoShowcase from "../components/VideoShowcase";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function HomePage() {
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 500,
        onEnter: () => setIsVideoExpanded(true),
        onLeaveBack: () => setIsVideoExpanded(false),
      });
    });
    return () => ctx.revert();
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
