import React, { useState, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedButton from "./AnimatedButton";
import ArrowIcon from "./ArrowIcon";
import ValueBtn from "./valueBtn";
import { scrollTo } from "../utils/smoothScroll";

gsap.registerPlugin(ScrollTrigger);

const ContactSection: React.FC = () => {
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    project: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    project: "",
    budget: "",
  });

  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.set(section, {
      borderTopLeftRadius: "160px",
      borderTopRightRadius: "160px",
    });

    const tween = gsap.to(section, {
      borderTopLeftRadius: "0px",
      borderTopRightRadius: "0px",
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top 20%",
        end: "top 10%",
        scrub: 3.5,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tween.kill();
    };
  }, []);

  const validate = () => {
    let tempErrors = {
      name: "",
      email: "",
      phone: "",
      project: "",
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
    if (!formData.phone) {
      isValid = false;
      tempErrors.phone = "Phone number is required.";
    }
    if (!formData.project) {
      isValid = false;
      tempErrors.project = "Please tell us about your project.";
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form submitted:", { ...formData, budget: selectedBudget });
      // Here you would typically send the data to a server
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="bg-[#0a0a0a] text-[var(--foreground)] py-24 px-8 min-h-screen flex items-center overflow-hidden"
      style={{ borderTopLeftRadius: "160px", borderTopRightRadius: "160px" }}
    >
      <div className="container mx-auto">
        <div className="grid max-w-[1800px] mx-auto grid-cols-1 md:grid-cols-2 gap-auto">
          {/* Left Column */}
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-6xl md:text-6xl lg:text-7xl xl:text-8xl font-[granary] uppercase font-normal text-[var(--foreground)] w-full text-left mb-12">
                Let’s Work <span className="font-apparel">Together</span>
              </h2>
            </div>
            <div className="flex space-x-6 mt-12">
              <a
                href="#facebook"
                className="inline-flex text-xl items-center group relative overflow-hidden text-[var(--foreground)]"
              >
                <span>Facebook</span>
                <span className="relative w-6 h-6 ml-1 inline-flex items-center justify-center">
                  <ArrowIcon className="absolute w-4 h-4 rotate-[-45deg] transition-all duration-700 ease-out group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:opacity-0" />
                  <ArrowIcon className="absolute w-4 h-4 rotate-[-45deg] translate-x-[-8px] translate-y-[8px] opacity-0 transition-all duration-700 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
                </span>
              </a>
              <a
                href="#linkedin"
                className="inline-flex text-xl items-center group relative overflow-hidden text-[var(--foreground)]"
              >
                <span>LinkedIn</span>
                <span className="relative w-6 h-6 ml-1 inline-flex items-center justify-center">
                  <ArrowIcon className="absolute w-4 h-4 rotate-[-45deg] transition-all duration-700 ease-out group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:opacity-0" />
                  <ArrowIcon className="absolute w-4 h-4 rotate-[-45deg] translate-x-[-8px] translate-y-[8px] opacity-0 transition-all duration-700 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
                </span>
              </a>
              <a
                href="#email"
                className="inline-flex text-xl items-center group relative overflow-hidden text-[var(--foreground)]"
              >
                <span>Email</span>
                <span className="relative w-6 h-6 ml-1 inline-flex items-center justify-center">
                  <ArrowIcon className="absolute w-4 h-4 rotate-[-45deg] transition-all duration-700 ease-out group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:opacity-0" />
                  <ArrowIcon className="absolute w-4 h-4 rotate-[-45deg] translate-x-[-8px] translate-y-[8px] opacity-0 transition-all duration-700 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
                </span>
              </a>
            </div>
          </div>

          {/* Right Column */}

          <div className="text-left">
            <p className="text-[var(--foreground)] text-xl mb-20 text-left opacity-80">
              Before we start, we would like to better understand your needs.
              We'll review your application and schedule a free estimation call.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-20">
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`bg-transparent border-b focus:outline-none py-2 w-full text-[var(--foreground)] autofill:bg-transparent autofill:text-[var(--foreground)] autofill:shadow-[inset_0_0_0px_1000px_#0a0a0a] ${errors.name ? "border-red-400" : "border-[var(--foreground)]"}`}
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-2">{errors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`bg-transparent border-b focus:outline-none py-2 w-full text-[var(--foreground)] autofill:bg-transparent autofill:text-[var(--foreground)] autofill:shadow-[inset_0_0_0px_1000px_#0a0a0a] ${errors.email ? "border-red-400" : "border-[var(--foreground)]"}`}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-2">{errors.email}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`bg-transparent border-b focus:outline-none py-2 w-full text-[var(--foreground)] autofill:bg-transparent autofill:text-[var(--foreground)] autofill:shadow-[inset_0_0_0px_1000px_#0a0a0a] ${errors.phone ? "border-red-400" : "border-[var(--foreground)]"}`}
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-sm mt-2">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="mb-20">
                <textarea
                  name="project"
                  placeholder="Tell us about your project"
                  value={formData.project}
                  onChange={handleChange}
                  className={`bg-transparent border-b focus:outline-none p-0 pb-2 w-full text-[var(--foreground)] resize-none peer focus:ring-0 overflow-hidden autofill:bg-transparent autofill:text-[var(--foreground)] autofill:shadow-[inset_0_0_0px_1000px_#0a0a0a] ${errors.project ? "border-red-400" : "border-[var(--foreground)]"}`}
                  rows={1}
                  onInput={(e) => {
                    e.currentTarget.style.height = "auto";
                    e.currentTarget.style.height =
                      e.currentTarget.scrollHeight + "px";
                  }}
                ></textarea>
                {errors.project && (
                  <p className="text-red-400 text-sm mt-2">{errors.project}</p>
                )}
              </div>

              <div className="mb-20 text-left">
                <p className="text-[var(--foreground)] mb-8 text-xl">Project budget</p>

                <div className="flex flex-wrap gap-4">
                  <ValueBtn
                    text="5-15k"
                    isActive={selectedBudget === "5-15k"}
                    onClick={() => setSelectedBudget("5-15k")}
                  />
                  <ValueBtn
                    text="15-25k"
                    isActive={selectedBudget === "15-25k"}
                    onClick={() => setSelectedBudget("15-25k")}
                  />
                  <ValueBtn
                    text="25-50k"
                    isActive={selectedBudget === "25-50k"}
                    onClick={() => setSelectedBudget("25-50k")}
                  />
                  <ValueBtn
                    text=">50k"
                    isActive={selectedBudget === ">50k"}
                    onClick={() => setSelectedBudget(">50k")}
                  />
                </div>
                {errors.budget && (
                  <p className="text-red-400 text-sm mt-2">{errors.budget}</p>
                )}
              </div>
              <div className="text-left">
                <AnimatedButton
                  text="Send request"
                  padding="px-8 py-8"
                  baseBgColor="bg-[var(--foreground)]"
                  baseTextColor="text-[#0a0a0a]"
                  hoverTextColor="group-hover:text-[var(--foreground)]"
                  hoverBgColor="bg-[#0a0a0a]"
                  hoverBorderColor="border-[var(--foreground)]"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ContactSection;
