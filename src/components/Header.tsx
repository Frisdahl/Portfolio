import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { scrollTo } from "../utils/smoothScroll";
import { triggerPageTransition } from "../utils/pageTransition";

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const navRef = React.useRef<HTMLElement>(null);

  React.useLayoutEffect(() => {
    const updateNavWidth = () => {
      if (navRef.current) {
        const width = navRef.current.offsetWidth;
        document.documentElement.style.setProperty("--nav-width", `${width}px`);
      }
    };

    updateNavWidth();
    window.addEventListener("resize", updateNavWidth);

    // Also update after transition
    window.addEventListener("page-transition-complete", updateNavWidth);

    return () => {
      window.removeEventListener("resize", updateNavWidth);
      window.removeEventListener("page-transition-complete", updateNavWidth);
    };
  }, []);

  const handleLogoClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    await triggerPageTransition();

    if (location.pathname === "/") {
      scrollTo(0, 0);
    } else {
      navigate("/");
    }
  };

  const navLinks = [
    { label: "Works", to: "/", section: "#projects" },
    { label: "Services", to: "/", section: "#services" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  const handleLinkClick = async (
    e: React.MouseEvent,
    to: string,
    section?: string,
  ) => {
    e.preventDefault();

    if (section) {
      if (location.pathname !== "/") {
        await triggerPageTransition();
        navigate("/");
        setTimeout(() => scrollTo(section, 0, 0, true), 100);
      } else {
        scrollTo(section, 0, 0, true);
      }
      return;
    }

    if (location.pathname !== to) {
      await triggerPageTransition();
      navigate(to);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[220] pointer-events-none px-0 sm:px-8 flex items-center py-0 sm:py-8">
      <nav
        ref={navRef}
        className="pointer-events-auto flex items-center bg-[#fefffe]/70 backdrop-blur-lg border-b sm:border border-[#1c1d1e]/10 px-6 sm:pl-2 sm:pr-3 py-4 sm:py-2 w-full sm:w-auto sm:rounded-lg shadow-sm transition-all duration-500"
      >
        <Link
          to="/"
          onClick={handleLogoClick}
          className="flex items-center mr-5 shrink-0"
        >
          <div className="bg-[#1d1d1f] w-10 h-10 sm:w-12 sm:h-12 md:w-15 md:h-15 flex items-center justify-center rounded-lg transition-all duration-300">
            <img
              src="/images/Logo-white.svg"
              alt="Portfolio Logo"
              className="h-5 sm:h-6 md:h-8"
            />
          </div>
        </Link>

        <ul className="flex items-center justify-between flex-grow sm:flex-none ml-4 sm:ml-0 gap-4 sm:gap-6">
          {navLinks.map((link, index) => (
            <li key={link.label} className="shrink-0">
              <a
                href={link.to}
                onClick={(e) => handleLinkClick(e, link.to, link.section)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`text-[11px] sm:text-xs md:text-[13px] uppercase font-bold tracking-normal transition-all duration-1000 ease-in-out text-[#1c1d1e] inline-block ${
                  hoveredIndex !== null && hoveredIndex !== index
                    ? "blur-[2px] opacity-50 scale-[0.99]"
                    : "opacity-100 scale-100"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
