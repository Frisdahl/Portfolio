import React, { useState, useEffect } from "react";
import Header from "./components/Header"; // Header component
import HeroSection from "./components/HeroSection";
import Projects from "./components/Projects";
import ServicesSection from "./components/ServicesSection"; // Import ServicesSection
import ExpectationSection from "./components/ExpectationSection"; // Import ExpectationSection
import CollaborationSection from "./components/CollaborationSection"; // Import CollaborationSection
import MobileMenuOverlay from "./components/MobileMenuOverlay";
import AnimatedButton from "./components/AnimatedButton"; // Import AnimatedButton
import VideoShowcase from "./components/VideoShowcase"; // Import VideoShowcase
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
      {/* Logo */}
      <div className="fixed top-0 left-0 px-8 py-10 z-30 flex items-center">
        <a href="/">
          <img
            src="/images/Portfolio-logo.svg"
            alt="Portfolio Logo"
            className="h-12 transition-all duration-500"
          />
        </a>
      </div>

      {/* Burger Menu Button (Header component) */}
      <div className="fixed top-0 right-0 p-10 z-50">
        <Header isOpen={isMobileMenuOpen} toggleMenu={toggleMenu} />
      </div>

      {/* Scroll-triggered "Get in touch" button */}
      <div
        className={`fixed top-10 right-28 z-30 transition-opacity duration-300 ${
          showScrollButton ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative overflow-hidden inline-block rounded-full">
          {" "}
          {/* Container for clipping the reveal */}
          <AnimatedButton
            text="Get in touch"
            baseBgColor="bg-black"
            baseTextColor="text-white"
            hoverTextColor="text-black"
            className="!h-10 !px-5 !py-2"
          />
          {/* Left white box */}
          <div
            className={`absolute top-0 bottom-0 left-0 w-1/2 bg-[#f2f2f2] z-30 transition-transform duration-700 ease-out ${
              showScrollButton ? "-translate-x-full" : "translate-x-0"
            }`}
          ></div>
          {/* Right white box */}
          <div
            className={`absolute top-0 bottom-0 right-0 w-1/2 bg-[#f2f2f2] z-30 transition-transform duration-700 ease-out ${
              showScrollButton ? "translate-x-full" : "translate-x-0"
            }`}
          ></div>
        </div>
      </div>

      <HeroSection />
      <VideoShowcase isExpanded={isVideoExpanded} />
      <Projects />
      <ServicesSection />
      <ExpectationSection />
      <CollaborationSection />

      {/* Mobile Menu Overlay */}
      {/* The Header component will now be part of the MobileMenuOverlay */}
      <MobileMenuOverlay isOpen={isMobileMenuOpen} onClose={closeMobileMenu} toggleMenu={toggleMenu} />


    </div>
  );
}

export default App;
