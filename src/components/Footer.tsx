import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AnimatedNavLink from "./AnimatedNavLink";
import { scrollTo } from "../utils/smoothScroll";
import { triggerPageTransition } from "../utils/pageTransition";

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLinkClick = async (
    e: React.MouseEvent,
    to: string,
    targetSection?: string,
  ) => {
    e.preventDefault();
    if (targetSection) {
      if (location.pathname !== "/") {
        sessionStorage.setItem("targetSection", targetSection);
        await triggerPageTransition();
        navigate("/");
      } else {
        scrollTo(targetSection, 1.2, -120, false);
      }
    } else {
      if (location.pathname !== to) {
        await triggerPageTransition();
        navigate(to);
      }
    }
  };

  const socialLinks = [
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Behance", href: "https://behance.net" },
  ];

  const menuLinks = [
    { label: "Works", to: "/", section: "#projects" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <footer className="w-full bg-[var(--background)] text-[var(--foreground)] px-4 md:px-10 lg:px-4 xl:px-6 pt-32 pb-12">
      <div className="w-full flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-32 mb-32">
        {/* Left Side: Columns Container */}
        <div className="flex flex-row gap-24 md:gap-32 lg:gap-40">
          {/* Menu Column */}
          <div className="flex flex-col items-start gap-4">
            <p className="text-xs uppercase tracking-[0.3em] opacity-40 mb-2">
              Menu
            </p>
            <div className="flex flex-col items-start gap-2">
              {menuLinks.map((link) => (
                <div key={link.label}>
                  <AnimatedNavLink
                    label={link.label}
                    to={link.to}
                    className="text-lg md:text-xl font-aeonik font-medium"
                    onClick={(e) => handleLinkClick(e, link.to, link.section)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Socials Column */}
          <div className="flex flex-col items-start gap-4">
            <p className="text-xs uppercase tracking-[0.3em] opacity-40 mb-2">
              Socials
            </p>
            <div className="flex flex-col items-start gap-2">
              {socialLinks.map((link) => (
                <div key={link.label}>
                  <AnimatedNavLink
                    label={link.label}
                    to={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg md:text-xl font-aeonik font-medium"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Video Container */}
        <div className="flex-1 w-full lg:max-w-xl aspect-[16/9] rounded-sm overflow-hidden bg-neutral-200 relative group">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          >
            <source
              src="/glassobj.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-700" />
        </div>
      </div>

      {/* Bottom Area */}
      <div className="w-full">
        <hr className="w-full h-px border-0 bg-[var(--foreground)] opacity-10 mb-8" />
        <div className="flex flex-row justify-between items-center text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium opacity-60">
          <p>© 2026 Alexander Frisdahl</p>
          <p className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Available for work
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
