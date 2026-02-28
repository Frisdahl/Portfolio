import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { scrollTo } from "../utils/smoothScroll";
import { triggerPageTransition } from "../utils/pageTransition";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArrowIcon from "./ArrowIcon";

gsap.registerPlugin(ScrollTrigger);

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPastHero, setIsPastHero] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const talkButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navButtonsRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLAnchorElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const entranceTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const isHomePage = location.pathname === "/";

  // 1. Layout Sync & Scroll Detection
  useLayoutEffect(() => {
    const updateHeaderDimensions = () => {
      if (nameRef.current) {
        const width = nameRef.current.offsetWidth;
        document.documentElement.style.setProperty(
          "--name-width",
          `${width}px`,
        );
      }
    };

    updateHeaderDimensions();

    const ctx = gsap.context(() => {
      if (isHomePage) {
        ScrollTrigger.create({
          trigger: "#hero",
          start: "bottom 100px",
          onEnter: () => setIsPastHero(true),
          onLeaveBack: () => setIsPastHero(false),
          onRefresh: (self) => setIsPastHero(self.progress > 0),
        });
      } else {
        setIsPastHero(true);
      }
    });

    window.addEventListener("resize", updateHeaderDimensions);
    window.addEventListener("page-transition-complete", updateHeaderDimensions);

    return () => {
      ctx.revert();
      window.removeEventListener("resize", updateHeaderDimensions);
      window.removeEventListener(
        "page-transition-complete",
        updateHeaderDimensions,
      );
    };
  }, [location.pathname, isHomePage]);

  // Header entrance animation (name + buttons)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (
        !nameRef.current ||
        !talkButtonRef.current ||
        !menuButtonRef.current
      ) {
        return;
      }

      gsap.set(
        [nameRef.current, talkButtonRef.current, menuButtonRef.current],
        {
          autoAlpha: 0,
          y: -12,
        },
      );

      const tl = gsap.timeline({ paused: true });
      tl.to(nameRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      }).to(
        [talkButtonRef.current, menuButtonRef.current],
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
        },
        "-=0.45",
      );

      entranceTimelineRef.current = tl;

      const playEntrance = () => {
        if (entranceTimelineRef.current?.progress() === 0) {
          entranceTimelineRef.current.play();
        }
      };

      window.addEventListener("initial-loader-complete", playEntrance);
      window.addEventListener("page-transition-complete", playEntrance);

      const hasSeenLoader = sessionStorage.getItem("hasSeenInitialLoader");
      const isLoaderActive = !!document.querySelector(".initial-loader-wrap");
      const isNavigating = sessionStorage.getItem("isNavigating") === "true";

      if (hasSeenLoader && !isLoaderActive && !isNavigating) {
        playEntrance();
      }

      const safetyTimeout = setTimeout(
        playEntrance,
        isLoaderActive ? 6000 : 120,
      );

      return () => {
        window.removeEventListener("initial-loader-complete", playEntrance);
        window.removeEventListener("page-transition-complete", playEntrance);
        clearTimeout(safetyTimeout);
      };
    });

    return () => ctx.revert();
  }, []);

  // 2. Synchronized Animation Timeline Setup
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const dropdown = dropdownRef.current;
      const items = dropdown?.querySelectorAll(".menu-item-anim");

      if (!dropdown || !items) return;

      // Initial State
      gsap.set(dropdown, {
        autoAlpha: 0,
        clipPath: "inset(0% 0% 100% 0%)",
      });

      gsap.set(items, {
        y: 10,
        autoAlpha: 0,
      });

      // Create the Master Timeline
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.inOut" },
      });

      // Sequence: Panel -> Items (Button handled by React state + CSS for maximum smoothness)
      tl.to(dropdown, {
        autoAlpha: 1,
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.6,
        ease: "expo.out",
      }).to(
        items,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.06,
          ease: "power2.out",
        },
        "-=0.4",
      );

      timelineRef.current = tl;
    });

    return () => ctx.revert();
  }, []);

  // 3. Trigger Logic
  useEffect(() => {
    if (!timelineRef.current) return;

    if (isMenuOpen) {
      timelineRef.current.timeScale(1).play();
    } else {
      timelineRef.current.timeScale(1.5).reverse();
    }
  }, [isMenuOpen]);

  // 4. Utility Effects
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) setIsMenuOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleLogoClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (!isHomePage) {
      sessionStorage.setItem("isNavigating", "true");
      await triggerPageTransition(() => navigate("/"));
    } else {
      scrollTo(0, 1.5, 0, false);
    }
  };

  const handleLinkClick = async (
    e: React.MouseEvent | null,
    to: string,
    section?: string,
  ) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsMenuOpen(false);

    if (section) {
      if (!isHomePage) {
        sessionStorage.setItem("isNavigating", "true");
        sessionStorage.setItem("targetSection", section);
        await triggerPageTransition(() => navigate(`/${section}`));
      } else {
        scrollTo(section, 1.5, -120, false);
      }
      return;
    }

    if (location.pathname !== to) {
      await triggerPageTransition(() => navigate(to));
    }
  };

  const menuItems = [
    { label: "Home", to: "/", section: undefined },
    { label: "About me", to: "/about", section: undefined },
    { label: "Projects", to: "/", section: "#projects" },
    { label: "Contact", to: "/contact", section: undefined },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[220] pointer-events-none py-6 md:py-10 px-6 md:px-10 lg:px-4 xl:px-6">
      <div className="flex items-start justify-between w-full relative">
        {/* Logo Replacement: Stylized Name */}
        <Link
          ref={nameRef}
          to="/"
          onClick={handleLogoClick}
          className="pointer-events-auto flex flex-col items-start shrink-0 text-[#1c1d1e] leading-[1.0] pt-1"
        >
          <span className="text-lg md:text-xl lg:text-2xl uppercase font-medium tracking-tight">
            <span className="italic">A</span>lexander
          </span>
          <span className="text-lg md:text-xl lg:text-2xl uppercase font-medium tracking-tight">
            <span className="italic">F</span>risdahl
          </span>
        </Link>

        {/* Nav on the far right */}
        <div className="flex flex-col items-end gap-2 relative">
          <nav
            ref={navButtonsRef}
            className="pointer-events-auto flex items-start gap-2 shrink-0"
          >
            <button
              ref={talkButtonRef}
              onClick={(e) => handleLinkClick(e, "/contact")}
              className="group/talk h-10 sm:h-12 px-10 rounded-full bg-[#1c1d1e] text-[#fefffe] text-lg sm:text-xl uppercase font-medium tracking-tight transition-all duration-500 hover:opacity-90 cursor-pointer flex items-center justify-center overflow-hidden relative min-w-[160px]"
            >
              <span className="whitespace-nowrap transition-transform duration-500 group-hover/talk:translate-x-3 font-medium">
                Let's talk
              </span>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse transition-all duration-300 group-hover/talk:opacity-0 group-hover/talk:scale-0" />
              </div>
              <div className="absolute left-6 top-1/2 -translate-y-1/2 -translate-x-10 opacity-0 transition-all duration-500 group-hover/talk:translate-x-0 group-hover/talk:opacity-100">
                <ArrowIcon className="w-4 h-4" />
              </div>
            </button>

            <button
              ref={menuButtonRef}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              className={`group/menu h-10 sm:h-12 px-10 min-w-[160px] rounded-full text-lg sm:text-xl uppercase font-medium tracking-tight transition-all duration-500 hover:brightness-110 cursor-pointer flex items-center justify-between gap-4 overflow-hidden ${
                isMenuOpen
                  ? "bg-[#fefeff]"
                  : isPastHero
                    ? "bg-white/30 backdrop-blur-2xl"
                    : "bg-[#e4e6ef]"
              }`}
            >
              <div className="relative h-10 sm:h-12 flex-grow overflow-hidden pointer-events-none">
                <div
                  className="flex flex-col w-full h-[200%] transition-transform duration-[600ms] ease-[cubic-bezier(0.7,0,0.3,1)]"
                  style={{
                    transform: isMenuOpen
                      ? "translateY(-50%)"
                      : "translateY(0%)",
                  }}
                >
                  <span className="h-1/2 flex items-center justify-start">
                    Menu
                  </span>
                  <span className="h-1/2 flex items-center justify-start">
                    Close
                  </span>
                </div>
              </div>

              <div
                className={`flex items-center gap-1.5 transition-transform duration-400 ease-[cubic-bezier(0.7,0,0.3,1)] ${isMenuOpen ? "rotate-90" : "group-hover/menu:rotate-90"}`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-current transition-colors duration-500" />
                <div className="w-1.5 h-1.5 rounded-full bg-current transition-colors duration-500" />
              </div>
            </button>
          </nav>

          <div
            ref={dropdownRef}
            aria-hidden={!isMenuOpen}
            className="pointer-events-auto absolute top-full right-0 mt-2 w-full min-w-[320px] bg-[#fefeff] rounded-[1.5rem] shadow-2xl border border-[#1c1d1e]/5 overflow-hidden flex flex-col p-3 invisible opacity-0"
          >
            {menuItems.map((item) => {
              const isActive = item.section
                ? location.pathname === "/" && location.hash === item.section
                : location.pathname === item.to && !location.hash;

              return (
                <a
                  key={item.label}
                  href={item.to}
                  onClick={(e) => handleLinkClick(e, item.to, item.section)}
                  className={`menu-item-anim group/item flex items-center justify-between px-8 py-5 rounded-full transition-colors duration-300 text-[#1c1d1e] uppercase font-medium text-xl md:text-2xl tracking-tight overflow-hidden ${
                    isActive ? "cursor-default" : "hover:bg-[#1c1d1e]/5"
                  }`}
                >
                  <div className="relative h-8 overflow-hidden flex-grow pointer-events-none">
                    <div
                      className={`flex flex-col transition-transform duration-[600ms] ease-[cubic-bezier(0.7,0,0.3,1)] h-[200%] ${
                        isActive
                          ? "translate-y-0"
                          : "group-hover/item:-translate-y-1/2"
                      }`}
                    >
                      <span className="h-1/2 flex items-center">
                        {item.label}
                      </span>
                      <span className="h-1/2 flex items-center">
                        {item.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center w-6 h-6">
                    {isActive ? (
                      <div className="w-2 h-2 rounded-full bg-[#1c1d1e]" />
                    ) : (
                      <div className="opacity-0 -translate-x-4 transition-all duration-300 group-hover/item:opacity-100 group-hover/item:translate-x-0">
                        <ArrowIcon className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
