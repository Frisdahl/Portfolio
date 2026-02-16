import React from "react";
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
    scrollTo("#contact", 2);
  };

  return (
    // Outermost fixed full-screen container for the overlay
    <div
      className={`fixed inset-0 z-[150] transition-opacity duration-500 ${
        isOpen
          ? "opacity-100 pointer-events-auto bg-[rgba(0,0,0,0.6)]"
          : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose} // Close menu if clicked outside
    >
      {/* The actual menu panel that slides in/out */}
      <div
        className={`fixed top-0 right-0 w-[30vw] bg-[#f2f2f2] transform transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } overflow-y-auto px-8 pt-8 pb-4 text-left rounded-bl-xl rounded-br-xl rounded-tl-xl rounded-tr-none max-h-[80vh]`} // Adjusted padding
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing the menu
      >
        {/* Left side: Main Nav - now at the top of the single column */}
        <div className="mb-16">
          <h3
            className={`text-2xl text-[#9d9dad] text-sm mb-8 transition-all duration-300 ease-out ${
              isOpen
                ? "opacity-100 translate-y-0 delay-200"
                : "opacity-0 translate-y-4"
            }`}
          >
            Menu
          </h3>
          <nav className="text-4xl text-[#131623] font-[300] flex flex-col space-y-8 mb-8">
            <a
              href="#works"
              className={`hover:text-gray-600 w-fit inline-block link-underline-effect transition-all duration-300 ease-out ${
                isOpen
                  ? "opacity-100 translate-y-0 delay-300"
                  : "opacity-0 translate-y-4"
              }`}
              onClick={onClose}
            >
              Works
            </a>
            <a
              href="#about"
              className={`hover:text-gray-600 w-fit inline-block link-underline-effect transition-all duration-300 ease-out ${
                isOpen
                  ? "opacity-100 translate-y-0 delay-400"
                  : "opacity-0 translate-y-4"
              }`}
              onClick={onClose}
            >
              About us
            </a>
            <a
              href="#blog"
              className={`hover:text-gray-600 w-fit inline-block link-underline-effect transition-all duration-300 ease-out ${
                isOpen
                  ? "opacity-100 translate-y-0 delay-500"
                  : "opacity-0 translate-y-4"
              }`}
              onClick={onClose}
            >
              Blog
            </a>
          </nav>
          <AnimatedButton
            text="Get in touch"
            baseBgColor="bg-[#0a0a0a]"
            baseTextColor="text-[#f2f2f2]"
            hoverTextColor="text-[#0a0a0a]"
            hoverBgColor="bg-[#f2f2f2]"
            onClick={handleGetInTouchClick}
            className={`mb-4 transition-all duration-300 ease-out ${
              /* Changed mb-8 to mb-4 */
              isOpen
                ? "opacity-100 translate-y-0 delay-600"
                : "opacity-0 translate-y-4"
            }`}
          />
        </div>

        {/* Right side: Detailed Links - now below the main nav */}
        <div>
          <div
            className={`transition-all duration-500 ease-out ${
              /* Changed duration-300 to duration-500 */
              isOpen
                ? "opacity-100 translate-y-0 w-full delay-700"
                : "opacity-0 translate-y-4 w-0"
            }`}
          >
            <hr className="border-t border-gray-300 my-4" />
          </div>
          <Section>
            {" "}
            {/* Removed title="Social" */}
            <a
              href="#facebook"
              className={`inline-flex items-center link-underline-effect px-2 py-1 group relative overflow-hidden transition-all duration-300 ease-out ${
                isOpen
                  ? "opacity-100 translate-y-0 delay-800"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <span>Facebook</span>
              <span className="relative w-6 h-6 ml-1 inline-flex items-center justify-center">
                {" "}
                {/* Wrapper for arrows */}
                {/* Current arrow, slides out top-right */}
                <ArrowIcon className="absolute w-4 h-4 rotate-[-45deg] transition-all duration-700 ease-out group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:opacity-0" />
                {/* New arrow, slides in bottom-left */}
                <ArrowIcon className="absolute w-4 h-4 rotate-[-45deg] translate-x-[-8px] translate-y-[8px] opacity-0 transition-all duration-700 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
              </span>
            </a>
            <a
              href="#linkedin"
              className={`inline-flex items-center link-underline-effect px-2 py-1 group relative overflow-hidden transition-all duration-300 ease-out ${
                isOpen
                  ? "opacity-100 translate-y-0 delay-900"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <span>LinkedIn</span>
              <span className="relative w-6 h-6 ml-1 inline-flex items-center justify-center">
                {" "}
                {/* Wrapper for arrows */}
                {/* Current arrow, slides out top-right */}
                <ArrowIcon className="absolute w-4 h-4 rotate-[-45deg] transition-all duration-700 ease-out group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:opacity-0" />
                {/* New arrow, slides in bottom-left */}
                <ArrowIcon className="absolute w-4 h-4 rotate-[-45deg] translate-x-[-8px] translate-y-[8px] opacity-0 transition-all duration-700 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
              </span>
            </a>
            <a
              href="#email"
              className={`inline-flex items-center link-underline-effect px-2 py-1 group relative overflow-hidden transition-all duration-300 ease-out ${
                isOpen
                  ? "opacity-100 translate-y-0 delay-1000"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <span>Email</span>
              <span className="relative w-6 h-6 ml-1 inline-flex items-center justify-center">
                {" "}
                {/* Wrapper for arrows */}
                {/* Current arrow, slides out top-right */}
                <ArrowIcon className="absolute w-4 h-4 rotate-[-45deg] transition-all duration-700 ease-out group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:opacity-0" />
                {/* New arrow, slides in bottom-left */}
                <ArrowIcon className="absolute w-4 h-4 rotate-[-45deg] translate-x-[-8px] translate-y-[8px] opacity-0 transition-all duration-700 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
              </span>
            </a>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default MobileMenuOverlay;
