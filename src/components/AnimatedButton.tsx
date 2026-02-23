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
  showBorder?: boolean;
  className?: string; // Additional classes for the main button element
  fontSize?: string; // e.g., 'text-xs'
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  text,
  link,
  onClick,
  padding = "px-6 py-6",
  baseBgColor = "bg-[var(--foreground)]",
  baseTextColor = "text-[var(--background)]",
  hoverTextColor = "hover:text-[var(--foreground)]",
  hoverBgColor = "bg-[var(--background)]", // Default to bg-white if not provided
  baseBorderColor = "border-[var(--foreground)]", // Default to border-black
  hoverBorderColor = "hover:border-[var(--foreground)]", // Default to border-black on hover
  showBorder = true,
  className = "",
  fontSize = "text-base",
}) => {
  const ButtonComponent = link ? "a" : "button";

  return (
    <ButtonComponent
      href={link}
      onClick={onClick}
      className={`group/btn relative overflow-hidden inline-flex items-center justify-center ${padding} w-fit cursor-pointer rounded-full ${showBorder ? "border-2" : "border-0"} ${baseBorderColor} ${hoverBorderColor} ${baseBgColor} ${baseTextColor} transition-all duration-500 ease-out hover:scale-x-105 ${className}`}
    >
      {/* Sliding background */}
      <span
        className={`absolute inset-0 z-[1] block h-full w-full rounded-[48px] ${hoverBgColor} transform translate-y-[-101%] group-hover/btn:translate-y-0 group-hover/btn:rounded-[0] transition-transform duration-500 [transition-timing-function:cubic-bezier(0.4,0,0,1)],border-radius duration-500 [transition-timing-function:cubic-bezier(0.4,0,0,1)]`}
      ></span>
      {/* Original text, slides down */}
      <span className="relative z-10 block overflow-hidden">
        <span
          className={`block font-semibold whitespace-nowrap ${baseTextColor} ${fontSize} transition-transform duration-500 [transition-timing-function:cubic-bezier(0.4,0,0,1)] group-hover/btn:translate-y-[101%]`}
        >
          {text}
        </span>
      </span>
      {/* Sliding text */}
      <span
        className={`absolute inset-0 z-20 inline-flex items-center justify-center whitespace-nowrap ${hoverTextColor.replace('hover:', 'group-hover/btn:')} ${fontSize} font-semibold transform translate-y-[-101%] group-hover/btn:translate-y-0 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.4,0,0,1)]`}
      >
        {text}
      </span>
    </ButtonComponent>
  );
};

export default AnimatedButton;
