import React from "react";

interface ExperienceItemProps {
  title: string;
  subtitle: string;
  dates: string;
  description: string;
  showDivider?: boolean;
  className?: string;
}

const ExperienceItem: React.FC<ExperienceItemProps> = ({
  title,
  subtitle,
  dates,
  description,
  showDivider = true,
  className = "",
}) => {
  return (
    <div
      className={`about-experience-item w-full py-8 md:py-10 first:pt-0 ${className}`}
    >
      <div className="flex flex-col gap-3 mb-4 overflow-hidden">
        <h3 className="about-experience-title text-2xl md:text-2xl font-cabinet font-semibold text-[#1b1b1a] uppercase">
          {title}
        </h3>
        <div className="about-experience-subtitle-wrap flex flex-col md:flex-row md:items-baseline justify-between gap-4 overflow-hidden">
          <p className="about-experience-subtitle text-lg md:text-xl font-cabinet font-bold text-[#7d7d7d] uppercase tracking-wide">
            {subtitle}
          </p>
          <span className="about-experience-date text-lg md:text-xl font-cabinet font-bold text-[#7d7d7d] md:text-right whitespace-nowrap">
            {dates}
          </span>
        </div>
      </div>
      <p className="about-experience-description text-lg md:text-xl font-cabinet text-[#1b1b1a]/70 leading-relaxed max-w-2xl">
        {description}
      </p>
      {showDivider && (
        <hr className="mt-8 md:mt-10 border-[#1b1b1a]/10 -mr-8 md:-mr-16 lg:-mr-24" />
      )}
    </div>
  );
};

export default ExperienceItem;
