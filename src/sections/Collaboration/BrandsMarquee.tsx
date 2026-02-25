import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
  { name: "Nike" },
  { name: "Apple" },
  { name: "Stripe" },
  { name: "Airbnb" },
  { name: "Figma" },
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
      type: "wheel,touch,pointer",
      onChange: (self) => {
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
      className="relative w-full mb-48 overflow-hidden bg-[#0a0a0a]"
      style={{ "--tileSkew": "-12deg" } as React.CSSProperties}
    >
      {/* Visual Polish */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="flex flex-col md:flex-row  px-8 md:px-16 lg:px-24 items-start md:items-end justify-between gap-8 mb-8 overflow-hidden">
        <div className="max-w-2xl overflow-hidden">
          <h2 ref={headerRef} className="project-header-text text-2xl md:text-3xl lg:text-5xl text-left font-newroman text-white leading-tight">
            Brands & creative teams <br className="hidden md:block" />
            I’ve collaborated with
          </h2>
        </div>
        <div className="max-w-sm md:text-right overflow-hidden">
          <p
            ref={subtextRef}
            className="project-header-subtext font-switzer text-base md:text-lg text-[var(--foreground)] opacity-70 leading-relaxed"
          >
            Trusted by brands & <br className="hidden md:block" /> creative
            teams worldwide
          </p>
        </div>
      </div>

      <div className="relative z-10 flex whitespace-nowrap">
        <div ref={marqueeRef} className="flex gap-4 md:gap-6 py-12">
          {duplicatedBrands.map((brand, idx) => (
            <a
              key={`${brand.name}-${idx}`}
              href={brand.href || "#"}
              className="group relative flex-shrink-0 w-56 h-48 md:w-72 md:h-62 rounded-2xl flex items-center justify-center transition-all duration-500 hover:scale-[1.04] backdrop-blur-3xl saturate-[1.8] shadow-[0_25px_80px_-15px_rgba(0,0,0,0.7)]"
              style={{
                transform: `skewX(var(--tileSkew)) translateZ(0)`,
                willChange: "transform",
                border: "1px solid rgba(255,255,255,0.06)",
                background: "linear-gradient(140deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01) 40%, rgba(0,0,0,0.1))"
              }}
            >
              {/* Internal Glass Depth Layer */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-50 rounded-2xl pointer-events-none" />
              
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 tile-sheen rounded-2xl" />
              
              <div
                className="relative z-10 flex flex-col items-center justify-center transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110"
                style={{ 
                  transform: `skewX(calc(var(--tileSkew) * -1))`,
                  opacity: 0.7,
                  filter: "contrast(0.95)"
                }}
              >
                {brand.logo ? (
                  <img src={brand.logo} alt={brand.name} className="w-24 md:w-40 h-auto object-contain" />
                ) : (
                  <span className="text-2xl md:text-4xl font-switzer font-bold text-white/80 group-hover:text-white tracking-tighter drop-shadow-md">
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
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.10) 45%,
            rgba(255,255,255,0) 100%
          );
          mix-blend-mode: screen;
        }
      `,
        }}
      />
    </section>
  );
};

export default BrandsMarquee;
