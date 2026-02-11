import React from "react";
import AnimatedButton from "./AnimatedButton"; // Import AnimatedButton

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-8 text-left">
    <h3 className="text-[#9d9dad] text-base mb-4">{title}</h3>
    <div className="flex flex-wrap gap-x-6 gap-y-2 text-[#131623] text-sm">{children}</div>
  </div>
);

const MobileMenuOverlay: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  return (
    <div
      className={`fixed top-0 bottom-0 right-0 w-[30vw] bg-white z-40 transform transition-transform duration-500 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } overflow-y-auto p-8 pt-24 text-left`}
    >
      {/* Left side: Main Nav - now at the top of the single column */}
      <div className="mb-16">
        <h3 className="text-2xl text-[#9d9dad] text-sm mb-8">Menu</h3>
        <nav className="text-4xl text-[#131623] font-[300] flex flex-col space-y-8 mb-8">
          <a
            href="#works"
            className="hover:text-gray-600 w-fit inline-block link-underline-effect"
            onClick={onClose}
          >
            Works
          </a>
          <a
            href="#about"
            className="hover:text-gray-600 w-fit inline-block link-underline-effect"
            onClick={onClose}
          >
            About us
          </a>
          <a
            href="#blog"
            className="hover:text-gray-600 w-fit inline-block link-underline-effect"
            onClick={onClose}
          >
            Blog
          </a>
        </nav>
        <AnimatedButton
          text="Get in touch"
          baseBgColor="bg-black"
          baseTextColor="text-white"
          hoverTextColor="text-black"
          onClick={onClose}
        />
      </div>

      {/* Right side: Detailed Links - now below the main nav */}
      <div>
        <Section title="Social">
          <a className="inline-block link-underline-effect px-2 py-1">
            Instagram
          </a>
          <a className="inline-block link-underline-effect px-2 py-1">
            Facebook
          </a>
          <a className="inline-block link-underline-effect px-2 py-1">
            LinkedIn
          </a>
          <a className="inline-block link-underline-effect px-2 py-1">Email</a>
        </Section>
      </div>
    </div>
  );
};

export default MobileMenuOverlay;
