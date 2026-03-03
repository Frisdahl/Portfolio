import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { scrollTo } from "../utils/smoothScroll";
import { triggerPageTransition } from "../utils/pageTransition";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import ArrowIcon from "./ArrowIcon";

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPastHero, setIsPastHero] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInProjectsSection, setIsInProjectsSection] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const talkButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navButtonsRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLAnchorElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const entranceTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const activeDotRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const previousActiveItemRef = useRef<string | null>(null);

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

      // 1. Setup SplitType for the name
      const nameSpans = nameRef.current.querySelectorAll("span.uppercase");
      const splits = Array.from(nameSpans).map(
        (span) => new SplitType(span as HTMLElement, { types: "lines" }),
      );

      const lines = splits.flatMap((s) => s.lines);

      // 2. Initial State
      gsap.set(lines, { yPercent: 100 });
      gsap.set([talkButtonRef.current, menuButtonRef.current], {
        autoAlpha: 0,
        y: 20,
      });
      // Show the main container but the text is hidden by yPercent + overflow
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
          duration: 0.65,
          stagger: 0.06,
          ease: "power4.out",
        },
        0,
      ).to(
        [talkButtonRef.current, menuButtonRef.current],
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
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
        splits.forEach((s) => s.revert());
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
    sessionStorage.removeItem("targetSection");

    if (!isHomePage) {
      sessionStorage.setItem("forceHomeEntrance", "true");
      sessionStorage.removeItem("isNavigating");
      navigate("/");
    } else {
      scrollTo(0, 0, 0, true);
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
      const sectionRoute = to || `/${section}`;

      if (!isHomePage) {
        sessionStorage.setItem("targetSection", section);
        navigate(sectionRoute);
      } else {
        sessionStorage.setItem("targetSection", section);
        navigate(sectionRoute);
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
    { label: "Projects", to: "/#projects", section: "#projects" },
    { label: "Contact", to: "/contact", section: undefined },
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

  const activeItemKey =
    menuItems.find((item) => isMenuItemActive(item))?.label ?? null;

  useLayoutEffect(() => {
    const dots = menuItems
      .map((item) => activeDotRefs.current[item.label])
      .filter((dot): dot is HTMLDivElement => Boolean(dot));

    if (!dots.length) return;

    gsap.set(dots, { transformOrigin: "center center" });

    if (!activeItemKey) {
      gsap.set(dots, { scale: 0 });
      previousActiveItemRef.current = null;
      return;
    }

    const nextDot = activeDotRefs.current[activeItemKey];
    if (!nextDot) return;

    const previousKey = previousActiveItemRef.current;
    if (!previousKey || previousKey === activeItemKey) {
      dots.forEach((dot) => {
        const isCurrent = dot === nextDot;
        gsap.set(dot, { scale: isCurrent ? 1 : 0 });
      });

      previousActiveItemRef.current = activeItemKey;
      return;
    }

    const previousDot = activeDotRefs.current[previousKey];
    const timeline = gsap.timeline();

    dots.forEach((dot) => {
      if (dot !== previousDot && dot !== nextDot) {
        gsap.set(dot, { scale: 0 });
      }
    });

    if (previousDot) {
      timeline.to(previousDot, {
        scale: 0,
        duration: 0.12,
        ease: "power2.in",
      });
    }

    timeline.set(nextDot, { scale: 0 }).to(nextDot, {
      scale: 1,
      duration: 0.18,
      ease: "back.out(2)",
    });

    previousActiveItemRef.current = activeItemKey;

    return () => {
      timeline.kill();
    };
  }, [activeItemKey, isMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-[220] pointer-events-none py-6 md:py-10 px-4 md:px-10 lg:px-4 xl:px-6">
      <div className="flex items-start justify-between w-full relative">
        {/* Logo Replacement: Stylized Name */}
        <Link
          ref={nameRef}
          to="/"
          onClick={handleLogoClick}
          className="pointer-events-auto flex flex-col items-start shrink-0 text-[#1c1d1e] pt-1 opacity-0"
        >
          <span className="text-base md:text-xl lg:text-2xl uppercase font-medium tracking-tight leading-none overflow-hidden inline-block">
            <span className="italic">A</span>lexander
          </span>
          <span className=" text-base md:text-xl lg:text-2xl uppercase mt-1 font-medium tracking-tight leading-none overflow-hidden inline-block">
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
              className="group/talk hidden md:flex h-10 sm:h-12 px-10 rounded-full bg-[#1c1d1e] text-[#fefffe] text-lg sm:text-xl uppercase font-medium tracking-tight transition-all duration-500 hover:opacity-90 cursor-pointer items-center justify-center overflow-hidden relative min-w-[160px] opacity-0"
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
              className={`group/menu h-10 sm:h-12 px-6 md:px-10 min-w-[140px] md:min-w-[160px] rounded-full text-base md:text-xl uppercase font-medium tracking-tight transition-all duration-500 hover:brightness-110 cursor-pointer flex items-center justify-between gap-3 md:gap-4 overflow-hidden opacity-0 ${
                isMenuOpen
                  ? "bg-[#fefeff]"
                  : isPastHero
                    ? "bg-white/30 backdrop-blur-2xl"
                    : "bg-[#f1efed]"
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
            className="pointer-events-auto absolute top-full right-0 mt-2 w-full min-w-[320px] bg-[#fefeff] rounded-[1.5rem] overflow-hidden flex flex-col p-3 invisible opacity-0"
          >
            {menuItems.map((item) => {
              const isActive = isMenuItemActive(item);

              return (
                <a
                  key={item.label}
                  href={item.to}
                  onClick={(e) => handleLinkClick(e, item.to, item.section)}
                  className={`menu-item-anim group/item flex items-center justify-between px-8 py-5 rounded-full transition-colors duration-300 text-[#1c1d1e] uppercase font-medium text-lg md:text-2xl tracking-tight overflow-hidden ${
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

                  <div className="relative flex items-center justify-center w-6 h-6">
                    <div
                      ref={(el) => {
                        activeDotRefs.current[item.label] = el;
                      }}
                      className="absolute w-2 h-2 rounded-full bg-[#1c1d1e] scale-0"
                    />
                    <div
                      className={`absolute opacity-0 -translate-x-4 transition-all duration-300 ${
                        isActive
                          ? ""
                          : "group-hover/item:opacity-100 group-hover/item:translate-x-0"
                      }`}
                    >
                      <ArrowIcon className="w-5 h-5" />
                    </div>
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
