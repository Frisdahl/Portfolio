import lenis from './lenis';

export const scrollTo = (target: string, duration: number = 2) => {
  if (lenis) {
    lenis.scrollTo(target, { duration });
  }
};
