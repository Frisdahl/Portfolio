import React, { useState, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import AnimatedButton from "../components/AnimatedButton";
import ValueBtn from "../components/valueBtn";
import Footer from "../components/Footer";

gsap.registerPlugin(ScrollTrigger);

const ContactPage: React.FC = () => {
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    inquiry: "",
  });

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Staggered Text Reveal for Heading
      if (headingRef.current) {
        const split = new SplitType(headingRef.current, { types: "lines,words" });
        gsap.set(split.lines, { overflow: "hidden" });
        gsap.from(split.words, {
          yPercent: 100,
          opacity: 0,
          duration: 1.2,
          stagger: 0.05,
          ease: "power4.out",
          delay: 0.2,
        });
      }

      // 2. Form Fields Entrance Animation
      if (formRef.current) {
        const fields = formRef.current.querySelectorAll(".form-field-row");
        const budgetArea = formRef.current.querySelector(".budget-area");
        const submitArea = formRef.current.querySelector(".submit-area");

        const tl = gsap.timeline({ delay: 0.8 });

        tl.from(fields, {
          y: 30,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
        })
        .from(budgetArea, {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out"
        }, "-=0.6")
        .from(submitArea, {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out"
        }, "-=0.4");
      }

    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", { ...formData, budget: selectedBudget });
  };

  const inputClasses = "bg-transparent border-b border-[#1c1d1e] focus:outline-none py-3 w-full text-xl md:text-2xl text-[#1c1d1e] placeholder:text-[#1c1d1e]/30 transition-all duration-500 focus:border-b-2 focus:scale-[1.01] origin-left";

  return (
    <div ref={containerRef} id="contact" className="relative w-full min-h-screen pt-32 md:pt-48 bg-[#fefffe] flex flex-col">
      <div className="w-full px-8 md:px-12 lg:px-24 flex flex-col items-start text-left pb-32 md:pb-48 flex-grow">
        <h2 ref={headingRef} className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-instrumentsans font-bold tracking-tight text-[#1c1d1e] uppercase leading-[1] mb-16">
          Let’s work <br />together
        </h2>

        <form ref={formRef} onSubmit={handleSubmit} className="w-full space-y-12">
          <div className="form-field-row grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="w-full">
              <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className={inputClasses} />
            </div>
            <div className="w-full">
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className={inputClasses} />
            </div>
          </div>

          <div className="form-field-row grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="w-full">
              <input type="text" name="company" placeholder="Company" value={formData.company} onChange={handleChange} className={inputClasses} />
            </div>
            <div className="w-full">
              <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className={inputClasses} />
            </div>
          </div>

          <div className="form-field-row w-full">
            <input type="text" name="inquiry" placeholder="Inquiry*" value={formData.inquiry} onChange={handleChange} className={inputClasses} />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 pt-4">
            <div className="budget-area flex flex-col items-start">
              <p className="text-[#1c1d1e] mb-6 text-sm font-medium uppercase tracking-[0.2em] opacity-40">Project budget</p>
              <div className="flex flex-wrap gap-3 justify-start">
                {["5-15k", "15-25k", "25-50k", ">50k"].map((budget) => (
                  <ValueBtn key={budget} text={budget} isActive={selectedBudget === budget} onClick={() => setSelectedBudget(budget)} baseBgColor="bg-transparent" baseTextColor="text-[#1c1d1e]" borderColor="border-[#1c1d1e]" activeBgColor="bg-[#1c1d1e]" activeTextColor="text-[#ffffff]" hoverBgColor="bg-[#1c1d1e]" hoverTextColor="group-hover/btn:text-[#ffffff]" />
                ))}
              </div>
            </div>

            <div className="submit-area w-full md:w-auto">
              <AnimatedButton text="Send request" padding="px-16 py-8" baseBorderColor="border-[#1c1d1e]" baseBgColor="bg-[#1c1d1e]" baseTextColor="text-[#ffffff]" hoverTextColor="group-hover/btn:text-[#1c1d1e]" hoverBgColor="bg-[#ffffff]" hoverBorderColor="border-[#1c1d1e]" fontSize="text-xl" />
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
