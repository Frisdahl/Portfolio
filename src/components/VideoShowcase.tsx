import React from "react";

interface VideoShowcaseProps {
  isExpanded: boolean;
}

const VideoShowcase: React.FC<VideoShowcaseProps> = ({ isExpanded }) => {
  return (
    <section className="mb-64 w-full flex justify-center px-8 md:px-16 lg:px-24">
      <div
        className={`overflow-hidden rounded-3xl transition-all duration-1000 ease-in-out ${
          isExpanded ? "w-full" : "w-[50vw]"
        }`}
      >
        <video
          className="w-full aspect-video object-cover rounded-3xl"
          autoPlay
          muted
          loop
          playsInline
          src="/projectVideos/videoshowcase/promo_h264.mp4"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  );
};

export default VideoShowcase;
