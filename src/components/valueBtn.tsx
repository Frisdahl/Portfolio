import React from "react";

interface ValueBtnProps {
  text: string;
  isActive: boolean;
  onClick: () => void;
}

const ValueBtn: React.FC<ValueBtnProps> = ({ text, isActive, onClick }) => {
  // We'll use a similar logic to AnimatedButton for the sliding effect
  // but keep it as a toggle state.
  
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative overflow-hidden inline-flex items-center justify-center px-6 py-2 w-fit group cursor-pointer rounded-full border border-[var(--foreground)] transition-all duration-500 ease-out ${
        isActive ? "bg-[var(--foreground)] text-[#0a0a0a]" : "bg-transparent text-[var(--foreground)]"
      }`}
    >
      {/* Sliding background for hover (only if not active) */}
      {!isActive && (
        <span
          className={`absolute inset-0 z-1 block h-full w-full rounded-[48px] bg-[var(--foreground)] transform translate-y-[-101%] group-hover:translate-y-0 group-hover:rounded-[0] transition-all duration-500 [transition-timing-function:cubic-bezier(0.4,0,0,1)]`}
        ></span>
      )}
      
      {/* Text layer */}
      <span className="relative z-10 block overflow-hidden">
        <span
          className={`block font-medium whitespace-nowrap transition-colors duration-500 ${
            isActive ? "text-[#0a0a0a]" : "text-[var(--foreground)] group-hover:text-[#0a0a0a]"
          }`}
        >
          {text}
        </span>
      </span>
    </button>
  );
};

export default ValueBtn;
