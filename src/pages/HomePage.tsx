import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Hero from "../sections/Hero/Hero";
import Projects from "../sections/Projects/Projects";
import Services from "../sections/Services/Services";
import VideoShowcase from "../sections/VideoShowcase/VideoShowcase";
import BrandsMarquee from "../sections/Collaboration/BrandsMarquee";
import { scrollTo } from "../utils/smoothScroll";

function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const isHomeNav = sessionStorage.getItem("isHomeNav") === "true";

    let attempts = 0;
    const maxAttempts = 40;
    let retryTimeout: number | null = null;

    const alignToTarget = (target: string, run = 0) => {
      const targetElement = document.querySelector(
        target,
      ) as HTMLElement | null;
      if (!targetElement) return;

      const desiredTop = 120;
      const currentTop = targetElement.getBoundingClientRect().top;
      const delta = Math.abs(currentTop - desiredTop);

      if (delta <= 12 || run >= 6) {
        sessionStorage.removeItem("targetSection");
        sessionStorage.removeItem("isNavigating");

        if (location.hash) {
          navigate(location.pathname, { replace: true });
        }
        return;
      }

      scrollTo(target, 0, -120, true);
      retryTimeout = window.setTimeout(
        () => alignToTarget(target, run + 1),
        120,
      );
    };

    const attemptScrollToTarget = () => {
      const target = location.hash || sessionStorage.getItem("targetSection");
      if (!target) return;

      const targetElement = document.querySelector(target);

      if (targetElement) {
        scrollTo(target, 0, -120, true);
        requestAnimationFrame(() => scrollTo(target, 0, -120, true));
        retryTimeout = window.setTimeout(() => alignToTarget(target), 100);
        return;
      }

      attempts += 1;
      if (attempts < maxAttempts) {
        retryTimeout = window.setTimeout(attemptScrollToTarget, 80);
      }
    };

    const startTargetScroll = () => {
      attempts = 0;
      attemptScrollToTarget();

      const hasTargetSection = !!sessionStorage.getItem("targetSection");
      const hasHashTarget = Boolean(location.hash);

      if (hasTargetSection || hasHashTarget) {
        sessionStorage.removeItem("isHomeNav");
        return;
      }

      if (isHomeNav) {
        scrollTo(0, 0, 0, true);
        sessionStorage.removeItem("isHomeNav");
        sessionStorage.removeItem("isNavigating");
      }
    };

    window.addEventListener("page-transition-complete", startTargetScroll);

    // Fallback in case transition event has already fired.
    const fallbackStart = window.setTimeout(startTargetScroll, 180);

    return () => {
      window.removeEventListener("page-transition-complete", startTargetScroll);
      window.clearTimeout(fallbackStart);
      if (retryTimeout) {
        window.clearTimeout(retryTimeout);
      }
    };
  }, [location.hash, location.pathname, navigate]);

  return (
    <div className="HomePage">
      <Hero />
      <VideoShowcase />
      <Services />
      <Projects />
      <BrandsMarquee />
      {/* <Expectations />
      <Collaboration /> */}
    </div>
  );
}

export default HomePage;
