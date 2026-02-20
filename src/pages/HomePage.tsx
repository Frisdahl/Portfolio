import React from "react";
import Hero from "../sections/Hero/Hero";
import Projects from "../sections/Projects/Projects";
import Services from "../sections/Services/Services";
/* import Expectations from "../sections/Expectations/Expectations";
import Collaboration from "../sections/Collaboration/Collaboration"; */
import VideoShowcase from "../sections/VideoShowcase/VideoShowcase";

function HomePage() {
  return (
    <div className="HomePage">
      <Hero />
      <VideoShowcase />
      <Projects />
      <Services />
      {/* <Expectations />
      <Collaboration /> */}
    </div>
  );
}

export default HomePage;
