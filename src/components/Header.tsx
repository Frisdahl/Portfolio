import React from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { scrollTo } from "../utils/smoothScroll";

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

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === "/") {
      e.preventDefault();
      scrollTo(0, 3);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 flex justify-between items-center py-10 px-8 transition-all duration-500 pointer-events-none ${
        isMobileMenuOpen ? "z-[220]" : "z-50"
      }`}
    >
      <div className="z-50 pointer-events-auto">
        <Link to="/" onClick={handleLogoClick}>
          <img
            src="/images/Portfolio-logo.svg"
            alt="Portfolio Logo"
            className={`h-12 transition-all duration-500 ${
              isInverted && !isDark ? "filter invert" : ""
            }`}
          />
        </Link>
      </div>

      <div className="flex items-center pointer-events-auto">
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
