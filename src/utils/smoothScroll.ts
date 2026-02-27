import lenis from "./lenis";

export const scrollTo = (
  target: string | number,
  duration: number = 1.5,
  offset: number = 0,
  immediate: boolean = false,
) => {
  if (immediate) {
    // If immediate, use native window.scrollTo for absolute reliability
    if (typeof target === 'string') {
      const el = document.querySelector(target);
      if (el) {
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.scrollY + offset;
        window.scrollTo(0, top);
      }
    } else {
      window.scrollTo(0, target + offset);
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
      immediate 
    });
  }
};
