import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

export const initVideoShowcaseAnimations = (
  container: HTMLElement,
  videoWrapper: HTMLElement,
  textContainer: HTMLElement,
  heading: HTMLElement,
  longText: HTMLElement,
  smallText: HTMLElement,
) => {
  const ctx = gsap.context(() => {
    // 1. Split text into lines and words for the standard slide-up effect
    const splits = [heading, longText, smallText].map((el) => {
      const s = new SplitType(el, { types: "lines,words" });
      
      s.lines?.forEach(line => {
        gsap.set(line, { overflow: "hidden", display: "block" });
      });

      s.words?.forEach(word => {
        gsap.set(word, { display: "inline-block", translateZ: 0 });
      });

      return s;
    });

    const [splitHeading, splitLongText, splitSmallText] = splits;

    // Initial state: Hidden below the line
    splits.forEach((s) => {
      gsap.set(s.words, { 
        yPercent: 100, 
        opacity: 0 
      });
    });

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 1024px)",
        isMobile: "(max-width: 1023px)",
      },
      (context) => {
        const { isDesktop } = context.conditions!;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "+=150%",
            pin: true,
            scrub: 1.2,
          },
        });

        if (isDesktop) {
          // Desktop Sequence: Full Screen -> Grid Split
          tl.fromTo(
            videoWrapper,
            {
              width: "100vw",
              height: "100vh",
              xPercent: -15,
              borderRadius: "0rem",
            },
            {
              width: "100%",
              height: "auto",
              xPercent: 0,
              borderRadius: "1.5rem",
              duration: 2,
              ease: "expo.inOut",
            },
          ).set(textContainer, { visibility: "visible" }, "-=1.0");
        } else {
          // Mobile Sequence: Subtle scaling into text
          tl.from(videoWrapper, {
            scale: 1.2,
            borderRadius: "0rem",
            duration: 1.5,
            ease: "expo.out",
          }).set(textContainer, { visibility: "visible" }, "-=0.5");
        }

        // Shared text stagger animation: Words slide up into view
        tl.to(
          splitHeading.words!,
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.05,
            ease: "power4.out",
          },
          "-=0.8",
        )
          .to(
            splitLongText.words!,
            {
              yPercent: 0,
              opacity: 1,
              duration: 1.0,
              stagger: 0.01,
              ease: "power4.out",
            },
            "-=1.0",
          )
          .to(
            splitSmallText.words!,
            {
              yPercent: 0,
              opacity: 1,
              duration: 1.0,
              stagger: 0.01,
              ease: "power4.out",
            },
            "-=1.0",
          );
      },
    );

    ScrollTrigger.refresh();
  }, container);

  return ctx;
};
