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
      className={`fixed top-0 left-0 right-0 flex justify-between items-center py-10 px-8 transition-all duration-500 pointer-events-none z-[220]`}
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
