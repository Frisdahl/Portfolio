import React from "react";
import AnimatedButton from "./AnimatedButton"; // Import AnimatedButton

interface HeaderProps {
  showScrollButton: boolean;
}

const Header: React.FC<HeaderProps> = ({ showScrollButton }) => {
  return (
    <header
      className={`fixed top-4 left-0 right-0 z-50 flex justify-between items-center py-6 pl-8 pr-16 rounded-full mx-8 transition-colors duration-300 ${
        showScrollButton ? "backdrop-blur-md bg-white/30" : "bg-transparent"
      }`}
    >
      {/* Logo */}
      <div className="z-50">
        <a href="/">
          <img
            src="/images/Portfolio-logo.svg"
            alt="Portfolio Logo"
            className="h-12 transition-all duration-500"
          />
        </a>
      </div>

      <div className="flex items-center gap-8">
        {/* "Get in touch" button */}
        <div
          className={`transition-opacity duration-300 ${
            showScrollButton ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="relative overflow-hidden inline-block rounded-full">
            {" "}
            {/* Container for clipping the reveal */}
            <AnimatedButton
              text="Get in touch"
              baseBgColor="bg-black"
              baseTextColor="text-white"
              hoverTextColor="text-black"
              className="!h-10 !px-5 !py-2 mr-8"
            />
            {/* Left white box */}
            <div
              className={`absolute top-0 bottom-0 left-0 w-1/2 bg-[#f2f2f2] z-30 transition-transform duration-700 ease-out ${
                showScrollButton ? "-translate-x-full" : "translate-x-0"
              }`}
            ></div>
            {/* Right white box */}
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
