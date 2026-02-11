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
  const easingFactor = 0.15; // Adjust this value for more or less lag

  useEffect(() => {
    let currentFrameId: number | null = null;

    const animate = () => {
      setSmoothedX((prevX) => {
        const dx = x - prevX;
        if (Math.abs(dx) < 0.1 && Math.abs(x - prevX) < 0.1) return x; // Snap to target if very close
        return prevX + dx * easingFactor;
      });

      setSmoothedY((prevY) => {
        const dy = y - prevY;
        if (Math.abs(dy) < 0.1 && Math.abs(y - prevY) < 0.1) return y; // Snap to target if very close
        return prevY + dy * easingFactor;
      });

      currentFrameId = requestAnimationFrame(animate);
    };

    if (isVisible) {
      // Re-initialize smoothed position when becoming visible or target changes significantly
      // This helps prevent jumping if mouse moves far while hidden
      if (Math.abs(x - smoothedX) > 50 || Math.abs(y - smoothedY) > 50 || !animationFrameId.current) {
        setSmoothedX(x);
        setSmoothedY(y);
      }
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
  }, [x, y, isVisible, easingFactor]);

  const arrowIcon = (
    <svg
      xmlns:xlink="http://www.w3.org/1999/xlink"
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
      className="fixed z-50 pointer-events-none flex items-center justify-center py-2 px-4 rounded-full"
      style={{
        left: `${smoothedX}px`,
        top: `${smoothedY + 20}px`, // Re-introducing the +20px offset
        transform: `translate(-50%, -50%) scaleY(${isVisible ? 1 : 0})`,
        transformOrigin: 'center center', // Explicitly set transform origin
        opacity: isVisible ? 1 : 0,
        transition: "transform 0.3s ease-out, opacity 0.3s ease-out",
        backgroundColor: "#0a0a0a",
        color: "white",
        minWidth: "120px",
      }}
    >
      <span className="mr-2 text-white font-normal">show case</span>
      {arrowIcon}
    </div>
  );
};

export default CursorFollower;
