/**
 * Central GSAP + ScrollTrigger setup.
 * Register once here; use transform and opacity only for performant animations.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
