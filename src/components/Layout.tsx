import React, { useState, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import BurgerMenuButton from "./BurgerMenuButton";
import MobileMenuOverlay from "./MobileMenuOverlay";
import Footer from "./Footer";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderDark, setIsHeaderDark] = useState(true);
  const layoutRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      // Permanent light theme background
      gsap.set(layoutRef.current, {
        backgroundColor: "#fefffe",
      });

      let mountRetryTimeouts: number[] = [];

      const updateHeaderTheme = () => {
        const darkSections = document.querySelectorAll(".dark-section");
        
        if (darkSections.length === 0) {
          setIsHeaderDark(true);
          return;
        }

        let currentlyOverDark = false;
        // The header's active "sensing" point is around 60px from top
        const sensingPoint = 60;

        darkSections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          if (rect.top <= sensingPoint && rect.bottom >= sensingPoint) {
            currentlyOverDark = true;
          }
        });

        setIsHeaderDark(!currentlyOverDark);
      };

      // Create a single global ScrollTrigger to monitor theme
      self.add(() => {
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: updateHeaderTheme,
          onRefresh: updateHeaderTheme,
        });
      });

      // Initial run
      updateHeaderTheme();

      // Retry loop to catch lazy-loaded content or transition delays
      [100, 400, 800, 1500, 2500].forEach((delay) => {
        const id = window.setTimeout(() => {
          updateHeaderTheme();
          ScrollTrigger.refresh();
        }, delay);
        mountRetryTimeouts.push(id);
      });

      return () => {
        mountRetryTimeouts.forEach(id => window.clearTimeout(id));
      };
    }, layoutRef);

    return () => ctx.revert();
  }, [location.pathname]);

  return (
    <div ref={layoutRef} className="flex flex-col min-h-screen">
      <Header
        isInverted={true}
        isDark={isHeaderDark}
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMenu={toggleMenu}
      />
      <MobileMenuOverlay isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />

      <main className="relative z-20 bg-[var(--background)] flex-grow">
        {children}
      </main>
    </div>
  );
};

export default Layout;
