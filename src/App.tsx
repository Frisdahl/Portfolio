import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import InitialLoader from "./components/InitialLoader";
import ComingSoon from "./components/ComingSoon";
import "./App.css";

import useSmoothScroll from "./utils/useSmoothScroll";

// Lazy Load Pages
const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));

function App() {
  useSmoothScroll();

  useEffect(() => {
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
  }, []);

  return (
    <Router>
      <div className="noise-grain" />
      <InitialLoader />
      <ScrollToTop />
      <ComingSoon />

      <Layout>
        <Suspense fallback={null}>
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
