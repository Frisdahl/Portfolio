import React from "react";

interface ValueBtnProps {
  text: string;
  isActive: boolean;
  onClick: () => void;
}

const ValueBtn: React.FC<ValueBtnProps> = ({ text, isActive, onClick }) => {
  const activeClasses = "bg-white text-black border border-gray-300";
  const inactiveClasses =
    "border border-white text-white hover:bg-white hover:text-black";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full cursor-pointer px-4 py-2 transition-colors duration-300 ${isActive ? activeClasses : inactiveClasses}`}
    >
      {text}
    </button>
  );
};

export default ValueBtn;
