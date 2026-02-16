import React from "react";

interface AnimatedButtonProps {
  text: string;
  link?: string;
  onClick?: () => void;
  padding?: string; // e.g., 'px-6 py-2'
  baseBgColor?: string; // e.g., 'bg-black', 'bg-gray-800', 'bg-[#121723]'
  baseTextColor?: string; // e.g., 'text-white'
  hoverTextColor?: string; // e.g., 'text-black'
  hoverBgColor?: string; // New prop for custom hover background color
  baseBorderColor?: string; // New prop for base border color
  hoverBorderColor?: string; // New prop for hover border color
  className?: string; // Additional classes for the main button element
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  text,
  link,
  onClick,
  padding = "px-6 py-2",
  baseBgColor = "bg-[#0a0a0a]",
  baseTextColor = "text-[#f2f2f2]",
  hoverTextColor = "group-hover:text-[#0a0a0a]",
  hoverBgColor = "bg-[#f2f2f2]", // Default to bg-white if not provided
  baseBorderColor = "border-[#0a0a0a]", // Default to border-black
  hoverBorderColor = "group-hover:border-[#0a0a0a]", // Default to border-black on hover
  className = "",
}) => {
  const ButtonComponent = link ? "a" : "button";

  return (
    <ButtonComponent
      href={link}
      onClick={onClick}
      className={`relative overflow-hidden inline-flex items-center justify-center h-12 ${padding} w-fit group cursor-pointer rounded-full border-2 ${baseBorderColor} ${hoverBorderColor} ${baseBgColor} ${baseTextColor} transition-all duration-500 ease-out group-hover:scale-x-105 ${className}`}
    >
      {/* Sliding background */}
      <span
        className={`absolute inset-0 z-1 block h-full w-full rounded-[48px] ${hoverBgColor} transform translate-y-[-101%] group-hover:translate-y-0 group-hover:rounded-[0] transition-transform duration-500 [transition-timing-function:cubic-bezier(0.4,0,0,1)],border-radius duration-500 [transition-timing-function:cubic-bezier(0.4,0,0,1)]`}
      ></span>
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
