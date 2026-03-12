import React, { useRef } from "react";
import gsap from "gsap";

interface LinksProps {
  links?: Array<{
    label: string;
    href: string;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  }>;
  className?: string;
  linkClassName?: string;
  textColor?: string;
  underlineColor?: string;
}

const Links: React.FC<LinksProps> = ({
  links = [
    { label: "Facebook", href: "#facebook" },
    { label: "LinkedIn", href: "#linkedin" },
    { label: "Instagram", href: "#instagram" },
  ],
  className = "flex flex-wrap gap-x-12 gap-y-4",
  linkClassName = "text-xs uppercase font-semibold tracking-[0.3em] py-1",
  textColor = "text-[#1b1b1a]",
}) => {
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Animation handlers
  const handleMouseEnter = (i: number) => {
    const dot = dotRefs.current[i];
    if (!dot) return;
    
    gsap.to(dot, {
      scale: 1,
      x: 0,
      opacity: 1,
      duration: 0.4,
      ease: "back.out(1.7)",
      overwrite: true
    });
  };

  const handleMouseLeave = (i: number) => {
    const dot = dotRefs.current[i];
    if (!dot) return;
    
    gsap.to(dot, {
      scale: 0,
      x: -10,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      overwrite: true
    });
  };

  return (
    <div className={className}>
      {links.map((link, i) => (
        <a
          key={link.label + i}
          href={link.href}
          onClick={link.onClick}
          className={`inline-flex items-center gap-4 group ${linkClassName} ${textColor}`}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={() => handleMouseLeave(i)}
          style={{ cursor: "pointer" }}
        >
          {/* Animated Dot */}
          <div
            ref={(el) => { dotRefs.current[i] = el; }}
            className="w-2.5 h-2.5 rounded-full bg-current opacity-0 scale-0 -translate-x-[10px]"
            style={{ willChange: "transform, opacity" }}
          />
          <span className="relative">
            <span className="link-label block">{link.label}</span>
          </span>
        </a>
      ))}
    </div>
  );
};

export default Links;
