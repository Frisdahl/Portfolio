import React, { useState, useEffect } from "react";
import HeroSection from "./components/HeroSection";
import Projects from "./components/Projects";
import ServicesSection from "./components/ServicesSection";
import ExpectationSection from "./components/ExpectationSection";
import CollaborationSection from "./components/CollaborationSection";
import VideoShowcase from "./components/VideoShowcase";
import Layout from "./components/Layout"; // Import Layout
import "./App.css";

import useSmoothScroll from "./utils/useSmoothScroll";

function App() {
  useSmoothScroll();
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
    <Layout>
      <div className="App">
        <HeroSection />
        <VideoShowcase isExpanded={isVideoExpanded} />
        <Projects />
        <ServicesSection />
        <ExpectationSection />
        <CollaborationSection />
      </div>
    </Layout>
  );
}

export default App;
