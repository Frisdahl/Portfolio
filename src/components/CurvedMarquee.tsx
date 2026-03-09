import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

interface CurvedMarqueeProps {
  text: string;
  speed?: number;
  className?: string;
  fontSize?: string;
  color?: string;
}

const CurvedMarquee: React.FC<CurvedMarqueeProps> = ({
  text,
  speed = 40,
  className = "",
  fontSize = "1rem",
  color = "currentColor",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textPathRef = useRef<SVGTextPathElement>(null);
  const measureRef = useRef<SVGTextElement>(null);

  useLayoutEffect(() => {
    if (!textPathRef.current || !measureRef.current) return;

    const unitLength = measureRef.current.getComputedTextLength();
    
    // We create a timeline that mimics the horizontalLoop logic 
    // by ensuring we move exactly one "unit" distance.
    const tl = gsap.timeline({
      repeat: -1,
      defaults: { ease: "none" }
    });

    tl.fromTo(textPathRef.current, 
      { attr: { startOffset: 0 } },
      {
        attr: { startOffset: -unitLength },
        duration: speed / 5,
      }
    );

    return () => {
      tl.kill();
    };
  }, [text, speed]);

  const separator = "   ✦   ";
  // We repeat the text many times to ensure the "wrap around" happens invisible to the user
  const repeatedText = new Array(20).fill(text).join(separator) + separator;

  return (
    <div ref={containerRef} className={`w-full overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 1000 220"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto"
      >
        <defs>
          {/* Shallow valley curve */}
          <path
            id="curvePath"
            d="M -100,20 Q 500,200 1100,20"
            fill="transparent"
          />
          
          <linearGradient id="edgeFade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor="white" stopOpacity="1" />
            <stop offset="95%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          
          <mask id="fadeMask">
            <rect width="1000" height="220" fill="url(#edgeFade)" />
          </mask>
        </defs>

        {/* Measurement node - invisible */}
        <text
          ref={measureRef}
          style={{ 
            fontSize, 
            fontFamily: "var(--font-cabinet)", 
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            visibility: "hidden",
            pointerEvents: "none"
          }}
        >
          {text + separator}
        </text>

        <text
          fill={color}
          mask="url(#fadeMask)"
          style={{ 
            fontSize, 
            fontFamily: "var(--font-cabinet)", 
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            opacity: 1
          }}
        >
          <textPath
            ref={textPathRef}
            xlinkHref="#curvePath"
            startOffset="0"
          >
            {repeatedText}
          </textPath>
        </text>
      </svg>
    </div>
  );
};

export default CurvedMarquee;
