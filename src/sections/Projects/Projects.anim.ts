import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

export const initProjectReveal = (item: HTMLElement) => {
  const ctx = gsap.context(() => {
    // Simple reveal animation for the whole item container (replacing parallax)
    gsap.fromTo(
      item,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
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
  isHovered: boolean,
  elements: {
    video: HTMLVideoElement | null;
    titleText: HTMLElement;
    categoriesText: HTMLElement;
    actions: HTMLElement;
  },
  splitCache?: { title: SplitType | null; categories: SplitType | null },
) => {
  const { titleText, categoriesText } = elements;

  let splitTitle = splitCache?.title;
  let splitCategories = splitCache?.categories;

  if (!splitTitle) {
    splitTitle = new SplitType(titleText, { types: "lines" });
  }
  if (!splitCategories) {
    splitCategories = new SplitType(categoriesText, { types: "lines" });
  }

  const ctx = gsap.context(() => {
    // We are now handling actions (buttons) locally in ProjectItem.tsx
    // to avoid state/prop synchronization issues with complex delays.
  });

  return { ctx, splitTitle, splitCategories };
};
