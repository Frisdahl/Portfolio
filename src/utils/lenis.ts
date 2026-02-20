import Lenis from "@studio-freight/lenis";

let lenis: Lenis | null = null;

if (typeof window !== "undefined") {
  lenis = new Lenis({
    duration: 1.5, // Smoother, longer duration
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.8,
    touchMultiplier: 1.5,
    normalizeWheel: true, // Crucial for laptop trackpads
    infinite: false,
    syncTouch: true, // Better touch device experience
  });
}

export default lenis;
