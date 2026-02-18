import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const images = [
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2071&auto=format&fit=crop",
];

const ServicesSection: React.FC = () => {
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (imageRef.current && containerRef.current) {
        // Parallax effect
        gsap.fromTo(
          imageRef.current,
          { yPercent: -12 },
          {
            yPercent: 12,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );

        // Image switching effect
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top center",
          end: "bottom center",
          onUpdate: (self) => {
            const index = Math.min(
              Math.floor(self.progress * images.length),
              images.length - 1,
            );
            if (imageRef.current && imageRef.current.src !== images[index]) {
              imageRef.current.src = images[index];
            }
          },
        });
      }
    });
    return () => ctx.revert();
  }, []);

  const SkillList = ({ title, items }: { title: string; items: string[] }) => {
    return (
      <div className="flex mb-32">
        <div className="flex flex-col gap-4 w-full">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-12 relative">
              <div
                className={`w-32 md:w-48 lg:w-64 font-apparel italic text-2xl md:text-3xl text-right whitespace-nowrap mix-blend-difference text-white z-20 ${
                  idx === 0 ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                {title}
              </div>
              <div className="flex-1 font-granary text-3xl md:text-3xl lg:text-4xl text-left uppercase tracking-tighter leading-tight hover:opacity-50 transition-opacity cursor-default mix-blend-difference text-white z-20">
                {item}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section
      ref={containerRef}
      className="relative px-8 w-full bg-transparent overflow-visible"
    >
      <div className="relative z-10">
        {/* Main Content Area - Shifted to the right */}
        <div className="relative ">
          {/* Intro Header */}
          <div className="mb-24 text-center  lg:text-left py-32">
            <p className="font-granary uppercase tracking-[0.3em] text-xs mb-8 text-white mix-blend-difference opacity-50">
              (my areas of focus)
            </p>
            <h3 className="text-6xl md:text-8xl lg:text-8xl font-granary uppercase tracking-tighter font-normal leading-[1] text-white mix-blend-difference">
              key skills<br></br>
              <span className="pl-32">
                & <span className="font-apparel">interests</span>
              </span>
            </h3>
          </div>

          {/* Main Content Container */}
          <div className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-start justify-center relative">
            {/* Left Column: Scrolling Image */}
            <div className="w-full lg:w-[40%] sticky top-32 overflow-hidden rounded-xl aspect-[4/5] bg-neutral-900 z-10 lg:-mr-24 xl:-mr-32">
              <img
                ref={imageRef}
                src={images[0]}
                alt="Services"
                className="w-full h-[140%] object-cover scale-110"
              />
            </div>

            {/* Right Column: Categories */}
            <div className="w-full lg:w-[60%] flex flex-col z-20">
              <SkillList
                title="capabilities"
                items={[
                  "web design",
                  "animation & interaction",
                  "react",
                  "ai",
                  "graphic design",
                  "branding",
                  "presentation",
                  "social media design",
                ]}
              />
              <SkillList
                title="expertise"
                items={["design consulting", "mentoring", "react"]}
              />
              <SkillList
                title="my inspiration"
                items={[
                  "music",
                  "futurism & retro sci-fi",
                  "cinema",
                  "animation",
                  "typography",
                  "posters",
                  "video games",
                  "art",
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
