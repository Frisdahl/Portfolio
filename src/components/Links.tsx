import React, { useEffect, useRef } from "react";

import gsap from "gsap";
import SplitType from "split-type";

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
  underlineColor = "bg-[#1b1b1a]",
}) => {
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const splitInstances = useRef<(SplitType | null)[]>([]);

  useEffect(() => {
    // Clean up any previous splits
    splitInstances.current.forEach((split) => split?.revert());
    splitInstances.current = [];

    linkRefs.current.forEach((link, i) => {
      if (!link) return;
      // Split the label into characters for animation
      const split = new SplitType(link.querySelector(".link-label"), {
        types: "chars",
      });
      splitInstances.current[i] = split;
      // Ensure characters are visible by default
      gsap.set(split.chars, { y: 0, opacity: 1 });
    });

    return () => {
      splitInstances.current.forEach((split) => split?.revert());
    };
  }, [links]);

  // Animation handlers
  const handleMouseEnter = (i: number) => {
    const split = splitInstances.current[i];
    if (!split) return;
    
    gsap.fromTo(split.chars, 
      { y: 10, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.02,
        ease: "power2.out",
        overwrite: true
      }
    );
  };

  const handleMouseLeave = (i: number) => {
    // Just ensure they are visible, no need to hide them
    const split = splitInstances.current[i];
    if (!split) return;
    
    gsap.to(split.chars, {
      y: 0,
      opacity: 1,
      duration: 0.3,
      ease: "power2.out",
      overwrite: true
    });
  };

  return (
    <div className={className}>
      {links.map((link, i) => (
        <a
          key={link.label + i}
          ref={(el) => (linkRefs.current[i] = el)}
          href={link.href}
          onClick={link.onClick}
          className={`inline-flex items-center ${linkClassName} ${textColor}`}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={() => handleMouseLeave(i)}
          style={{ cursor: "pointer" }}
        >
          <span className="relative">
            <span className="link-label block">{link.label}</span>
          </span>
        </a>
      ))}
    </div>
  );
};

export default Links;
