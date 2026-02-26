import { useRef, useEffect, FC, forwardRef, MouseEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { scrollTo } from "../utils/smoothScroll";
import Links from "./Links";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { triggerPageTransition } from "./PageTransition";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedMenuLinkProps {
  to: string;
  children: React.ReactNode;
  onClick: (e: MouseEvent) => void;
  isOpen: boolean;
}

const AnimatedMenuLink = forwardRef<HTMLAnchorElement, AnimatedMenuLinkProps>(
  ({ to, children, onClick }, ref) => {
    const circleRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);

    const handleMouseEnter = () => {
      if (circleRef.current && textRef.current) {
        gsap.to(circleRef.current, {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
        });
        gsap.to(textRef.current, {
          x: 20,
          duration: 0.6,
          ease: "power3.out",
        });
      }
    };

    const handleMouseLeave = () => {
      if (circleRef.current && textRef.current) {
        gsap.to(circleRef.current, {
          scale: 0,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
        });
        gsap.to(textRef.current, {
          x: 0,
          duration: 0.6,
          ease: "power3.out",
        });
      }
    };

    return (
      <div className="overflow-hidden py-1">
        <Link
          ref={ref}
          to={to}
          className="w-fit relative inline-flex items-center opacity-0"
          onClick={onClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            ref={circleRef}
            className="absolute left-0 w-[8px] h-[8px] rounded-full bg-[var(--foreground)] opacity-0"
            style={{ transform: "scale(0)" }}
          />
          <span
            ref={textRef}
            className="inline-block tracking-wider text-2xl sm:text-4xl text-[var(--foreground)]"
          >
            {children}
          </span>
        </Link>
      </div>
    );
  },
);

AnimatedMenuLink.displayName = "AnimatedMenuLink";

const MobileMenuOverlay: FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuLabelRef = useRef<HTMLHeadingElement>(null);
  const navLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const footerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    // Initial states for hidden menu
    gsap.set(overlayRef.current, { autoAlpha: 0 });
    gsap.set(panelRef.current, { xPercent: 101, opacity: 0 });
    gsap.set(menuLabelRef.current, { opacity: 0, y: 10 });
    gsap.set(navLinksRef.current, { opacity: 0, y: 80 }); // Increased for better visibility
    gsap.set(footerRef.current, { opacity: 0, y: 10 });
  }, []);

  useEffect(() => {
    if (timelineRef.current) timelineRef.current.kill();

    const tl = gsap.timeline({
      defaults: { ease: "expo.out" },
    });
    timelineRef.current = tl;

    if (isOpen) {
      // Opening animation - using absolute timestamps for precise control
      tl.to(
        overlayRef.current,
        {
          autoAlpha: 1,
          duration: 0.8,
          ease: "power2.inOut",
        },
        0,
      );

      tl.to(
        panelRef.current,
        {
          xPercent: 0,
          opacity: 1,
          duration: 1.2,
          ease: "expo.out",
        },
        0.2,
      );

      tl.to(
        menuLabelRef.current,
        {
          opacity: 0.5,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        0.4,
      );

      // Navigation items slide up with a clearer stagger (top to bottom)
      tl.to(
        navLinksRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          stagger: 0.15, // Increased stagger for more visible sequence
          ease: "power4.out",
        },
        0.5,
      );

      tl.to(
        footerRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        0.8,
      );
    } else {
      // Closing animation
      tl.to([menuLabelRef.current, footerRef.current], {
        opacity: 0,
        y: 10,
        duration: 0.4,
        ease: "power2.in",
      });

      tl.to(
        navLinksRef.current,
        {
          opacity: 0,
          y: 40,
          duration: 0.5,
          stagger: 0.05,
          ease: "power2.in",
        },
        "-=0.3",
      );

      tl.to(
        panelRef.current,
        {
          xPercent: 101,
          opacity: 0,
          duration: 0.8,
          ease: "power3.inOut",
        },
        "-=0.4",
      );

      tl.to(
        overlayRef.current,
        {
          autoAlpha: 0,
          duration: 0.7,
          ease: "power2.inOut",
        },
        "-=0.6",
      );
    }

    return () => {
      tl.kill();
    };
  }, [isOpen]);

  const handleLinkClick = async (
    e: MouseEvent,
    to: string,
    targetSection?: string,
  ) => {
    e.preventDefault();
    onClose();

    // Start transition
    await triggerPageTransition();

    if (targetSection) {
      if (targetSection === "#contact") {
        // Contact is on every page
        scrollTo("#contact", 0);
        setTimeout(() => {
          ScrollTrigger.refresh();
          ScrollTrigger.update();
        }, 50);
        return;
      }

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

  return (
    <div
      ref={overlayRef}
      className="mobile-menu-overlay fixed inset-0 z-[150] bg-[rgba(0,0,0,0.6)] invisible"
      onClick={onClose}
    >
      {/* The actual menu panel */}
      <div
        ref={panelRef}
        className="mobile-menu-panel fixed top-0 right-0 w-full sm:w-[500px] h-full sm:h-auto sm:max-h-screen bg-[var(--background)] overflow-y-auto px-8 pt-24 sm:pt-16 pb-12 text-left text-[var(--foreground)] shadow-2xl sm:rounded-tl-2xl sm:rounded-bl-2xl sm:rounded-br-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main Nav */}
        <div className="mb-12 sm:mb-16">
          <h3
            ref={menuLabelRef}
            className="text-[10px] uppercase tracking-[0.3em] text-[var(--foreground)] font-medium mb-10 opacity-0"
          >
            Menu
          </h3>
          <nav className="text-3xl sm:text-4xl text-[var(--foreground)] font-normal flex flex-col space-y-3 sm:space-y-5 mb-12 sm:mb-16">
            <AnimatedMenuLink
              ref={(el) => (navLinksRef.current[0] = el)}
              to="/"
              onClick={(e) => handleLinkClick(e, "/", "#projects")}
              isOpen={isOpen}
            >
              Works
            </AnimatedMenuLink>
            <AnimatedMenuLink
              ref={(el) => (navLinksRef.current[1] = el)}
              to="/about"
              onClick={(e) => handleLinkClick(e, "/about")}
              isOpen={isOpen}
            >
              About
            </AnimatedMenuLink>
            <AnimatedMenuLink
              ref={(el) => (navLinksRef.current[2] = el)}
              to="/contact"
              onClick={(e) => handleLinkClick(e, "/contact")}
              isOpen={isOpen}
            >
              Contact
            </AnimatedMenuLink>
          </nav>
        </div>

        {/* Social / Footer Info */}
        <div ref={footerRef} className="mt-auto opacity-0">
          <div className="border-t border-black/5 pt-8 sm:pt-10">
            <Links
              links={[
                { label: "Facebook", href: "#facebook" },
                { label: "LinkedIn", href: "#linkedin" },
                { label: "Instagram", href: "#instagram" },
              ]}
              linkClassName="text-[10px] uppercase font-medium tracking-[0.4em] py-1"
              textColor="text-[var(--foreground)] opacity-60"
              underlineColor="bg-[var(--foreground)] opacity-60"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenuOverlay;
