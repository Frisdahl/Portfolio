import { gsap } from "gsap";

/**
 * GSAP Helper: Horizontal Loop
 * @param items - Array of elements to loop
 * @param config - Configuration object
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function horizontalLoop(items: any[], config: any) {
  const elements = gsap.utils.toArray(items) as HTMLElement[];
  const cfg = config || {};
  const tl = gsap.timeline({
    repeat: cfg.repeat,
    paused: cfg.paused,
    defaults: { ease: "none" },
    onReverseComplete: () => { tl.totalTime(tl.rawTime() + tl.duration() * 100); },
  });
  const length = elements.length;
  const startX = elements[0].offsetLeft;
  const times: number[] = [];
  const widths: number[] = [];
  const xPercents: number[] = [];
  let curIndex = 0;
  const pixelsPerSecond = (cfg.speed || 1) * 100;
  const snap = cfg.snap === false ? (v: number) => v : gsap.utils.snap(cfg.snap || 1);
  let curX: number;
  let distanceToStart: number;
  let distanceToLoop: number;
  let item: HTMLElement;
  let i: number;

  gsap.set(elements, {
    xPercent: (index, el) => {
      const w = (widths[index] = parseFloat(gsap.getProperty(el, "width", "px") as string));
      xPercents[index] = snap(
        (parseFloat(gsap.getProperty(el, "x", "px") as string) / w) * 100 +
          (gsap.getProperty(el, "xPercent") as number)
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
    (parseFloat(cfg.paddingRight) || 0);

  for (i = 0; i < length; i++) {
    item = elements[i];
    curX = (xPercents[i] / 100) * widths[i];
    distanceToStart = item.offsetLeft + curX - startX;
    distanceToLoop =
      distanceToStart + widths[i] * (gsap.getProperty(item, "scaleX") as number);
    tl.to(
      item,
      {
        xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
        duration: distanceToLoop / pixelsPerSecond,
      },
      0
    )
      .fromTo(
        item,
        {
          xPercent: snap(
            ((curX - distanceToLoop + totalWidth) / widths[i]) * 100
          ),
        },
        {
          xPercent: xPercents[i],
          duration:
            (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
          immediateRender: false,
        },
        distanceToLoop / pixelsPerSecond
      )
      .add("label" + i, distanceToStart / pixelsPerSecond);
    times[i] = distanceToStart / pixelsPerSecond;
  }

  function toIndex(index: number, vars: gsap.TweenVars = {}) {
    let targetIndex = index;
    if (Math.abs(targetIndex - curIndex) > length / 2) {
      targetIndex += targetIndex > curIndex ? -length : length;
    }
    const newIndex = gsap.utils.wrap(0, length, targetIndex);
    let time = times[newIndex];
    if (time > tl.time() !== targetIndex > curIndex) {
      vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
      time += tl.duration() * (targetIndex > curIndex ? 1 : -1);
    }
    curIndex = newIndex;
    vars.overwrite = true;
    return tl.tweenTo(time, vars);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (tl as any).next = (vars: gsap.TweenVars) => toIndex(curIndex + 1, vars);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (tl as any).previous = (vars: gsap.TweenVars) => toIndex(curIndex - 1, vars);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (tl as any).current = () => curIndex;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (tl as any).toIndex = (index: number, vars: gsap.TweenVars) => toIndex(index, vars);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (tl as any).times = times;
  tl.progress(1, true).progress(0, true);
  if (cfg.reversed) {
    tl.vars.onReverseComplete?.();
    tl.reverse();
  }
  return tl;
}
