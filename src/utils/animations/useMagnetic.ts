import { useLayoutEffect, RefObject } from "react";
import { gsap } from "gsap";

interface UseMagneticOptions {
  strength?: number;
  duration?: number;
  ease?: string;
  enabled?: boolean;
}
export const useMagnetic = (
  ref: RefObject<HTMLElement | null>,
  options: UseMagneticOptions = {},
) => {
  const {
    strength = 40,
    duration = 0.6,
    ease = "power2.out",
    enabled = true,
  } = options;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = el.getBoundingClientRect();

      // Calculate center of the element
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      // Calculate distance between mouse and center
      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;

      // Animate the element towards the cursor, limited by strength
      gsap.to(el, {
        x: (deltaX / width) * strength,
        y: (deltaY / height) * strength,
        duration: duration,
        ease: ease,
      });
    };

    const handleMouseLeave = () => {
      // Reset position when mouse leaves
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: duration * 1.5,
        ease: "elastic.out(1, 0.3)",
      });
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [ref, strength, duration, ease, enabled]);
};
