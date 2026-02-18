import React from "react";

export function LuxuryGrainBackground() {
  return (
    <>
      {/* Grain filter definition (hidden svg) */}
      <svg
        aria-hidden="true"
        style={{
          position: "fixed",
          width: 0,
          height: 0,
          pointerEvents: "none",
        }}
      >
        <filter id="grain">
          {/* Higher numOctaves = more “paper-like” complexity */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
          />
          {/* Controls grain contrast */}
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>

      {/* Overlay layer */}
      <div className="lux-grain" />
    </>
  );
}

export default LuxuryGrainBackground;
