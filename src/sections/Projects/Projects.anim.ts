import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

/**
 * Premium scroll entrance animation for projects grid
 *
 * Logic:
 * 1. Large rows (1 item): Fade in + subtle scale (0.98 -> 1)
 * 2. Standard rows (2 items): Reveal toward center.
 *    - Detects narrow vs wide cards per row via width measurement.
 *    - Narrow on left: slides from left (-24px).
 *    - Narrow on right: slides from right (+24px).
 */
export const initGridAnimations = (container: HTMLElement) => {
  const ctx = gsap.context(() => {
    let didSetup = false;

    const headerTextEl = container.querySelector(
      ".project-header-text",
    ) as HTMLElement | null;
    const subTextEl = container.querySelector(
      ".project-header-subtext",
    ) as HTMLElement | null;
    const allCards = Array.from(
      container.querySelectorAll(".project-card"),
    ) as HTMLElement[];

    gsap.set(allCards, { opacity: 1, clearProps: "transform" });

    const setupAnimations = () => {
      if (didSetup) return;
      didSetup = true;

      // 1. Header Entrance Animation
      const headerText = headerTextEl as HTMLElement;
      const subText = subTextEl as HTMLElement;

      if (headerText && subText) {
        gsap.set([headerText, subText], { opacity: 1 });

        const shouldRunImmediate =
          sessionStorage.getItem("pendingProjectsEntrance") === "true";
        const shouldAnimateNow =
          shouldRunImmediate ||
          headerText.getBoundingClientRect().top <= window.innerHeight * 0.9;

        if (shouldAnimateNow) {
          gsap.fromTo(
            [headerText, subText],
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.95,
              stagger: 0.1,
              ease: "power3.out",
            },
          );
          sessionStorage.removeItem("pendingProjectsEntrance");
        } else {
          gsap.fromTo(
            [headerText, subText],
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.15,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: headerText,
                start: "top 85%",
                once: true,
              },
            },
          );
        }
      }

      gsap.set(allCards, { opacity: 1, clearProps: "transform" });

      ScrollTrigger.refresh();
    };

    const replayProjectsEntrance = () => {
      const headerText = headerTextEl as HTMLElement | null;
      const subText = subTextEl as HTMLElement | null;

      if (!headerText || !subText) return;

      gsap.killTweensOf([headerText, subText]);
      gsap.set([headerText, subText], { y: 24, opacity: 0 });

      gsap.to([headerText, subText], {
        y: 0,
        opacity: 1,
        duration: 0.95,
        stagger: 0.1,
        ease: "power3.out",
        onComplete: () => {
          sessionStorage.removeItem("pendingProjectsEntrance");
        },
      });
    };

    window.addEventListener("replay-projects-entrance", replayProjectsEntrance);

    const isNavigating = sessionStorage.getItem("isNavigating") === "true";

    if (isNavigating) {
      const onTransitionDone = () => {
        setupAnimations();
        window.removeEventListener(
          "page-transition-complete",
          onTransitionDone,
        );
      };

      window.addEventListener("page-transition-complete", onTransitionDone);

      // Fallback if event already fired before listener was attached.
      window.setTimeout(onTransitionDone, 1200);
      return () => {
        window.removeEventListener(
          "replay-projects-entrance",
          replayProjectsEntrance,
        );
      };
    }

    setupAnimations();

    return () => {
      window.removeEventListener(
        "replay-projects-entrance",
        replayProjectsEntrance,
      );
    };
  }, container);

  return ctx;
};

export const initProjectReveal = (item: HTMLElement) => {
  const ctx = gsap.context(() => {
    gsap.fromTo(
      item,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top bottom-=50",
          once: true,
        },
      },
    );
  }, item);

  return ctx;
};

export const initProjectItemAnimations = (
  _isHovered: boolean,
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

  const ctx = gsap.context(() => {});

  return { ctx, splitTitle, splitCategories };
};
