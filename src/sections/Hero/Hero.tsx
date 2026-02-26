import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import Marquee from "../../components/Marquee";
import Links from "../../components/Links";

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

    // Fade in video (starting from its base opacity)
    tl.fromTo(
      videoRef.current,
      { scale: 1.1, opacity: 0 },
      { opacity: 0.4, scale: 1.06, duration: 2.5, ease: "power2.inOut" },
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
      id="hero"
      className="hero-container relative w-full h-[200vh]"
    >
      <section
        ref={heroRef}
        className="dark-section relative h-[100vh] w-full bg-[#1c1d1e] overflow-hidden flex flex-col justify-between pt-44 pb-4 md:pb-8 will-change-[clip-path]"
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
            className="w-full h-full object-cover transform-gpu opacity-40"
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

        {/* Layer C: Neutral Dark Overlay */}
        <div
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{ backgroundColor: "rgba(28, 29, 30, 0.1)" }}
        />

        {/* Top Content: Headline Wrap */}
        <div className="relative z-[10] px-8">
          <div className="flex flex-col items-start text-left gap-8 md:gap-10">
            <h1
              ref={headlineRef}
              className="text-5xl md:text-6xl lg:text-7xl xl:text-7xl font-instrumentsans font-semibold text-white uppercase tracking-tight leading-[1]"
            >
              Immersive websites, <br />
              designed with clarity.
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
                  <Links
                    links={[
                      { label: "IG", href: "#" },
                      { label: "FB", href: "#" },
                      { label: "LK", href: "#" },
                      { label: "TEL", href: "#" },
                      { label: "MAIL", href: "#" },
                    ]}
                    className="flex space-x-6"
                    textColor="text-white"
                    underlineColor="bg-white"
                  />
                </div>

                <p className="text-xs md:text-sm max-w-sm text-left md:text-right leading-relaxed font-switzer font-light uppercase tracking-wider text-white opacity-60">
                  I help ambitious brands launch digital experiences and
                  strengthen their identity through strategic, custom design.
                </p>
              </div>

              {/* Divider (Also aligned to sides) */}
              <hr className="w-full h-px border-0 bg-white opacity-10" />
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
