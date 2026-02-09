import React from "react";

// Social icons - using placeholders for now, can be replaced with actual SVG icons
const SocialIcon = ({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`transition-colors duration-300 ${className}`}
  >
    {children}
  </a>
);

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen w-full bg-white text-black overflow-hidden flex flex-col justify-center">
      {/* Top Left: Brand/Name */}

      {/* Center Left: HUGE Headline */}
      <div className="flex flex-col items-start justify-center p-8 pl-16 md:pl-32 lg:pl-32 relative">
        <h1 className="text-6xl md:text-6xl lg:text-7xl font-regular text-left pmm uppercase leading-none tracking-tighter animate-fade-in-up text-gray-900 font-granary">
          <span className="font-[700]">Freelance</span> web developer &{" "}
          <br></br>
          creative designer
        </h1>

        <p className="mt-6 text-lg md:text-xl max-w-lg text-gray-600 animate-fade-in-up delay-200 text-left">
          Working alongside ambitious startups and enterprises to build scalable
          web, mobile, and cross-platform products — from concept to launch
          worldwide.
        </p>

        <button className="mt-8 px-6 py-4 bg-[#121723] text-white font-semibold tracking-wide rounded-full hover:bg-gray-800 transition-colors duration-300 animate-fade-in-up delay-400">
          Let's discuss your project
        </button>
      </div>

      {/* Bottom Section: Social Links, Divider, Paragraph */}
      <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col md:flex-row justify-between items-center gap-8 z-10">
        {/* Thin Horizontal Divider */}
        <div className="absolute top-0 left-8 right-8 h-px bg-gray-300"></div>

        {/* Bottom Left: Social Links */}
        <div className="flex space-x-6">
          <SocialIcon href="#" className="text-gray-600 hover:text-black">
            IG
          </SocialIcon>
          <SocialIcon href="#" className="text-gray-600 hover:text-black">
            FB
          </SocialIcon>
          <SocialIcon href="#" className="text-gray-600 hover:text-black">
            LK
          </SocialIcon>
          <SocialIcon href="#" className="text-gray-600 hover:text-black">
            TEL
          </SocialIcon>
          <SocialIcon href="#" className="text-gray-600 hover:text-black">
            MAIL
          </SocialIcon>
          <SocialIcon href="#" className="text-gray-600 hover:text-black">
            AWWWARDS
          </SocialIcon>
        </div>

        {/* Bottom Right: Short Paragraph */}
        <p className="text-gray-600 text-sm max-w-xs text-right">
          Jeg hjælper iværksættere, foreninger og entusiaster med at lancere
          deres webprojekter og forbedre deres brand image med skræddersyet
          grafisk design, der kombinerer ydeevne, tilgængelighed og SEO.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
