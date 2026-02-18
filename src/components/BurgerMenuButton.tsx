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
  // Logic for when menu is open:
  // Default: Dark bars (#0a0a0a), No circle
  // Hover: White bars (#f2f2f2), Dark circle (#0a0a0a)
  
  // Logic for when menu is closed:
  // Use dynamic theme variables
  
  const barColor = isOpen 
    ? 'bg-[#0a0a0a] group-hover:bg-[#e4e2dd]' 
    : 'bg-[var(--foreground)] group-hover:bg-[var(--background)]';
  
  const circleColor = isOpen
    ? 'bg-[#0a0a0a]'
    : 'bg-[var(--foreground)]';

  return (
    <div className="fixed top-4 right-8 py-6 z-[200]">
      <button
        onClick={toggleMenu}
        aria-label="Toggle menu"
        className="group relative w-12 h-12 flex items-center justify-center focus:outline-none cursor-pointer"
      >
        <div className="relative w-6 h-2 flex flex-col justify-between z-10">
          <span
            className={`block h-0.5 w-full ${barColor} transition-all duration-500 ease-out ${
              isOpen ? "rotate-45 translate-y-[3px]" : ""
            }`}
          ></span>
          <span
            className={`block h-0.5 w-full ${barColor} transition-all duration-500 ease-out ${
              isOpen ? "-rotate-45 -translate-y-[3px]" : ""
            }`}
          ></span>
        </div>
        {/* Expanding circle background */}
        <div
          className={`absolute inset-0 rounded-full transition-all duration-500 ease-out ${circleColor} z-0 scale-0 group-hover:scale-100`}
        ></div>
      </button>
    </div>
  );
};

export default BurgerMenuButton;
