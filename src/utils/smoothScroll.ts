import lenis from "./lenis";

export const scrollTo = (
  target: string | number,
  duration: number = 1.5,
  offset: number = 0,
  immediate: boolean = false,
) => {
  const resolveTargetTop = () => {
    if (typeof target === "string") {
      const el = document.querySelector(target);
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return rect.top + window.scrollY + offset;
    }

    return target + offset;
  };

  if (immediate) {
    // If immediate, use native window.scrollTo for absolute reliability
    const top = resolveTargetTop();
    if (top !== null) {
      window.scrollTo(0, top);
    }

    // Sync lenis state immediately
    if (lenis) {
      lenis.scrollTo(window.scrollY, { immediate: true });
    }
    return;
  }

  if (lenis) {
    lenis.scrollTo(target, {
      duration,
      offset,
      immediate,
    });
    return;
  }

  const top = resolveTargetTop();
  if (top !== null) {
    window.scrollTo({ top, behavior: "smooth" });
  }
};
