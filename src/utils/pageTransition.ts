let trigger: null | ((onCovered?: () => void) => Promise<void>) = null;

/**
 * Internal function to set the transition trigger.
 */
export const _setTransitionTrigger = (
  fn: (onCovered?: () => void) => Promise<void>
) => {
  trigger = fn;
};

/**
 * Manually trigger the page transition animation.
 * @param onCovered Optional callback to execute when the screen is fully covered
 * @returns A promise that resolves when the transition is complete
 */
export const triggerPageTransition = async (onCovered?: () => void) => {
  if (!trigger) {
    onCovered?.();
    return Promise.resolve();
  }
  return trigger(onCovered);
};
