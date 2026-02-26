import React from "react";
import Hero from "../sections/Hero/Hero";
import Projects from "../sections/Projects/Projects";
import Services from "../sections/Services/Services";
import Expectations from "../sections/Expectations/Expectations";
import Collaboration from "../sections/Collaboration/Collaboration";
import VideoShowcase from "../sections/VideoShowcase/VideoShowcase";
import BrandsMarquee from "../sections/Collaboration/BrandsMarquee";
import Footer from "../components/Footer";

function HomePage() {
  return (
    <div className="HomePage">
      <Hero />
      <VideoShowcase />
      <Services />
      <Projects />
      <BrandsMarquee />
      {/* <Expectations />
      <Collaboration /> */}
      <Footer />
    </div>
  );
}

export default HomePage;
