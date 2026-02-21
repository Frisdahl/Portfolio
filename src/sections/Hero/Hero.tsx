import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import Marquee from "../../components/Marquee";

gsap.registerPlugin(ScrollTrigger);

const SocialIcon = ({
  href,
  children,
  className,
  style,
}: {
  href: string;
  children: React.ReactNode;
  className: string;
  style?: React.CSSProperties;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`transition-colors duration-300 ${className}`}
    style={style}
  >
    {children}
  </a>
);

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current || !containerRef.current) return;

    // Initial Load Animation
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Fade in video
    tl.fromTo(
      videoRef.current,
      { opacity: 0, scale: 1.1 },
      { opacity: 0.75, scale: 1.06, duration: 2.5, ease: "power2.inOut" },
    );

    // Split headline for staggered animation
    if (headlineRef.current) {
      const split = new SplitType(headlineRef.current, { types: "lines" });
      tl.fromTo(
        split.lines,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.4,
          stagger: 0.15,
          ease: "expo.out",
        },
        "-=1.8",
      );
    }

    // Fade in footer area
    tl.fromTo(
      footerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1.2 },
      "-=1.2",
    );

    // Scroll-driven Wipe Transition
    gsap.to(heroRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        pin: true,
        pinSpacing: false,
      },
      clipPath: "inset(0% 0% 100% 0%)",
      ease: "none",
    });

    // Subtle Parallax for video
    gsap.to(videoRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
      y: "10%",
      ease: "none",
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="hero-container relative w-full h-[200vh]"
    >
      <section
        ref={heroRef}
        className="relative h-[100vh] w-full bg-[#0a0a0a] overflow-hidden flex flex-col justify-between pt-44 pb-4 md:pb-8 will-change-[clip-path]"
        style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      >
        {/* Layer B: Video Background */}
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover transform-gpu opacity-0"
          >
            <source
              src="/projectVideos/herovideo/wave-optimized.webm"
              type="video/webm"
            />
            <source
              src="/projectVideos/herovideo/wave-optimized.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        {/* Layer C: Navy/Dark Overlay */}
        <div
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(5, 10, 20, 0.8) 0%, rgba(5, 5, 5, 0.75) 100%)",
          }}
        />

        {/* Layer D: Atmosphere + Grain Overlay */}
        <div
          className="absolute inset-0 z-[3] pointer-events-none mix-blend-overlay opacity-[0.08]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Top Content: Headline Wrap */}
        <div className="relative z-[10] px-8">
          <div className="flex flex-col items-start text-left gap-8 md:gap-10">
            <h1
              ref={headlineRef}
              className="text-5xl md:text-6xl lg:text-7xl xl:text-7xl font-granary text-[#fff] font-semibold uppercase leading-[1] tracking-tighter"
            >
              Freelance web developer <br />&
              <span className="font-apparel italic"> creative designer.</span>
            </h1>
          </div>
        </div>

        {/* Bottom Content Area */}
        <div ref={contentRef} className="relative z-[10] w-full">
          <div ref={footerRef} className="w-full opacity-0">
            {/* Elements ABOVE the divider */}
            <div className="px-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                <div className="flex items-center space-x-6">
                  <img
                    src="/images/danish-flag.svg"
                    alt="Danish Flag"
                    className="h-6 rounded-full"
                  />
                  <div className="flex space-x-6">
                    {["IG", "FB", "LK", "TEL", "MAIL"].map((label) => (
                      <SocialIcon
                        key={label}
                        href="#"
                        className="hover:opacity-70 transition-opacity font-granary text-xs uppercase tracking-widest"
                        style={{ color: "var(--foreground-muted)" }}
                      >
                        {label}
                      </SocialIcon>
                    ))}
                  </div>
                </div>

                <p
                  className="text-xs md:text-sm max-w-sm text-left md:text-right leading-relaxed font-granary font-light uppercase tracking-wider"
                  style={{ color: "var(--foreground-muted)" }}
                >
                  I help ambitious brands launch digital experiences and
                  strengthen their identity through strategic, custom design.
                </p>
              </div>

              {/* Divider (Also aligned to sides) */}
              <hr
                className="w-full h-px border-0 opacity-10"
                style={{ backgroundColor: "var(--divider)" }}
              />
            </div>

            {/* Marquee Section (Full screen width) */}
            <Marquee
              text="Frisdahl Studio°"
              className="pt-8"
              itemClassName="text-5xl md:text-7xl lg:text-[7vw] font-granary font-semibold uppercase tracking-wide pr-20 text-[var(--foreground)] opacity-[0.05] leading-none"
              speed={1}
            />
          </div>
        </div>

        <style>{`
        @media (prefers-reduced-motion: reduce) {
          .transform-gpu {
            transform: none !important;
          }
        }
      `}</style>
      </section>
    </div>
  );
};

export default Hero;
