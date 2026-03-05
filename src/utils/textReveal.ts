import { revealYPercent } from "./animations";
import type { ScrollTriggerConfig } from "./animations";

export type TextRevealOptions = {
  start?: string;
  end?: string;
  duration?: number;
  ease?: string;
  toggleActions?: string;
  markers?: boolean;
  yPercentFrom?: number;
};

/**
 * Text reveal (yPercent) with ScrollTrigger. Uses shared animation utilities.
 */
export const createTextReveal = (
  element: HTMLElement,
  options: TextRevealOptions = {},
) => {
  const {
    start = "top 80%",
    end = "bottom 60%",
    duration = 1.2,
    ease = "power4.out",
    toggleActions = "play none none reverse",
    markers = false,
    yPercentFrom = 100,
  } = options;

  const scrollTrigger: ScrollTriggerConfig = {
    start,
    end,
    toggleActions,
    markers,
  };

  const tween = revealYPercent(element, {
    from: yPercentFrom,
    duration,
    ease,
    scrollTrigger,
  });

  return () => {
    if (Array.isArray(tween)) tween.forEach((t) => t.kill());
    else tween.kill();
  };
};
