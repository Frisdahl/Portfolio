import Lenis from '@studio-freight/lenis';

let lenis: Lenis | null = null;

if (typeof window !== 'undefined') {
  lenis = new Lenis({
    duration: 1.2, // Slightly faster for responsiveness
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    normalizeWheel: true, // Crucial for laptop trackpads
  });
}

export default lenis;
