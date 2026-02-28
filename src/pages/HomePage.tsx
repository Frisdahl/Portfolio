import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Hero from "../sections/Hero/Hero";
import Projects from "../sections/Projects/Projects";
import Services from "../sections/Services/Services";
import TechStack from "../sections/TechStack/TechStack";
import Manifesto from "../sections/Manifesto/Manifesto";
// import VideoShowcase from "../sections/VideoShowcase/VideoShowcase";
import BrandsMarquee from "../sections/Collaboration/BrandsMarquee";
// import Expectations from "../sections/Expectations/Expectations";
// import Collaboration from "../sections/Collaboration/Collaboration";

function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="HomePage">
      {/* Hero Section */}
      <div className="mb-32 md:mb-48 lg:mb-32">
        <Hero />
      </div>

      {/* Video Showcase (Commented out) */}
      {/* <div className="mb-32 md:mb-48 lg:mb-64">
        <VideoShowcase />
      </div> */}

      {/* Manifesto Section */}
      <div className="mb-32 md:mb-48 lg:mb-64">
        <Manifesto />
      </div>

      {/* Projects Section */}
      <div className="mb-32 md:mb-48 lg:mb-64">
        <Projects />
      </div>

      {/* Services Section */}
      <div className="mb-32 md:mb-48 lg:mb-64">
        <Services />
      </div>

      {/* Tech Stack Section */}
      <div className="mb-32 md:mb-48 lg:mb-64">
        <TechStack />
      </div>

      {/* Brands Marquee Section */}
      {/*       <div className="mb-32 md:mb-48 lg:mb-64">
        <BrandsMarquee />
      </div> */}

      {/* <Expectations />
      <Collaboration /> */}
    </div>
  );
}

export default HomePage;
