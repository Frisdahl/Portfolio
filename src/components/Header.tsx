import React from "react";

interface HeaderProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ isOpen, toggleMenu }) => {
  return (
    <button
      className="group relative w-10 h-10 flex items-center justify-center focus:outline-none z-50 transition-colors duration-600 cursor-pointer"
      onClick={toggleMenu}
      aria-label="Toggle menu"
    >
      <div className="relative z-20 w-6 h-2 flex flex-col justify-between">
        <span
          className={`block h-0.5 bg-[#222531] transition-all duration-600 ease-out group-hover:bg-white  ${
            isOpen
              ? "rotate-45 translate-y-[3px] w-full"
              : "w-full group-hover:w-3/4 group-hover:mx-auto"
          }`}
        ></span>
        <span
          className={`block h-0.5 bg-[#222531] transition-all duration-600 ease-out group-hover:bg-white ${
            isOpen
              ? "-rotate-45 -translate-y-[3px] w-full"
              : "w-full group-hover:w-3/4 group-hover:mx-auto"
          }`}
        ></span>
      </div>
      {/* Expanding circle background */}
      <div className="absolute inset-0 rounded-full scale-0 group-hover:scale-100 transition-transform duration-600 ease-out bg-[#121723] z-10"></div>
    </button>
  );
};

export default Header;
