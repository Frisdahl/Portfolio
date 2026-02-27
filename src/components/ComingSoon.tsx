import { useState, useEffect, useCallback, FC } from "react";
import gsap from "gsap";

const ComingSoon: FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const trigger = useCallback(() => {
    if (isVisible) return;
    setIsVisible(true);

    const el = document.getElementById("coming-soon-popup");
    if (!el) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          gsap.to(el, {
            y: 50,
            opacity: 0,
            duration: 0.6,
            ease: "power2.in",
            onComplete: () => setIsVisible(false)
          });
        }, 2500);
      }
    });

    gsap.set(el, { y: 50, opacity: 0, display: "flex" });

    tl.to(el, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out"
    });
  }, [isVisible]);

  useEffect(() => {
    window.addEventListener("show-coming-soon", trigger);
    return () => window.removeEventListener("show-coming-soon", trigger);
  }, [trigger]);

  return (
    <div
      id="coming-soon-popup"
      className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100000] hidden items-center gap-3 backdrop-blur-xl bg-black/80 border border-white/10 px-6 py-3 rounded-full shadow-2xl pointer-events-none"
    >
      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
      <span className="text-white font-switzer uppercase text-[10px] tracking-[0.25em] font-medium whitespace-nowrap">
        Project case study coming soon
      </span>
    </div>
  );
};

export default ComingSoon;
