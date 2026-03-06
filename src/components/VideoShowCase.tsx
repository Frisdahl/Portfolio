import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const VideoShowCase = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current || !videoWrapperRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        videoWrapperRef.current,
        {
          scale: 0.6,
          y: 60,
        },
        {
          scale: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current, // static trigger
            start: "top 80%",
            end: "bottom 20%",
            scrub: 0.5,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="flex justify-center">
      <div
        ref={videoWrapperRef}
        className="w-[80vw] max-w-[100vw] min-w-[320px] aspect-[16/9] overflow-hidden origin-center"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source
            src="/projectVideos/videoshowcase/promo_h264.mp4"
            type="video/mp4"
          />
        </video>
      </div>
    </div>
  );
};

export default VideoShowCase;
