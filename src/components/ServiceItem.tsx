import React from "react";

interface ServiceItemProps {
  name: string;
  description: string;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ name, description }) => {
  return (
    <div className="relative group overflow-hidden cursor-pointer py-4">
      {/* The black box that slides up */}
      <div className="absolute inset-0 bg-black transition-transform duration-200 translate-y-full group-hover:translate-y-0 z-0"></div>

      <div className="flex justify-between items-center relative z-10 pl-2 pr-2 w-full">
        <p className="text-xl uppercase transition-colors duration-300 group-hover:text-white text-left">
            {name}
        </p>
        <p className="text-sm text-[#f2f2f2] mx-4"> {/* Description is now a fixed color */}
            {description}
        </p>
        {/* Inline SVG for direct fill control */}
        <svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 31 26" 
             className="h-6 w-6 transition-transform duration-300 transform -rotate-45 group-hover:rotate-0 text-[#12181B] group-hover:text-white" fill="none" >
            <path d="M18.582 24.6654L29.3737 12.9987L18.582 1.33203" stroke="currentColor" stroke-width="2px" stroke-miterlimit="10"></path>
            <path d="M29.3737 13L0.0820312 13" stroke="currentColor" stroke-width="2px" stroke-miterlimit="10"></path>
        </svg>
      </div>
    </div>
  );
};

export default ServiceItem;
