import React from "react";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-8 text-left">
    <h3 className="text-[#9d9dad] text-sm mb-4">{title}</h3>
    <div className="flex flex-wrap gap-x-6 gap-y-2 text-black">{children}</div>
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
        <h3 className="text-[#9d9dad] text-sm mb-4">Menu</h3>
        <nav className="text-5xl text-black flex flex-col space-y-4 mb-8">
          <a href="#works" className="hover:text-gray-600" onClick={onClose}>
            Works
          </a>
          <a href="#about" className="hover:text-gray-600" onClick={onClose}>
            About us
          </a>
          <a href="#blog" className="hover:text-gray-600" onClick={onClose}>
            Blog
          </a>
        </nav>
        <button className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
          Get in touch
        </button>
      </div>

      {/* Right side: Detailed Links - now below the main nav */}
      <div>
        <Section title="Development">
          <a>FastAPI</a>
          <a>C#.NET</a>
          <a>ROR</a>
          <a>Webflow</a>
          <a>Mobile Apps</a>
          <a>iOS Apps</a>
          <a>Android Apps</a>
          <a>Web Development</a>
          <a>Frontend</a>
          <a>React JS</a>
          <a>Python</a>
          <a>Low Code</a>
          <a>AI Development</a>
          <a>Support & Maintenance</a>
        </Section>

        <Section title="Design">
          <a>UI/UX Design</a>
          <a>Identity & Branding</a>
          <a>Design Concept</a>
        </Section>

        <Section title="Industries">
          <a>E-Learning</a>
          <a>Fintech</a>
          <a>Healthcare</a>
          <a>Web3</a>
          <a>Social Platforms</a>
          <a>SaaS</a>
          <a className="font-['TTNormsPro']">Real Estate</a>
          <a className="font-['TTNormsPro']">Gaming</a>
          <a className="font-['TTNormsPro']">E-Commerce</a>
        </Section>

        <Section title="Social">
          {/* Assuming social links will be added here */}
        </Section>
      </div>
    </div>
  );
};

export default MobileMenuOverlay;
