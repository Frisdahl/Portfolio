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

    const willPreserve = shouldPreservePendingHomeSectionScroll || shouldPreserveSectionScroll;
    // #region agent log
    fetch("http://127.0.0.1:7485/ingest/c3600584-6a50-43cc-836a-dd52b7cba410", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "da1222" },
      body: JSON.stringify({
        sessionId: "da1222",
        location: "ScrollToTop.tsx:useLayoutEffect",
        message: "ScrollToTop decision",
        data: {
          pathname,
          hasPendingSectionTarget,
          hasPendingSectionScroll,
          hasHash,
          isHomePath,
          willPreserve,
          scrollYBefore: window.scrollY,
        },
        timestamp: Date.now(),
        hypothesisId: "H-A,H-D",
      }),
    }).catch(() => {});
    // #endregion

    // Don't clear section intent when landing on home with a section target.
    // Scroll to 0 so we don't show the previous page's scroll position; keep main hidden until HomePage scrolls to section.
    if (willPreserve) {
      if (lenis) lenis.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
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
