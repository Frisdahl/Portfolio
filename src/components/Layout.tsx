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
    ScrollTrigger.getAll().forEach((st) => st.kill());

    if (location.pathname === "/") {
      // 1. Projects Transition (Light -> Dark)
      const projectsSection = document.querySelector("#projects");
      if (projectsSection) {
        ScrollTrigger.create({
          trigger: projectsSection,
          start: "top 40%",
          onEnter: () => {
            setIsHeaderInverted(true);
            gsap.to(layoutRef.current, {
              backgroundColor: "#0a0a0a",
              duration: 0.8,
              ease: "power2.inOut",
            });
          },
          onLeaveBack: () => {
            setIsHeaderInverted(false);
            gsap.to(layoutRef.current, {
              backgroundColor: "#E4E2DD",
              duration: 0.8,
              ease: "power2.inOut",
            });
          },
        });
      }

      // 2. Collaboration Transition (Dark -> Light)
      const collaborationSection = document.querySelector("#collaboration");
      if (collaborationSection) {
        ScrollTrigger.create({
          trigger: collaborationSection,
          start: "top 40%",
          onEnter: () => {
            setIsHeaderInverted(false);
            gsap.to(layoutRef.current, {
              backgroundColor: "#E4E2DD",
              duration: 0.8,
              ease: "power2.inOut",
            });
          },
          onLeaveBack: () => {
            setIsHeaderInverted(true);
            gsap.to(layoutRef.current, {
              backgroundColor: "#0a0a0a",
              duration: 0.8,
              ease: "power2.inOut",
            });
          },
        });
      }

      // 3. Contact Header Inversion (Light -> Dark header items)
      // Since contact has its own dark background, we only need to invert the header.
      const contactSection = document.querySelector("#contact");
      if (contactSection) {
        ScrollTrigger.create({
          trigger: contactSection,
          start: "top 80px", // Invert when header (approx 80px high) hits the section
          onEnter: () => {
            setIsHeaderInverted(true);
            // Ensure layout background is also dark to avoid any transition gaps
            gsap.to(layoutRef.current, {
              backgroundColor: "#0a0a0a",
              duration: 0.4,
              ease: "power2.inOut",
            });
          },
          onLeaveBack: () => {
            setIsHeaderInverted(false);
            // Revert to light since previous section (collaboration) is light
            gsap.to(layoutRef.current, {
              backgroundColor: "#E4E2DD",
              duration: 0.4,
              ease: "power2.inOut",
            });
          },
        });
      }
    } else {
      // For other pages like /about
      setIsHeaderInverted(true);
      gsap.to(layoutRef.current, {
        backgroundColor: "#0a0a0a",
        duration: 0,
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [location.pathname]);

  return (
    <div
      ref={layoutRef}
      className={`flex flex-col min-h-screen ${isHeaderInverted ? "dark" : ""}`}
      style={{
        backgroundColor: location.pathname === "/" ? "#E4E2DD" : "#0a0a0a",
      }}
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
