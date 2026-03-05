import React, { useRef, useLayoutEffect, useMemo } from "react";
import { gsap } from "../../utils/animations";
import "./ProjectGallerySection.css";

/**
 * Image slider at bottom of viewport. No page scroll – wheel advances slides.
 * - Per-slide text above the images.
 * - Big image ~80vw; smaller image on the right that overflows the page.
 */

export type GallerySlide = {
  image: string;
  alt: string;
  text: string;
};

const CROSSFADE_DURATION = 0.7;
const CROSSFADE_EASE = "power2.inOut";

type Props = {
  slides: GallerySlide[];
  activeIndex: number;
  id?: string;
  className?: string;
};

const ProjectGallerySection: React.FC<Props> = ({
  slides,
  activeIndex,
  id,
  className = "",
}) => {
  const bigImgsRef = useRef<(HTMLImageElement | null)[]>([]);
  const smallWrapRef = useRef<HTMLDivElement>(null);
  const prevActiveRef = useRef(0);

  useLayoutEffect(() => {
    const bigImgs = bigImgsRef.current;
    const prev = prevActiveRef.current;
    const next = activeIndex;
    prevActiveRef.current = next;

    if (prev !== next && bigImgs[next]) {
      if (bigImgs[prev]) {
        gsap.to(bigImgs[prev], {
          opacity: 0,
          duration: CROSSFADE_DURATION,
          ease: CROSSFADE_EASE,
        });
      }
      gsap.to(bigImgs[next], {
        opacity: 1,
        duration: CROSSFADE_DURATION,
        ease: CROSSFADE_EASE,
      });
      if (smallWrapRef.current) {
        gsap.fromTo(
          smallWrapRef.current,
          { opacity: 0, scale: 0.98 },
          { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" },
        );
      }
    }
  }, [activeIndex, slides]);

  const nextSlide = useMemo(
    () => (activeIndex < slides.length - 1 ? slides[activeIndex + 1] : null),
    [slides, activeIndex],
  );

  if (slides.length === 0) return null;

  return (
    <section
      id={id}
      className={`project-gallery-section ${className}`}
      aria-label="Project gallery"
    >
      <div className="project-gallery-inner">
        <div className="project-gallery-images">
          <div className="project-gallery-big-wrap">
            {slides.map((slide, i) => (
              <img
                key={`big-${slide.image}-${i}`}
                ref={(el) => (bigImgsRef.current[i] = el)}
                src={slide.image}
                alt={slide.alt}
                className="project-gallery-big-img"
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: i === 0 ? 1 : 0,
                }}
                loading={i === 0 ? "eager" : "lazy"}
              />
            ))}
          </div>

          {nextSlide && (
            <div ref={smallWrapRef} className="project-gallery-small-wrap">
              <img
                src={nextSlide.image}
                alt={nextSlide.alt}
                className="project-gallery-small-img"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectGallerySection;
