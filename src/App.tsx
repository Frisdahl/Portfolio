import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
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
      <ScrollToTop />
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
