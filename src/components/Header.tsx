import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { scrollTo } from "../utils/smoothScroll";
import { triggerPageTransition } from "../utils/pageTransition";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import ArrowIcon from "./ArrowIcon";
import PlusIcon from "../assets/icons/PlusIcon";
import Links from "./Links";
import AnimatedNavLink from "./AnimatedNavLink";
import { useMagnetic } from "../utils/animations/useMagnetic";

gsap.registerPlugin(ScrollTrigger);

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPastHero, setIsPastHero] = useState(false);
  const [isInProjectsSection, setIsInProjectsSection] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Icon always top-right now; no state needed

  const talkButtonRef = useRef<HTMLButtonElement>(null);
  const navLinksRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLAnchorElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  // Only apply magnetic effect when menu is closed
  useMagnetic(talkButtonRef, { strength: 30, enabled: !isMenuOpen });
  useMagnetic(nameRef, { strength: 20, enabled: !isMenuOpen });
  useMagnetic(burgerRef, { strength: 30, enabled: !isMenuOpen });

  const entranceTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const logoReplayTimeoutRef = useRef<number | null>(null);
  const lastLogoReplayAtRef = useRef(0);

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

    const setBurgerState = () => {
      const header = document.querySelector("header");
      const headerHeight = header ? header.getBoundingClientRect().height : 0;
      const scrollY = window.scrollY || window.pageYOffset;
      setIsPastHero(scrollY > headerHeight);
    };

    // Set initial state on mount
    setBurgerState();

    // Listen to scroll events
    window.addEventListener("scroll", setBurgerState);
    window.addEventListener("resize", updateHeaderDimensions);
    window.addEventListener("page-transition-complete", updateHeaderDimensions);

    return () => {
      window.removeEventListener("scroll", setBurgerState);
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
          autoAlpha: 1,
          scale: 1,
          duration: 0.4,
          ease: "back.out(1.7)",
          transformOrigin: "center center",
          pointerEvents: "auto",
        });
      } else {
        gsap.to(burgerRef.current, {
          autoAlpha: 0,
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

  // Animate burger to square and icon to X when menu is open
  // Only animate width/height, keep borderRadius always rounded square
  useLayoutEffect(() => {
    if (!burgerRef.current) return;
    const el = burgerRef.current;
    gsap.to(el, {
      borderRadius: "18px",
      width: isMenuOpen ? 320 : 56,
      height: isMenuOpen ? 320 : 56,
      backgroundColor: "#1b1b1a",
      duration: 0.4,
      ease: "linear",
    });
  }, [isMenuOpen]);

  // Header entrance animation (name + nav links + talk button)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!nameRef.current || !talkButtonRef.current || !navLinksRef.current) {
        return;
      }

      // 1. Setup SplitType for the name
      const nameSpans = nameRef.current.querySelectorAll("span.uppercase");
      const splits = Array.from(nameSpans).map(
        (span) => new SplitType(span as HTMLElement, { types: "lines" }),
      );

      const lines = splits.flatMap((s) => s.lines);

      // 2. Initial State
      gsap.set(lines, { yPercent: 100 });
      gsap.set([talkButtonRef.current, navLinksRef.current], {
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
        [talkButtonRef.current, navLinksRef.current],
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

  useEffect(() => {
    if (!isHomePage) {
      setIsInProjectsSection(false);
      return;
    }

    let sectionObserver: IntersectionObserver | null = null;
    let domObserver: MutationObserver | null = null;

    const disconnectSectionObserver = () => {
      if (sectionObserver) {
        sectionObserver.disconnect();
        sectionObserver = null;
      }
    };

    const observeProjectsSection = () => {
      const projectsSection = document.getElementById("projects");
      if (!projectsSection) return false;

      disconnectSectionObserver();

      const headerElement = document.querySelector("header");
      const headerHeight = headerElement?.getBoundingClientRect().height ?? 0;
      const topOffset = Math.round(headerHeight + 8);

      sectionObserver = new IntersectionObserver(
        ([entry]) => {
          setIsInProjectsSection(entry.isIntersecting);
        },
        {
          root: null,
          threshold: 0,
          rootMargin: `-${topOffset}px 0px -55% 0px`,
        },
      );

      sectionObserver.observe(projectsSection);
      return true;
    };

    if (!observeProjectsSection()) {
      domObserver = new MutationObserver(() => {
        if (observeProjectsSection()) {
          domObserver?.disconnect();
          domObserver = null;
        }
      });

      domObserver.observe(document.body, { childList: true, subtree: true });
    }

    const handleResize = () => {
      observeProjectsSection();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      disconnectSectionObserver();
      domObserver?.disconnect();
    };
  }, [isHomePage, location.pathname]);

  const handleLogoClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    sessionStorage.removeItem("targetSection");

    if (!isHomePage) {
      sessionStorage.setItem("forceHomeEntrance", "true");
      sessionStorage.removeItem("isNavigating");
      navigate("/");
    } else {
      if (window.location.hash) {
        window.history.replaceState(null, "", location.pathname);
      }

      if (logoReplayTimeoutRef.current) {
        window.clearTimeout(logoReplayTimeoutRef.current);
        logoReplayTimeoutRef.current = null;
      }

      const shouldReplayEntrance = window.scrollY > 64;
      scrollTo(0, 0, 0, true);

      if (shouldReplayEntrance) {
        logoReplayTimeoutRef.current = window.setTimeout(() => {
          const now = Date.now();
          if (now - lastLogoReplayAtRef.current < 900) {
            return;
          }
          lastLogoReplayAtRef.current = now;
          window.dispatchEvent(new CustomEvent("replay-hero-entrance"));
          logoReplayTimeoutRef.current = null;
        }, 16);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (logoReplayTimeoutRef.current) {
        window.clearTimeout(logoReplayTimeoutRef.current);
      }
    };
  }, []);

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
      // #region agent log
      fetch(
        "http://127.0.0.1:7485/ingest/c3600584-6a50-43cc-836a-dd52b7cba410",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "da1222",
          },
          body: JSON.stringify({
            sessionId: "da1222",
            location: "Header.tsx:handleLinkClick(section)",
            message: "Projects/section link clicked",
            data: { isHomePage, section, pathname: location.pathname },
            timestamp: Date.now(),
            hypothesisId: "H-B",
          }),
        },
      ).catch(() => {});
      // #endregion
      if (isHomePage) {
        const headerElement = document.querySelector("header");
        const navRow = headerElement?.querySelector("div");
        const headerHeight = navRow
          ? navRow.getBoundingClientRect().height
          : (headerElement?.getBoundingClientRect().height ?? 0);

        const isMobile = window.innerWidth < 768;
        const topPadding = isMobile ? 24 : 40;
        const topOffset = -(headerHeight + topPadding + 8);

        if (window.location.hash) {
          window.history.replaceState(null, "", location.pathname);
        }

        sessionStorage.setItem("pendingSectionScroll", "true");
        sessionStorage.removeItem("targetSection");
        scrollTo(section, 0, topOffset, true);
      } else {
        sessionStorage.setItem("pendingSectionScroll", "true");
        sessionStorage.setItem("targetSection", section);
        document.documentElement.classList.add("scroll-to-section-pending");
        navigate("/");
      }
      return;
    }

    sessionStorage.removeItem("targetSection");
    sessionStorage.removeItem("pendingSectionScroll");

    if (location.pathname !== to) {
      sessionStorage.setItem("isNavigating", "true");
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
    const isProjectsItem = item.section === "#projects";
    const isHomeItem = !item.section && item.to === "/";

    if (isProjectsItem) {
      return isHomePage && isInProjectsSection;
    }

    if (isHomeItem) {
      return isHomePage && !isInProjectsSection;
    }

    return location.pathname === item.to && !location.hash;
  };

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-[220] pointer-events-none py-6 md:py-10 px-4 md:px-10 lg:px-4 xl:px-6 h-28 min-h-28 flex items-center">
        <div className="flex items-start justify-between w-full relative">
          {/* Logo Replacement: Stylized Name */}
          <Link
            ref={nameRef}
            to="/"
            onClick={handleLogoClick}
            className="pointer-events-auto flex flex-col items-start shrink-0 text-[var(--foreground)] pt-1 opacity-0"
          >
            <span className=" text-base md:text-xl lg:text-2xl mt-1 font-medium tracking-tight leading-none overflow-hidden inline-block">
              <span className="italic">A</span>lexander
            </span>
            <span className=" text-base md:text-xl lg:text-2xl mt-1 font-medium tracking-tight leading-none overflow-hidden inline-block">
              <span className="italic">F</span>risdahl
            </span>
          </Link>

          {/* Nav: links (split-char hover) + Let's talk */}
          <div className="pointer-events-auto flex items-center gap-6 md:gap-8 shrink-0 relative min-h-[44px] md:min-h-[56px] justify-end">
            <nav
              ref={navLinksRef}
              className="hidden md:flex items-center gap-6 lg:gap-8"
            >
              {menuItems.map((item) => {
                const isActive = isMenuItemActive(item);
                return (
                  <AnimatedNavLink
                    key={item.label}
                    label={item.label}
                    to={item.to}
                    isActive={isActive}
                    onClick={(e) => handleLinkClick(e, item.to, item.section)}
                  />
                );
              })}
            </nav>
            <button
              ref={talkButtonRef}
              onClick={(e) => handleLinkClick(e, "/contact")}
              className="group/talk hidden md:flex gap-x-4 py-2 px-8 rounded-full bg-[#E35239] text-[#1b1b1a] text-md md:text-2xl font-cabinet font-medium tracking-tight transition-[opacity,background-color] duration-500 hover:opacity-90 cursor-pointer items-center justify-center overflow-hidden relative"
            >
              <span className="whitespace-nowrap font-cabinet transition-transform duration-500 group-hover/talk:translate-x-4 font-medium">
                Let's talk
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#1b1b1a] animate-pulse transition-all duration-300 group-hover/talk:opacity-0 group-hover/talk:scale-0" />
              <div className="absolute left-5 top-1/2 -translate-y-1/2 -translate-x-10 opacity-0 transition-all duration-500 group-hover/talk:translate-x-0 group-hover/talk:opacity-100">
                <ArrowIcon className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Burger Button - fixed size, always top-right, expanding overlay for menu */}
      <div className="fixed top-0 right-0 z-[999] pointer-events-none py-6 md:py-10 px-4 md:px-10 lg:px-4 xl:px-6 h-28 flex items-center justify-end overflow-visible">
        {/* Expanding Burger/Menu Button - single button, always top-right, icon always stays in same spot */}
        <button
          ref={burgerRef}
          aria-label="Menu"
          className="pointer-events-auto bg-[#1b1b1a] shadow-lg fixed top-8 right-8 z-[1001] flex items-center justify-center overflow-hidden transition-all duration-400 rounded-[18px]"
          style={{
            visibility: "hidden",
            minWidth: isMenuOpen ? 700 : 56,
            minHeight: isMenuOpen ? 500 : 56,
            width: isMenuOpen ? "auto" : 56,
            height: isMenuOpen ? "auto" : 56,
            transition:
              "min-width 0.4s linear, min-height 0.4s linear, width 0.4s linear, height 0.4s linear",
            boxShadow: "0 8px 32px 0 rgba(0,0,0,0.25)",
          }}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {/* Burger/X icon - always stays in same spot (top-right) */}
          <div
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              width: 28,
              height: 28,
              zIndex: 1002,
              pointerEvents: "none",
            }}
          >
            <div
              className={`relative w-7 h-7 flex flex-col items-center justify-center`}
            >
              <div
                className={`w-7 h-[2.5px] bg-[#fefffe] rounded transition-all duration-300 ${isMenuOpen ? "rotate-45 absolute top-1/2 left-0" : ""}`}
                style={{
                  transition: "all 0.3s",
                  marginBottom: isMenuOpen ? 0 : 1,
                }}
              />
              <div
                className={`w-7 h-[2.5px] bg-[#fefffe] rounded transition-all duration-300 ${isMenuOpen ? "-rotate-45 absolute top-1/2 left-0" : ""}`}
                style={{
                  transition: "all 0.3s",
                  marginTop: isMenuOpen ? 0 : 6,
                }}
              />
            </div>
          </div>
          {/* Menu links - only show when open */}
          {isMenuOpen && (
            <div
              className="flex flex-row h-full w-full pt-20 pl-10 pr-6 pb-10 absolute inset-0 z-[1100]"
              style={{ minWidth: 700, minHeight: 500 }}
            >
              {/* Menu items left */}
              <nav className="flex flex-col gap-10 justify-start items-start w-2/3">
                <Links
                  links={menuItems.map((item) => ({
                    label: item.label,
                    href: item.to,
                    onClick: () => setIsMenuOpen(false),
                  }))}
                  className="flex flex-col gap-10 justify-start items-start"
                  linkClassName="text-5xl text-[#fefffe] font-cabinet font-bold hover:underline text-left flex items-center group"
                  textColor="text-[#fefffe]"
                />
              </nav>
              {/* Glassobj video right */}
              <div className="flex items-center justify-end w-1/3 h-full">
                <div className="aspect-square w-full max-w-[400px] flex items-center justify-center">
                  <video
                    src="/glassobj.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover rounded-2xl shadow-xl"
                    style={{
                      aspectRatio: "1 / 1",
                      maxWidth: "100%",
                      maxHeight: "100%",
                    }}
                    poster="/images/projectVideos/glassobj-poster.jpg"
                    controls
                  />
                </div>
              </div>
            </div>
          )}
        </button>
      </div>
    </>
  );
};

export default Header;
