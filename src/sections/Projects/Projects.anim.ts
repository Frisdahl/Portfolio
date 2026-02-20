import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

export const initProjectParallax = (
  item: HTMLElement,
  parallaxTarget: HTMLElement,
  speed: number,
) => {
  const ctx = gsap.context(() => {
    // Parallax effect with GPU acceleration
    gsap.to(parallaxTarget, {
      y: (i, target) => -((speed - 1) * 400),
      ease: "none",
      force3D: true,
      scrollTrigger: {
        trigger: item,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
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
        force3D: true,
        scrollTrigger: {
          trigger: item,
          start: "top bottom-=100",
          toggleActions: "play none none none",
        },
      },
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
  },
  splitCache?: { title: SplitType | null; categories: SplitType | null },
) => {
  const { video, titleText, categoriesText, actions } = elements;

  // 1. Split text into lines ONLY if not already split (performance optimization)
  let splitTitle = splitCache?.title;
  let splitCategories = splitCache?.categories;

  if (!splitTitle) {
    splitTitle = new SplitType(titleText, { types: "lines" });
  }
  if (!splitCategories) {
    splitCategories = new SplitType(categoriesText, { types: "lines" });
  }

  const ctx = gsap.context(() => {
    // Initial state: ensure lines are hidden if playing
    if (isPlaying) {
      if (video) video.play().catch(() => undefined);

      const tl = gsap.timeline();

      tl.set([splitTitle.lines, splitCategories.lines], { yPercent: 105 }).set(
        actions,
        { opacity: 0 },
      );

      tl.to(splitTitle.lines!, {
        yPercent: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        force3D: true,
      })
        .to(
          splitCategories.lines!,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.05,
            ease: "power3.out",
            force3D: true,
          },
          "-=0.4",
        )
        .to(
          actions,
          {
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
          },
          "-=0.3",
        );
    } else {
      // Exit sequence
      const exitTl = gsap.timeline();

      exitTl
        .to(actions, { opacity: 0, duration: 0.2, ease: "power2.in" })
        .to(splitCategories.lines!, {
          yPercent: 105,
          duration: 0.4,
          stagger: 0.05,
          ease: "power3.in",
          force3D: true,
        })
        .to(
          splitTitle.lines!,
          {
            yPercent: 105,
            duration: 0.4,
            stagger: 0.1,
            ease: "power3.in",
            force3D: true,
          },
          "-=0.3",
        )
        .add(() => {
          if (video) {
            video.pause();
            video.currentTime = 0;
          }
        });
    }
  });

  return { ctx, splitTitle, splitCategories };
};
