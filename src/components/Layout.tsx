import React, { useLayoutEffect, useRef } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import lenis from "../utils/lenis";

gsap.registerPlugin(ScrollTrigger);

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const layoutRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // Sync ScrollTrigger with Lenis
    const handleLenisScroll = () => {
      ScrollTrigger.update();
    };

    if (lenis) {
      lenis.on("scroll", handleLenisScroll);
    }

    return () => {
      if (lenis) {
        lenis.off("scroll", handleLenisScroll);
      }
    };
  }, []);

  return (
    <div ref={layoutRef} className="flex flex-col min-h-screen">
      <Header />

      <main className="relative z-20 flex-grow bg-[var(--background)]">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
