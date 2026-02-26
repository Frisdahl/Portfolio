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
      let activeTriggers: ScrollTrigger[] = [];

      const setupHeaderTriggers = () => {
        const darkSections = document.querySelectorAll(".dark-section");
        
        activeTriggers.forEach(t => t.kill());
        activeTriggers = [];

        if (darkSections.length === 0) {
          setIsHeaderDark(true);
          return false;
        }

        // Check current position
        let currentlyOverDark = false;
        darkSections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          // Use a smaller threshold for the top check
          if (rect.top <= 60 && rect.bottom >= 60) {
            currentlyOverDark = true;
          }

          // Use self.add if we are inside context, but ScrollTrigger.create is usually fine if we kill it manually
          const trigger = ScrollTrigger.create({
            trigger: section,
            start: "top 60px", 
            end: "bottom 60px",
            onEnter: () => setIsHeaderDark(false),
            onEnterBack: () => setIsHeaderDark(false),
            onLeave: () => setIsHeaderDark(true),
            onLeaveBack: () => setIsHeaderDark(true),
            onRefresh: (s) => {
              if (s.isActive) setIsHeaderDark(false);
            }
          });
          activeTriggers.push(trigger);
        });

        setIsHeaderDark(!currentlyOverDark);
        return true;
      };

      // Add to context for cleanup
      self.add("setupHeaderTriggers", setupHeaderTriggers);

      // Initial attempt
      setupHeaderTriggers();

      // Retry logic for lazy content / transitions
      [100, 300, 600, 1000, 2000].forEach((delay) => {
        const id = window.setTimeout(() => {
          setupHeaderTriggers();
          ScrollTrigger.refresh();
        }, delay);
        mountRetryTimeouts.push(id);
      });

      // Cleanup
      return () => {
        mountRetryTimeouts.forEach(id => window.clearTimeout(id));
        activeTriggers.forEach(t => t.kill());
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
