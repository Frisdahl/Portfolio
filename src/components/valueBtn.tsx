import React from "react";

interface ValueBtnProps {
  text: string;
  isActive: boolean;
  onClick: () => void;
  baseBgColor?: string;
  baseTextColor?: string;
  activeBgColor?: string;
  activeTextColor?: string;
  borderColor?: string;
  hoverBgColor?: string;
  hoverTextColor?: string;
}

const ValueBtn: React.FC<ValueBtnProps> = ({
  text,
  isActive,
  onClick,
  baseBgColor = "bg-transparent",
  baseTextColor = "text-[var(--foreground)]",
  activeBgColor = "bg-[var(--foreground)]",
  activeTextColor = "text-[#1c1d1e]",
  borderColor = "border-[var(--foreground)]",
  hoverBgColor = "bg-[var(--foreground)]",
  hoverTextColor = "group-hover/btn:text-[#1c1d1e]",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative overflow-hidden inline-flex items-center justify-center px-6 py-2 w-fit group/btn cursor-pointer rounded-full border ${borderColor} transition-all duration-500 ease-out ${
        isActive ? `${activeBgColor}` : `${baseBgColor}`
      }`}
    >
      {/* Sliding background for hover (only if not active) */}
      {!isActive && (
        <span
          className={`absolute inset-0 z-[1] block h-full w-full rounded-[48px] ${hoverBgColor} transform translate-y-[-101%] group-hover/btn:translate-y-0 group-hover/btn:rounded-[0] transition-all duration-500 [transition-timing-function:cubic-bezier(0.4,0,0,1)]`}
        ></span>
      )}

      {/* Text layer */}
      <span className="relative z-10 block overflow-hidden">
        <span
          className={`block font-medium whitespace-nowrap transition-colors duration-500 ${
            isActive ? activeTextColor : `${baseTextColor} ${hoverTextColor}`
          }`}
        >
          {text}
        </span>
      </span>
    </button>
  );
};

export default ValueBtn;
