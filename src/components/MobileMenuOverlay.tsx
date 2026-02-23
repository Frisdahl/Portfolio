import React from "react";
import { Link } from "react-router-dom";
import AnimatedButton from "./AnimatedButton";
import { scrollTo } from "../utils/smoothScroll";
import Links from "./Links";

const MobileMenuOverlay: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const handleGetInTouchClick = () => {
    onClose();
    scrollTo("#contact", 3);
  };

  return (
    // Outermost fixed full-screen container for the overlay
    <div
      className={`fixed inset-0 z-[150] transition-opacity duration-700 ease-in-out ${
        isOpen
          ? "opacity-100 pointer-events-auto bg-[rgba(0,0,0,0.6)]"
          : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose} // Close menu if clicked outside
    >
      {/* The actual menu panel that slides in/out */}
      <div
        className={`fixed top-0 right-0 w-full sm:w-[500px] h-full sm:h-auto sm:max-h-screen bg-[#fff] transform transition-transform duration-700 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-[110%]"
        } overflow-y-auto px-6 sm:px-12 pt-24 sm:pt-16 pb-12 text-left text-[#0a0a0a] shadow-2xl sm:rounded-tl-2xl sm:rounded-bl-2xl sm:rounded-br-2xl`}
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing the menu
      >
        {/* Main Nav */}
        <div className="mb-12 sm:mb-16">
          <h3
            className={`text-[10px] uppercase tracking-[0.2em] text-[#9d9dad] mb-8 sm:mb-12 transition-all duration-500 ease-out ${
              isOpen
                ? "opacity-100 translate-y-0 delay-200"
                : "opacity-0 translate-y-4"
            }`}
          >
            Menu
          </h3>
          <nav className="text-3xl sm:text-4xl text-[#0a0a0a] font-light flex flex-col space-y-4 sm:space-y-6 mb-12 sm:mb-16">
            <Link
              to="/"
              className={`hover:opacity-70 w-fit inline-block link-underline-effect transition-all duration-500 ease-out ${
                isOpen
                  ? "opacity-100 translate-y-0 delay-300"
                  : "opacity-0 translate-y-4"
              }`}
              onClick={onClose}
            >
              Works
            </Link>
            <Link
              to="/about"
              className={`hover:opacity-70 w-fit inline-block link-underline-effect transition-all duration-500 ease-out ${
                isOpen
                  ? "opacity-100 translate-y-0 delay-400"
                  : "opacity-0 translate-y-4"
              }`}
              onClick={onClose}
            >
              About
            </Link>
            <Link
              to="/"
              className={`hover:opacity-70 w-fit inline-block link-underline-effect transition-all duration-500 ease-out ${
                isOpen
                  ? "opacity-100 translate-y-0 delay-500"
                  : "opacity-0 translate-y-4"
              }`}
              onClick={onClose}
            >
              Contact
            </Link>
          </nav>

          <div
            className={`transition-all duration-500 ease-out ${
              isOpen
                ? "opacity-100 translate-y-0 delay-600"
                : "opacity-0 translate-y-4"
            }`}
          >
            <AnimatedButton
              text="Let's Talk"
              baseBgColor="bg-[#0a0a0a]"
              baseTextColor="text-[#e4e2dd]"
              baseBorderColor="border-[#0a0a0a]"
              hoverTextColor="group-hover/btn:text-[#0a0a0a]"
              hoverBgColor="bg-[#fff]"
              hoverBorderColor="border-[#0a0a0a]"
              onClick={handleGetInTouchClick}
              padding="py-4 px-8"
            />
          </div>
        </div>

        {/* Social / Footer Info */}
        <div className="mt-auto">
          <div
            className={`transition-all duration-700 ease-out border-t border-black/10 pt-8 sm:pt-10 ${
              isOpen
                ? "opacity-100 translate-y-0 delay-700"
                : "opacity-0 translate-y-4"
            }`}
          >
            <Links
              links={[
                { label: "Facebook", href: "#facebook" },
                { label: "LinkedIn", href: "#linkedin" },
                { label: "Instagram", href: "#instagram" },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenuOverlay;
