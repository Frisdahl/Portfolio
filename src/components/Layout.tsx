import React, {
  Suspense,
  lazy,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Header from "./Header";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import lenis from "../utils/lenis";

const Footer = lazy(() => import("./Footer"));

gsap.registerPlugin(ScrollTrigger);

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const layoutRef = useRef<HTMLDivElement>(null);
  const [shouldRenderFooter, setShouldRenderFooter] = useState(false);

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

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let idleId: number | null = null;

    const revealFooter = () => setShouldRenderFooter(true);

    if ("requestIdleCallback" in window) {
      idleId = (
        window as Window & {
          requestIdleCallback: (
            cb: IdleRequestCallback,
            opts?: IdleRequestOptions,
          ) => number;
        }
      ).requestIdleCallback(revealFooter, { timeout: 2000 });
    } else {
      timeoutId = setTimeout(revealFooter, 900);
    }

    return () => {
      if (timeoutId !== null) clearTimeout(timeoutId);
      if (idleId !== null && "cancelIdleCallback" in window) {
        (
          window as Window & {
            cancelIdleCallback: (id: number) => void;
          }
        ).cancelIdleCallback(idleId);
      }
    };
  }, []);

  return (
    <div ref={layoutRef} className="flex flex-col min-h-screen">
      <Header />

      <main className="relative z-20 flex-grow bg-[var(--background)]">
        {children}
      </main>
      {shouldRenderFooter && (
        <Suspense fallback={<div aria-hidden="true" style={{ height: 1 }} />}>
          <Footer />
        </Suspense>
      )}
    </div>
  );
};

export default Layout;
