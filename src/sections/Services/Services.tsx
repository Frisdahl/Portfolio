import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";

interface ServiceItem {
  id: string;
  name: string;
  smallTitle: string;
  description: string;
  image?: string;
  tags: string[];
}

const services: ServiceItem[] = [
  {
    id: "01",
    name: "Digital Strategy",
    smallTitle: "Clear direction blueprint",
    description:
      "We define the digital path for your brand, ensuring every interaction serves a purpose. From market analysis to brand positioning, we build the foundation for your digital growth.",
    image: "/images/serviceImages/Digital-strategy.webp",
    tags: [
      "Research & Insights",
      "Brand Strategy",
      "Competitive Study",
      "Voice & Tone",
      "Naming & Copywriting",
      "Workshops",
    ],
  },
  {
    id: "02",
    name: "UX/UI Design",
    smallTitle: "Design with intent",
    description:
      "Designing with clarity and creative ambition. We create immersive interfaces that balance aesthetic beauty with functional simplicity, making digital navigation a seamless experience.",
    image: "/images/serviceImages/Ui-design.webp",
    tags: [
      "Identity Design",
      "Wireframing",
      "UI",
      "UX",
      "Web Design",
      "Product Design",
    ],
  },
  {
    id: "03",
    name: "Web Development",
    smallTitle: "Code that holds up over time",
    description:
      "Turning designs into high-end digital experiences. We focus on performance, clean code, and interactive excellence to bring your vision to life on the modern web.",
    image: "/images/serviceImages/Development.webp",
    tags: [
      "Frontend Development",
      "SEO",
      "Motion",
      "Animation",
      "WebGL",
      "CMS Development",
      "Databases",
    ],
  },
];

const Services: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const rowsContainerRef = useRef<HTMLDivElement>(null);

  // Per-Row Animations
  useEffect(() => {
    const container = rowsContainerRef.current;
    if (!container) return;

    const splitInstances: SplitType[] = [];
    let hasInitialized = false;
    let cleanupAnimations: (() => void) | null = null;

    const initAnimations = () => {
      if (hasInitialized) return;
      hasInitialized = true;

      const rows = gsap.utils.toArray(".service-row") as HTMLElement[];
      const ctx = gsap.context(() => {
        rows.forEach((row) => {
          const id = row.querySelector(".service-id-text");
          const name = row.querySelector(".service-name");
          const desc = row.querySelector(".service-description");
          const img = row.querySelector(".service-image");

          gsap.set([id, name], { opacity: 0, y: 40 });
          if (img) {
            gsap.set(img, { yPercent: -101, scale: 1.1, opacity: 0 });
          }

          let splitDesc: SplitType | null = null;
          if (desc) {
            splitDesc = new SplitType(desc as HTMLElement, {
              types: "lines",
            });
            splitInstances.push(splitDesc);
          }

          if (splitDesc?.lines) {
            gsap.set(splitDesc.lines, { opacity: 0, y: 20 });
          }

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: row,
              start: "top 85%",
              once: true,
            },
          });

          tl.to(id, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "expo.out",
          });

          tl.to(
            name,
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "expo.out",
            },
            "-=0.8",
          );

          if (splitDesc?.lines) {
            tl.to(
              splitDesc.lines,
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.05,
                ease: "expo.out",
              },
              "-=0.7",
            );
          }

          if (img) {
            tl.to(
              img,
              {
                yPercent: 0,
                scale: 1,
                opacity: 1,
                duration: 1.5,
                ease: "expo.out",
              },
              "-=0.8",
            );
          }
        });
      }, rowsContainerRef);

      cleanupAnimations = () => {
        ctx.revert();
        splitInstances.forEach((split) => split.revert());
      };
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          initAnimations();
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      cleanupAnimations?.();
    };
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="w-full text-[#1d1d1f] text-left font-aeonik px-6 md:px-10 lg:px-4 xl:px-6"
    >
      {/* Services List Container */}
      <div className="w-full">
        <div className="bg-[#1d1d1f] text-[#f4f4f5] rounded-[2rem] md:rounded-[3rem] p-6 md:p-8">
          {/* Header Section - 12 Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8 px-8">
            <div className="flex flex-col mb-16 lg:col-start-2 lg:col-span-10">
              <p className="text-sm uppercase mb-4 font-aeonik font-semibold tracking-[0.2em] text-white/40">
                Services
              </p>
              <h3 className="text-2xl md:text-4xl lg:text-5xl font-aeonik font-medium text-white leading-tight tracking-tight w-full">
                Evolving with every brief and built for impact, my process spans
                design, development, and brand strategy—aligning vision with
                execution to bring clarity and edge to every project.
              </h3>
            </div>
          </div>

          <div
            className="bg-[#272627] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden"
            ref={rowsContainerRef}
          >
            <div className="flex flex-col">
              {services.map((service, index) => (
                <div key={service.id} className="w-full service-row">
                  {/* Individual Service Item - 12 Column Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-16 md:py-20 lg:items-stretch items-start px-8">
                    {/* lg:col-span-2: Service ID */}
                    <div className="lg:col-span-1 pt-2 service-id">
                      <span className="service-id-text text-sm md:text-base font-aeonik text-[#f4f4f5] font-bold block">
                        {service.id}
                      </span>
                    </div>

                    {/* lg:col-span-3: Service Name */}
                    <div className="lg:col-span-4">
                      <h3 className="text-2xl md:text-4xl lg:text-5xl font-aeonik font-medium text-white leading-tight tracking-tight service-name">
                        {service.name}
                      </h3>
                    </div>

                    {/* lg:col-span-3: Description & Tags */}
                    <div className="lg:col-span-3 flex flex-col gap-8 overflow-hidden">
                      <p className="service-description text-lg font-aeonik font-medium leading-relaxed text-left text-[#f4f4f5]">
                        {service.description}
                      </p>

                      {/* Tags Section */}
                      <div className="flex flex-wrap gap-2">
                        {service.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="service-tag text-[10px] md:text-[11px] uppercase tracking-[0.12em] px-4 py-2 rounded-full bg-[#3b3a3b] text-white/80 font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* lg:col-span-4: Image Reveal */}
                    <div className="lg:col-span-4">
                      {service.image && (
                        <div className="service-image-reveal-ctn relative overflow-hidden rounded-2xl w-full h-full">
                          <div className="w-full h-full rounded-2xl overflow-hidden aspect-video lg:aspect-auto">
                            <img
                              src={service.image}
                              alt={service.name}
                              className="service-image w-full h-full object-cover will-change-transform"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Divider */}
                  {index < services.length - 1 && (
                    <div className="mx-8 h-px bg-white/5" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Services as default };
