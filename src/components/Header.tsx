import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { scrollTo } from "../utils/smoothScroll";
import { triggerPageTransition } from "../utils/pageTransition";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import PlusIcon from "../assets/icons/PlusIcon";
import AnimatedNavLink from "./AnimatedNavLink";
import CtaButton from "./CtaButton";
import { useMagnetic } from "../utils/animations/useMagnetic";

gsap.registerPlugin(ScrollTrigger);

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPastHero, setIsPastHero] = useState(false);
  const [isInProjectsSection, setIsInProjectsSection] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const navLinksRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLAnchorElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const menuContentRef = useRef<HTMLDivElement>(null);
  const shakaIconRef = useRef<HTMLSpanElement>(null);

  // Apply magnetic effect
  useMagnetic(nameRef, { strength: 20, enabled: !isMenuOpen });
  useMagnetic(burgerRef, { strength: 30, enabled: !isMenuOpen });

  const entranceTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const isHomePage = location.pathname === "/";

  // Layout Sync & Scroll Detection
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

    const setScrollState = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      setIsAtTop(scrollY < 100);

      const header = document.querySelector("header");
      const headerHeight = header ? header.getBoundingClientRect().height : 0;
      setIsPastHero(scrollY > headerHeight);
    };

    setScrollState();
    window.addEventListener("scroll", setScrollState);
    window.addEventListener("resize", updateHeaderDimensions);
    window.addEventListener("page-transition-complete", updateHeaderDimensions);

    return () => {
      window.removeEventListener("scroll", setScrollState);
      window.removeEventListener("resize", updateHeaderDimensions);
      window.removeEventListener(
        "page-transition-complete",
        updateHeaderDimensions,
      );
    };
  }, [location.pathname]);

  // Handle scroll-based visibility of burger
  useLayoutEffect(() => {
    const isMobile = window.innerWidth < 768;
    const ctx = gsap.context(() => {
      if (isPastHero || isMobile) {
        gsap.to(burgerRef.current, {
          scale: 1,
          duration: 0.4,
          ease: "back.out(1.7)",
          transformOrigin: "center center",
          pointerEvents: "auto",
          onStart: () => {
            gsap.set(burgerRef.current, { visibility: "visible" });
          },
        });
      } else {
        gsap.to(burgerRef.current, {
          scale: 0,
          duration: 0.4,
          ease: "power2.inOut",
          transformOrigin: "center center",
          pointerEvents: "none",
        });
      }
    });
    return () => ctx.revert();
  }, [isPastHero]);

  // Handle clicks outside menu to close it
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        burgerRef.current &&
        !burgerRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  // Animate burger with content-aware sizing
  useLayoutEffect(() => {
    if (!burgerRef.current) return;
    const el = burgerRef.current;

    let targetWidth = 140;
    let targetHeight = 56;
    let targetRadius = 28;

    if (isMenuOpen && menuContentRef.current) {
      const rect = menuContentRef.current.getBoundingClientRect();
      targetWidth = Math.max(rect.width, 400);
      targetHeight = rect.height;
      targetRadius = 24;
    }

    const tl = gsap.timeline();

    tl.to(el, {
      borderRadius: targetRadius,
      width: targetWidth,
      height: targetHeight,
      duration: 0.6,
      ease: "expo.inOut",
      force3D: true,
    });

    if (menuContentRef.current) {
      tl.to(
        menuContentRef.current,
        {
          opacity: isMenuOpen ? 1 : 0,
          pointerEvents: isMenuOpen ? "auto" : "none",
          duration: 0.3,
          ease: "power2.out",
        },
        isMenuOpen ? 0.3 : 0,
      );
    }
  }, [isMenuOpen]);

  // Shaka Shake Animation
  useEffect(() => {
    if (!isMenuOpen || !shakaIconRef.current) return;

    const shakeTween = gsap.to(shakaIconRef.current, {
      keyframes: [
        { rotation: -14, duration: 0.08 },
        { rotation: 14, duration: 0.08 },
        { rotation: -10, duration: 0.07 },
        { rotation: 10, duration: 0.07 },
        { rotation: 0, duration: 0.1 },
      ],
      transformOrigin: "50% 60%",
      repeat: -1,
      repeatDelay: 3.6,
    });

    return () => {
      shakeTween.kill();
    };
  }, [isMenuOpen]);

  // Header entrance animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!nameRef.current || !navLinksRef.current) {
        return;
      }

      const nameSpans = nameRef.current.querySelectorAll("span.uppercase");
      const splits = Array.from(nameSpans).map(
        (span) => new SplitType(span as HTMLElement, { types: "lines" }),
      );

      const lines = splits.flatMap((s) => s.lines);

      gsap.set(lines, { yPercent: 100 });
      gsap.set(navLinksRef.current, {
        autoAlpha: 0,
        y: 20,
      });
      gsap.set(nameRef.current, { autoAlpha: 1 });

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power2.out" },
        onComplete: () => {
          window.dispatchEvent(new CustomEvent("header-entrance-complete"));
        },
      });

      tl.to(
        lines,
        {
          yPercent: 0,
          duration: 0.15,
          stagger: 0.02,
          ease: "power4.out",
        },
        0,
      ).to(
        navLinksRef.current,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.15,
          stagger: 0.02,
          ease: "power2.out",
        },
        0,
      );

      entranceTimelineRef.current = tl;

      const playEntrance = () => {
        const entranceTimeline = entranceTimelineRef.current;
        if (!entranceTimeline) return;
        if (entranceTimeline.progress() === 0) {
          entranceTimeline.play();
          return;
        }
        window.dispatchEvent(new CustomEvent("header-entrance-complete"));
      };

      window.addEventListener("initial-loader-complete", playEntrance);
      window.addEventListener("page-transition-complete", playEntrance);

      const isInitialLoaderDone =
        sessionStorage.getItem("hasSeenInitialLoader") === "true";
      const isLoaderActive = !!document.querySelector(".initial-loader-wrap");
      const isNavigating = sessionStorage.getItem("isNavigating") === "true";

      if (isInitialLoaderDone && !isLoaderActive && !isNavigating) {
        playEntrance();
      }

      const safetyTimeout = setTimeout(
        playEntrance,
        isLoaderActive ? 8000 : 250,
      );

      return () => {
        window.removeEventListener("initial-loader-complete", playEntrance);
        window.removeEventListener("page-transition-complete", playEntrance);
        clearTimeout(safetyTimeout);
        splits.forEach((s) => s.revert());
      };
    });

    return () => ctx.revert();
  }, []);

  const handleLogoClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!isHomePage) {
      navigate("/");
    } else {
      scrollTo(0, 0, 0, true);
    }
  };

  const handleLinkClick = (
    e: React.MouseEvent<HTMLElement> | null,
    to: string,
    section?: string,
  ) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (section) {
      if (isHomePage) {
        scrollTo(section, 0, -120, true);
      } else {
        sessionStorage.setItem("targetSection", section);
        navigate("/");
      }
      return;
    }

    // Scroll to top if clicking Home while already on HomePage but scrolled down
    if (to === "/" && isHomePage && !isAtTop) {
      scrollTo(0, 0, 0, true);
      return;
    }

    if (location.pathname !== to) {
      navigate(to);
      triggerPageTransition();
    }
  };

  const menuItems = [
    { label: "Home", to: "/", section: undefined },
    { label: "About", to: "/about", section: undefined },
    { label: "Works", to: "/#projects", section: "#projects" },
  ];

  const isMenuItemActive = (item: (typeof menuItems)[number]) => {
    if (item.section === "#projects") return isHomePage && isInProjectsSection;
    if (!item.section && item.to === "/") {
      return isHomePage && !isInProjectsSection && isAtTop;
    }
    return location.pathname === item.to && !location.hash;
  };

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-[220] pointer-events-none py-6 md:py-10 px-4 md:px-10 lg:px-4 xl:px-6 h-28 min-h-28 flex items-center">
        <div className="flex items-start justify-between w-full relative">
          <Link
            ref={nameRef}
            to="/"
            onClick={handleLogoClick}
            className="pointer-events-auto flex flex-col items-start shrink-0 text-[var(--foreground)] pt-1 opacity-0"
          >
            <span className="flex flex-row gap-2 text-base md:text-xl lg:text-2xl mt-1 font-medium tracking-tight leading-none overflow-hidden">
              <span className="inline-block">
                <span className="italic">A</span>lexander
              </span>
              <span className="inline-block">
                <span className="italic">F</span>risdahl
              </span>
            </span>
          </Link>

          <div className="pointer-events-auto flex items-center gap-6 md:gap-8 shrink-0 relative min-h-[44px] md:min-h-[56px] justify-end">
            <nav
              ref={navLinksRef}
              className="hidden md:flex items-center gap-6 lg:gap-8 text-xl"
            >
              {menuItems.map((item) => (
                <AnimatedNavLink
                  key={item.label}
                  label={item.label}
                  to={item.to}
                  isActive={isMenuItemActive(item)}
                  onClick={(e) => handleLinkClick(e, item.to, item.section)}
                />
              ))}
            </nav>
            <CtaButton
              fontSize="text-xl"
              text="Let's talk"
              to="/contact"
              className="hidden md:flex"
            />
          </div>
        </div>
      </header>

      <div className="fixed top-0 right-0 z-[999] pointer-events-none py-6 md:py-10 px-4 md:px-10 lg:px-4 xl:px-6 h-28 flex items-center justify-end overflow-visible">
        <button
          ref={burgerRef}
          aria-label="Menu"
          className="pointer-events-auto shadow-lg fixed top-8 right-8 z-[1001] flex items-start justify-start overflow-hidden cursor-pointer"
          style={{
            visibility: "hidden",
            boxShadow: "0 8px 32px 0 rgba(0,0,0,0.25)",
            backgroundColor: "var(--menu-bg)",
            opacity: 1,
          }}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {/* Static Header Area for Menu/Close Text */}
          <div className="absolute top-0 right-0 w-[140px] h-[56px] flex items-center justify-center gap-4 z-[1002] pointer-events-none text-[var(--menu-text)]">
            <span className="text-xs font-aeonik font-bold uppercase tracking-[0.2em] pt-0.5">
              {isMenuOpen ? "Close" : "Menu"}
            </span>
            <div className="flex gap-1.5 items-center">
              <div
                className={`w-1.5 h-1.5 rounded-full bg-current transition-all duration-300 ${isMenuOpen ? "scale-125" : ""}`}
              />
              <div
                className={`w-1.5 h-1.5 rounded-full bg-current transition-all duration-300 ${isMenuOpen ? "scale-125 opacity-50" : ""}`}
              />
            </div>
          </div>

          {/* Measuring Content Container */}
          <div
            ref={menuContentRef}
            className="flex flex-col pt-12 px-10 pb-10 opacity-0 pointer-events-none"
          >
            {/* Greeting Section */}
            <div className="flex items-center gap-6 mb-12 mt-8 px-2">
              <div className="flex items-center justify-center text-5xl leading-none rotate-[15deg]">
                <span ref={shakaIconRef} className="leading-none">
                  🤙🏼
                </span>
              </div>
              <div className="flex flex-col text-left justify-center">
                <p className="text-[var(--menu-text)] text-lg font-cabinet font-medium leading-tight">
                  Nice to see you!
                </p>
                <p className="text-[var(--menu-text)] opacity-40 text-sm font-aeonik max-w-[200px] leading-tight">
                  I'm Alex, Full-stack Developer based in Copenhagen.
                </p>
              </div>
            </div>

            {/* Menu Links - FULL WIDTH CLICKABLE ROWS */}
            <nav className="flex flex-col gap-2 items-start w-full min-w-[320px]">
              {menuItems.map((item, index) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between w-full group/menu-item gap-12 cursor-pointer py-3 px-2 rounded-xl transition-colors"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={(e) => {
                    setIsMenuOpen(false);
                    handleLinkClick(e, item.to, item.section);
                  }}
                >
                  <AnimatedNavLink
                    label={item.label}
                    to={item.to}
                    isActive={isMenuItemActive(item)}
                    className="text-5xl font-cabinet font-medium pointer-events-none"
                    textColor="var(--menu-text)"
                    externalHover={hoveredIndex === index}
                  />
                  <div
                    className={`transition-transform duration-500 ${hoveredIndex === index ? "rotate-90" : ""}`}
                  >
                    <PlusIcon
                      className={`w-6 h-6 text-[var(--menu-text)] transition-opacity duration-300 ${hoveredIndex === index ? "opacity-100" : "opacity-30"}`}
                    />
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </button>
      </div>
    </>
  );
};

export default Header;
