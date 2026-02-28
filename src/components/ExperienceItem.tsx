import React from "react";

interface ExperienceItemProps {
  title: string;
  subtitle: string;
  dates: string;
  description: string;
  showDivider?: boolean;
}

const ExperienceItem: React.FC<ExperienceItemProps> = ({
  title,
  subtitle,
  dates,
  description,
  showDivider = true,
}) => {
  return (
    <div className="about-animate-item w-full py-8 md:py-10 first:pt-0 opacity-0">
      <div className="flex flex-col gap-3 mb-4">
        <h3 className="text-3xl md:text-3xl font-aeonik font-bold text-[#1c1d1e] uppercase">
          {title}
        </h3>
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
          <p className="text-lg md:text-xl font-aeonik font-bold text-[#7d7d7d] uppercase tracking-wide">
            {subtitle}
          </p>
          <span className="text-lg md:text-xl font-aeonik font-bold text-[#7d7d7d] md:text-right whitespace-nowrap">
            {dates}
          </span>
        </div>
      </div>
      <p className="text-lg md:text-xl font-aeonik text-[#1c1d1e]/70 leading-relaxed max-w-2xl">
        {description}
      </p>
      {showDivider && (
        <hr className="mt-8 md:mt-10 border-[#1c1d1e]/10 -mr-8 md:-mr-16 lg:-mr-24" />
      )}
    </div>
  );
};

export default ExperienceItem;
