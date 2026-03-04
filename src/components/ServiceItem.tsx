import React from "react";

interface ServiceItemProps {
  title: string;
  description: string;
  showDivider?: boolean;
  className?: string;
}

const ServiceItem: React.FC<ServiceItemProps> = ({
  title,
  description,
  showDivider = true,
  className = "",
}) => {
  return (
    <div
      className={`about-service-item w-full py-8 md:py-10 first:pt-0 ${className}`}
    >
      <div className="flex items-center gap-4 mb-4 overflow-hidden">
        <h3 className="about-service-title text-3xl md:text-3xl font-aeonik font-bold text-[#1b1b1a] uppercase">
          {title}
        </h3>
      </div>
      <p className="about-service-description text-lg md:text-xl font-aeonik text-[#1b1b1a]/70 leading-relaxed max-w-2xl">
        {description}
      </p>
      {showDivider && (
        <hr className="mt-8 md:mt-10 border-[#1b1b1a]/10 -mr-8 md:-mr-16 lg:-mr-24" />
      )}
    </div>
  );
};

export default ServiceItem;
