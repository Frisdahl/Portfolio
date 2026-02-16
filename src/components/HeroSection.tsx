import React, { useLayoutEffect, useRef } from "react";
import AnimatedButton from "./AnimatedButton";
import { gsap } from "gsap";

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
  const boxesRef = useRef(null);
  const marqueeTween = useRef(null);

  const wrap = (value: number, max: number) => ((value % max) + max) % max;

  useLayoutEffect(() => {
    const boxes = boxesRef.current;
    if (!boxes) return;

    const textToRepeat = "Frisdahl Studio°";
    const segmentBaseClasses =
      "uppercase text-4xl font-granary text-gray-800 mx-4 absolute";

    const tempSpan = document.createElement("span");
    tempSpan.className = segmentBaseClasses;
    tempSpan.textContent = textToRepeat;
    tempSpan.style.whiteSpace = "nowrap";
    tempSpan.style.position = "absolute";
    tempSpan.style.visibility = "hidden";
    boxes.appendChild(tempSpan);
    const segmentWidth = tempSpan.offsetWidth + 32;
    boxes.removeChild(tempSpan);

    boxes.innerHTML = "";

    const containerWidth = boxes.parentElement.offsetWidth;

    const numSegmentsToFillScreen =
      Math.ceil(containerWidth / segmentWidth) + 1;
    const numClones = numSegmentsToFillScreen * 2;

    const allBoxElements = [];
    for (let k = 0; k < numClones; k++) {
      const span = document.createElement("span");
      span.className = segmentBaseClasses;
      span.textContent = textToRepeat;
      boxes.appendChild(span);
      allBoxElements.push(span);
    }

    gsap.set(allBoxElements, {
      x: (k) => k * segmentWidth,
    });

    const totalLoopWidth = segmentWidth * numSegmentsToFillScreen;

    marqueeTween.current = gsap.to(allBoxElements, {
      duration: 10,
      ease: "none",
      x: `+=${totalLoopWidth}`,
      modifiers: {
        x: (x) => {
          return wrap(parseFloat(x), totalLoopWidth) + "px";
        },
      },
      repeat: -1,
    });

    return () => {
      if (marqueeTween.current) {
        marqueeTween.current.kill();
      }
    };
  }, []);

  return (
    <section className="relative h-screen w-full bg-transparent text-black overflow-hidden flex flex-col">
      {/* Center Content: HUGE Headline */}
      <div className="flex-1 flex flex-col items-start justify-center px-16 md:px-32 lg:px-32 -mt-16">
        <img
          src="/images/danish-flag.svg"
          alt="Danish Flag"
          className="h-8 mb-4 rounded-full"
        />
        <h1 className="text-6xl md:text-6xl lg:text-7xl color-[#121723] font-regular text-left pmm uppercase leading-none tracking-tighter animate-fade-in-up text-gray-900 font-granary">
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
          baseBgColor="bg-[#0a0a0a]"
          baseTextColor="text-[#f2f2f2]"
          hoverTextColor="text-[#0a0a0a]"
          hoverBgColor="bg-[#f2f2f2]"
          className="mt-8 animate-fade-in-up delay-400"
        />
      </div>

      {/* Bottom Section: Social Links, Paragraph, Divider, Marquee */}
      <div className="w-full px-16 md:px-32 lg:px-32 pb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
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

          <p className="text-gray-600 text-sm max-w-xs text-right">
            Jeg hjælper iværksættere, foreninger og entusiaster med at lancere
            deres webprojekter og forbedre deres brand image med skræddersyet
            grafisk design, der kombinerer ydeevne, tilgængelighed og SEO.
          </p>
        </div>

        <hr className="w-full h-px bg-gray-300 border-0 my-8" />

        <div className="relative w-full overflow-hidden flex items-center wrapper">
          <div
            className="boxes relative w-full h-full flex"
            ref={boxesRef}
          ></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
