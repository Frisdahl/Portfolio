import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";

if (typeof window !== "undefined") {
  const forceTop = () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.style.visibility = "hidden";
  }

  forceTop();

  requestAnimationFrame(() => {
    forceTop();
    if (rootElement) {
      rootElement.style.visibility = "visible";
    }
  });

  window.addEventListener("load", forceTop, { once: true });
  window.addEventListener("pageshow", forceTop);
}

gsap.registerPlugin(ScrollTrigger, Observer);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
