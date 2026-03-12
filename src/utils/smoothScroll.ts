import lenis from "./lenis";

export const scrollTo = (
  target: string | number | Element,
  duration: number = 1.5,
  offset: number = 0,
  immediate: boolean = false,
) => {
  const resolveTargetTop = () => {
    if (typeof target === "number") {
      return target + offset;
    }

    const el =
      typeof target === "string" ? document.querySelector(target) : target;

    if (!el || !(el instanceof Element)) return null;

    const rect = el.getBoundingClientRect();
    return rect.top + window.scrollY + offset;
  };

  const top = resolveTargetTop();
  if (top === null) return;

  if (immediate) {
    // If immediate, use native window.scrollTo for absolute reliability
    window.scrollTo(0, top);

    // Sync lenis state immediately with the same value
    if (lenis) {
      lenis.scrollTo(top, { immediate: true });
    }
    return;
  }

  if (lenis) {
    lenis.scrollTo(target as string | number | HTMLElement, {
      duration,
      offset,
      immediate,
    });
    return;
  }

  window.scrollTo({ top, behavior: "smooth" });
};
