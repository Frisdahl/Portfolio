import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import PageTransition from "./components/PageTransition";
import ComingSoon from "./components/ComingSoon";
import Contact from "./sections/Contact/Contact";
import "./App.css";

import useSmoothScroll from "./utils/useSmoothScroll";

// Lazy Load Pages
const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));

function App() {
  useSmoothScroll();

  return (
    <Router>
      <div className="noise-grain" />
      <ScrollToTop />
      <PageTransition />
      <ComingSoon />
      <Layout>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
          <Contact />
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
