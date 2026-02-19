import React from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { scrollTo } from "../utils/smoothScroll";

gsap.registerPlugin(ScrollToPlugin);

interface HeaderProps {
  isInverted: boolean;
}

const Header: React.FC<HeaderProps> = ({ isInverted }) => {
  const location = useLocation();

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === "/") {
      e.preventDefault();
      scrollTo(0, 3);
    }
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-between items-center py-6 px-8 rounded-full transition-colors duration-300 bg-transparent pointer-events-none">
      <div className="z-50 pointer-events-auto">
        <Link to="/" onClick={handleLogoClick}>
          <img
            src="/images/Portfolio-logo.svg"
            alt="Portfolio Logo"
            className={`h-12 transition-all duration-500 ${isInverted ? "filter invert" : ""}`}
          />
        </Link>
      </div>

      <div className="flex items-center gap-8">
        {/* Navigation links moved to burger menu */}
      </div>
    </header>
  );
};

export default Header;
