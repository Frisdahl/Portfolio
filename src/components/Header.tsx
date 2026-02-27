import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { scrollTo } from "../utils/smoothScroll";
import { triggerPageTransition } from "../utils/pageTransition";

gsap.registerPlugin(ScrollToPlugin);

import BurgerMenuButton from "./BurgerMenuButton";

interface HeaderProps {
  isInverted: boolean;
  isDark?: boolean;
  isMobileMenuOpen: boolean;
  toggleMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isInverted,
  isDark,
  isMobileMenuOpen,
  toggleMenu,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Start transition and wait for screen to be covered
    await triggerPageTransition();

    if (location.pathname === "/") {
      scrollTo(0, 0); // Jump to top immediately while screen is covered
    } else {
      navigate("/");
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 flex justify-between items-center py-4 md:py-10 px-4 md:px-8 transition-all duration-500 pointer-events-none z-[220]`}
    >
      {/* Mobile Glassmorph Container - visible only after scroll */}
      <div className={`absolute inset-x-4 top-4 bottom-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] md:hidden pointer-events-auto transition-all duration-500 ${
        isScrolled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
      }`} />

      <div className="z-50 pointer-events-auto flex items-center px-6 md:px-0 h-16 md:h-auto">
        <Link to="/" onClick={handleLogoClick}>
          <img
            src="/images/Portfolio-logo.svg"
            alt="Portfolio Logo"
            className={`h-10 md:h-12 transition-all duration-500 ${
              isInverted && !isDark && !isMobileMenuOpen ? "filter invert" : ""
            }`}
          />
        </Link>
      </div>

      <div className="flex items-center pointer-events-auto px-6 md:px-0 h-16 md:h-auto">
        <BurgerMenuButton
          isOpen={isMobileMenuOpen}
          toggleMenu={toggleMenu}
          isInverted={isInverted}
          isDark={isDark}
          isInsideHeader={true}
        />
      </div>
    </header>
  );
};

export default Header;
