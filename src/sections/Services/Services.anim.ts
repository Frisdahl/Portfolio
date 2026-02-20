import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Decoupled GSAP animation logic for the Services section.
 * Maintains context-scoped triggers and respects performance-first architecture.
 */
export const initServicesAnimations = (
  container: HTMLElement,
  image: HTMLImageElement,
  images: string[]
) => {
  const ctx = gsap.context(() => {
    // 1. Parallax Effect
    gsap.fromTo(
      image,
      { yPercent: -12 },
      {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );

    // 2. Image Switching Sequence
    ScrollTrigger.create({
      trigger: container,
      start: "top center",
      end: "bottom center",
      onUpdate: (self) => {
        const index = Math.min(
          Math.floor(self.progress * images.length),
          images.length - 1
        );
        if (image.src !== images[index]) {
          image.src = images[index];
        }
      },
    });
  }, container);

  return ctx;
};
