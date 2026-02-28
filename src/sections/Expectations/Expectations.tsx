import React, { useState } from "react";

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
        className={`flex justify-between items-center w-full text-lg font-semibold text-[var(--foreground)] border-[var(--divider)] focus:outline-none py-4 cursor-pointer ${isOpen ? "border-b-0" : "border-b"}`}
        onClick={onToggle}
      >
        <span className="text-2xl uppercase font-normal text-[var(--foreground)]">
          {title}
        </span>
        <div className="relative w-4 h-4 flex items-center justify-center">
          <span className="absolute h-0.5 w-full bg-[var(--foreground)] transition-transform duration-300 ease-out"></span>
          <span
            className={`absolute h-0.5 w-full bg-[var(--foreground)] transition-transform duration-300 ease-out ${isOpen ? "rotate-180" : "rotate-90"}`}
          ></span>
        </div>
      </button>
      <div
        className={`mt-2 text-[var(--foreground-muted)] text-left overflow-hidden transition-all duration-300 ease-in-out`}
        style={{
          maxHeight: isOpen ? "1000px" : "0", // Increased for complex content
          opacity: isOpen ? "1" : "0",
        }}
      >
        {children}
      </div>
    </>
  );
};

const Expectations: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

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
            <p>
              <span
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                ✔
              </span>{" "}
              Brand positioning & digital identity
            </p>
            <p>
              <span
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                ✔
              </span>{" "}
              User journey and product
            </p>
            <p>
              <span
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                ✔
              </span>{" "}
              Strategy Design consistency & scalability
            </p>
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
            <p>
              <span
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                ✔
              </span>{" "}
              Responsive UI design
            </p>
            <p>
              <span
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                ✔
              </span>{" "}
              User-focused interaction design
            </p>
            <p>
              <span
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                ✔
              </span>{" "}
              Design systems & accessibility
            </p>
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
            <p>
              <span
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                ✔
              </span>{" "}
              Frontend & backend development
            </p>
            <p>
              <span
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                ✔
              </span>{" "}
              API integrations & architecture
            </p>
            <p>
              <span
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                ✔
              </span>{" "}
              Performance optimization
            </p>
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
            <p>
              <span
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                ✔
              </span>{" "}
              Updates & bug fixes
            </p>
            <p>
              <span
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                ✔
              </span>{" "}
              Performance monitoring
            </p>
            <p>
              <span
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                ✔
              </span>{" "}
              Security maintenance
            </p>
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
            <p>
              <span
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                ✔
              </span>{" "}
              Feature expansion
            </p>
            <p>
              <span
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                ✔
              </span>{" "}
              Performance scaling
            </p>
            <p>
              <span
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                ✔
              </span>{" "}
              Architecture improvements
            </p>
          </div>
        </>
      ),
    },
  ];

  const handleToggle = (index: number) => {
    if (activeIndex === index) {
      setActiveIndex((activeIndex + 1) % dropdownData.length);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <section
      id="expectations"
      className="text-[var(--foreground)] mb-64 px-24 mx-auto w-full"
    >
      <div className=" mx-auto px-8 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-24 xl:gap-32 items-start">
          <div className="text-left lg:-mt-24 lg:col-span-1">
            <p className="font-aeonik uppercase tracking-[0.3em] text-xs text-[var(--foreground)] mix-blend-difference opacity-50">
              What You Can Expect
            </p>
            <h2 className="text-6xl md:text-6xl lg:text-7xl xl:text-8xl mb-8 uppercase text-[var(--foreground)] leading-tight whitespace-nowrap">
              Why Work <br></br>{" "}
              <span className="font-newroman pl-48">Together</span>
            </h2>
          </div>

          <div className="lg:col-span-3 lg:col-start-2 mt-48">
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

export default Expectations;
