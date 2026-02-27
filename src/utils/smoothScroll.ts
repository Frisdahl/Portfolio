import lenis from "./lenis";

export const scrollTo = (
  target: string | number,
  duration: number = 1.5,
  offset: number = 0,
  immediate: boolean = false,
) => {
  if (lenis) {
    lenis.scrollTo(target, { 
      duration: immediate ? 0 : duration, 
      offset,
      immediate 
    });
  }
};
