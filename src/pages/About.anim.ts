import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

/**
 * Line-by-line reveal animation for about items (Services/Experience)
 */
export const initAboutItemsAnimation = (container: HTMLElement) => {
  const ctx = gsap.context(() => {
    // Select all items to animate
    const items = container.querySelectorAll(".about-animate-item");

    items.forEach((item) => {
      // Find text elements within the item
      const headings = item.querySelectorAll("h3, p.uppercase, span.whitespace-nowrap");
      const descriptions = item.querySelectorAll("p:not(.uppercase)");

      // Create a timeline for each item
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: "top 90%",
          once: true,
        },
      });

      // 1. Animate Headings/Titles
      headings.forEach((heading) => {
        const split = new SplitType(heading as HTMLElement, { types: "lines" });
        tl.from(split.lines, {
          yPercent: 100,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",
        }, 0); // Start at 0 relative to timeline
      });

      // 2. Animate Descriptions
      descriptions.forEach((desc) => {
        const split = new SplitType(desc as HTMLElement, { types: "lines" });
        tl.from(split.lines, {
          yPercent: 100,
          opacity: 0,
          duration: 1,
          stagger: 0.05,
          ease: "power4.out",
        }, 0.1); // Slight delay for depth
      });

      // 3. Fade in "PRO" tags (using a separate selector for the span)
      const proTags = item.querySelectorAll("span.rounded-full");
      if (proTags.length > 0) {
        tl.from(proTags, {
          opacity: 0,
          scale: 0.8,
          duration: 0.8,
          ease: "back.out(1.7)",
          stagger: 0.1
        }, 0.15);
      }
      
      // 4. Animate Divider if present
      const divider = item.querySelector("hr");
      if (divider) {
        tl.from(divider, {
          scaleX: 0,
          transformOrigin: "left",
          duration: 1.2,
          ease: "power3.out"
        }, 0.2);
      }
    });
  }, container);

  return ctx;
};
