import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedButton from "../components/AnimatedButton";
import ValueBtn from "../components/valueBtn";

gsap.registerPlugin(ScrollTrigger);

const ContactPage: React.FC = () => {
  const CONTACT_FORM_STORAGE_KEY = "contactFormData";
  const CONTACT_BUDGET_STORAGE_KEY = "contactBudget";
  const SUBMIT_COOLDOWN_MS = 15000;
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headingLineOneRef = useRef<HTMLSpanElement>(null);
  const headingLineTwoRef = useRef<HTMLSpanElement>(null);
  const circleRef = useRef<HTMLSpanElement>(null);
  const shakaIconRef = useRef<HTMLSpanElement>(null);
  const shakaShakeTweenRef = useRef<gsap.core.Tween | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const formStartedAtRef = useRef<number>(Date.now());
  const animationTriggeredRef = useRef(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    inquiry: "",
  });
  const [website, setWebsite] = useState("");

  useEffect(() => {
    const storedFormData = localStorage.getItem(CONTACT_FORM_STORAGE_KEY);
    const storedBudget = localStorage.getItem(CONTACT_BUDGET_STORAGE_KEY);

    if (storedFormData) {
      try {
        const parsed = JSON.parse(storedFormData) as {
          name?: string;
          email?: string;
          company?: string;
          phone?: string;
          inquiry?: string;
        };

        setFormData({
          name: parsed.name ?? "",
          email: parsed.email ?? "",
          company: parsed.company ?? "",
          phone: parsed.phone ?? "",
          inquiry: parsed.inquiry ?? "",
        });
      } catch {
        localStorage.removeItem(CONTACT_FORM_STORAGE_KEY);
      }
    }

    if (storedBudget) {
      setSelectedBudget(storedBudget);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CONTACT_FORM_STORAGE_KEY, JSON.stringify(formData));

    if (selectedBudget) {
      localStorage.setItem(CONTACT_BUDGET_STORAGE_KEY, selectedBudget);
      return;
    }

    localStorage.removeItem(CONTACT_BUDGET_STORAGE_KEY);
  }, [formData, selectedBudget]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    gsap.set([headingLineOneRef.current, headingLineTwoRef.current], {
      autoAlpha: 0,
      yPercent: 120,
    });
    gsap.set(circleRef.current, {
      scale: 0,
      transformOrigin: "center center",
    });

    const ctx = gsap.context(() => {
      const shakeTween = gsap.to(shakaIconRef.current, {
        keyframes: [
          { rotation: -14, duration: 0.08 },
          { rotation: 14, duration: 0.08 },
          { rotation: -10, duration: 0.07 },
          { rotation: 10, duration: 0.07 },
          { rotation: 0, duration: 0.1 },
        ],
        transformOrigin: "50% 60%",
        repeat: -1,
        repeatDelay: 3.6,
        paused: true,
      });
      shakaShakeTweenRef.current = shakeTween;

      const entranceTl = gsap.timeline({
        paused: true,
        onStart: () => {
          animationTriggeredRef.current = true;
        },
      });

      entranceTl
        .to([headingLineOneRef.current, headingLineTwoRef.current], {
          autoAlpha: 1,
          yPercent: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "power4.out",
        })
        .to(
          circleRef.current,
          {
            scale: 1,
            duration: 0.35,
            ease: "back.out(1.7)",
          },
          "+=0.05",
        )
        .call(() => {
          shakeTween.play();
        });

      const startEntranceAnimation = () => {
        if (animationTriggeredRef.current) return;
        entranceTl.play();
        sessionStorage.removeItem("isNavigating");
      };

      // 2. Coordination logic
      const handleTransitionComplete = () => startEntranceAnimation();
      window.addEventListener(
        "initial-loader-complete",
        handleTransitionComplete,
      );
      window.addEventListener(
        "page-transition-complete",
        handleTransitionComplete,
      );

      const isInitialLoaderDone =
        sessionStorage.getItem("hasSeenInitialLoader") === "true";
      const isLoaderActive = !!document.querySelector(".initial-loader-wrap");

      if (
        isInitialLoaderDone &&
        !isLoaderActive &&
        !animationTriggeredRef.current
      ) {
        requestAnimationFrame(() => startEntranceAnimation());
      }

      const safetyTimeout = setTimeout(
        () => {
          if (!animationTriggeredRef.current) startEntranceAnimation();
        },
        isLoaderActive ? 8000 : 250,
      );

      return () => {
        window.removeEventListener(
          "initial-loader-complete",
          handleTransitionComplete,
        );
        window.removeEventListener(
          "page-transition-complete",
          handleTransitionComplete,
        );
        clearTimeout(safetyTimeout);
        entranceTl.kill();
        shakeTween.kill();
        shakaShakeTweenRef.current = null;
      };
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [submitCooldownUntil, setSubmitCooldownUntil] = useState(0);
  const [cooldownNow, setCooldownNow] = useState(Date.now());

  const cooldownRemainingMs = Math.max(0, submitCooldownUntil - cooldownNow);
  const cooldownRemainingSeconds = Math.ceil(cooldownRemainingMs / 1000);
  const isSubmitBlockedByCooldown = cooldownRemainingMs > 0;

  useEffect(() => {
    if (!isSubmitBlockedByCooldown) return;

    const intervalId = setInterval(() => {
      setCooldownNow(Date.now());
    }, 250);

    return () => clearInterval(intervalId);
  }, [isSubmitBlockedByCooldown]);

  // Auto-dismiss status toast after 5 seconds
  useLayoutEffect(() => {
    if (submitStatus !== "idle") {
      const timer = setTimeout(() => {
        setSubmitStatus("idle");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitBlockedByCooldown) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          budget: selectedBudget,
          website,
          formStartedAt: formStartedAtRef.current,
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          company: "",
          phone: "",
          inquiry: "",
        });
        setWebsite("");
        setSelectedBudget(null);
        formStartedAtRef.current = Date.now();
      } else {
        setSubmitStatus("error");
        setSubmitCooldownUntil(Date.now() + SUBMIT_COOLDOWN_MS);
        setCooldownNow(Date.now());
      }
    } catch (err) {
      console.error("Submission error:", err);
      setSubmitStatus("error");
      setSubmitCooldownUntil(Date.now() + SUBMIT_COOLDOWN_MS);
      setCooldownNow(Date.now());
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    "bg-transparent border-b border-[#1c1d1e] focus:outline-none py-3 w-full text-lg md:text-2xl text-[#1c1d1e] placeholder:text-[#1c1d1e]/30 transition-all duration-500 focus:border-b-2 focus:scale-[1.01] origin-left";

  return (
    <div
      ref={containerRef}
      id="contact"
      className="relative w-full min-h-screen py-28 bg-[var(--background)] flex flex-col"
    >
      <div className="w-full px-6 md:px-10 lg:px-12 xl:px-48 flex flex-col items-start text-left flex-grow">
        <h2 className="project-header-text text-5xl sm:text-6xl md:text-7xl lg:text-9xl w-full text-left font-aeonik font-medium text-[#1c1d1e] leading-[1.25] tracking-tight whitespace-normal md:whitespace-nowrap mb-10">
          <span className="block overflow-hidden">
            <span ref={headingLineOneRef} className="inline-block">
              Let’s Work
            </span>
          </span>
          <span className="inline-flex items-end flex-wrap md:flex-nowrap gap-y-3 md:gap-y-0">
            <span className="inline-block overflow-hidden">
              <span ref={headingLineTwoRef} className="inline-block">
                Together
              </span>
            </span>
            <span className="inline-flex items-center align-bottom ml-4 md:ml-8 lg:ml-10">
              <span
                ref={circleRef}
                onMouseEnter={() => shakaShakeTweenRef.current?.restart(true)}
                className="relative inline-flex cursor-default h-14 w-14 md:h-20 md:w-20 lg:h-24 lg:w-24 items-center justify-center rounded-full bg-[#161618] text-2xl md:text-4xl lg:text-5xl leading-none align-middle"
                aria-label="shaka hand"
              >
                <span
                  ref={shakaIconRef}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 leading-none"
                >
                  🤙🏼
                </span>
              </span>
            </span>
          </span>
        </h2>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="w-full space-y-8 md:space-y-12"
        >
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              type="text"
              name="website"
              autoComplete="off"
              tabIndex={-1}
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <div className="form-field-row grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="w-full">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={100}
                className={inputClasses}
              />
            </div>
            <div className="w-full">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                maxLength={254}
                className={inputClasses}
              />
            </div>
          </div>

          <div className="form-field-row grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="w-full">
              <input
                type="text"
                name="company"
                placeholder="Company"
                value={formData.company}
                onChange={handleChange}
                maxLength={120}
                className={inputClasses}
              />
            </div>
            <div className="w-full">
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                maxLength={50}
                className={inputClasses}
              />
            </div>
          </div>

          <div className="form-field-row w-full">
            <input
              type="text"
              name="inquiry"
              placeholder="Inquiry*"
              value={formData.inquiry}
              onChange={handleChange}
              required
              maxLength={3000}
              className={inputClasses}
            />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-12 pt-2 md:pt-4">
            <div className="budget-area flex flex-col items-start">
              <p className="text-[#1c1d1e] mb-6 text-sm font-medium uppercase tracking-[0.2em] opacity-40">
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
                    baseTextColor="text-[#1c1d1e]"
                    borderColor="border-[#1c1d1e]"
                    activeBgColor="bg-[#1c1d1e]"
                    activeTextColor="text-[#ffffff]"
                    hoverBgColor="bg-[#1c1d1e]"
                    hoverTextColor="group-hover/btn:text-[#ffffff]"
                  />
                ))}
              </div>
            </div>

            <div className="submit-area w-full md:w-auto">
              <AnimatedButton
                text={
                  isSubmitting
                    ? "Sending..."
                    : isSubmitBlockedByCooldown
                      ? `Wait ${cooldownRemainingSeconds}s`
                      : "Send request"
                }
                type="submit"
                disabled={isSubmitting || isSubmitBlockedByCooldown}
                padding="px-10 py-5 md:px-16 md:py-8"
                baseBorderColor="border-[#1c1d1e]"
                baseBgColor="bg-[#1c1d1e]"
                baseTextColor="text-[#ffffff]"
                hoverTextColor="group-hover/btn:text-[#1c1d1e]"
                hoverBgColor="bg-[#f4f4f5]"
                hoverBorderColor="border-[#1c1d1e]"
                fontSize="text-lg md:text-xl"
              />
            </div>
          </div>
        </form>

        {/* Floating Status Toast */}
        {(submitStatus === "success" || submitStatus === "error") && (
          <div className="fixed bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] md:w-auto max-w-[640px] px-5 md:px-10 py-4 md:py-5 bg-[#1c1d1e] border border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.5)] rounded-2xl md:rounded-full flex items-center gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out backdrop-blur-md">
            <div className="flex-shrink-0 flex items-center justify-center">
              {submitStatus === "success" ? (
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-green-500/80"
                >
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-red-400/80"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>

            <div className="flex flex-col pr-2 md:pr-10 min-w-0">
              <p className="text-[#fefffe] text-base md:text-lg font-medium tracking-tight leading-tight">
                {submitStatus === "success"
                  ? "Message sent successfully"
                  : "Unable to send message"}
              </p>
              <p className="text-[#fefffe]/40 text-[10px] md:text-[11px] uppercase tracking-[0.12em] md:tracking-[0.15em] mt-1 leading-none">
                {submitStatus === "success"
                  ? "I'll get back to you within 24 hours"
                  : "Please verify your details and try again"}
              </p>
            </div>

            <button
              onClick={() => setSubmitStatus("idle")}
              className="ml-auto text-[#fefffe]/20 hover:text-[#fefffe] transition-colors p-2 cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 1L13 13M1 13L13 1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactPage;
