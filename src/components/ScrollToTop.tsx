import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import lenis from "../utils/lenis";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const hasPendingSectionTarget = !!sessionStorage.getItem("targetSection");
    const hasHash = Boolean(window.location.hash);
    const isHomePath = pathname === "/";
    const shouldPreserveSectionScroll =
      hasHash || (isHomePath && hasPendingSectionTarget);

    if (shouldPreserveSectionScroll) {
      return;
    }

    // Clear stale intent flags so future navigations reset correctly
    sessionStorage.removeItem("targetSection");
    sessionStorage.removeItem("isHomeNav");

    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
