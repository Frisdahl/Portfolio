import React from "react";

const Contact: React.FC = () => {
  return (
    <footer
      id="contact"
      className="bg-[#e4e3de] text-[#0a0a0a] py-32 px-8 md:px-16 lg:px-24 w-full"
    >
      <div className="max-w-[1600px] mx-auto">
        <h2 className="text-6xl md:text-8xl lg:text-9xl font-granary uppercase leading-[0.85] tracking-tighter mb-12">
          Let’s Work <br /> <span className="font-apparel italic">Together</span>
        </h2>
        
        <p className="text-xl md:text-2xl mb-16 opacity-80 max-w-2xl">
          Interested in starting a project? Reach out and let's build something exceptional.
        </p>

        <div className="flex flex-col gap-4 text-xl md:text-2xl font-medium">
          <a href="mailto:hello@example.com" className="underline underline-offset-8 decoration-1 hover:opacity-60 transition-opacity w-fit">
            hello@example.com
          </a>
          <div className="flex gap-8 mt-4">
            <a href="#" className="hover:opacity-60 transition-opacity">LinkedIn</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Facebook</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Contact;
