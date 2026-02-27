import React, { useState, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import MobileMenuOverlay from "./MobileMenuOverlay";
import Footer from "./Footer";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import lenis from "../utils/lenis";

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
    const ctx = gsap.context(() => {
      const mountRetryTimeouts: number[] = [];

      const updateHeaderTheme = () => {
        // Sample the element exactly where the header sits (50px from top, middle of screen)
        const samplePoint = 50;
        const elements = document.elementsFromPoint(window.innerWidth / 2, samplePoint);
        
        // Find the first element in the stack that isn't the header, noise grain, or menu backdrop
        const target = elements.find(el => {
          const isHeader = el.closest('header');
          const isNoise = el.classList.contains('noise-grain');
          const isMenuOverlay = el.classList.contains('mobile-menu-overlay');
          const isLoader = el.closest('.initial-loader-wrap'); // Add class to InitialLoader
          return !isHeader && !isNoise && !isMenuOverlay && !isLoader;
        });

        if (target) {
          // Check if this element or any of its parents are marked as a dark section
          // ALSO check if it's the hero container which is dark
          const isOverDark = !!target.closest('.dark-section') || !!target.closest('#hero');
          setIsHeaderDark(!isOverDark);
        } else {
          // Default to light elements (dark theme) for Hero if nothing found
          setIsHeaderDark(false);
        }
      };

      // Create a single ScrollTrigger to drive the sampling on every scroll
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: updateHeaderTheme,
        onRefresh: updateHeaderTheme
      });

      // Direct Lenis listener for ultra-smooth updates
      if (lenis) {
        lenis.on("scroll", updateHeaderTheme);
      }

      // Initial run
      updateHeaderTheme();

      // Retry loop to handle lazy-loaded content
      [100, 500, 1000, 2000].forEach((delay) => {
        const id = window.setTimeout(() => {
          updateHeaderTheme();
          ScrollTrigger.refresh();
        }, delay);
        mountRetryTimeouts.push(id);
      });

      return () => {
        mountRetryTimeouts.forEach(id => window.clearTimeout(id));
        if (lenis) {
          lenis.off("scroll", updateHeaderTheme);
        }
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
      <Footer />
    </div>
  );
};

export default Layout;
