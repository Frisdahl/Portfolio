import { Suspense, lazy, useEffect, useLayoutEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import "./App.css";

import useSmoothScroll from "./utils/useSmoothScroll";

// Lazy Load Pages
const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const ComingSoon = lazy(() => import("./components/ComingSoon"));

function App() {
  const [showNonCriticalUI, setShowNonCriticalUI] = useState(false);

  useSmoothScroll();

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let idleId: number | null = null;

    const revealNonCriticalUI = () => setShowNonCriticalUI(true);

    if ("requestIdleCallback" in window) {
      idleId = (
        window as Window & {
          requestIdleCallback: (
            cb: IdleRequestCallback,
            opts?: IdleRequestOptions,
          ) => number;
        }
      ).requestIdleCallback(revealNonCriticalUI, { timeout: 1500 });
    } else {
      timeoutId = setTimeout(revealNonCriticalUI, 600);
    }

    console.clear();

    console.log(
      "%cFRISDAHL.STUDIO°",
      `
      font-size:32px;
      font-weight:700;
      background:linear-gradient(90deg,#ffffff,#888);
      -webkit-background-clip:text;
      color:transparent;
      padding: 10px 0;
      `,
    );

    console.log(
      "%cHey fellow developer 👋",
      "font-size:16px; color:#fff; font-family: 'Switzer', sans-serif; padding-top: 10px;",
    );

    console.log(
      "%cIf you're here, you're probably curious. I like that.",
      "font-size:14px; color:#888; font-family: 'Switzer', sans-serif;",
    );

    console.log(
      "%cWant to build something cool together?",
      "font-size:14px; color:#ffffff; font-family: 'Switzer', sans-serif; font-weight: bold; padding-top: 10px;",
    );

    console.log(
      "%c👉 frisdahlmarketing@gmail.com",
      "font-size:14px; color:#ffffff; font-family: 'Switzer', sans-serif; text-decoration: underline;",
    );

    return () => {
      if (timeoutId !== null) clearTimeout(timeoutId);
      if (idleId !== null && "cancelIdleCallback" in window) {
        (
          window as Window & {
            cancelIdleCallback: (id: number) => void;
          }
        ).cancelIdleCallback(idleId);
      }
    };
  }, []);

  return (
    <Router>
      {/* <InitialLoader /> */}
      {/* <PageTransition /> */}
      {showNonCriticalUI && <SpeedInsights />}
      <ScrollToTop />
      {showNonCriticalUI && (
        <Suspense fallback={null}>
          <ComingSoon />
        </Suspense>
      )}

      <Layout>
        <Suspense
          fallback={
            <div className="w-full min-h-screen bg-[var(--background)]" />
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
