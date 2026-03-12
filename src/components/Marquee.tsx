import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface MarqueeProps {
  text: string;
  speed?: number; // Duration in seconds
  className?: string;
  itemClassName?: string;
  direction?: 1 | -1;
}

const Marquee: React.FC<MarqueeProps> = ({
  text,
  speed = 20,
  className = "",
  itemClassName = "",
  direction: initialDirection = 1,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current || !textRef.current) return;

    const ctx = gsap.context(() => {
      let currentScrollDirection = 0; // 0 means not yet determined

      function roll(target: HTMLElement, vars: gsap.TweenVars, reverse: boolean = false) {
        vars = vars || {};
        if (!vars.ease) vars.ease = "none";
        
        const tl = gsap.timeline({
          repeat: -1,
          onReverseComplete() {
            this.totalTime(this.rawTime() + this.duration() * 100);
          }
        });

        const el = target;
        const clone = el.cloneNode(true) as HTMLElement;
        el.parentNode?.appendChild(clone);

        const positionClones = () => {
          gsap.set(clone, {
            position: "absolute",
            overwrite: false,
            top: el.offsetTop,
            left: el.offsetLeft + (reverse ? -el.offsetWidth : el.offsetWidth)
          });
        };

        positionClones();

        tl.to([el, clone], { xPercent: reverse ? 100 : -100, ...vars }, 0);
        
        // Crucial: Give the timeline a head start so it can go backwards immediately
        tl.totalTime(tl.duration() * 100);

        const resizeHandler = () => {
          const time = tl.totalTime();
          tl.totalTime(0);
          positionClones();
          tl.totalTime(time);
        };

        window.addEventListener("resize", resizeHandler);

        return {
          tl,
          cleanup: () => window.removeEventListener("resize", resizeHandler)
        };
      }

      const { tl: rollTimeline, cleanup: resizeCleanup } = roll(textRef.current!, { duration: speed });

      // Use initialDirection: 1 (Down) -> LTR (-1), -1 (Up) -> RTL (1)
      gsap.set(rollTimeline, { timeScale: initialDirection === 1 ? -1 : 1 });

      const st = ScrollTrigger.create({
        onUpdate(self) {
          if (self.direction !== currentScrollDirection && self.direction !== 0) {
            currentScrollDirection = self.direction;
            
            // self.direction is 1 when scrolling down, -1 when scrolling up
            // Down (1) -> LTR (-1)
            // Up (-1) -> RTL (1)
            const targetScale = currentScrollDirection === 1 ? -1 : 1;
            
            gsap.to(rollTimeline, { 
              timeScale: targetScale, 
              overwrite: true,
              duration: 0.6,
              ease: "power2.out"
            });
          }
        }
      });

      return () => {
        resizeCleanup();
        st.kill();
      };
    }, containerRef);

    return () => ctx.revert();
  }, [text, speed, initialDirection]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden w-full ${className}`}
    >
      <div
        ref={textRef}
        className={`inline-block whitespace-nowrap ${itemClassName}`}
      >
        <span>{text}&nbsp;&nbsp;</span>
        <span>{text}&nbsp;&nbsp;</span>
        <span>{text}&nbsp;&nbsp;</span>
        <span>{text}&nbsp;&nbsp;</span>
      </div>
    </div>
  );
};

export default Marquee;
