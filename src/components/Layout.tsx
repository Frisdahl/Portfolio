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

      // PROGRESSIVE REFRESH STRATEGY
      // 1. Immediate
      ScrollTrigger.refresh();

      // 2. Short delay (DOM ready)
      const t1 = setTimeout(() => ScrollTrigger.refresh(), 200);

      // 3. Medium delay (Images/Videos likely rendered)
      const t2 = setTimeout(() => ScrollTrigger.refresh(), 1000);

      // 4. Long delay (Safety fallback for slower hardware)
      const t3 = setTimeout(() => ScrollTrigger.refresh(), 3000);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }, layoutRef);

    return () => {
      ctx.revert();
    };
  }, [location.pathname]);

  return (
    <div ref={layoutRef} className="flex flex-col min-h-screen dark">
      <Header isInverted={true} />
      <BurgerMenuButton
        isOpen={isMobileMenuOpen}
        toggleMenu={toggleMenu}
        isInverted={true}
      />
      <MobileMenuOverlay isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />

      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default Layout;
