import React from "react";

interface BurgerMenuButtonProps {
  toggleMenu: () => void;
  isOpen: boolean;
  isInverted: boolean;
}

const BurgerMenuButton: React.FC<BurgerMenuButtonProps> = ({
  toggleMenu,
  isOpen,
  isInverted,
}) => {
  // Styling logic that prioritizes the 'isOpen' state
  const barClasses = isOpen ? 'bg-[#222531]' : (isInverted ? 'bg-white' : 'bg-[#222531]');
  const hoverBarClasses = isOpen ? 'group-hover:bg-white' : (isInverted ? 'group-hover:bg-[#222531]' : 'group-hover:bg-white');
  const circleBgClass = isOpen ? 'bg-[#121723]' : (isInverted ? 'bg-white' : 'bg-[#121723]');

  return (
    <div className="fixed top-0 right-6 py-10 px-10 z-[200]">
      <button
        onClick={toggleMenu}
        aria-label="Toggle menu"
        className={`group relative w-10 h-10 flex items-center justify-center focus:outline-none transition-colors duration-600 cursor-pointer`}
      >
                  <div className="relative w-6 h-2 flex flex-col justify-between z-10">          <span
            className={`block h-0.5 w-full ${barClasses} ${hoverBarClasses} transition-all duration-600 ease-out group-hover:px-2 ${
              isOpen ? "rotate-45 translate-y-[3px]" : ""
            }`}
          ></span>
          <span
            className={`block h-0.5 w-full ${barClasses} ${hoverBarClasses} transition-all duration-600 ease-out group-hover:px-2 ${
              isOpen ? "-rotate-45 -translate-y-[3px]" : ""
            }`}
          ></span>
        </div>
        {/* Expanding circle background */}
        <div
          className={`absolute inset-0 rounded-full transition-transform duration-600 ease-out ${circleBgClass} z-0 scale-0 group-hover:scale-100`}
        ></div>
      </button>
    </div>
  );
};

export default BurgerMenuButton;
