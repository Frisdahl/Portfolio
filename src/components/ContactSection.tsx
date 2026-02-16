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

    const tween = gsap.to(section, {
      borderRadius: "0px",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: section,
        start: "top 30%",
        end: "top 90%",
        scrub: 5,
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.killAll();
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
      className="bg-[#0a0a0a] text-white rounded-t-[10rem] py-36 px-8 min-h-screen flex items-center"
    >
      <div className="container mx-auto pt-16">
        <div className="grid max-w-[1800px] mx-auto grid-cols-1 md:grid-cols-2 gap-auto">
          {/* Left Column */}
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-6xl font-[granary] uppercase font-light text-white w-full text-left mb-12">
                Ready to Start Your{" "}
                <span className="font-semibold">Next Project?</span>
              </h2>
              <div className="flex space-x-4 my-12">
                <AnimatedButton
                  text="Start your project"
                  baseBgColor="bg-white"
                  baseTextColor="text-black"
                  hoverTextColor="text-white"
                  hoverBgColor="bg-black"
                  hoverBorderColor="border-white"
                />
                <AnimatedButton
                  text="Get in touch"
                  baseBgColor="bg-transparent"
                  baseTextColor="text-white"
                  hoverTextColor="text-black"
                  hoverBgColor="bg-white"
                  baseBorderColor="border-white"
                  onClick={() => scrollTo("#contact")}
                />
              </div>
            </div>
            <div className="flex space-x-6 mt-12">
              <a
                href="#facebook"
                className="inline-flex text-xl items-center group relative overflow-hidden"
              >
                <span>Facebook</span>
                <span className="relative w-6 h-6 ml-1 inline-flex items-center justify-center">
                  <ArrowIcon className="absolute w-4 h-4 rotate-[-45deg] transition-all duration-700 ease-out group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:opacity-0 brightness-0 invert" />
                  <ArrowIcon className="absolute w-4 h-4 rotate-[-45deg] translate-x-[-8px] translate-y-[8px] opacity-0 transition-all duration-700 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 brightness-0 invert" />
                </span>
              </a>
              <a
                href="#linkedin"
                className="inline-flex text-xl items-center group relative overflow-hidden"
              >
                <span>LinkedIn</span>
                <span className="relative w-6 h-6 ml-1 inline-flex items-center justify-center">
                  <ArrowIcon className="absolute w-4 h-4 rotate-[-45deg] transition-all duration-700 ease-out group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:opacity-0 brightness-0 invert" />
                  <ArrowIcon className="absolute w-4 h-4 rotate-[-45deg] translate-x-[-8px] translate-y-[8px] opacity-0 transition-all duration-700 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 brightness-0 invert" />
                </span>
              </a>
              <a
                href="#email"
                className="inline-flex text-xl items-center group relative overflow-hidden"
              >
                <span>Email</span>
                <span className="relative w-6 h-6 ml-1 inline-flex items-center justify-center">
                  <ArrowIcon className="absolute w-4 h-4 rotate-[-45deg] transition-all duration-700 ease-out group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:opacity-0 brightness-0 invert" />
                  <ArrowIcon className="absolute w-4 h-4 rotate-[-45deg] translate-x-[-8px] translate-y-[8px] opacity-0 transition-all duration-700 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 brightness-0 invert" />
                </span>
              </a>
            </div>
          </div>

          {/* Right Column */}

          <div className="text-left">
            <p className="text-white text-xl mb-16 text-left">
              Before we start, we would like to better understand your needs.
              We'll review your application and schedule a free estimation call.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-12">
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`bg-transparent border-b  focus:outline-none py-2 w-full text-white ${errors.name ? "border-red-400" : "border-white"}`}
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-2">{errors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`bg-transparent border-b focus:outline-none py-2 w-full text-white ${errors.email ? "border-red-400" : "border-white"}`}
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
                    className={`bg-transparent border-b focus:outline-none py-2 w-full text-white ${errors.phone ? "border-red-400" : "border-white"}`}
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-sm mt-2">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="mb-16">
                <textarea
                  name="project"
                  placeholder="Tell us about your project"
                  value={formData.project}
                  onChange={handleChange}
                  className={`bg-transparent border-b focus:outline-none p-0 pb-2 w-full text-white resize-none peer focus:ring-0 overflow-hidden ${errors.project ? "border-red-400" : "border-white"}`}
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

              <div className="mb-16 text-left">
                <p className="text-white mb-6 text-xl">Project budget</p>

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
                  baseBgColor="bg-white"
                  baseTextColor="text-black"
                  hoverTextColor="text-white"
                  hoverBgColor="bg-[#0a0a0a]"
                  hoverBorderColor="border-white"
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
