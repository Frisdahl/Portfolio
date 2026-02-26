import React from "react";

interface BurgerMenuButtonProps {
  toggleMenu: () => void;
  isOpen: boolean;
  isInverted: boolean;
  isDark?: boolean;
  isInsideHeader?: boolean;
}

const BurgerMenuButton: React.FC<BurgerMenuButtonProps> = ({
  toggleMenu,
  isOpen,
  isDark,
  isInsideHeader,
}) => {
  const isHeaderDark = Boolean(isDark);
  const barBaseColor = isOpen || isHeaderDark ? "bg-[#1c1d1e]" : "bg-white";
  const barHoverColor = isOpen
    ? "group-hover:bg-white"
    : isHeaderDark
      ? "group-hover:bg-white"
      : "group-hover:bg-[#1c1d1e]";
  const hoverCircleColor = isOpen
    ? "bg-[#1c1d1e]"
    : isHeaderDark
      ? "bg-[#1c1d1e]"
      : "bg-white";

  const wrapperClass = isInsideHeader
    ? "relative pointer-events-auto flex items-center h-12"
    : "fixed top-0 right-8 py-10 z-[200] pointer-events-none transition-all duration-500";

  return (
    <div className={wrapperClass}>
      <button
        onClick={toggleMenu}
        aria-label="Toggle menu"
        className="group relative w-12 h-12 flex items-center justify-center focus:outline-none cursor-pointer pointer-events-auto"
      >
        <div className="relative w-6 h-2 flex flex-col justify-between z-10">
          <span
            className={`block h-0.5 w-full ${barBaseColor} ${barHoverColor} transition-all duration-500 ease-out ${
              isOpen ? "rotate-45 translate-y-[3px]" : ""
            }`}
          ></span>
          <span
            className={`block h-0.5 w-full ${barBaseColor} ${barHoverColor} transition-all duration-500 ease-out ${
              isOpen ? "-rotate-45 -translate-y-[3px]" : ""
            }`}
          ></span>
        </div>
        {/* Expanding circle background */}
        <div
          className={`absolute inset-0 rounded-full transition-all duration-500 ease-out ${hoverCircleColor} z-0 scale-0 group-hover:scale-100`}
        ></div>
      </button>
    </div>
  );
};

export default BurgerMenuButton;
