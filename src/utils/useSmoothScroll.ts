import { useEffect } from 'react';
import lenis from './lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const useSmoothScroll = () => {
  useEffect(() => {
    if (!lenis) return;

    // Connect GSAP's ScrollTrigger to the Lenis instance
    lenis.on('scroll', ScrollTrigger.update);
    
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      lenis?.scrollTo(0, { immediate: true });
      ScrollTrigger.refresh();
    }, 100);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    }

    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    // Setup scrollerProxy to tell ScrollTrigger to use Lenis' scroll position
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
    });

    // Refresh ScrollTrigger on body resize
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);

    return () => {
      // Clean up listeners and proxy
      gsap.ticker.remove(ticker);
      lenis.off('scroll', ScrollTrigger.update);
      window.removeEventListener('resize', onResize);
      ScrollTrigger.scrollerProxy(document.body, undefined);
    };
  }, []);
};

export default useSmoothScroll;
