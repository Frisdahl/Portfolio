import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const initVideoShowcaseAnimations = (
  container: HTMLElement,
  videoWrapper: HTMLElement,
  heading: HTMLElement,
  longText: HTMLElement,
  smallText: HTMLElement,
) => {
  const ctx = gsap.context(() => {
    // Initial state: Subtle offset and hidden
    gsap.set([heading, longText, smallText], { 
      y: 30, 
      opacity: 0 
    });

    gsap.set(videoWrapper, {
      scale: 1.08,
      opacity: 0,
    });

    // Elegant, Controlled Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        once: true,
      },
    });

    tl.to(heading, {
      y: 0,
      opacity: 1,
      duration: 0.9,
      ease: "power3.out"
    })
    .to(longText, {
      y: 0,
      opacity: 1,
      duration: 0.7,
      ease: "power2.out"
    }, "-=0.5")
    .to(smallText, {
      y: 0,
      opacity: 1,
      duration: 0.7,
      ease: "power2.out"
    }, "-=0.5")
    .to(videoWrapper, {
      scale: 1,
      opacity: 1,
      duration: 1.2,
      ease: "power4.out"
    }, "-=0.6");

    ScrollTrigger.refresh();
  }, container);

  return ctx;
};
