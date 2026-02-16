import React from 'react';

interface ArrowIconProps {
  className?: string;
}

const ArrowIcon: React.FC<ArrowIconProps> = ({ className }) => {
  return (
    <svg 
      xmlnsXlink="http://www.w3.org/1999/xlink" 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 31 26" 
      fill="none" 
      className={className}
    >
      <path 
        d="M18.582 24.6654L29.3737 12.9987L18.582 1.33203" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeMiterlimit="10" 
        fill="none"
      />
      <path 
        d="M29.3737 13L0.0820312 13" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeMiterlimit="10" 
        fill="none"
      />
    </svg>
  );
};

export default ArrowIcon;
