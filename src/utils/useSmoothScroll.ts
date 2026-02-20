import { useEffect } from "react";
import lenis from "./lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const useSmoothScroll = () => {
  useEffect(() => {
    if (!lenis) return;

    // Start Lenis
    lenis.start();

    // Connect GSAP's ScrollTrigger to the Lenis instance
    lenis.on("scroll", ScrollTrigger.update);

    // Small delay to ensure DOM is ready
    setTimeout(() => {
      lenis?.scrollTo(0, { immediate: true });
      ScrollTrigger.refresh();
    }, 100);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger on body resize
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      // Clean up listeners
      gsap.ticker.remove(ticker);
      lenis.off("scroll", ScrollTrigger.update);
      window.removeEventListener("resize", onResize);
      lenis.stop();
    };
  }, []);
};

export default useSmoothScroll;
