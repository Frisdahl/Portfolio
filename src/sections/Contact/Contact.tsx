import React, { useState } from "react";
import AnimatedButton from "../../components/AnimatedButton";
import ArrowIcon from "../../components/ArrowIcon";
import ValueBtn from "../../components/valueBtn";

const Contact: React.FC = () => {
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

  const validate = () => {
    let tempErrors = {
      name: "", email: "", phone: "", project: "", budget: "",
    };
    let isValid = true;

    if (!formData.name) { isValid = false; tempErrors.name = "Name is required."; }
    if (!formData.email) { isValid = false; tempErrors.email = "Email is required."; }
    else if (!/\S+@\S+\.\S+/.test(formData.email)) { isValid = false; tempErrors.email = "Email is not valid."; }
    if (!formData.phone) { isValid = false; tempErrors.phone = "Phone number is required."; }
    if (!formData.project) { isValid = false; tempErrors.project = "Please tell us about your project."; }
    if (!selectedBudget) { isValid = false; tempErrors.budget = "Please select a project budget."; }

    setErrors(tempErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form submitted:", { ...formData, budget: selectedBudget });
    }
  };

  return (
    <footer
      id="contact"
      className="bg-[#e4e3de] text-[#0a0a0a] py-20 lg:py-32 px-8 md:px-16 lg:px-24 w-full flex flex-col items-start overflow-hidden relative z-20"
    >
      <div className="max-w-[1600px] w-full mx-auto flex flex-col items-start">
        {/* Heading - Left Aligned */}
        <div className="w-full text-left mb-16">
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-granary uppercase leading-[0.85] tracking-tighter text-[#0a0a0a]">
            Let’s Work <br /> <span className="font-apparel italic">Together</span>
          </h2>
          
          <div className="flex justify-start space-x-8 mt-10">
            {["Facebook", "LinkedIn", "Email"].map((platform) => (
              <a
                key={platform}
                href={`#${platform.toLowerCase()}`}
                className="inline-flex text-base md:text-lg items-center group relative overflow-hidden text-[#0a0a0a]"
              >
                <span>{platform}</span>
                <span className="relative w-5 h-5 ml-1 inline-flex items-center justify-center">
                  <ArrowIcon className="absolute w-3.5 h-3.5 rotate-[-45deg] transition-all duration-700 ease-out group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:opacity-0" />
                  <ArrowIcon className="absolute w-3.5 h-3.5 rotate-[-45deg] translate-x-[-8px] translate-y-[8px] opacity-0 transition-all duration-700 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Form Content - Left Aligned */}
        <div className="w-full">
          <p className="text-[#0a0a0a] text-xl md:text-2xl mb-12 text-left opacity-80 leading-relaxed max-w-2xl">
            Before we start, we would like to better understand your needs.
            We'll review your application and schedule a free estimation call.
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-10">
            <div className="w-full">
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                className="bg-transparent border-b border-[#0a0a0a] focus:outline-none py-3 w-full text-xl md:text-2xl text-[#0a0a0a] placeholder:text-[#0a0a0a]/30"
              />
              {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="w-full">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-transparent border-b border-[#0a0a0a] focus:outline-none py-3 w-full text-xl md:text-2xl text-[#0a0a0a] placeholder:text-[#0a0a0a]/30"
                />
                {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
              </div>
              <div className="w-full">
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="bg-transparent border-b border-[#0a0a0a] focus:outline-none py-3 w-full text-xl md:text-2xl text-[#0a0a0a] placeholder:text-[#0a0a0a]/30"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-2">{errors.phone}</p>}
              </div>
            </div>

            <div className="w-full">
              <textarea
                name="project"
                placeholder="Tell us about your project"
                value={formData.project}
                onChange={handleChange}
                className="bg-transparent border-b border-[#0a0a0a] focus:outline-none p-0 pb-3 w-full text-xl md:text-2xl text-[#0a0a0a] resize-none placeholder:text-[#0a0a0a]/30"
                rows={1}
                onInput={(e) => {
                  e.currentTarget.style.height = "auto";
                  e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
                }}
              />
              {errors.project && <p className="text-red-500 text-sm mt-2">{errors.project}</p>}
            </div>

            <div className="w-full text-left">
              <p className="text-[#0a0a0a] mb-6 text-lg font-medium uppercase tracking-wider opacity-60">Project budget</p>
              <div className="flex flex-wrap gap-4 justify-start">
                {["5-15k", "15-25k", "25-50k", ">50k"].map((budget) => (
                  <ValueBtn
                    key={budget}
                    text={budget}
                    isActive={selectedBudget === budget}
                    onClick={() => setSelectedBudget(budget)}
                  />
                ))}
              </div>
            </div>

            <div className="w-full flex justify-start pt-8 pb-12">
              <AnimatedButton
                text="Send request"
                padding="px-12 py-6"
                baseBgColor="bg-[#0a0a0a]"
                baseTextColor="text-[#e4e3de]"
                hoverTextColor="group-hover:text-[#0a0a0a]"
                hoverBgColor="bg-[#e4e3de]"
                hoverBorderColor="border-[#0a0a0a]"
              />
            </div>
          </form>
        </div>
      </div>
    </footer>
  );
};

export default Contact;
