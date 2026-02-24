import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const initFeaturedIntroAnimations = (
  container: HTMLElement,
  leftBox: HTMLElement,
  rightText: HTMLElement,
) => {
  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ctx = gsap.context(() => {
    if (isReducedMotion) return;

    // Master timeline WITHOUT pinning for a smoother, un-interrupted scroll feel
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 80%", 
        end: "bottom 10%", 
        scrub: 1.5, // Increased scrub for more inertia and "weight"
      },
    });

    // 1. Initial State: Items are outside and faded
    gsap.set(leftBox, { x: -100, opacity: 0 });
    gsap.set(rightText, { x: 100, opacity: 0 });

    // 2. Entrance Phase: Smooth, gradual liquid slide in (Power3 for balanced acceleration)
    tl.to(leftBox, {
      x: 0,
      opacity: 1,
      duration: 2,
      ease: "power3.inOut",
    })
    .to(rightText, {
      x: 0,
      opacity: 1,
      duration: 2,
      ease: "power3.inOut",
    }, "-=1.6") 
    
    // 3. Center Glide (Extended hold through the middle)
    .to({}, { duration: 1 }) 

    // 4. Exit Phase: Smooth, gradual liquid slide out
    .to(leftBox, {
      x: -140,
      opacity: 0,
      duration: 2,
      ease: "power3.inOut",
    })
    .to(rightText, {
      x: 140,
      opacity: 0,
      duration: 2,
      ease: "power3.inOut",
    }, "<");

  }, container);

  return ctx;
};
