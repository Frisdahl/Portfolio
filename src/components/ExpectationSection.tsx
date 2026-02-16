import React, { useState } from "react";
import AnimatedButton from "./AnimatedButton";
import { scrollTo } from "../utils/smoothScroll";

interface DropdownProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  title,
  children,
  isOpen,
  onToggle,
}) => {
  return (
    <>
      <button
        className={`flex justify-between items-center w-full text-lg font-semibold text-gray-800 border-gray-300 focus:outline-none py-4 cursor-pointer ${isOpen ? "border-b-0" : "border-b"}`}
        onClick={onToggle}
      >
        <span className="text-xl uppercase font-normal text-[#0a0a0a]">
          {title}
        </span>
        <div className="relative w-4 h-4 flex items-center justify-center">
          <span className="absolute h-0.5 w-full bg-gray-800 transition-transform duration-300 ease-out"></span>
          <span
            className={`absolute h-0.5 w-full bg-gray-800 transition-transform duration-300 ease-out ${isOpen ? "rotate-180" : "rotate-90"}`}
          ></span>
        </div>
      </button>
      <div
        className={`mt-2 text-gray-600 text-left overflow-hidden transition-all duration-300 ease-in-out`}
        style={{
          maxHeight: isOpen ? "200px" : "0",
          opacity: isOpen ? "1" : "0",
        }}
      >
        {children}
      </div>
    </>
  );
};

const ExpectationSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const dropdownData = [
    {
      title: "Brand Strategy",
      content: (
        <>
          <p className="pb-6 max-w-3xl">
            Establishing a clear digital direction that aligns your brand
            identity, user experience, and long-term goals to create a strong
            and consistent online presence.
          </p>
          <div className="space-y-3 pb-6">
            <p>✔ Brand positioning & digital identity</p>
            <p>✔ User journey and product</p>
            <p>✔ Strategy Design consistency & scalability</p>
          </div>
        </>
      ),
    },
    {
      title: "UI & UX Design",
      content: (
        <>
          <p className="pb-6 max-w-3xl">
            Designing modern, intuitive interfaces that balance visual
            aesthetics with usability, ensuring seamless experiences across
            devices.
          </p>
          <div className="space-y-3 pb-6">
            <p>✔ Responsive UI design</p>
            <p>✔ User-focused interaction design</p>
            <p>✔ Design systems & accessibility</p>
          </div>
        </>
      ),
    },
    {
      title: "Development",
      content: (
        <>
          <p className="pb-6 max-w-3xl">
            Building fast, scalable web applications using modern technologies
            with a strong focus on performance, security, and maintainability.
          </p>
          <div className="space-y-3 pb-6">
            <p>✔ Frontend & backend development</p>
            <p>✔ API integrations & architecture</p>
            <p>✔ Performance optimization</p>
          </div>
        </>
      ),
    },
    {
      title: "Support & Maintenance",
      content: (
        <>
          <p className="pb-6 max-w-3xl">
            Providing ongoing technical support to keep your platform secure,
            stable, and continuously improving after launch.
          </p>
          <div className="space-y-3 pb-6">
            <p>✔ Updates & bug fixes</p>
            <p>✔ Performance monitoring</p>
            <p>✔ Security maintenance</p>
          </div>
        </>
      ),
    },
    {
      title: "Scale & Grow",
      content: (
        <>
          <p className="pb-6 max-w-3xl">
            Helping your product evolve by improving performance, expanding
            features, and preparing your system for future growth.
          </p>
          <div className="space-y-3 pb-6">
            <p>✔ Feature expansion</p>
            <p>✔ Performance scaling</p>
            <p>✔ Architecture improvements</p>
          </div>
        </>
      ),
    },
  ];

  const handleToggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-24 text-gray-800 px-8 max-w-[1800px] mx-auto w-full">
      <div className=" mx-auto px-8 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column */}
          <div className="text-left">
            <h2 className="text-6xl mb-8 uppercase text-[#0a0a0a] leading-tight">
              <span className="font-bold">What You Can Expect</span> <br></br>{" "}
              Working With Me
            </h2>
            <p className="text-lg mb-12 max-w-lg">
              Clear communication, thoughtful design decisions, and a focus on
              building fast, scalable web solutions. I combine technical
              expertise with a user-first mindset to deliver reliable and modern
              digital experiences — from concept to launch.
            </p>
            <AnimatedButton
              text="Get in touch"
              baseBgColor="bg-[#0a0a0a]"
              baseTextColor="text-[#f2f2f2]"
              hoverTextColor="text-[#0a0a0a]"
              onClick={() => scrollTo("#contact")}
            />
          </div>

          {/* Right Column - Dropdowns */}
          <div>
            {dropdownData.map((item, index) => (
              <Dropdown
                key={index}
                title={item.title}
                isOpen={activeIndex === index}
                onToggle={() => handleToggle(index)}
              >
                {item.content}
              </Dropdown>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpectationSection;
