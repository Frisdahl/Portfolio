import React from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import AnimatedButton from "./AnimatedButton";
import { scrollTo } from "../utils/smoothScroll";

gsap.registerPlugin(ScrollToPlugin);

interface HeaderProps {
  showScrollButton: boolean;
  isInverted: boolean;
}

const Header: React.FC<HeaderProps> = ({ showScrollButton, isInverted }) => {
  const isButtonVisible = showScrollButton && !isInverted;

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname === "/") {
      e.preventDefault();
      gsap.to(window, { scrollTo: 0, duration: 1, ease: "power2.out" });
    }
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-between items-center py-6 pl-8 pr-16 rounded-full mx-8 transition-colors duration-300 bg-transparent">
      <div className="z-50">
        <a href="/" onClick={handleLogoClick}>
          <img
            src="/images/Portfolio-logo.svg"
            alt="Portfolio Logo"
            className={`h-12 transition-all duration-500 ${isInverted ? "filter invert" : ""}`}
          />
        </a>
      </div>

      <div className="flex items-center gap-8">
        <div
          className={`transition-opacity duration-300 ${
            isButtonVisible ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="relative overflow-hidden inline-block rounded-full">
            <AnimatedButton
              text="Get in touch"
              baseBgColor="bg-[#0a0a0a]"
              baseTextColor="text-[#f2f2f2]"
              hoverTextColor="text-[#0a0a0a]"
              hoverBgColor="bg-[#f2f2f2]"
              className="!h-10 !px-5 !py-2 mr-8"
              onClick={() => scrollTo("#contact", 2)}
            />
            <div
              className={`absolute top-0 bottom-0 left-0 w-1/2 bg-[#f2f2f2] z-30 transition-transform duration-700 ease-out ${
                showScrollButton ? "-translate-x-full" : "translate-x-0"
              }`}
            ></div>
            <div
              className={`absolute top-0 bottom-0 right-0 w-1/2 bg-[#f2f2f2] z-30 transition-transform duration-700 ease-out ${
                showScrollButton ? "translate-x-full" : "translate-x-0"
              }`}
            ></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
