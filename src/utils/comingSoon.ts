/**
 * A simple utility to trigger the coming soon notification from anywhere.
 */
export const showComingSoon = () => {
  window.dispatchEvent(new CustomEvent("show-coming-soon"));
};
