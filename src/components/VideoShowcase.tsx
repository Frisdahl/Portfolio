import React from "react";

interface VideoShowcaseProps {
  isExpanded: boolean;
}

const VideoShowcase: React.FC<VideoShowcaseProps> = ({ isExpanded }) => {
  return (
    <section className="py-16">
      <div
        className={`mx-auto overflow-hidden rounded-3xl px-8 pb-48 transition-[width,opacity,transform] duration-1000 ease-in-out ${
          isExpanded ? "w-full" : "w-[50vw]"
        }`}
      >
        {/* Placeholder for video */}
        <div className="bg-gray-200 flex rounded-3xl items-center justify-center text-gray-600 font-bold h-[80svh]">
          <p className="text-xl">
            Video Showcase Placeholder (16:9 Aspect Ratio)
          </p>
        </div>
        {/*
          When the video is ready, replace the div above with:
          <video controls className="w-full h-full object-cover rounded-3xl" poster="path/to/poster.jpg">
            <source src="path/to/your/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        */}
      </div>
    </section>
  );
};

export default VideoShowcase;
