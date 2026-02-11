import React from "react";

interface AnimatedButtonProps {
  text: string;
  link?: string;
  onClick?: () => void;
  baseBgColor?: string; // e.g., 'bg-black', 'bg-gray-800', 'bg-[#121723]'
  baseTextColor?: string; // e.g., 'text-white'
  hoverTextColor?: string; // e.g., 'text-black'
  className?: string; // Additional classes for the main button element
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  text,
  link,
  onClick,
  baseBgColor = "bg-black",
  baseTextColor = "text-white",
  hoverTextColor = "group-hover:text-black",
  className = "",
}) => {
  const ButtonComponent = link ? "a" : "button";

  return (
    <ButtonComponent
      href={link}
      onClick={onClick}
      className={`relative overflow-hidden inline-flex items-center justify-center h-12 px-6 w-fit group cursor-pointer rounded-full border-2 border-black ${baseBgColor} ${baseTextColor} transition-all duration-500 ease-out group-hover:scale-x-105 ${className}`}
    >
      {/* Sliding background */}
      <span className="absolute inset-0 z-1 block h-full w-full rounded-[48px] bg-[#f2f2f2] transform translate-y-[-101%] group-hover:translate-y-0 group-hover:rounded-[0] transition-transform duration-500 [transition-timing-function:cubic-bezier(0.4,0,0,1)],border-radius duration-500 [transition-timing-function:cubic-bezier(0.4,0,0,1)]"></span>
      {/* Original text, slides down */}
      <span className="relative z-10 block overflow-hidden">
        <span
          className={`block font-semibold whitespace-nowrap ${baseTextColor} transition-transform duration-500 [transition-timing-function:cubic-bezier(0.4,0,0,1)] group-hover:translate-y-[101%]`}
        >
          {text}
        </span>
      </span>
      {/* Sliding text */}
      <span
        className={`absolute inset-0 z-20 inline-flex items-center justify-center whitespace-nowrap ${hoverTextColor} font-semibold transform translate-y-[-101%] group-hover:translate-y-0 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.4,0,0,1)]`}
      >
        {text}
      </span>
    </ButtonComponent>
  );
};

export default AnimatedButton;
