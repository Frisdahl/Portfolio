import lenis from './lenis';

export const scrollTo = (target: string | number, duration: number = 3) => {
  if (lenis) {
    lenis.scrollTo(target, { duration });
  }
};
