import React, { useRef, useLayoutEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AnimatedButton from "./AnimatedButton";
import { scrollTo } from "../utils/smoothScroll";
import Links from "./Links";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { triggerPageTransition } from "./PageTransition";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedMenuLinkProps {
  to: string;
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  delay: number;
  isOpen: boolean;
}

const AnimatedMenuLink: React.FC<AnimatedMenuLinkProps> = ({
  to,
  children,
  onClick,
  delay,
  isOpen,
}) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (!linkRef.current || !circleRef.current || !textRef.current) return;

    const link = linkRef.current;
    const circle = circleRef.current;
    const text = textRef.current;

    // Set initial scale to 0 for center expansion
    gsap.set(circle, { scale: 0 });

    const handleMouseEnter = () => {
      gsap.to(circle, {
        scale: 1,
        opacity: 1,
        duration: 1.0,
        ease: "power4.out",
      });
      gsap.to(text, {
        x: 20,
        duration: 1.0,
        ease: "power4.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(circle, {
        scale: 0,
        opacity: 0,
        duration: 1.0,
        ease: "power4.out",
      });
      gsap.to(text, {
        x: 0,
        duration: 1.0,
        ease: "power4.out",
      });
    };

    link.addEventListener("mouseenter", handleMouseEnter);
    link.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      link.removeEventListener("mouseenter", handleMouseEnter);
      link.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <Link
      ref={linkRef}
      to={to}
      className={`w-fit relative inline-block transition-all duration-500 ease-out ${
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ transitionDelay: isOpen ? `${delay}ms` : "0ms" }}
      onClick={onClick}
    >
      <div
        ref={circleRef}
        className="absolute top-[55%] -translate-y-1/2 left-0 w-[10px] h-[10px] rounded-full bg-[#0a0a0a] opacity-0 flex-shrink-0"
      />
      <span
        ref={textRef}
        className="inline-block tracking-wider text-2xl sm:text-4xl"
      >
        {children}
      </span>
    </Link>
  );
};

const MobileMenuOverlay: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLinkClick = async (
    e: React.MouseEvent,
    to: string,
    targetSection?: string,
  ) => {
    e.preventDefault();
    onClose();

    // Start transition
    await triggerPageTransition();

    if (targetSection) {
      if (location.pathname !== "/") {
        navigate("/");
        // Small delay to let navigation happen then scroll
        setTimeout(() => {
          scrollTo(targetSection, 0);
          // Force ScrollTrigger to recognize the jump
          setTimeout(() => {
            ScrollTrigger.refresh();
            ScrollTrigger.update();
          }, 50);
        }, 150);
      } else {
        scrollTo(targetSection, 0);
        // Force ScrollTrigger to recognize the jump
        setTimeout(() => {
          ScrollTrigger.refresh();
          ScrollTrigger.update();
        }, 50);
      }
    } else {
      navigate(to);
    }
  };

  const handleGetInTouchClick = async () => {
    onClose();
    await triggerPageTransition();
    scrollTo("#contact", 0);
    // Force ScrollTrigger to recognize the jump
    setTimeout(() => {
      ScrollTrigger.refresh();
      ScrollTrigger.update();
    }, 50);
  };

  return (
    // Outermost fixed full-screen container for the overlay
    <div
      className={`fixed inset-0 z-[150] transition-opacity duration-700 ease-in-out ${
        isOpen
          ? "opacity-100 pointer-events-auto bg-[rgba(0,0,0,0.6)]"
          : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose} // Close menu if clicked outside
    >
      {/* The actual menu panel that slides in/out */}
      <div
        className={`fixed top-0 right-0 w-full sm:w-[500px] h-full sm:h-auto sm:max-h-screen bg-[#fff] transform transition-transform duration-700 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-[110%]"
        } overflow-y-auto px-6 sm:px-12 pt-24 sm:pt-16 pb-12 text-left text-[#0a0a0a] shadow-2xl sm:rounded-tl-2xl sm:rounded-bl-2xl sm:rounded-br-2xl`}
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing the menu
      >
        {/* Main Nav */}
        <div className="mb-12 sm:mb-16">
          <h3
            className={`text-[10px] uppercase tracking-[0.2em] text-[#9d9dad] mb-8 sm:mb-12 transition-all duration-500 ease-out ${
              isOpen
                ? "opacity-100 translate-y-0 delay-200"
                : "opacity-0 translate-y-4"
            }`}
          >
            Menu
          </h3>
          <nav className="text-3xl sm:text-4xl text-[#0a0a0a] font-light flex flex-col space-y-4 sm:space-y-6 mb-12 sm:mb-16">
            <AnimatedMenuLink
              to="/"
              onClick={(e) => handleLinkClick(e, "/", "#projects")}
              delay={300}
              isOpen={isOpen}
            >
              Works
            </AnimatedMenuLink>
            <AnimatedMenuLink
              to="/about"
              onClick={(e) => handleLinkClick(e, "/about")}
              delay={400}
              isOpen={isOpen}
            >
              About
            </AnimatedMenuLink>
            <AnimatedMenuLink
              to="/"
              onClick={(e) => handleLinkClick(e, "/", "#contact")}
              delay={500}
              isOpen={isOpen}
            >
              Contact
            </AnimatedMenuLink>
          </nav>
        </div>

        {/* Social / Footer Info */}
        <div className="mt-auto">
          <div
            className={`transition-all duration-700 ease-out border-t border-black/10 pt-8 sm:pt-10 ${
              isOpen
                ? "opacity-100 translate-y-0 delay-700"
                : "opacity-0 translate-y-4"
            }`}
          >
            <Links
              links={[
                { label: "Facebook", href: "#facebook" },
                { label: "LinkedIn", href: "#linkedin" },
                { label: "Instagram", href: "#instagram" },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenuOverlay;
