/**
 * Reusable scroll-triggered animations using transform and opacity only.
 */
import { gsap } from "./gsap";
// @ts-expect-error - used for ScrollTrigger.Vars type below
import type { ScrollTrigger } from "gsap/ScrollTrigger";
import { DURATION, EASE, TRIGGER_PRESETS, type TriggerPresetKey } from "./constants";

export type ScrollTriggerConfig =
  | { preset: TriggerPresetKey; once?: boolean; scrub?: boolean; toggleActions?: string }
  | {
      start: string;
      end?: string;
      once?: boolean;
      scrub?: boolean;
      toggleActions?: string;
      markers?: boolean;
    };

function resolveScrollTrigger(
  config: ScrollTriggerConfig | undefined,
  trigger: gsap.DOMTarget,
): ScrollTrigger.Vars | undefined {
  if (!config) return undefined;

  const base: ScrollTrigger.Vars = {
    trigger,
    once: config.once ?? true,
    toggleActions: config.toggleActions ?? "play none none reverse",
  };

  if ("preset" in config) {
    const { start, end } = TRIGGER_PRESETS[config.preset];
    return { ...base, start, end, scrub: config.scrub };
  }

  return {
    ...base,
    start: config.start,
    end: config.end,
    scrub: config.scrub,
    markers: config.markers,
    toggleActions: config.toggleActions ?? base.toggleActions,
  };
}

export type FadeUpOptions = {
  y?: number;
  duration?: number;
  ease?: string;
  stagger?: number;
  scrollTrigger?: ScrollTriggerConfig;
};

/**
 * Fade up: opacity 0→1 and translateY(from)→0.
 * Uses transform + opacity for performance.
 */
export function fadeUp(
  targets: gsap.DOMTarget,
  options: FadeUpOptions = {},
): gsap.core.Tween | gsap.core.Tween[] {
  const {
    y = 24,
    duration = DURATION.normal,
    ease = EASE.out,
    stagger,
    scrollTrigger: stConfig,
  } = options;

  const trigger = Array.isArray(targets) ? (targets as HTMLElement[])[0] : targets;
  const st = resolveScrollTrigger(stConfig, trigger);

  return gsap.fromTo(
    targets,
    { y, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration,
      ease,
      stagger,
      scrollTrigger: st,
    },
  );
}

export type FadeInOptions = {
  duration?: number;
  ease?: string;
  stagger?: number;
  scrollTrigger?: ScrollTriggerConfig;
};

/**
 * Fade in: opacity 0→1 only.
 */
export function fadeIn(
  targets: gsap.DOMTarget,
  options: FadeInOptions = {},
): gsap.core.Tween | gsap.core.Tween[] {
  const {
    duration = DURATION.normal,
    ease = EASE.out,
    stagger,
    scrollTrigger: stConfig,
  } = options;

  const trigger = Array.isArray(targets) ? (targets as HTMLElement[])[0] : targets;
  const st = resolveScrollTrigger(stConfig, trigger);

  return gsap.fromTo(
    targets,
    { opacity: 0 },
    { opacity: 1, duration, ease, stagger, scrollTrigger: st },
  );
}

export type RevealYPercentOptions = {
  from?: number;
  duration?: number;
  ease?: string;
  stagger?: number;
  scrollTrigger?: ScrollTriggerConfig;
};

/**
 * Vertical clip-style reveal (e.g. line-by-line text).
 * Animates yPercent only (transform) for performance.
 */
export function revealYPercent(
  targets: gsap.DOMTarget,
  options: RevealYPercentOptions = {},
): gsap.core.Tween | gsap.core.Tween[] {
  const {
    from = 100,
    duration = DURATION.slow,
    ease = EASE.outStrong,
    stagger,
    scrollTrigger: stConfig,
  } = options;

  const trigger = Array.isArray(targets) ? (targets as HTMLElement[])[0] : targets;
  const st = resolveScrollTrigger(stConfig, trigger);

  return gsap.fromTo(
    targets,
    { yPercent: from },
    {
      yPercent: 0,
      duration,
      ease,
      stagger,
      scrollTrigger: st,
    },
  );
}

export type ScaleInOptions = {
  from?: number;
  duration?: number;
  ease?: string;
  scrollTrigger?: ScrollTriggerConfig;
};

/**
 * Scale in with optional opacity. Transform + opacity only.
 */
export function scaleIn(
  targets: gsap.DOMTarget,
  options: ScaleInOptions = {},
): gsap.core.Tween | gsap.core.Tween[] {
  const {
    from = 0.98,
    duration = DURATION.normal,
    ease = EASE.out,
    scrollTrigger: stConfig,
  } = options;

  const trigger = Array.isArray(targets) ? (targets as HTMLElement[])[0] : targets;
  const st = resolveScrollTrigger(stConfig, trigger);

  return gsap.fromTo(
    targets,
    { scale: from, opacity: 0 },
    { scale: 1, opacity: 1, duration, ease, scrollTrigger: st },
  );
}

/**
 * Split text into lines and animate them with a stagger effect.
 */
export function splitLinesAndAnimate(
  targets: string | HTMLElement | HTMLElement[],
  options: {
    stagger?: number;
    duration?: number;
    ease?: string;
    delay?: number;
    start?: string;
    scrollTrigger?: boolean;
  } = {}
) {
  const elements = typeof targets === "string" 
    ? gsap.utils.toArray(targets) as HTMLElement[] 
    : Array.isArray(targets) ? targets : [targets];

  elements.forEach((element) => {
    const originalText = element.innerText;
    const words = originalText.split(" ");
    
    // 1. Wrap each word in a span to measure positions
    element.innerHTML = words
      .map((word) => `<span>${word} </span>`)
      .join("");

    const spans = element.querySelectorAll("span");
    const lines: HTMLElement[][] = [];
    let currentLine: HTMLElement[] = [];
    let lastTop = -1;

    // 2. Group spans by their top position (detecting lines)
    spans.forEach((span) => {
      const top = span.offsetTop;
      if (top !== lastTop && lastTop !== -1) {
        lines.push(currentLine);
        currentLine = [];
      }
      currentLine.push(span);
      lastTop = top;
    });
    lines.push(currentLine);

    // 3. Rebuild DOM with line wrappers (clean text, no spans)
    element.innerHTML = "";
    lines.forEach((line) => {
      const lineText = line.map(span => span.innerText).join(" ");
      const lineDiv = document.createElement("div");
      lineDiv.className = "overflow-hidden w-full";
      const innerDiv = document.createElement("div");
      innerDiv.className = "split-line-inner w-full";
      innerDiv.textContent = lineText;
      lineDiv.appendChild(innerDiv);
      element.appendChild(lineDiv);
    });

    // 4. Animate the lines
    const lineInners = element.querySelectorAll(".split-line-inner");
    
    gsap.from(lineInners, {
      yPercent: 100,
      opacity: 0,
      stagger: options.stagger ?? 0.08,
      duration: options.duration ?? 1.2,
      ease: options.ease ?? "power4.out",
      delay: options.delay ?? 0,
      scrollTrigger: options.scrollTrigger ? {
        trigger: element,
        start: options.start ?? "top 90%",
      } : undefined
    });
  });
}

/**
 * Kill reveal tweens. Use inside useEffect/useLayoutEffect cleanup, or rely on gsap.context() for full revert.
 */
export function killReveal(tween: gsap.core.Tween | gsap.core.Tween[]): void {
  const tweens = Array.isArray(tween) ? tween : [tween];
  tweens.forEach((t) => t.kill());
}
