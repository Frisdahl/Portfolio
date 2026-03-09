import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useMagnetic } from "../utils/animations/useMagnetic";
import ArrowIcon from "./ArrowIcon";

interface CtaButtonProps {
  text: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  to?: string;
  href?: string;
  fontSize?: string;
  target?: string;
  rel?: string;
  className?: string;
  bgColor?: string;
  textColor?: string;
  dotColor?: string;
  magneticStrength?: number;
  showArrow?: boolean;
  forceHover?: boolean;
  arrowColor?: string;
}

const CtaButton: React.FC<CtaButtonProps> = ({
  text,
  onClick,
  to,
  href,
  fontSize,
  target,
  rel,
  className = "",
  bgColor = "bg-[#E35239]",
  textColor = "text-[#1b1b1a]",
  dotColor = "bg-[#1b1b1a]",
  magneticStrength = 30,
  showArrow = true,
  forceHover = false,
  arrowColor = "currentColor",
}) => {
  const elementRef = useRef<any>(null);

  // Apply the premium magnetic effect
  useMagnetic(elementRef, { strength: magneticStrength });

  const commonClasses = `group/talk inline-flex gap-x-4 py-3 px-8 rounded-full ${bgColor} ${textColor} ${fontSize || "text-md md:text-2xl"} font-cabinet font-medium tracking-tight transition-[opacity,background-color] duration-500 hover:opacity-90 cursor-pointer items-center justify-center overflow-hidden relative ${className}`;

  const content = (
    <>
      <span className={`whitespace-nowrap font-cabinet transition-transform duration-500 font-medium ${forceHover ? "translate-x-4" : "group-hover/talk:translate-x-4"}`}>
        {text}
      </span>

      {/* Animated Dot */}
      <div
        className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse transition-all duration-300 ${forceHover ? "opacity-0 scale-0" : "group-hover/talk:opacity-0 group-hover/talk:scale-0"}`}
      />

      {/* Sliding Arrow */}
      {showArrow && (
        <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-all duration-500 ${forceHover ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0 group-hover/talk:translate-x-0 group-hover/talk:opacity-100"}`}>
          <ArrowIcon className={`w-4 h-4 ${arrowColor}`} />
        </div>
      )}
    </>
  );

  if (to) {
    return (
      <Link
        ref={elementRef}
        to={to}
        className={commonClasses}
        onClick={onClick as any}
      >
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        ref={elementRef}
        href={href}
        target={target}
        rel={rel}
        className={commonClasses}
        onClick={onClick as any}
      >
        {content}
      </a>
    );
  }

  return (
    <button ref={elementRef} onClick={onClick} className={commonClasses}>
      {content}
    </button>
  );
};

export default CtaButton;
