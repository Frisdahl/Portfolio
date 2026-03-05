/**
 * Shared animation constants.
 * All values tuned for transform/opacity-only animations (GPU-friendly).
 */

export const DURATION = {
  fast: 0.4,
  normal: 0.8,
  slow: 1.2,
  slower: 1.6,
} as const;

export const EASE = {
  out: "power3.out",
  outStrong: "power4.out",
  inOut: "power2.inOut",
  back: "back.out(1.7)",
} as const;

/**
 * ScrollTrigger preset positions.
 * Use with scrollReveal helpers for consistent behavior.
 */
export const TRIGGER_PRESETS = {
  /** Element top hits 80% viewport – classic “in view” */
  inView: { start: "top 80%", end: "bottom 60%" },
  /** Tighter – element top at 85% */
  inViewTight: { start: "top 85%", end: "bottom 50%" },
  /** Earlier – element top at 95% */
  inViewEarly: { start: "top 95%", end: "bottom 40%" },
  /** Just above fold – top at bottom of viewport */
  aboveFold: { start: "top bottom-=50", end: "bottom top" },
  /** Center – for parallax-style */
  center: { start: "top 60%", end: "bottom 40%" },
} as const;

export type TriggerPresetKey = keyof typeof TRIGGER_PRESETS;
