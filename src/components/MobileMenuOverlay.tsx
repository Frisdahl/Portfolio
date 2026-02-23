import React from "react";
import { Link } from "react-router-dom";
import AnimatedButton from "./AnimatedButton"; // Import AnimatedButton
import { scrollTo } from "../utils/smoothScroll";
import ArrowIcon from "./ArrowIcon"; // Import the new component

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-0 text-left">
    {" "}
    {/* Changed mb-8 to mb-0 */}
    <h3 className="text-[#9d9dad] text-base mb-4">{title}</h3>
    <div className="flex flex-wrap gap-x-6 gap-y-2 text-[#131623] text-base">
      {" "}
      {/* Changed text-sm to text-base */}
      {children}
    </div>
  </div>
);

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
        className={`fixed top-0 right-0 w-full sm:w-[500px] h-full sm:h-auto sm:max-h-screen bg-[#e4e2dd] transform transition-transform duration-700 ease-in-out ${
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
              hoverTextColor="group-hover:text-[#0a0a0a]"
              hoverBgColor="bg-[#e4e2dd]"
              onClick={handleGetInTouchClick}
              className="w-full sm:w-auto text-base py-3 px-6"
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
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              {["Facebook", "LinkedIn", "Instagram"].map((social, index) => (
                <a
                  key={social}
                  href={`#${social.toLowerCase()}`}
                  className={`inline-flex items-center text-lg font-normal tracking-wider group relative transition-all duration-500 ease-out text-[#0a0a0a] delay-[${800 + index * 100}ms] ${
                    isOpen
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                >
                  <span className="hover:opacity-60 transition-opacity">
                    {social}
                  </span>
                  <span className="relative w-6 h-6 ml-1 inline-flex items-center justify-center">
                    <ArrowIcon className="absolute w-4 h-4 rotate-[-45deg] transition-all duration-700 ease-out group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:opacity-0 brightness-0" />
                    <ArrowIcon className="absolute w-4 h-4 rotate-[-45deg] translate-x-[-8px] translate-y-[8px] opacity-0 transition-all duration-700 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 brightness-0" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenuOverlay;
