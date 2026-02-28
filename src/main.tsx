import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.css";
import App from './App.tsx'
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";

if (typeof window !== "undefined") {
  // Use a small timeout to override browser scroll restoration more reliably
  window.history.scrollRestoration = "manual";
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 10);
}

gsap.registerPlugin(ScrollTrigger, Observer);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
