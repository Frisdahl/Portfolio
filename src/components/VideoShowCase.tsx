import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const VideoShowCase = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current || !videoWrapperRef.current || !videoRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 95%",
          end: "bottom 40%",
          scrub: 1.5,
        },
      });

      tl.fromTo(
        videoWrapperRef.current,
        {
          scale: 0.85,
          y: 80,
          clipPath: "inset(15% 15% 15% 15% round 2rem)",
          opacity: 0.4,
        },
        {
          scale: 1,
          y: 0,
          clipPath: "inset(0% 0% 0% 0% round 2rem)",
          opacity: 1,
          ease: "power2.out",
        }
      );

      // Parallax effect on the video itself
      gsap.fromTo(
        videoRef.current,
        {
          scale: 1.2,
        },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="flex justify-center py-20">
      <div
        ref={videoWrapperRef}
        className="w-[90vw] max-w-[1400px] aspect-[16/9] overflow-hidden origin-center shadow-2xl rounded-[2rem] md:rounded-[2.5rem]"
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover scale-110"
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
