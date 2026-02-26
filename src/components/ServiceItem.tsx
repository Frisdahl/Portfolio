import React from "react";

interface ServiceItemProps {
  title: string;
  description: string;
  showDivider?: boolean;
}

const ServiceItem: React.FC<ServiceItemProps> = ({
  title,
  description,
  showDivider = true,
}) => {
  return (
    <div className="about-animate-item w-full py-8 md:py-10 first:pt-0">
      <div className="flex items-center gap-4 mb-4">
        <h3 className="text-3xl md:text-3xl font-instrumentsans font-bold text-[#1c1d1e] uppercase">
          {title}
        </h3>
        <span
          className="px-3 py-1 text-[10px] md:text-xs font-instrumentsans font-bold tracking-widest uppercase rounded-full"
          style={{ backgroundColor: "#ececed", color: "#7d7d7d" }}
        >
          PRO
        </span>
      </div>
      <p className="text-lg md:text-xl font-instrumentsans text-[#1c1d1e]/70 leading-relaxed max-w-2xl">
        {description}
      </p>
      {showDivider && (
        <hr className="mt-8 md:mt-10 border-[#1c1d1e]/10 -mr-8 md:-mr-16 lg:-mr-24" />
      )}
    </div>
  );
};

export default ServiceItem;
