import React, { useState, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderDark, setIsHeaderDark] = useState(false);
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

      let headerTrigger: ScrollTrigger | null = null;
      let refreshTimeouts: number[] = [];
      let mountRetryTimeouts: number[] = [];

      const clearRefreshTimeouts = () => {
        refreshTimeouts.forEach((id) => window.clearTimeout(id));
        refreshTimeouts = [];
      };

      const setupHeaderTrigger = () => {
        const contactSection = document.getElementById("contact");
        if (!contactSection) return false;

        headerTrigger?.kill();

        headerTrigger = ScrollTrigger.create({
          trigger: contactSection,
          start: "top 5px", // Slightly offset from very top to handle sub-pixel jump issues
          end: "bottom top",
          onEnter: () => setIsHeaderDark(true),
          onEnterBack: () => setIsHeaderDark(true),
          onLeave: () => setIsHeaderDark(false),
          onLeaveBack: () => setIsHeaderDark(false),
          onUpdate: (self) => {
            if (self.isActive !== isHeaderDark) {
              setIsHeaderDark(self.isActive);
            }
          },
          onRefresh: (self) => {
            setIsHeaderDark(self.isActive);
          },
        });

        clearRefreshTimeouts();
        refreshTimeouts.push(
          window.setTimeout(() => ScrollTrigger.refresh(), 0),
          window.setTimeout(() => ScrollTrigger.refresh(), 200),
          window.setTimeout(() => ScrollTrigger.refresh(), 1000),
          window.setTimeout(() => ScrollTrigger.refresh(), 3000),
        );

        return true;
      };

      if (!setupHeaderTrigger()) {
        [100, 300, 700, 1500].forEach((delay) => {
          const timeoutId = window.setTimeout(() => {
            if (setupHeaderTrigger()) {
              mountRetryTimeouts.forEach((id) => window.clearTimeout(id));
              mountRetryTimeouts = [];
            }
          }, delay);
          mountRetryTimeouts.push(timeoutId);
        });
      }

      return () => {
        mountRetryTimeouts.forEach((id) => window.clearTimeout(id));
        clearRefreshTimeouts();
        headerTrigger?.kill();
        setIsHeaderDark(false);
      };
    }, layoutRef);

    return () => {
      ctx.revert();
    };
  }, [location.pathname]);

  return (
    <div ref={layoutRef} className="flex flex-col min-h-screen dark">
      <Header
        isInverted={true}
        isDark={isHeaderDark}
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMenu={toggleMenu}
      />
      <MobileMenuOverlay isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />

      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default Layout;
