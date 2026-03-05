/**
 * Reusable GSAP + ScrollTrigger animation utilities.
 * Animations use transform and opacity only for performance.
 */

export { gsap, ScrollTrigger } from "./gsap";
export { DURATION, EASE, TRIGGER_PRESETS } from "./constants";
export type { TriggerPresetKey } from "./constants";
export {
  fadeUp,
  fadeIn,
  revealYPercent,
  scaleIn,
  killReveal,
} from "./scrollReveal";
export { useReveal } from "./useReveal";
export type {
  ScrollTriggerConfig,
  FadeUpOptions,
  FadeInOptions,
  RevealYPercentOptions,
  ScaleInOptions,
} from "./scrollReveal";
