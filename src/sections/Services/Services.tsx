import React, { useLayoutEffect, useRef } from "react";
import { initServicesAnimations } from "./Services.anim";

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

const SkillList = ({ title, items }: { title: string; items: string[] }) => (
  <div className="flex mb-32">
    <div className="flex flex-col gap-4 w-full">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-12 relative">
          <div
            className={`w-32 md:w-48 lg:w-64 font-apparel italic text-2xl md:text-3xl whitespace-nowrap text-white mix-blend-difference z-20 ${
              idx === 0 ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {title}
          </div>
          <div className="flex-1 font-granary text-3xl md:text-3xl lg:text-4xl text-left uppercase tracking-tighter leading-tight hover:opacity-50 transition-opacity cursor-default text-white mix-blend-difference z-20">
            {item}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Services: React.FC = () => {
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current || !imageRef.current) return;
    
    // Initialize animation logic from external file
    const ctx = initServicesAnimations(containerRef.current, imageRef.current, images);
    
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="services"
      className="relative px-24 w-full mb-64 bg-transparent overflow-visible"
    >
      <div className="relative z-10">
        <div className="relative">
          <div className="text-center lg:text-left py-32">
            <p className="font-granary uppercase tracking-[0.3em] text-xs mb-8 text-white mix-blend-difference opacity-50">
              (my areas of focus)
            </p>
            <h3 className="text-6xl md:text-8xl lg:text-8xl font-granary uppercase tracking-tighter font-normal leading-[1] text-white mix-blend-difference">
              key skills<br />
              <span className="pl-48">
                & <span className="font-apparel">interests</span>
              </span>
            </h3>
          </div>

          <div className="max-w-7xl w-full mx-auto py-12 flex flex-col lg:flex-row items-start justify-center relative pb-32">
            <div className="w-full lg:w-[40%] sticky top-32 overflow-hidden rounded-xl aspect-[4/5] bg-neutral-900 z-10 lg:-mr-24 xl:-mr-32 lg:-mt-32">
              <img
                ref={imageRef}
                src={images[0]}
                alt="Services"
                className="w-full h-[140%] object-cover scale-110 will-change-transform"
              />
            </div>

            <div className="w-full lg:w-[60%] flex flex-col z-20 pt-32">
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

export default Services;
