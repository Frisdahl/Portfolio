import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Helper function for seamless horizontal loop from GSAP
interface LoopConfig {
  repeat?: number;
  paused?: boolean;
  speed?: number;
  snap?: number | boolean;
  paddingRight?: number | string;
  reversed?: boolean;
  modifiers?: Record<string, unknown>;
  overwrite?: boolean;
}

interface LoopTimeline extends gsap.core.Timeline {
  next: (vars?: Record<string, unknown>) => gsap.core.Tween;
  previous: (vars?: Record<string, unknown>) => gsap.core.Tween;
  current: () => number;
  toIndex: (index: number, vars?: Record<string, unknown>) => gsap.core.Tween;
  times: number[];
}

function horizontalLoop(items: HTMLElement[], config: LoopConfig): LoopTimeline {
  const elements = gsap.utils.toArray(items) as HTMLElement[];
  const finalConfig = config || {};
  const tl = gsap.timeline({
    repeat: finalConfig.repeat,
    paused: finalConfig.paused,
    defaults: { ease: "none" },
    onReverseComplete: () => {
      tl.totalTime(tl.rawTime() + tl.duration() * 100);
    },
  }) as LoopTimeline;

  const length = elements.length;
  const startX = elements[0].offsetLeft;
  const times: number[] = [];
  const widths: number[] = [];
  const xPercents: number[] = [];
  let curIndex = 0;
  const pixelsPerSecond = (finalConfig.speed || 1) * 100;
  const snap =
    finalConfig.snap === false
      ? (v: number) => v
      : gsap.utils.snap(typeof finalConfig.snap === "number" ? finalConfig.snap : 1);
  let curX: number;
  let distanceToStart: number;
  let distanceToLoop: number;
  let item: HTMLElement;
  let i: number;

  gsap.set(elements, {
    xPercent: (index, el) => {
      const w = (widths[index] = parseFloat(
        gsap.getProperty(el, "width", "px") as string,
      ));
      xPercents[index] = snap(
        (parseFloat(gsap.getProperty(el, "x", "px") as string) / w) * 100 +
          (gsap.getProperty(el, "xPercent") as number),
      );
      return xPercents[index];
    },
  });
  gsap.set(elements, { x: 0 });
  const totalWidth =
    elements[length - 1].offsetLeft +
    (xPercents[length - 1] / 100) * widths[length - 1] -
    startX +
    elements[length - 1].offsetWidth *
      (gsap.getProperty(elements[length - 1], "scaleX") as number) +
    (parseFloat(finalConfig.paddingRight as string) || 0);
  for (i = 0; i < length; i++) {
    item = elements[i];
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
  function toIndex(index: number, vars?: Record<string, unknown>) {
    const finalVars = vars || {};
    let targetIndex = index;
    if (Math.abs(targetIndex - curIndex) > length / 2) {
      targetIndex += targetIndex > curIndex ? -length : length;
    }
    const newIndex = gsap.utils.wrap(0, length, targetIndex);
    let time = times[newIndex];
    if (time > tl.time() !== targetIndex > curIndex) {
      finalVars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
      time += tl.duration() * (targetIndex > curIndex ? 1 : -1);
    }
    curIndex = newIndex;
    finalVars.overwrite = true;
    return tl.tweenTo(time, finalVars);
  }
  tl.next = (vars?: Record<string, unknown>) => toIndex(curIndex + 1, vars);
  tl.previous = (vars?: Record<string, unknown>) => toIndex(curIndex - 1, vars);
  tl.current = () => curIndex;
  tl.toIndex = (index: number, vars?: Record<string, unknown>) => toIndex(index, vars);
  tl.times = times;
  tl.progress(1, true).progress(0, true);
  if (finalConfig.reversed) {
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
  direction?: 1 | -1; // 1 for right-to-left, -1 for left-to-right (GSAP default)
  dynamicSpeed?: boolean;
  paddingRight?: number;
}

const Marquee: React.FC<MarqueeProps> = ({
  text,
  speed = 1,
  className = "",
  itemClassName = "",
  repeat = 8,
  paddingRight = 100,
  direction = 1,
}) => {
  const railRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!railRef.current || !containerRef.current) return;

    let loop: LoopTimeline | null = null;

    // Small timeout to ensure DOM is fully rendered and styles applied
    const timeoutId = setTimeout(() => {
      if (!railRef.current || !containerRef.current) return;
      
      const items = Array.from(railRef.current.querySelectorAll(".marquee-item")) as HTMLElement[];
      if (items.length === 0) return;

      loop = horizontalLoop(items, {
        repeat: -1,
        speed: speed,
        paddingRight: paddingRight,
        paused: false,
        reversed: direction === 1,
      });

      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (loop) loop.kill();
    };
  }, [speed, text, repeat, paddingRight, direction]);

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
