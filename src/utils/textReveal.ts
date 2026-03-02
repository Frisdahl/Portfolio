import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

type TextRevealOptions = {
  start?: string;
  end?: string;
  duration?: number;
  ease?: string;
  toggleActions?: string;
  markers?: boolean;
  yPercentFrom?: number;
};

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

  const tween = gsap.fromTo(
    element,
    { yPercent: yPercentFrom },
    {
      yPercent: 0,
      duration,
      ease,
      scrollTrigger: {
        trigger: element,
        start,
        end,
        toggleActions,
        markers,
      },
    },
  );

  return () => {
    tween.kill();
  };
};
