import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import lenis from "../utils/lenis";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const hasPendingSectionTarget = !!sessionStorage.getItem("targetSection");
    const hasPendingSectionScroll =
      sessionStorage.getItem("pendingSectionScroll") === "true";
    const hasHash = Boolean(window.location.hash);
    const isHomePath = pathname === "/";
    const shouldPreserveSectionScroll =
      hasHash || (isHomePath && hasPendingSectionTarget);

    const shouldPreservePendingHomeSectionScroll =
      isHomePath && hasPendingSectionScroll;

    if (shouldPreserveSectionScroll || shouldPreservePendingHomeSectionScroll) {
      return;
    }

    // Clear stale intent flags so future navigations reset correctly
    sessionStorage.removeItem("targetSection");
    sessionStorage.removeItem("pendingSectionScroll");
    sessionStorage.removeItem("pendingProjectsEntrance");
    sessionStorage.removeItem("isHomeNav");

    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
