import Lenis from "@studio-freight/lenis";

let lenis: Lenis | null = null;

if (typeof window !== "undefined") {
  lenis = new Lenis({
    lerp: 0.1, // More consistent smoothness
    wheelMultiplier: 1,
    touchMultiplier: 1, // Reduced for natural mobile feel
    infinite: false,
    syncTouch: true,
  });
}

export default lenis;
