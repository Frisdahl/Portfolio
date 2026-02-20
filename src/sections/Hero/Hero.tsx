import React from "react";

const SocialIcon = ({
  href,
  children,
  className,
  style,
}: {
  href: string;
  children: React.ReactNode;
  className: string;
  style?: React.CSSProperties;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`transition-colors duration-300 ${className}`}
    style={style}
  >
    {children}
  </a>
);

const Hero: React.FC = () => {
  return (
    <section
      className="hero-section relative h-screen w-full bg-transparent mb-64 overflow-hidden flex flex-col justify-end"
      style={{ color: "var(--foreground)" }}
    >
      {/* Anchored Bottom Content */}
      <div className="w-full px-8 pb-8">
        <h1
          className="text-6xl md:text-6xl lg:text-7xl text-left uppercase leading-[1] tracking-tighter animate-fade-in-up font-granary mb-8"
          style={{ color: "var(--foreground)" }}
        >
          <span className="font-semibold">Freelance</span> web developer{" "}
          <br></br> &<span className="font-apparel"> creative designer</span>
        </h1>

        <hr
          className="w-full h-px border-0 mb-8"
          style={{ backgroundColor: "var(--divider)" }}
        />

        <div className="flex flex-col md:flex-row justify-between items-center md:items-center gap-8">
          <div className="flex space-x-6">
            <img
              src="/images/danish-flag.svg"
              alt="Danish Flag"
              className="h-6 rounded-full"
            />
            <SocialIcon
              href="#"
              className="hover:opacity-70 transition-opacity"
              style={{ color: "var(--foreground-muted)" }}
            >
              IG
            </SocialIcon>
            <SocialIcon
              href="#"
              className="hover:opacity-70 transition-opacity"
              style={{ color: "var(--foreground-muted)" }}
            >
              FB
            </SocialIcon>
            <SocialIcon
              href="#"
              className="hover:opacity-70 transition-opacity"
              style={{ color: "var(--foreground-muted)" }}
            >
              LK
            </SocialIcon>
            <SocialIcon
              href="#"
              className="hover:opacity-70 transition-opacity"
              style={{ color: "var(--foreground-muted)" }}
            >
              TEL
            </SocialIcon>
            <SocialIcon
              href="#"
              className="hover:opacity-70 transition-opacity"
              style={{ color: "var(--foreground-muted)" }}
            >
              MAIL
            </SocialIcon>
          </div>

          <p
            className="text-xs md:text-sm max-w-sm text-left md:text-right leading-relaxed"
            style={{ color: "var(--foreground-muted)" }}
          >
            I help ambitious brands launch digital experiences and strengthen
            their identity through strategic, custom design.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
