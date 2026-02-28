import Lenis from "@studio-freight/lenis";

let lenis: Lenis | null = null;

if (typeof window !== "undefined") {
  lenis = new Lenis({
    lerp: 0.08, // Slightly faster for responsiveness
    wheelMultiplier: 1,
    touchMultiplier: 1.5, // Better for touch devices
    infinite: false,
    syncTouch: false, // Disabling syncTouch improves video playback on touch
  });
}

export default lenis;
