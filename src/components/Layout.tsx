import React, { useState, useLayoutEffect } from "react";
import Header from "./Header";
import ContactSection from "./ContactSection";
import BurgerMenuButton from "./BurgerMenuButton";
import MobileMenuOverlay from "./MobileMenuOverlay";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderInverted, setIsHeaderInverted] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useLayoutEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    const contactSection = document.querySelector("#contact");
    if (contactSection) {
      ScrollTrigger.create({
        trigger: contactSection,
        start: "top 60px",
        end: "bottom top",
        onEnter: () => setIsHeaderInverted(true),
        onLeaveBack: () => setIsHeaderInverted(false),
      });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      ScrollTrigger.killAll();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#f2f2f2]">
      <Header
        showScrollButton={showScrollButton}
        isInverted={isHeaderInverted}
      />
      <BurgerMenuButton
        isOpen={isMobileMenuOpen}
        toggleMenu={toggleMenu}
        isInverted={isHeaderInverted}
      />
      <MobileMenuOverlay isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
      <main className="flex-grow">{children}</main>
      <ContactSection />
    </div>
  );
};

export default Layout;
