import React, { useState, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import ContactSection from "./ContactSection";
import BurgerMenuButton from "./BurgerMenuButton";
import MobileMenuOverlay from "./MobileMenuOverlay";
import LuxuryGrainBackground from "./LuxuryGrainBackground";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderInverted, setIsHeaderInverted] = useState(false);
  const layoutRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useLayoutEffect(() => {
    // Clear existing triggers
    ScrollTrigger.getAll().forEach(st => st.kill());

    if (location.pathname === "/") {
      // Home page scroll logic
      const projectsSection = document.querySelector("#projects");
      if (projectsSection) {
        ScrollTrigger.create({
          trigger: projectsSection,
          start: "top center",
          onEnter: () => {
            setIsHeaderInverted(true);
            gsap.to(layoutRef.current, {
              backgroundColor: "#0a0a0a",
              duration: 1,
              ease: "power3.inOut",
            });
          },
          onLeaveBack: () => {
            setIsHeaderInverted(false);
            gsap.to(layoutRef.current, {
              backgroundColor: "#E4E2DD",
              duration: 1,
              ease: "power3.inOut",
            });
          },
        });
      }
    } else {
      // For other pages like /about, we might want it always dark or always light
      // Let's assume the /about page is dark for now based on previous section style
      setIsHeaderInverted(true);
      gsap.to(layoutRef.current, {
        backgroundColor: "#0a0a0a",
        duration: 0, // Instant
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [location.pathname]);

  return (
    <div
      ref={layoutRef}
      className={`flex flex-col min-h-screen ${isHeaderInverted ? "dark" : ""}`}
      style={{ backgroundColor: location.pathname === "/" ? "#E4E2DD" : "#0a0a0a" }}
    >
      <Header isInverted={isHeaderInverted} />
      <BurgerMenuButton
        isOpen={isMobileMenuOpen}
        toggleMenu={toggleMenu}
        isInverted={isHeaderInverted}
      />
      <MobileMenuOverlay isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
      <LuxuryGrainBackground />
      <main className="flex-grow">{children}</main>
      <ContactSection />
    </div>
  );
};

export default Layout;
