import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

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
  const isReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

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

    // Hide immediately to avoid flash before transition-sync setup runs.
    gsap.set([headerTextEl, subTextEl, ...allCards], { opacity: 0 });

    const setupAnimations = () => {
      if (didSetup) return;
      didSetup = true;

      const imageBaseDelay = 0.2;

      // 1. Header Entrance Animation
      const headerText = headerTextEl as HTMLElement;
      const subText = subTextEl as HTMLElement;

      if (headerText && subText) {
        gsap.set([headerText, subText], { opacity: 1 });

        // Removed SplitType as it breaks the custom AnimatedLetter logic
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

      const rows = container.querySelectorAll(".project-row");

      rows.forEach((row) => {
        const cards = Array.from(
          row.querySelectorAll(".project-card"),
        ) as HTMLElement[];
        const largeItem = row.querySelector(".project-large") as HTMLElement;

        // --- 1. Horizontal Video Rows / Large Items ---
        if (
          largeItem ||
          (cards.length === 1 && row.classList.contains("project-row--large"))
        ) {
          const target = largeItem || cards[0];

          gsap.fromTo(
            target,
            {
              opacity: 0,
              scale: isReducedMotion ? 1 : 0.98,
              y: isReducedMotion ? 0 : 20,
            },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 1.6,
              delay: imageBaseDelay,
              ease: "power4.out",
              scrollTrigger: {
                trigger: row,
                start: "top 80%",
                once: true,
              },
            },
          );
          return;
        }

        // --- 2. Grid Rows with Two Cards ---
        if (cards.length === 2) {
          cards.forEach((card, idx) => {
            const isLeft = idx === 0;

            let xOffset = 0;
            if (!isReducedMotion) {
              xOffset = isLeft ? -18 : 18;
            }

            gsap.fromTo(
              card,
              {
                opacity: 0,
                x: xOffset,
                y: isReducedMotion ? 0 : 10,
              },
              {
                opacity: 1,
                x: 0,
                y: 0,
                duration: 1.35,
                ease: "power4.out",
                delay: imageBaseDelay + idx * 0.12,
                scrollTrigger: {
                  trigger: row,
                  start: "top 80%",
                  once: true,
                },
              },
            );
          });
        } else if (cards.length > 0) {
          // Fallback for single cards or other layouts
          gsap.fromTo(
            cards,
            { opacity: 0, y: isReducedMotion ? 0 : 24 },
            {
              opacity: 1,
              y: 0,
              duration: 1.3,
              delay: imageBaseDelay,
              stagger: 0.12,
              ease: "power4.out",
              scrollTrigger: {
                trigger: row,
                start: "top 80%",
                once: true,
              },
            },
          );
        }
      });

      ScrollTrigger.refresh();
    };

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
      return;
    }

    setupAnimations();
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
