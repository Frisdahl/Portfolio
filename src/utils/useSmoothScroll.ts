import { useEffect } from "react";
import lenis from "./lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const useSmoothScroll = () => {
  useEffect(() => {
    if (!lenis) return;

    // Start Lenis
    lenis.start();

    // Connect GSAP's ScrollTrigger to the Lenis instance
    lenis.on("scroll", ScrollTrigger.update);

    // Ensure top sync after mount without timer drift
    requestAnimationFrame(() => {
      lenis?.scrollTo(0, { immediate: true });
      ScrollTrigger.refresh();
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis?.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };

    rafId = window.requestAnimationFrame(raf);

    // Refresh ScrollTrigger on body resize
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      // Clean up listeners
      window.cancelAnimationFrame(rafId);
      lenis?.off("scroll", ScrollTrigger.update);
      window.removeEventListener("resize", onResize);
      lenis?.stop();
    };
  }, []);
};

export default useSmoothScroll;
