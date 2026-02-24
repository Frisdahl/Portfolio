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

    // 2. Create the master timeline with a more generous scroll distance to slow things down
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "+=160%", // Increased from 130% to slow down the overall rate of change
        pin: true,
        scrub: 1,
        onRefresh: (self) => {
          if (self.pin) self.pin.style.zIndex = "10";
        },
      },
    });

    // Phase 1: Video expands to full-screen
    tl.to(videoWrapper, {
      width: "100%",
      borderRadius: "1.5rem",
      duration: 1.2,
      ease: "expo.inOut",
      force3D: true,
    })
      // Phase 2: Video scales down and moves - Slower and more deliberate
      .to(
        videoWrapper,
        {
          width: "55%",
          xPercent: -38,
          yPercent: 15,
          borderRadius: "1.5rem",
          duration: 2.5, // Increased from 1.5 to take up more of the scroll "time"
          ease: "expo.inOut",
          force3D: true,
        },
        "-=0.2",
      )

      // Phase 3: Text reveal with tighter width to avoid overlap
      .set(
        textContainer,
        {
          visibility: "visible",
          yPercent: -45,
          xPercent: 0,
          right: "5%", // Refined margin from edge
          width: "35%", // Narrower text column to prevent video overlap
          opacity: 1,
        },
        "-=0.4",
      )

      .to(
        splitHeadingWords.words!,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.04,
          ease: "power3.out",
        },
        "-=0.2",
      )
      .to(
        splitLongTextWords.words!,
        {
          yPercent: 0,
          opacity: 0.8,
          duration: 0.8,
          stagger: 0.015,
          ease: "power3.out",
        },
        "-=0.6",
      )
      .to(
        splitSmallTextWords.words!,
        {
          yPercent: 0,
          opacity: 0.6,
          duration: 0.8,
          stagger: 0.015,
          ease: "power3.out",
        },
        "-=0.6",
      )
      // Final hold
      .to({}, { duration: 0.4 });

    ScrollTrigger.refresh();
  }, container);

  return ctx;
};
