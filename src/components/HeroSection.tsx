import React, { useLayoutEffect, useRef } from "react";
import AnimatedButton from "./AnimatedButton";
import { gsap } from "gsap"; // Import gsap
// import { ScrollTrigger } from "gsap/ScrollTrigger"; // Not needed for this marquee

// gsap.registerPlugin(ScrollTrigger); // Not needed for this marquee

// Social icons - using placeholders for now, can be replaced with actual SVG icons
const SocialIcon = ({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`transition-colors duration-300 ${className}`}
  >
    {children}
  </a>
);

const HeroSection: React.FC = () => {
  const boxesRef = useRef(null); // Ref for the boxes container
  const marqueeTween = useRef(null); // Ref to store the GSAP animation instance

  // Helper function to create seamless wrapping
  const wrap = (value: number, max: number) => (value % max + max) % max;

  useLayoutEffect(() => {
    const boxes = boxesRef.current;
    if (!boxes) return;

    const textToRepeat = "Frisdahl Studio°";
    const segmentBaseClasses = "uppercase text-4xl font-granary text-gray-800 mx-4 absolute"; // Added absolute

    // Measure the width of a single segment dynamically (more robust)
    const tempSpan = document.createElement("span");
    tempSpan.className = segmentBaseClasses;
    tempSpan.textContent = textToRepeat;
    tempSpan.style.whiteSpace = "nowrap"; // Ensure text doesn't wrap during measurement
    tempSpan.style.position = "absolute"; // Explicitly set for measurement, as we add 'absolute' to segmentBaseClasses
    tempSpan.style.visibility = "hidden"; // Hide it
    boxes.appendChild(tempSpan); // Append to boxes to get correct context
    const segmentWidth = tempSpan.offsetWidth + 32; // Added 32 for mx-4 (16px left + 16px right)
    boxes.removeChild(tempSpan);

    boxes.innerHTML = ""; // Clear existing content

    const containerWidth = boxes.parentElement.offsetWidth;

    // Calculate how many segments are needed to fill the container, plus extra for seamless looping
    const numSegmentsToFillScreen = Math.ceil(containerWidth / segmentWidth) + 1;
    const numClones = numSegmentsToFillScreen * 2; // Enough to fill twice the screen for seamless loop

    const allBoxElements = [];
    for (let k = 0; k < numClones; k++) {
      const span = document.createElement("span");
      span.className = segmentBaseClasses;
      span.textContent = textToRepeat;
      boxes.appendChild(span);
      allBoxElements.push(span);
    }
    
    // Set initial position of each box
    gsap.set(allBoxElements, {
      x: (k) => k * segmentWidth, // Position boxes side by side initially
    });

    const totalLoopWidth = segmentWidth * numSegmentsToFillScreen; // The width of one visible set of content

    // Animate the boxes to the right (like the inspiration)
    marqueeTween.current = gsap.to(allBoxElements, {
      duration: 10, // Changed duration to 10s
      ease: "none",
      x: `+=${totalLoopWidth}`, // Move right by the width of one visible set of content
      modifiers: {
        x: (x) => {
          // This creates the seamless loop: when an element moves past the right edge,
          // it instantly jumps back to the left, but shifted by totalLoopWidth to follow the previous elements.
          return wrap(parseFloat(x), totalLoopWidth) + "px";
        }
      },
      repeat: -1,
    });

    // Cleanup function for GSAP animation
    return () => {
      if (marqueeTween.current) {
        marqueeTween.current.kill();
      }
    };
  }, []); // Empty dependency array, runs once on mount

  return (
    <section className="relative min-h-screen w-full bg-transparent text-black overflow-hidden flex flex-col justify-center">
      {/* Top Left: Brand/Name */}

      {/* Center Left: HUGE Headline */}
      <div className="flex flex-col items-start justify-center py-8 px-16 md:px-32 lg:px-32 relative">
        <h1 className="text-6xl md:text-6xl lg:text-7xl color-[#010101] font-regular text-left pmm uppercase leading-none tracking-tighter animate-fade-in-up text-gray-900 font-granary">
          <span className="font-[700]">Freelance</span> web developer <br></br>&
          creative designer
        </h1>

        <p className="mt-6 text-lg md:text-xl max-w-lg text-gray-600 animate-fade-in-up delay-200 text-left">
          Working alongside ambitious startups and enterprises to build scalable
          web, mobile, and cross-platform products — from concept to launch
          worldwide.
        </p>

        <AnimatedButton
          text="Let's discuss your project"
          baseBgColor="bg-[#121723]"
          baseTextColor="text-white"
          hoverTextColor="text-black"
          className="mt-8 animate-fade-in-up delay-400"
        />
      </div>

      {/* New Bottom Section: Social Links, Paragraph, Divider, Marquee */}
      <div className="w-full px-16 md:px-32 lg:px-32 mt-16 pb-8">
        {/* Content above divider: Social Links and Paragraph */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
          {/* Social Links */}
          <div className="flex space-x-6">
            <SocialIcon href="#" className="text-gray-600 hover:text-black">
              IG
            </SocialIcon>
            <SocialIcon href="#" className="text-gray-600 hover:text-black">
              FB
            </SocialIcon>
            <SocialIcon href="#" className="text-gray-600 hover:text-black">
              LK
            </SocialIcon>
            <SocialIcon href="#" className="text-gray-600 hover:text-black">
              TEL
            </SocialIcon>
            <SocialIcon href="#" className="text-gray-600 hover:text-black">
              MAIL
            </SocialIcon>
            <SocialIcon href="#" className="text-gray-600 hover:text-black">
              AWWWARDS
            </SocialIcon>
          </div>

          {/* Short Paragraph */}
          <p className="text-gray-600 text-sm max-w-xs text-right">
            Jeg hjælper iværksættere, foreninger og entusiaster med at lancere
            deres webprojekter og forbedre deres brand image med skræddersyet
            grafisk design, der kombinerer ydeevne, tilgængelighed og SEO.
          </p>
        </div>

        {/* Thin Horizontal Divider */}
        <hr className="w-full h-px bg-gray-300 border-0 my-8" />

        {/* Marquee Slider */}
        <div className="relative w-full overflow-hidden flex items-center wrapper"> {/* Removed py-8, added flex items-center */}
          <div className="boxes relative w-full h-full flex" ref={boxesRef}> {/* Added flex */}
            {/* The spans will be generated dynamically by GSAP */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;