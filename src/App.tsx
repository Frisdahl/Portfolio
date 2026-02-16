import React, { useState, useEffect } from "react";
import Header from "./components/Header"; // Header component
import HeroSection from "./components/HeroSection";
import Projects from "./components/Projects";
import ServicesSection from "./components/ServicesSection"; // Import ServicesSection
import ExpectationSection from "./components/ExpectationSection"; // Import ExpectationSection
import CollaborationSection from "./components/CollaborationSection"; // Import CollaborationSection
import MobileMenuOverlay from "./components/MobileMenuOverlay";
import VideoShowcase from "./components/VideoShowcase"; // Import VideoShowcase
import BurgerMenuButton from "./components/BurgerMenuButton"; // Import BurgerMenuButton
import "./App.css"; // Keep existing CSS if it's used elsewhere

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
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
    <div className="App bg-[#f2f2f2]">
      <Header showScrollButton={showScrollButton} />
      <BurgerMenuButton isOpen={isMobileMenuOpen} toggleMenu={toggleMenu} />

      <HeroSection />
      <VideoShowcase isExpanded={isVideoExpanded} />
      <Projects />
      <ServicesSection />
      <ExpectationSection />
      <CollaborationSection />

      {/* Mobile Menu Overlay */}
      <MobileMenuOverlay isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
    </div>
  );
}

export default App;
