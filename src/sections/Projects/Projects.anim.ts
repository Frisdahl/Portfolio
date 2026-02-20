import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const initProjectParallax = (
  item: HTMLElement,
  parallaxTarget: HTMLElement,
  speed: number
) => {
  const ctx = gsap.context(() => {
    // Parallax effect
    gsap.to(parallaxTarget, {
      y: (i, target) => -((speed - 1) * 400),
      ease: "none",
      scrollTrigger: {
        trigger: item,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    // Reveal animation
    gsap.fromTo(
      item,
      { opacity: 1, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          start: "top bottom-=100",
          toggleActions: "play none none none",
        },
      }
    );
  }, item);

  return ctx;
};

export const createProjectItemTimeline = (
  isPlaying: boolean,
  elements: {
    video: HTMLVideoElement | null;
    titleText: HTMLElement;
    categoriesText: HTMLElement;
    titleReveal: HTMLElement;
    categoriesReveal: HTMLElement;
    actions: HTMLElement;
  }
) => {
  const { video, titleText, categoriesText, titleReveal, categoriesReveal, actions } = elements;
  
  // Kill any existing animations on these elements
  gsap.killTweensOf([titleText, categoriesText, titleReveal, categoriesReveal, actions]);

  if (isPlaying) {
    if (video) video.play().catch(() => undefined);

    const tl = gsap.timeline();
    tl.set([titleText, categoriesText, actions], { opacity: 0, x: "0%" })
      .set([titleReveal, categoriesReveal], { x: "100%", opacity: 1 })
      .to(titleReveal, { x: "0%", duration: 0.4, ease: "power2.inOut" })
      .set(titleText, { opacity: 1 })
      .to(titleReveal, { x: "-105%", duration: 0.4, ease: "power2.inOut" })
      .to(categoriesReveal, { x: "0%", duration: 0.4, ease: "power2.inOut" }, "-=0.2")
      .set(categoriesText, { opacity: 1 })
      .to(categoriesReveal, { x: "-105%", duration: 0.4, ease: "power2.inOut" })
      .to(actions, { opacity: 1, duration: 0.4, ease: "power2.out" }, "-=0.2");
    
    return tl;
  } else {
    const exitTl = gsap.timeline({ delay: 0.8 });
    exitTl
      .to(actions, { opacity: 0, duration: 0.2, ease: "power2.in" })
      .add(() => {
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
      })
      .set([titleReveal, categoriesReveal], { x: "100%", opacity: 1 })
      .to(titleReveal, { x: "0%", duration: 0.3, ease: "power2.inOut" })
      .to([titleReveal, titleText], { x: "-105%", duration: 0.3, ease: "power2.in" })
      .to(categoriesReveal, { x: "0%", duration: 0.3, ease: "power2.inOut" }, "-=0.1")
      .to([categoriesReveal, categoriesText], { x: "-105%", duration: 0.3, ease: "power2.in" })
      .set([titleText, categoriesText], { opacity: 0, x: "0%" })
      .set([titleReveal, categoriesReveal], { x: "100%" });
    
    return exitTl;
  }
};
