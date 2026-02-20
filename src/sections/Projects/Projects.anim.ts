import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

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

    // Reveal animation for the whole item container
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

export const initProjectItemAnimations = (
  isPlaying: boolean,
  elements: {
    video: HTMLVideoElement | null;
    titleText: HTMLElement;
    categoriesText: HTMLElement;
    actions: HTMLElement;
  }
) => {
  const { video, titleText, categoriesText, actions } = elements;

  const ctx = gsap.context(() => {
    // 1. Split text into lines
    const splitTitle = new SplitType(titleText, { types: "lines" });
    const splitCategories = new SplitType(categoriesText, { types: "lines" });

    // Initial state: ensure lines are hidden if playing
    if (isPlaying) {
      if (video) video.play().catch(() => undefined);

      const tl = gsap.timeline();
      
      tl.set([splitTitle.lines, splitCategories.lines], { yPercent: 105 })
        .set(actions, { opacity: 0 });

      tl.to(splitTitle.lines!, {
        yPercent: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out"
      })
      .to(splitCategories.lines!, {
        yPercent: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.05,
        ease: "power3.out"
      }, "-=0.4")
      .to(actions, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out"
      }, "-=0.3");
    } else {
      // Exit sequence
      const exitTl = gsap.timeline();
      
      exitTl
        .to(actions, { opacity: 0, duration: 0.2, ease: "power2.in" })
        .to(splitCategories.lines!, {
          yPercent: 105,
          duration: 0.4,
          stagger: 0.05,
          ease: "power3.in"
        })
        .to(splitTitle.lines!, {
          yPercent: 105,
          duration: 0.4,
          stagger: 0.1,
          ease: "power3.in"
        }, "-=0.3")
        .add(() => {
          if (video) {
            video.pause();
            video.currentTime = 0;
          }
        });
    }
  });

  return ctx;
};
