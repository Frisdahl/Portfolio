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
    const ctx = gsap.context(() => {
      // Initial background color
      gsap.set(layoutRef.current, {
        backgroundColor: location.pathname === "/" ? "#E4E2DD" : "#0a0a0a",
      });

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

        // 2. Contact Header Inversion
        // The footer is light theme, so we need dark header items.
        const contactSection = document.querySelector("#contact");
        if (contactSection) {
          ScrollTrigger.create({
            trigger: contactSection,
            start: "top 80px", // Invert when section hits the header
            onEnter: () => setIsHeaderInverted(false),
            onLeaveBack: () => setIsHeaderInverted(true),
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
    }, layoutRef);

    return () => {
      ctx.revert();
    };
  }, [location.pathname]);

  return (
    <div
      ref={layoutRef}
      className={`flex flex-col min-h-screen ${isHeaderInverted ? "dark" : ""}`}
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
