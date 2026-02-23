import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedButton from "../../components/AnimatedButton";
import ValueBtn from "../../components/valueBtn";
import Marquee from "../../components/Marquee";

gsap.registerPlugin(ScrollTrigger);

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

const Contact: React.FC = () => {
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const topPartRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    inquiry: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    inquiry: "",
    budget: "",
  });

  useEffect(() => {
    if (!containerRef.current || !topPartRef.current) return;

    // Scroll-driven border radius animation (smooth out as you scroll in)
    gsap.to(topPartRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=50%",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const startRadius = 80;
          const endRadius = 0;
          const currentRadius =
            startRadius - progress * (startRadius - endRadius);
          if (topPartRef.current) {
            topPartRef.current.style.borderTopLeftRadius = `${currentRadius}px`;
            topPartRef.current.style.borderTopRightRadius = `${currentRadius}px`;
          }
        },
      },
    });

    // Use a single timeline for pinning and wiping
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=100%",
        scrub: true,
        pin: true,
        pinSpacing: true,
      },
    });

    // Wipe the top part upwards to reveal the bottom part underneath
    // Adjusted to 55% to ensure it clears the footer text completely
    tl.to(topPartRef.current, {
      clipPath: "inset(0% 0% 55% 0%)",
      ease: "none",
    });

    // Subtle Parallax for the video behind
    gsap.to(videoRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
      y: "15%",
      ease: "none",
    });

    // Refresh all triggers after setting up this one (which pins and shifts layout)
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === containerRef.current) t.kill();
      });
    };
  }, []);

  const validate = () => {
    let tempErrors = {
      name: "",
      email: "",
      company: "",
      phone: "",
      inquiry: "",
      budget: "",
    };
    let isValid = true;

    if (!formData.name) {
      isValid = false;
      tempErrors.name = "Name is required.";
    }
    if (!formData.email) {
      isValid = false;
      tempErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      isValid = false;
      tempErrors.email = "Email is not valid.";
    }
    if (!formData.inquiry) {
      isValid = false;
      tempErrors.inquiry = "Please tell us about your inquiry.";
    }
    if (!selectedBudget) {
      isValid = false;
      tempErrors.budget = "Please select a project budget.";
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form submitted:", { ...formData, budget: selectedBudget });
    }
  };

  return (
    <div
      ref={containerRef}
      id="contact"
      className="relative w-full h-[100vh] overflow-hidden bg-[#0a0a0a]"
    >
      {/* Bottom Part: Video/Footer Section (Revealed behind) */}
      <div className="absolute inset-0 z-[1] w-full h-full flex flex-col justify-end">
        {/* Video Background */}
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover transform-gpu opacity-40"
          >
            <source
              src="/projectVideos/herovideo/wave-optimized.webm"
              type="video/webm"
            />
            <source
              src="/projectVideos/herovideo/wave-optimized.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        <div className="absolute inset-0 z-[2] bg-black/60 pointer-events-none" />

        {/* Info Area (Bottom content) */}
        <div className="relative z-[10] w-full min-h-[40vh] flex flex-col justify-end">
          <div className="w-full px-8 md:px-12 lg:px-24 py-8 md:py-12 lg:py-16 flex flex-col md:flex-row justify-between items-start gap-8 text-[#e4e3de]">
            <div className="flex flex-col items-start text-left">
              <h3 className="text-2xl md:text-3xl lg:text-5xl font-semibold font-switzer uppercase leading-tight mb-8 max-w-xl">
                Available for <br /> select projects
              </h3>
              <div className="flex items-start gap-12">
                <p className="text-xs uppercase tracking-[0.2em] opacity-40">
                  © 2026 Frisdahl Studio
                </p>
                <p className="text-xs uppercase tracking-widest opacity-40">
                  Denmark — Copenhagen
                </p>
              </div>
            </div>

            <div className="flex gap-16 lg:gap-24 mb-2">
              <div className="flex flex-col items-start text-left">
                <p className="text-xs uppercase tracking-[0.3em] opacity-40 mb-6">
                  Menu
                </p>
                <nav className="flex flex-col space-y-3">
                  {["Works", "About", "Contact"].map((item) => (
                    <Link
                      key={item}
                      to={item === "Works" ? "/" : `/${item.toLowerCase()}`}
                      className="text-sm uppercase tracking-widest hover:opacity-60 transition-opacity"
                    >
                      {item}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="flex flex-col items-start text-left">
                <p className="text-xs uppercase tracking-[0.3em] opacity-40 mb-6">
                  Socials
                </p>
                <div className="flex flex-col space-y-3">
                  {["Instagram", "Facebook", "LinkedIn"].map((platform) => (
                    <SocialIcon
                      key={platform}
                      href="#"
                      className="text-sm uppercase tracking-widest hover:opacity-60 transition-opacity"
                    >
                      {platform}
                    </SocialIcon>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full pb-6">
            <div className="w-full px-8 md:px-12 lg:px-24 mb-8">
              <hr
                className="w-full h-px border-0 opacity-10"
                style={{ backgroundColor: "var(--divider)" }}
              />
            </div>
            <Marquee
              text="Frisdahl Studio°"
              className="pt-4"
              itemClassName="text-5xl md:text-7xl lg:text-[5vw] font-switzer font-semibold uppercase tracking-wide pr-16 text-[#e4e3de] opacity-[0.05] leading-none"
              speed={1}
            />
          </div>
        </div>
      </div>

      {/* Top Part: White Form Section (Wipes away) */}
      <div
        ref={topPartRef}
        id="lets-work-together"
        className="absolute inset-0 z-[2] w-full h-full bg-[#ffffff] flex flex-col items-center justify-start pt-32 will-change-[clip-path]"
        style={{
          clipPath: "inset(0% 0% 0% 0%)",
          borderTopLeftRadius: "80px",
          borderTopRightRadius: "80px",
        }}
      >
        <div className="w-full px-8 md:px-12 lg:px-24 flex flex-col items-start text-left">
          {/* Heading */}
          <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-newroman tracking-wide text-[#0a0a0a] leading-[1] mb-16">
            Let’s work <br></br>together
          </h2>

          {/* Form - Now under heading, full width */}
          <form onSubmit={handleSubmit} className="w-full space-y-12">
            {/* Row 1: Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="w-full">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-transparent border-b border-[#0a0a0a] focus:outline-none py-3 w-full text-xl md:text-2xl text-[#0a0a0a] placeholder:text-[#0a0a0a]/30"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-2">{errors.name}</p>
                )}
              </div>
              <div className="w-full">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-transparent border-b border-[#0a0a0a] focus:outline-none py-3 w-full text-xl md:text-2xl text-[#0a0a0a] placeholder:text-[#0a0a0a]/30"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-2">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Row 2: Company & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="w-full">
                <input
                  type="text"
                  name="company"
                  placeholder="Company"
                  value={formData.company}
                  onChange={handleChange}
                  className="bg-transparent border-b border-[#0a0a0a] focus:outline-none py-3 w-full text-xl md:text-2xl text-[#0a0a0a] placeholder:text-[#0a0a0a]/30"
                />
              </div>
              <div className="w-full">
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="bg-transparent border-b border-[#0a0a0a] focus:outline-none py-3 w-full text-xl md:text-2xl text-[#0a0a0a] placeholder:text-[#0a0a0a]/30"
                />
              </div>
            </div>

            {/* Row 3: Inquiry */}
            <div className="w-full">
              <input
                type="text"
                name="inquiry"
                placeholder="Inquiry*"
                value={formData.inquiry}
                onChange={handleChange}
                className="bg-transparent border-b border-[#0a0a0a] focus:outline-none py-3 w-full text-xl md:text-2xl text-[#0a0a0a] placeholder:text-[#0a0a0a]/30"
              />
              {errors.inquiry && (
                <p className="text-red-500 text-xs mt-2">{errors.inquiry}</p>
              )}
            </div>

            {/* Final Row: Budget (Left) and Send (Right) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 pt-4">
              <div className="flex flex-col items-start">
                <p className="text-[#0a0a0a] mb-6 text-sm font-medium uppercase tracking-[0.2em] opacity-40">
                  Project budget
                </p>
                <div className="flex flex-wrap gap-3 justify-start">
                  {["5-15k", "15-25k", "25-50k", ">50k"].map((budget) => (
                    <ValueBtn
                      key={budget}
                      text={budget}
                      isActive={selectedBudget === budget}
                      onClick={() => setSelectedBudget(budget)}
                      baseBgColor="bg-transparent"
                      baseTextColor="text-[#0a0a0a]"
                      borderColor="border-[#0a0a0a]"
                      activeBgColor="bg-[#0a0a0a]"
                      activeTextColor="text-[#ffffff]"
                      hoverBgColor="bg-[#0a0a0a]"
                      hoverTextColor="group-hover/btn:text-[#ffffff]"
                    />
                  ))}
                </div>
                {errors.budget && (
                  <p className="text-red-500 text-xs mt-4">{errors.budget}</p>
                )}
              </div>

              <div className="w-full md:w-auto">
                <AnimatedButton
                  text="Send request"
                  padding="px-16 py-8"
                  baseBorderColor="border-[#0a0a0a]"
                  baseBgColor="bg-[#0a0a0a]"
                  baseTextColor="text-[#ffffff]"
                  hoverTextColor="group-hover/btn:text-[#0a0a0a]"
                  hoverBgColor="bg-[#ffffff]"
                  hoverBorderColor="border-[#0a0a0a]"
                  fontSize="text-xl"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
