import React, { useState, useEffect, useRef } from "react";

interface CursorFollowerProps {
  x: number;
  y: number;
  isVisible: boolean;
}

const CursorFollower: React.FC<CursorFollowerProps> = ({ x, y, isVisible }) => {
  const [smoothedX, setSmoothedX] = useState(x);
  const [smoothedY, setSmoothedY] = useState(y);
  const animationFrameId = useRef<number | null>(null);
  const targetX = useRef(x); // Use ref for target x
  const targetY = useRef(y); // Use ref for target y
  const easingFactor = 0.08; // Adjust this value for more or less lag
  const [isAnimating, setIsAnimating] = useState(false); // New state for animation

  // Update refs whenever x or y props change
  useEffect(() => {
    targetX.current = x;
    targetY.current = y;
  }, [x, y]);

  useEffect(() => {
    setIsAnimating(isVisible);
  }, [isVisible]);

  useEffect(() => {
    let currentFrameId: number | null = null;

    const animate = () => {
      setSmoothedX((prevX) => {
        const dx = targetX.current - prevX;
        return prevX + dx * easingFactor;
      });

      setSmoothedY((prevY) => {
        const dy = targetY.current - prevY;
        return prevY + dy * easingFactor;
      });

      if (isVisible) {
        currentFrameId = requestAnimationFrame(animate);
      }
    };

    if (isVisible) {
      // Start the animation frame loop if visible
      currentFrameId = requestAnimationFrame(animate);
    } else {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    }

    // Update global animationFrameId ref
    animationFrameId.current = currentFrameId;

    return () => {
      if (currentFrameId) {
        cancelAnimationFrame(currentFrameId);
      }
    };
  }, [isVisible, easingFactor]); // Dependencies only include isVisible and easingFactor

  const arrowSvg = (
    <svg
      xmlnsXlink="http://www.w3.org/1999/xlink"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 31 26"
      className="h-4 w-4 text-white transform -rotate-45"
      fill="none"
    >
      {" "}
      {/* Text-white for the stroke color */}
      <path
        d="M18.582 24.6654L29.3737 12.9987L18.582 1.33203"
        stroke="currentColor"
        strokeWidth="2px"
        strokeMiterlimit="10"
      ></path>
      <path
        d="M29.3737 13L0.0820312 13"
        stroke="currentColor"
        strokeWidth="2px"
        strokeMiterlimit="10"
      ></path>
    </svg>
  );

  return (
    <div
      className="absolute z-50 pointer-events-none flex items-center justify-center py-2 px-4 rounded-full"
      style={{
        left: `${smoothedX}px`,
        top: `${smoothedY}px`,
        transform: `translate(-50%, -50%) scaleY(${isVisible ? 1 : 0})`,
        transformOrigin: 'center center', // Explicitly set transform origin
        opacity: isVisible ? 1 : 0,
        transition: "transform 0.3s ease-out, opacity 0.3s ease-out",
        backgroundColor: "rgba(10, 10, 10, 0.7)", // Semi-transparent background
        backdropFilter: "blur(10px)", // Glassmorphism blur
        border: "1px solid rgba(255, 255, 255, 0.18)", // Subtle border
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", // Optional: Glassmorphism shadow
        color: "white",
        minWidth: "120px",
      }}
    >
      <span className="mr-2 text-white font-normal whitespace-nowrap">show case</span>
      {arrowSvg}
    </div>
  );
};

export default CursorFollower;
