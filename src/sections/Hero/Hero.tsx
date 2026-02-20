import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

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
  const labelRef = useRef<HTMLSpanElement>(null);
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

    // Fade in other elements
    tl.fromTo(
      [labelRef.current, footerRef.current],
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1.2, stagger: 0.15 },
      "-=1.2",
    );

    // Scroll-driven Wipe Transition (Erasing from bottom to top)
    gsap.to(heroRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        pin: true,
        pinSpacing: false, // Reveal next section underneath
      },
      clipPath: "inset(0% 0% 100% 0%)",
      ease: "none",
    });

    // Subtle Parallax for video inside the wipe
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
        className="relative h-[100vh] w-full bg-[#0a0a0a] overflow-hidden flex flex-col justify-end px-6 md:px-12 lg:px-24 will-change-[clip-path]"
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

        {/* Main Content Area */}
        <div
          ref={contentRef}
          className="relative z-[10] w-full max-w-[1800px] mx-auto pb-8 md:pb-12"
        >
          <div className="flex flex-col items-start text-left gap-8 md:gap-10 mb-12 md:mb-20">
            <span
              ref={labelRef}
              className="text-[10px] md:text-xs tracking-[0.4em] font-granary font-medium uppercase opacity-0 text-[#a0a0a0] flex items-center gap-4"
            >
              <span className="w-8 h-px bg-[#a0a0a0]/40" />
              Design + Development Studio
            </span>

            <h1
              ref={headlineRef}
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-granary uppercase leading-[0.85] tracking-tighter text-[var(--foreground)]"
            >
              Freelance web developer <br />&
              <span className="font-apparel italic text-[#e4e3de]">
                {" "}
                creative designer.
              </span>
            </h1>
          </div>

          {/* Bottom Divider Content */}
          <div ref={footerRef} className="w-full opacity-0">
            <hr
              className="w-full h-px border-0 mb-8"
              style={{ backgroundColor: "var(--divider)" }}
            />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="flex items-center space-x-6">
                <img
                  src="/images/danish-flag.svg"
                  alt="Danish Flag"
                  className="h-6 rounded-full"
                />
                <div className="flex space-x-6">
                  <SocialIcon
                    href="#"
                    className="hover:opacity-70 transition-opacity font-granary text-xs uppercase tracking-widest"
                    style={{ color: "var(--foreground-muted)" }}
                  >
                    IG
                  </SocialIcon>
                  <SocialIcon
                    href="#"
                    className="hover:opacity-70 transition-opacity font-granary text-xs uppercase tracking-widest"
                    style={{ color: "var(--foreground-muted)" }}
                  >
                    FB
                  </SocialIcon>
                  <SocialIcon
                    href="#"
                    className="hover:opacity-70 transition-opacity font-granary text-xs uppercase tracking-widest"
                    style={{ color: "var(--foreground-muted)" }}
                  >
                    LK
                  </SocialIcon>
                  <SocialIcon
                    href="#"
                    className="hover:opacity-70 transition-opacity font-granary text-xs uppercase tracking-widest"
                    style={{ color: "var(--foreground-muted)" }}
                  >
                    TEL
                  </SocialIcon>
                  <SocialIcon
                    href="#"
                    className="hover:opacity-70 transition-opacity font-granary text-xs uppercase tracking-widest"
                    style={{ color: "var(--foreground-muted)" }}
                  >
                    MAIL
                  </SocialIcon>
                </div>
              </div>

              <p
                className="text-xs md:text-sm max-w-sm text-left md:text-right leading-relaxed font-granary font-light"
                style={{ color: "var(--foreground-muted)" }}
              >
                I help ambitious brands launch digital experiences and
                strengthen their identity through strategic, custom design.
              </p>
            </div>
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
