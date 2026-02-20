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
      // Permanent dark theme background
      gsap.set(layoutRef.current, {
        backgroundColor: "#0a0a0a",
      });

      // Refresh ScrollTrigger to ensure pins are calculated
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }, layoutRef);

    return () => {
      ctx.revert();
    };
  }, [location.pathname]);

  return (
    <div
      ref={layoutRef}
      className="flex flex-col min-h-screen dark"
    >
      <Header isInverted={true} />
      <BurgerMenuButton
        isOpen={isMobileMenuOpen}
        toggleMenu={toggleMenu}
        isInverted={true}
      />
      <MobileMenuOverlay isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
      <LuxuryGrainBackground />
      <main className="flex-grow">{children}</main>
      <ContactSection />
    </div>
  );
};

export default Layout;
