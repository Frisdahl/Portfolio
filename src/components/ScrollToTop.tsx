import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import lenis from "../utils/lenis";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const hasPendingSectionTarget = !!sessionStorage.getItem("targetSection");
    const isPendingHomeNav = sessionStorage.getItem("isHomeNav") === "true";

    if (hasPendingSectionTarget || isPendingHomeNav || Boolean(hash)) {
      return;
    }

    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
