import Lenis from '@studio-freight/lenis';

let lenis: Lenis | null = null;

if (typeof window !== 'undefined') {
  lenis = new Lenis({
    duration: 1.8,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
}

export default lenis;
