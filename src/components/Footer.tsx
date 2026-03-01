import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Marquee from "./Marquee";
import Links from "./Links";
import { triggerPageTransition } from "../utils/pageTransition";
import { scrollTo } from "../utils/smoothScroll";

gsap.registerPlugin(ScrollTrigger);

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isInView, setIsInView] = useState(false);
  const [footerHeight, setFooterHeight] = useState(0);
  const spacerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!footerRef.current) return;

    const updateFooterHeight = () => {
      if (!footerRef.current) return;
      setFooterHeight(footerRef.current.offsetHeight);
    };

    updateFooterHeight();
    window.addEventListener("resize", updateFooterHeight);

    const resizeObserver = new ResizeObserver(() => updateFooterHeight());
    resizeObserver.observe(footerRef.current);

    return () => {
      window.removeEventListener("resize", updateFooterHeight);
      resizeObserver.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    if (!spacerRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      // Footer reveal animation
      gsap.fromTo(
        contentRef.current,
        { y: -90 },
        {
          y: 0,
          ease: "power1.out",
          scrollTrigger: {
            trigger: spacerRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    }, spacerRef);

    return () => ctx.revert();
  }, [footerHeight]);

  useEffect(() => {
    const el = spacerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleFooterLinkClick = async (
    e: React.MouseEvent,
    to: string,
    targetSection?: string,
  ) => {
    e.preventDefault();
    if (targetSection) {
      if (location.pathname !== "/") {
        sessionStorage.setItem("isNavigating", "true");
        sessionStorage.removeItem("isHomeNav");
        sessionStorage.setItem("targetSection", targetSection);

        await triggerPageTransition();
        navigate(`/${targetSection}`);
      } else {
        scrollTo(targetSection, 1.2, -120, false);
      }
    } else {
      if (location.pathname !== to) {
        sessionStorage.setItem("isNavigating", "true");
        await triggerPageTransition();
        navigate(to);
      }
    }
  };

  return (
    <>
      <div
        ref={spacerRef}
        style={{ height: footerHeight || 1 }}
        aria-hidden="true"
      />

      <footer
        ref={footerRef}
        className="fixed bottom-0 left-0 right-0 w-full bg-[#1c1d1e] text-white overflow-hidden z-10"
      >
        <div ref={contentRef} className="w-full h-full relative">
          {/* Background Video Layer */}
          <div className="absolute inset-0 z-[1] pointer-events-none">
            {isInView && (
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full h-full object-cover opacity-40"
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
            )}
          </div>

          {/* Neutral Dark overlay */}
          <div className="absolute inset-0 z-[2] bg-[#1c1d1e]/45 pointer-events-none" />

          {/* Footer Content */}
          <div className="relative z-[10] w-full px-4 md:px-10 lg:px-12 xl:px-16 pt-24 flex flex-col md:flex-row justify-between items-start gap-12 pb-12">
            <div className="flex flex-col items-start text-left">
              <h3 className="text-2xl md:text-3xl lg:text-5xl font-bold font-aeonik uppercase leading-tight mb-8 max-w-xl text-white">
                Available for <br /> select projects
              </h3>
              <div className="flex items-start gap-12">
                <p className="text-xs uppercase tracking-[0.2em] opacity-40">
                  © 2026 Frisdahl Studio
                </p>
                <p className="text-xs uppercase tracking-widest opacity-40">
                  Denmark — Copenhagen
                </p>
              </div>
            </div>

            <div className="flex gap-16 lg:gap-24 mb-2">
              <div className="flex flex-col items-start text-left">
                <p className="text-xs uppercase tracking-[0.3em] opacity-40 mb-6">
                  Menu
                </p>
                <Links
                  links={[
                    {
                      label: "Works",
                      href: "/",
                      onClick: (e) =>
                        handleFooterLinkClick(e, "/", "#projects"),
                    },
                    {
                      label: "About",
                      href: "/about",
                      onClick: (e) => handleFooterLinkClick(e, "/about"),
                    },
                    {
                      label: "Contact",
                      href: "/contact",
                      onClick: (e) => handleFooterLinkClick(e, "/contact"),
                    },
                  ]}
                  className="flex flex-col space-y-3"
                  textColor="text-white"
                  underlineColor="bg-white"
                />
              </div>

              <div className="flex flex-col items-start text-left">
                <p className="text-xs uppercase tracking-[0.3em] opacity-40 mb-6">
                  Socials
                </p>
                <Links
                  links={[
                    { label: "Instagram", href: "#" },
                    { label: "Facebook", href: "#" },
                    { label: "LinkedIn", href: "#" },
                  ]}
                  className="flex flex-col space-y-3"
                  textColor="text-white"
                  underlineColor="bg-white"
                />
              </div>
            </div>
          </div>

          {/* Bottom Divider & Marquee */}
          <div className="relative z-[10] w-full">
            <div className="w-full px-4 md:px-10 lg:px-12 xl:px-16 mb-10">
              <hr className="w-full h-px border-0 bg-white opacity-10" />
            </div>
            <div className="w-full pb-8">
              <Marquee
                text="Frisdahl Studio°"
                itemClassName="text-5xl md:text-7xl lg:text-[5vw] font-aeonik font-bold uppercase tracking-wide pr-20 text-white opacity-[0.05] leading-none"
                speed={1}
              />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
