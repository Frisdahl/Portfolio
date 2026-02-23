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
    // 1. Split text into lines then words for maximum stability (Matching Services pattern)
    const splitHeading = new SplitType(heading, { types: "lines", lineClass: "split-line" });
    const splitHeadingWords = new SplitType(splitHeading.lines!, { types: "words", wordClass: "split-word" });

    const splitLongText = new SplitType(longText, { types: "lines", lineClass: "split-line" });
    const splitLongTextWords = new SplitType(splitLongText.lines!, { types: "words", wordClass: "split-word" });

    const splitSmallText = new SplitType(smallText, { types: "lines", lineClass: "split-line" });
    const splitSmallTextWords = new SplitType(splitSmallText.lines!, { types: "words", wordClass: "split-word" });

    // Setup initial states
    [splitHeading, splitLongText, splitSmallText].forEach(s => {
      gsap.set(s.lines, { overflow: "hidden", display: "block" });
    });
    
    [splitHeadingWords, splitLongTextWords, splitSmallTextWords].forEach(s => {
      gsap.set(s.words, { yPercent: 100, opacity: 0, display: "inline-block" });
    });

    // 2. Create the master timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "+=200%",
        pin: true,
        scrub: 1,
        onRefresh: (self) => {
          if (self.pin) self.pin.style.zIndex = "10";
        },
      },
    });

    tl.to(videoWrapper, {
      width: "100%",
      borderRadius: "1rem",
      duration: 1,
      ease: "power2.inOut",
      force3D: true,
    })
      .to({}, { duration: 0.2 })
      .to(videoWrapper, {
        width: "60%",
        xPercent: -35,
        yPercent: 20,
        borderRadius: "1rem",
        duration: 1,
        ease: "power2.inOut",
        force3D: true,
      })
      .set(textContainer, { 
        visibility: "visible", 
        yPercent: -40,
        xPercent: 0,
        right: 0,
        width: "35%",
        opacity: 1
      }, "-=0.1")
      .to(
        splitHeadingWords.words!,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.05,
          ease: "power3.out",
        },
        "+=0.1",
      )
      .to(
        splitLongTextWords.words!,
        {
          yPercent: 0,
          opacity: 0.8,
          duration: 0.8,
          stagger: 0.02,
          ease: "power3.out",
        },
        "-=0.4",
      )
      .to(
        splitSmallTextWords.words!,
        {
          yPercent: 0,
          opacity: 0.6,
          duration: 0.8,
          stagger: 0.02,
          ease: "power3.out",
        },
        "-=0.4",
      )
      .to({}, { duration: 0.5 })
      .add(() => {
        ScrollTrigger.refresh();
      });

    ScrollTrigger.refresh();
  }, container);

  return ctx;
};
