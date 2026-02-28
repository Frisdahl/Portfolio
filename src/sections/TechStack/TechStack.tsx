import React, { useState, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Import SVGs
import FigmaIcon from "../../assets/icons/experienceIcons/Figma.svg";
import ReactIcon from "../../assets/icons/experienceIcons/React.svg";
import GSAPIcon from "../../assets/icons/experienceIcons/GSAP.svg";
import NextIcon from "../../assets/icons/experienceIcons/Next.js.svg";
import TSIcon from "../../assets/icons/experienceIcons/TypeScript.svg";
import TailwindIcon from "../../assets/icons/experienceIcons/TailwindCSS.svg";
import SupabaseIcon from "../../assets/icons/experienceIcons/Supabase.svg";
import VercelIcon from "../../assets/icons/experienceIcons/Vercel.svg";

gsap.registerPlugin(ScrollTrigger);

const headingData = [
  [ // Modern
    { char: "M", order: 1 },
    { char: "o", order: 3 },
    { char: "d", order: 2 },
    { char: "e", order: 4 },
    { char: "r", order: 5 },
    { char: "n", order: -1 },
  ],
  [ // Tech
    { char: "T", order: 6 },
    { char: "e", order: 7 },
    { char: "c", order: -1 },
    { char: "h", order: -1 },
  ],
  [ // Stack
    { char: "S", order: 8 },
    { char: "t", order: -1 },
    { char: "a", order: -1 },
    { char: "c", order: 9 },
    { char: "k", order: 10 },
  ]
];

const AnimatedLetter = ({ char, order }: { char: string; order: number }) => {
  if (order < 0) {
    return <span>{char}</span>;
  }
  return (
    <span className="relative inline-flex overflow-hidden align-bottom">
      <span className="tech-letter-inner block relative" data-order={order}>
        <span className="absolute bottom-full left-0 right-0 text-center" aria-hidden="true">{char}</span>
        <span>{char}</span>
      </span>
    </span>
  );
};

const TechStack: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<string>("r1-0"); // Default to top left
  const bgRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const row1 = [
    {
      id: "r1-0",
      icon: FigmaIcon,
      name: "Figma",
      url: "https://www.figma.com/",
    },
    { id: "r1-1", icon: ReactIcon, name: "React", url: "https://react.dev/" },
    { id: "r1-2", icon: GSAPIcon, name: "GSAP", url: "https://gsap.com/" },
  ];

  const row2 = [
    { id: "r2-0", icon: NextIcon, name: "Next.js", url: "https://nextjs.org/" },
    {
      id: "r2-1",
      icon: TSIcon,
      name: "TypeScript",
      url: "https://www.typescriptlang.org/",
    },
    {
      id: "r2-2",
      icon: TailwindIcon,
      name: "Tailwind CSS",
      url: "https://tailwindcss.com/",
    },
    {
      id: "r2-3",
      icon: SupabaseIcon,
      name: "Supabase",
      url: "https://supabase.com/",
    },
    {
      id: "r2-4",
      icon: VercelIcon,
      name: "Vercel",
      url: "https://vercel.com/",
    },
  ];

  const allItems = [...row1, ...row2];

  useLayoutEffect(() => {
    const activeId = hoveredIdx; 
    const activeElement = document.getElementById(activeId);

    if (activeElement && bgRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const elementRect = activeElement.getBoundingClientRect();

      const targetX = elementRect.left - containerRect.left;
      const targetY = elementRect.top - containerRect.top;

      gsap.to(bgRef.current, {
        x: targetX,
        y: targetY,
        width: elementRect.width,
        height: elementRect.height,
        duration: 0.65,
        ease: "power4.out",
        overwrite: "auto", // Crucial: cancels any ongoing animation
      });
    }
  }, [hoveredIdx]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 2. Heading Scroll Animation Logic
      if (headingRef.current) {
        const animatedLetters = Array.from(
          headingRef.current.querySelectorAll('.tech-letter-inner')
        ) as HTMLElement[];

        // Sort sequentially based on the order assigned
        animatedLetters.sort((a, b) => {
          return parseInt(a.dataset.order || "0") - parseInt(b.dataset.order || "0");
        });

        gsap.to(animatedLetters, {
          yPercent: 100,
          stagger: 0.15,
          ease: "none", 
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
            end: "bottom 30%",
            scrub: 1.5, // 1.5s smoothing for a very premium feel
          }
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="w-full px-6 md:px-10 lg:px-4 xl:px-6 font-aeonik">
      {/* Heading Area */}
      <div className="mb-16 md:mb-24">
        <h2 
          ref={headingRef}
          className="text-5xl md:text-7xl lg:text-8xl xl:text-[10rem] font-bold uppercase tracking-tight text-[#1c1d1e] leading-[0.8] mb-12"
        >
          <span className="inline-block whitespace-nowrap">
            {headingData[0].map((item, i) => <AnimatedLetter key={i} char={item.char} order={item.order} />)}
          </span>
          <br />
          <span className="inline-block whitespace-nowrap">
            {headingData[1].map((item, i) => <AnimatedLetter key={i} char={item.char} order={item.order} />)}
            <span className="inline-block w-[0.25em]"></span>
            {headingData[2].map((item, i) => <AnimatedLetter key={i} char={item.char} order={item.order} />)}
          </span>
        </h2>
        
        <div className="text-left">
          <p className="text-xs md:text-sm uppercase font-semibold tracking-wide text-[#1c1d1e]">
            Professional At
          </p>
        </div>
      </div>

      {/* Grid Container */}
      <div ref={containerRef} className="w-full relative">
        {/* Shared Hover Background */}
        <div
          ref={bgRef}
          className="absolute top-0 left-0 bg-[#1c1d1e] pointer-events-none z-0"
          style={{ willChange: "transform, width, height" }}
        />

        {/* Row 1 */}
        <div className="grid grid-cols-12 w-full relative z-10">
          {row1.map((item) => (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              id={item.id}
              key={item.id}
              onMouseEnter={() => setHoveredIdx(item.id)}
              className={`col-span-4 h-64 md:h-80 lg:h-[400px] flex items-center justify-center transition-all duration-500 border-[#1c1d1e]/10 
                ${item.id !== "r1-2" ? "border-r" : ""} border-b cursor-pointer`}
            >
              <img
                src={item.icon}
                alt={item.name}
                className={`w-20 h-20 md:w-32 lg:w-40 object-contain transition-all duration-500 pointer-events-none
                  ${
                    hoveredIdx === item.id
                      ? "invert brightness-200 grayscale-0 opacity-100"
                      : "grayscale opacity-60"
                  }`}
              />
            </a>
          ))}
        </div>

        {/* Row 2 */}
        <div className="flex w-full overflow-hidden relative z-10">
          {row2.map((item, idx) => (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              id={item.id}
              key={item.id}
              onMouseEnter={() => setHoveredIdx(item.id)}
              className={`flex-1 h-32 md:h-48 flex items-center justify-center transition-all duration-500 border-[#1c1d1e]/10 
                ${idx < row2.length - 1 ? "border-r" : ""} cursor-pointer`}
            >
              <img
                src={item.icon}
                alt={item.name}
                className={`w-12 h-12 md:w-16 lg:w-20 object-contain transition-all duration-500 pointer-events-none
                  ${
                    hoveredIdx === item.id
                      ? "invert brightness-200 grayscale-0 opacity-100"
                      : "grayscale opacity-60"
                  }`}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
