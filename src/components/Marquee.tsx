import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Helper function for seamless horizontal loop from GSAP
function horizontalLoop(items: any[], config: any) {
  items = gsap.utils.toArray(items);
  config = config || {};
  let tl = gsap.timeline({
      repeat: config.repeat,
      paused: config.paused,
      defaults: { ease: "none" },
      onReverseComplete: () => {
        tl.totalTime(tl.rawTime() + tl.duration() * 100);
      },
    }),
    length = items.length,
    startX = items[0].offsetLeft,
    times: number[] = [],
    widths: number[] = [],
    xPercents: number[] = [],
    curIndex = 0,
    pixelsPerSecond = (config.speed || 1) * 100,
    snap =
      config.snap === false ? (v: any) => v : gsap.utils.snap(config.snap || 1),
    totalWidth: number,
    curX: number,
    distanceToStart: number,
    distanceToLoop: number,
    item: any,
    i: number;

  gsap.set(items, {
    xPercent: (i, el) => {
      let w = (widths[i] = parseFloat(
        gsap.getProperty(el, "width", "px") as string,
      ));
      xPercents[i] = snap(
        (parseFloat(gsap.getProperty(el, "x", "px") as string) / w) * 100 +
          (gsap.getProperty(el, "xPercent") as number),
      );
      return xPercents[i];
    },
  });
  gsap.set(items, { x: 0 });
  totalWidth =
    items[length - 1].offsetLeft +
    (xPercents[length - 1] / 100) * widths[length - 1] -
    startX +
    items[length - 1].offsetWidth *
      (gsap.getProperty(items[length - 1], "scaleX") as number) +
    (parseFloat(config.paddingRight) || 0);
  for (i = 0; i < length; i++) {
    item = items[i];
    curX = (xPercents[i] / 100) * widths[i];
    distanceToStart = item.offsetLeft + curX - startX;
    distanceToLoop =
      distanceToStart +
      widths[i] * (gsap.getProperty(item, "scaleX") as number);
    tl.to(
      item,
      {
        xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
        duration: distanceToLoop / pixelsPerSecond,
      },
      0,
    )
      .fromTo(
        item,
        {
          xPercent: snap(
            ((curX - distanceToLoop + totalWidth) / widths[i]) * 100,
          ),
        },
        {
          xPercent: xPercents[i],
          duration:
            (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
          immediateRender: false,
        },
        distanceToLoop / pixelsPerSecond,
      )
      .add("label" + i, distanceToStart / pixelsPerSecond);
    times[i] = distanceToStart / pixelsPerSecond;
  }
  function toIndex(index: number, vars: any) {
    vars = vars || {};
    Math.abs(index - curIndex) > length / 2 &&
      (index += index > curIndex ? -length : length);
    let newIndex = gsap.utils.wrap(0, length, index),
      time = times[newIndex];
    if (time > tl.time() !== index > curIndex) {
      vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
      time += tl.duration() * (index > curIndex ? 1 : -1);
    }
    curIndex = newIndex;
    vars.overwrite = true;
    return tl.tweenTo(time, vars);
  }
  tl.next = (vars: any) => toIndex(curIndex + 1, vars);
  tl.previous = (vars: any) => toIndex(curIndex - 1, vars);
  tl.current = () => curIndex;
  tl.toIndex = (index: number, vars: any) => toIndex(index, vars);
  tl.times = times;
  tl.progress(1, true).progress(0, true);
  if (config.reversed) {
    tl.vars.onReverseComplete?.();
    tl.reverse();
  }
  return tl;
}

interface MarqueeProps {
  text: string;
  speed?: number;
  className?: string;
  itemClassName?: string;
  repeat?: number;
  direction?: 1 | -1;
  dynamicSpeed?: boolean;
}

const Marquee: React.FC<MarqueeProps> = ({
  text,
  speed = 1,
  className = "",
  itemClassName = "",
  repeat = 8,
  dynamicSpeed = true,
}) => {
  const railRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!railRef.current || !containerRef.current) return;

    let loop: any;
    let speedTween: gsap.core.Timeline | null = null;
    let scrollTriggerInstance: ScrollTrigger | null = null;

    // Small timeout to ensure DOM is fully rendered and styles applied
    const timeoutId = setTimeout(() => {
      if (!railRef.current || !containerRef.current) return;
      
      const items = Array.from(railRef.current.querySelectorAll(".marquee-item"));
      if (items.length === 0) return;

      loop = horizontalLoop(items, {
        repeat: -1,
        speed: speed,
        paddingRight: 100,
        paused: false,
      });

      if (dynamicSpeed) {
        scrollTriggerInstance = ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const targetScale = self.direction * speed;
            
            speedTween && speedTween.kill();
            speedTween = gsap.timeline()
              .to(loop, {
                timeScale: targetScale * 1.5, // Reduced boost
                duration: 0.2,
                ease: "power1.out"
              })
              .to(loop, {
                timeScale: targetScale,
                duration: 0.8, // Faster recovery
                ease: "power2.out"
              }, "+=0.1");
          },
        });
      }

      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      loop?.kill();
      scrollTriggerInstance?.kill();
      speedTween?.kill();
    };
  }, [speed, dynamicSpeed, text, repeat]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden w-full ${className}`}
    >
      <div ref={railRef} className="flex whitespace-nowrap">
        {[...Array(repeat)].map((_, i) => (
          <span key={i} className={`marquee-item inline-block ${itemClassName}`}>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
