import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/all";
import SplitType from "split-type";

gsap.registerPlugin(Observer, ScrollTrigger);

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

  const motion = useRef({
    x: 0,
    vel: 0.8,
    targetVel: 0.8,
    skew: -25,
    targetSkew: -25,
  });

  useEffect(() => {
    if (!containerRef.current || !marqueeRef.current) return;

    const container = containerRef.current;
    const marquee = marqueeRef.current;

    const ctx = gsap.context(() => {
      if (headerRef.current && subtextRef.current) {
        const splitHeader = new SplitType(headerRef.current, {
          types: "lines",
        });
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

      const BASE_SPEED = 0.8;
      const SKEW_ANGLE = 25;
      const SKEW_LERP = 0.2;
      const VEL_LERP = 0.05;
      const DECAY_LERP = 0.05;

      const tick = () => {
        const m = motion.current;
        const marqueeWidth = marquee.offsetWidth / 2;

        m.vel += (m.targetVel - m.vel) * VEL_LERP;
        m.skew += (m.targetSkew - m.skew) * SKEW_LERP;

        const idleVel = m.targetVel > 0 ? BASE_SPEED : -BASE_SPEED;
        m.targetVel += (idleVel - m.targetVel) * DECAY_LERP;

        m.x += m.vel;

        if (m.x <= -marqueeWidth) m.x += marqueeWidth;
        if (m.x >= 0) m.x -= marqueeWidth;

        gsap.set(marquee, { x: m.x });
        container.style.setProperty("--tileSkew", `${m.skew}deg`);
      };

      gsap.ticker.add(tick);

      Observer.create({
        target: window,
        type: "wheel,touch",
        onChange: (self: Observer) => {
          const isScrollingDown = self.deltaY > 0;
          const m = motion.current;

          const newTargetVel = isScrollingDown ? BASE_SPEED : -BASE_SPEED;
          const newTargetSkew = isScrollingDown ? -SKEW_ANGLE : SKEW_ANGLE;

          if (Math.sign(newTargetVel) !== Math.sign(m.vel)) {
            m.vel = newTargetVel;
            m.skew = newTargetSkew;
          }

          m.targetVel = newTargetVel + self.deltaY * 0.02;
          m.targetSkew = newTargetSkew;
        },
      });

      return () => {
        gsap.ticker.remove(tick);
      };
    }, container);

    return () => {
      ctx.revert();
    };
  }, []);

  const duplicatedBrands = [...brands, ...brands];

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[var(--background)]"
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

      <div className="flex flex-col md:flex-row px-6 md:px-10 lg:px-12 xl:px-16 items-start md:items-end justify-between gap-8 overflow-hidden relative z-10">
        <div className=" overflow-hidden">
          <h2
            ref={headerRef}
            className="project-header-text text-2xl md:text-3xl lg:text-5xl w-full text-left font-aeonik font-semibold text-[#1c1d1e] leading-tight"
          >
            Brands & creative teams <br className="hidden md:block" />
            I’ve collaborated with
          </h2>
        </div>
        <div className="max-w-sm md:text-right overflow-hidden">
          <p
            ref={subtextRef}
            className="project-header-subtext font-aeonik text-base md:text-lg text-[#1c1d1e] opacity-40 leading-relaxed tracking-wider"
          >
            Trusted by brands & <br className="hidden md:block" /> creative
            teams worldwide
          </p>
        </div>
      </div>

      <div className="relative z-10 flex whitespace-nowrap py-16 overflow-hidden">
        <div ref={marqueeRef} className="flex gap-4 md:gap-6 px-4 md:px-6">
          {duplicatedBrands.map((brand, idx) => (
            <div
              key={`${brand.name}-${idx}`}
              className="group relative flex-shrink-0 w-56 h-48 md:w-72 md:h-62 flex items-center justify-center transition-all duration-500 hover:scale-[1.05] bg-[#1c1d1e]"
              style={{
                transform: `skewX(var(--tileSkew)) translateZ(0)`,
                willChange: "transform",
              }}
            >
              <div
                className="relative z-10 flex flex-col items-center justify-center transition-all duration-500 grayscale brightness-[10] opacity-60 group-hover:opacity-100 group-hover:grayscale-0 group-hover:brightness-100 px-8"
                style={{
                  transform: `skewX(calc(var(--tileSkew) * -1))`,
                }}
              >
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-24 md:w-40 h-auto object-contain"
                  />
                ) : (
                  <span className="text-xl md:text-2xl font-aeonik font-bold text-white uppercase tracking-tight text-center">
                    {brand.name}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsMarquee;
