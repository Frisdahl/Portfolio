let transitionTrigger: (() => Promise<void>) | null = null;

/**
 * Internal function to set the transition trigger.
 */
export const _setTransitionTrigger = (trigger: () => Promise<void>) => {
  transitionTrigger = trigger;
};

/**
 * Manually trigger the page transition animation.
 * Returns a promise that resolves when the transition is "at the middle"
 * (screen covered) so you can switch content/scroll.
 */
export const triggerPageTransition = () => {
  if (transitionTrigger) {
    return transitionTrigger();
  }
  return Promise.resolve();
};
