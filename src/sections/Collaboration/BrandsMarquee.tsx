import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/all";
import SplitType from "split-type";

gsap.registerPlugin(Observer, ScrollTrigger);

/**
 * REFINED PREMIUM MARQUEE
 *
 * Fixes:
 * 1. Motion: Corrected velocity object targeting to prevent NaN errors.
 * 2. Smoothness: Implemented a 'lerp-like' velocity bridge for liquid direction changes.
 * 3. Performance: Used a single GSAP ticker for both position and style updates.
 */

interface Brand {
  name: string;
  href?: string;
  logo?: string;
}

const brands: Brand[] = [
  { name: "DemensAi" },
  { name: "Fonden for Entreprenørskab" },
  { name: "CryoByBreum" },
  { name: "Fjong Studio" },
  { name: "Anette" },
  { name: "Vercel" },
  { name: "Tesla" },
  { name: "Netflix" },
  { name: "Spotify" },
  { name: "Linear" },
  { name: "OpenAI" },
  { name: "Arc" },
];

const BrandsMarquee: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);

  // State-like refs for the ticker (avoids React re-renders)
  const motion = useRef({
    x: 0,
    vel: 0.8,
    targetVel: 0.8,
    skew: -25, // Start pointed Right (Negative skew)
    targetSkew: -25,
  });

  useEffect(() => {
    if (!containerRef.current || !marqueeRef.current) return;

    const container = containerRef.current;
    const marquee = marqueeRef.current;

    // --- ENTRANCE ANIMATION ---
    if (headerRef.current && subtextRef.current) {
      const splitHeader = new SplitType(headerRef.current, { types: "lines" });
      const splitSub = new SplitType(subtextRef.current, { types: "lines" });

      gsap.from([splitHeader.lines, splitSub.lines], {
        yPercent: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 85%",
          once: true,
        },
      });
    }

    // --- TWEAKABLE CONSTANTS FOR PREMIUM FEEL ---
    const BASE_SPEED = 0.8;
    const SKEW_ANGLE = 25;
    const SKEW_LERP = 0.2; // Fast but stable skew flip
    const VEL_LERP = 0.05; // Slightly increased for responsiveness
    const DECAY_LERP = 0.05; // How fast the scroll "push" fades away

    // 1. Frame-by-frame Update Loop
    const tick = () => {
      const m = motion.current;
      const marqueeWidth = marquee.offsetWidth / 2;

      // Smoothly interpolate velocity and skew independently
      m.vel += (m.targetVel - m.vel) * VEL_LERP;
      m.skew += (m.targetSkew - m.skew) * SKEW_LERP;

      // Decay target velocity back to BASE_SPEED
      const idleVel = m.targetVel > 0 ? BASE_SPEED : -BASE_SPEED;
      m.targetVel += (idleVel - m.targetVel) * DECAY_LERP;

      // Update position
      m.x += m.vel;

      // Seamless Loop Modulo
      if (m.x <= -marqueeWidth) m.x += marqueeWidth;
      if (m.x >= 0) m.x -= marqueeWidth;

      // Apply transforms
      gsap.set(marquee, { x: m.x });
      container.style.setProperty("--tileSkew", `${m.skew}deg`);
    };

    gsap.ticker.add(tick);

    // 2. Scroll/Direction Observer
    Observer.create({
      target: window,
      type: "wheel,touch",
      onChange: (self: Observer) => {
        const isScrollingDown = self.deltaY > 0;
        const m = motion.current;

        // Update targets
        // Scrolling Down: moves Right (Pos vel), points Right (Neg skew)
        // Scrolling Up: moves Left (Neg vel), points Left (Pos skew)
        const newTargetVel = isScrollingDown ? BASE_SPEED : -BASE_SPEED;
        const newTargetSkew = isScrollingDown ? -SKEW_ANGLE : SKEW_ANGLE;

        // If direction flipped, reset values instantly to provide instant reaction
        if (Math.sign(newTargetVel) !== Math.sign(m.vel)) {
          m.vel = newTargetVel;
          m.skew = newTargetSkew;
        }

        // Add "push" to target velocity based on scroll delta
        // This ensures the acceleration is smooth and proportional to input
        m.targetVel = newTargetVel + self.deltaY * 0.02;
        m.targetSkew = newTargetSkew;
      },
    });

    return () => {
      gsap.ticker.remove(tick);
    };
  }, []);

  const duplicatedBrands = [...brands, ...brands];

  return (
    <section
      ref={containerRef}
      className="relative w-full pb-48 overflow-hidden bg-[#fefffe]"
      style={{ "--tileSkew": "-12deg" } as React.CSSProperties}
    >
      {/* Visual Polish */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="flex flex-col md:flex-row  px-8 md:px-16 lg:px-24 items-start md:items-end justify-between gap-8 overflow-hidden">
        <div className=" overflow-hidden">
          <h2
            ref={headerRef}
            className="project-header-text text-2xl md:text-3xl lg:text-5xl w-full text-left font-instrumentsans font-semibold text-[#1c1d1e] leading-tight"
          >
            Brands & creative teams <br className="hidden md:block" />
            I’ve collaborated with
          </h2>
        </div>
        <div className="max-w-sm md:text-right overflow-hidden">
          <p
            ref={subtextRef}
            className="project-header-subtext font-switzer text-base md:text-lg text-[#1c1d1e] opacity-40 leading-relaxed tracking-wider"
          >
            Trusted by brands & <br className="hidden md:block" /> creative
            teams worldwide
          </p>
        </div>
      </div>

      <div className="relative z-10 flex whitespace-nowrap py-8 overflow-hidden">
        <div ref={marqueeRef} className="flex gap-4 md:gap-6">
          {duplicatedBrands.map((brand, idx) => (
            <a
              key={`${brand.name}-${idx}`}
              href={brand.href || "#"}
              className="group relative flex-shrink-0 w-56 h-48 md:w-72 md:h-62 border rounded-xl border-[#1c1d1e]/10 flex items-center justify-center transition-all duration-500 hover:scale-[1.03] hover:border-[#1c1d1e]/30"
              style={{
                transform: `skewX(var(--tileSkew)) translateZ(0)`,
                willChange: "transform",
              }}
            >
              <div
                className="relative z-10 flex flex-col items-center justify-center transition-all duration-500 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100"
                style={{
                  transform: `skewX(calc(var(--tileSkew) * -1))`,
                  filter: "contrast(0.95)",
                }}
              >
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-24 md:w-40 h-auto object-contain"
                  />
                ) : (
                  <span className="text-xl md:text-2xl font-instrumentsans font-bold text-[#1c1d1e]/20 group-hover:text-[#1c1d1e] uppercase tracking-tight transition-colors duration-300">
                    {brand.name}
                  </span>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .tile-sheen {
          background: linear-gradient(
            25deg,
            rgba(0,0,0,0) 0%,
            rgba(0,0,0,0.05) 45%,
            rgba(0,0,0,0) 100%
          );
          mix-blend-mode: multiply;
        }
      `,
        }}
      />
    </section>
  );
};

export default BrandsMarquee;
