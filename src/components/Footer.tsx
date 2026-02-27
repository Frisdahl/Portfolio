import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Marquee from "./Marquee";
import Links from "./Links";
import { triggerPageTransition } from "../utils/pageTransition";
import { scrollTo } from "../utils/smoothScroll";

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isInView, setIsInView] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = footerRef.current;
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
    await triggerPageTransition();

    if (targetSection) {
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          scrollTo(targetSection, 0);
        }, 150);
      } else {
        scrollTo(targetSection, 0);
      }
    } else {
      navigate(to);
    }
  };

  return (
    <footer ref={footerRef} className="dark-section relative w-full bg-[#1c1d1e] text-white pt-24 overflow-hidden">
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
      <div className="relative z-[10] w-full px-8 flex flex-col md:flex-row justify-between items-start gap-12 pb-12">
        <div className="flex flex-col items-start text-left">
          <h3 className="text-2xl md:text-3xl lg:text-5xl font-bold font-instrumentsans uppercase leading-tight mb-8 max-w-xl text-white">
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
                  onClick: (e) => handleFooterLinkClick(e, "/", "#projects"),
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
        <div className="w-full px-8 mb-10">
          <hr className="w-full h-px border-0 bg-white opacity-10" />
        </div>
        <div className="w-full pb-8">
          <Marquee
            text="Frisdahl Studio°"
            itemClassName="text-5xl md:text-7xl lg:text-[5vw] font-instrumentsans font-bold uppercase tracking-wide pr-20 text-white opacity-[0.05] leading-none"
            speed={1}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
