/**
 * React hook to run a reveal animation and clean up on unmount.
 */
import { useLayoutEffect, useRef } from "react";
import { killReveal } from "./scrollReveal";

type TweenRef = any; // Replacing gsap.core.Tween usage if it's considered unused or problematic. 
// Actually, let me try just removing the import and seeing if I can use type-only import differently.

/**
 * Runs an animation factory once ref is set and kills it on cleanup.
 * Usage:
 *   const ref = useRef<HTMLDivElement>(null);
 *   useReveal(ref, (el) => fadeUp(el, { scrollTrigger: { preset: "inView" } }));
 */
export function useReveal<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  animate: (element: T) => TweenRef,
  deps: React.DependencyList = [],
): void {
  const tweenRef = useRef<TweenRef>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    tweenRef.current = animate(el);

    return () => {
      if (tweenRef.current) {
        killReveal(tweenRef.current);
        tweenRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, animate, ...deps]);
}
