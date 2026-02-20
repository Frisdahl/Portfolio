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
  smallText: HTMLElement
) => {
  const ctx = gsap.context(() => {
    // 1. Split text into lines
    const splitHeading = new SplitType(heading, { types: "lines", tagName: "span" });
    const splitLongText = new SplitType(longText, { types: "lines", tagName: "span" });
    const splitSmallText = new SplitType(smallText, { types: "lines", tagName: "span" });

    // Wrap each line in an overflow-hidden container
    [splitHeading, splitLongText, splitSmallText].forEach((split) => {
      split.lines?.forEach((line) => {
        const wrapper = document.createElement("div");
        wrapper.style.overflow = "hidden";
        wrapper.style.paddingTop = "0.1em";
        wrapper.style.paddingBottom = "0.1em";
        wrapper.style.marginTop = "-0.1em";
        line.style.display = "inline-block";
        line.parentNode?.insertBefore(wrapper, line);
        wrapper.appendChild(line);

        gsap.set(line, { yPercent: 100, opacity: 0 });
      });
    });

    // 2. Create the master timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "+=200%",
        pin: true,
        scrub: 0.8,
        onRefresh: (self) => {
          if (self.pin) self.pin.style.zIndex = "10";
        },
      },
    });

    tl.to(videoWrapper, {
      width: "100%",
      borderRadius: "0rem",
      duration: 1,
      ease: "power2.inOut",
    })
      .to({}, { duration: 0.2 })
      .to(videoWrapper, {
        width: "42%",
        xPercent: -60,
        yPercent: 30,
        borderRadius: "4rem",
        duration: 1,
        ease: "power2.inOut",
      })
      .set(textContainer, { visibility: "visible", yPercent: -45 }, "-=0.1")
      .to(splitHeading.lines!, {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      }, "+=0.1")
      .to(splitLongText.lines!, {
        yPercent: 0,
        opacity: 0.8,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      }, "-=0.4")
      .to(splitSmallText.lines!, {
        yPercent: 0,
        opacity: 0.6,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      }, "-=0.4")
      .to({}, { duration: 0.5 })
      .add(() => {
        ScrollTrigger.refresh();
      });

    ScrollTrigger.refresh();
  }, container);

  return ctx;
};
