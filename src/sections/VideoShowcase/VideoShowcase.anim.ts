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
    // 1. Split text for animation
    const splitHeading = new SplitType(heading, {
      types: "lines",
      lineClass: "split-line",
    });
    const splitHeadingWords = new SplitType(splitHeading.lines!, {
      types: "words",
      wordClass: "split-word",
    });

    const splitLongText = new SplitType(longText, {
      types: "lines",
      lineClass: "split-line",
    });
    const splitLongTextWords = new SplitType(splitLongText.lines!, {
      types: "words",
      wordClass: "split-word",
    });

    const splitSmallText = new SplitType(smallText, {
      types: "lines",
      lineClass: "split-line",
    });
    const splitSmallTextWords = new SplitType(splitSmallText.lines!, {
      types: "words",
      wordClass: "split-word",
    });

    // Setup initial states
    [splitHeading, splitLongText, splitSmallText].forEach((s) => {
      gsap.set(s.lines, { overflow: "hidden", display: "block" });
    });

    [splitHeadingWords, splitLongTextWords, splitSmallTextWords].forEach(
      (s) => {
        gsap.set(s.words, {
          yPercent: 100,
          opacity: 0,
          display: "inline-block",
        });
      },
    );

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
            end: "+=150%", // Slightly reduced scroll for more responsive feel
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
              xPercent: -15, // Centering logic for full screen 
              borderRadius: "0rem" 
            },
            {
              width: "100%", // Returns to Grid Column width
              height: "auto",
              xPercent: 0,
              borderRadius: "1.5rem",
              duration: 2,
              ease: "expo.inOut",
            }
          ).set(
            textContainer,
            {
              visibility: "visible",
              opacity: 1,
            },
            "-=0.5"
          );
        } else {
          // Mobile Sequence: Subtle scaling into text
          tl.from(videoWrapper, {
            scale: 1.2,
            borderRadius: "0rem",
            duration: 1.5,
            ease: "expo.out",
          }).set(
            textContainer,
            {
              visibility: "visible",
              opacity: 1,
            },
            "-=0.5"
          );
        }

        // Shared text stagger animation
        tl.to(
          splitHeadingWords.words!,
          {
            yPercent: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.05,
            ease: "power4.out",
          },
          "-=0.8"
        )
          .to(
            splitLongTextWords.words!,
            {
              yPercent: 0,
              opacity: 0.8,
              duration: 1,
              stagger: 0.02,
              ease: "power4.out",
            },
            "-=0.9"
          )
          .to(
            splitSmallTextWords.words!,
            {
              yPercent: 0,
              opacity: 0.6,
              duration: 1,
              stagger: 0.02,
              ease: "power4.out",
            },
            "-=0.9"
          );
      }
    );

    ScrollTrigger.refresh();
  }, container);

  return ctx;
};
