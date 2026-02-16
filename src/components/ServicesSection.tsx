import React from "react";
import ServiceItem from "./ServiceItem";

const ServicesSection: React.FC = () => {
  return (
    <section className="py-16 px-8 w-full max-w-[1800px] mx-auto">
      {/* Row for Header and Paragraph */}
      <div className="flex flex-col lg:flex-row justify-between items-end mb-12">
        <h2 className="text-6xl font-[granary] uppercase text-[#010101] w-full text-left">
          <span className="font-bold">My services</span> <br></br> and areas of
          expertise
        </h2>
        <p className="text-lg w-full text-left lg:w-1/3 lg:text-right">
          Every project is unique. I provide tailor-made solutions with
          meticulous attention to detail. I focus solely on areas where I can
          truly create added value for my clients.
        </p>
      </div>

      {/* Row for Service Lines - now full width, left aligned */}
      <div className="flex flex-col w-full md:w-3/4 md:ml-auto mt-24">
        <hr className=" border-[#dcdcdc] z-10" />
        <ServiceItem
          name="Responsive Frontend Development"
          description="Modern, mobile-first interfaces built with React, TypeScript, and scalable component architecture."
        />
        <hr className=" border-[#dcdcdc] z-10" />
        <ServiceItem
          name="Fullstack Web Application Development"
          description="End-to-end solutions combining frontend UI with Node.js/Express backend logic."
        />
        <hr className=" border-[#dcdcdc] z-10" />
        <ServiceItem
          name="REST API Design & Integration"
          description="Building and integrating secure, scalable APIs and third-party services."
        />
        <hr className=" border-[#dcdcdc] z-10" />
        <ServiceItem
          name="Authentication & Web Security"
          description="JWT authentication, input validation, secure API practices, and protection against common web vulnerabilities."
        />
        <hr className=" border-[#dcdcdc] z-10" />
        <ServiceItem
          name="Database Design & Management"
          description="Relational database modeling, SQL/MySQL, Prisma ORM, and transactional data handling."
        />
        <hr className=" border-[#dcdcdc] z-10" />
        <ServiceItem
          name="Performance Optimization"
          description="Code splitting, lazy loading, caching strategies, CDN usage, and performance-focused architecture."
        />
        <hr className=" border-[#dcdcdc] z-10" />
        <ServiceItem
          name="Modern UI/UX Implementation"
          description="Translating Figma/design concepts into fast, accessible, and visually polished interfaces."
        />
        <hr className=" border-[#dcdcdc] z-10" />
        <ServiceItem
          name="E-commerce & Payment Integration"
          description="Checkout flows, Stripe integration, webhooks, and transactional workflows."
        />
        <hr className=" border-[#dcdcdc] z-10" />
        <ServiceItem
          name="Headless / Decoupled Architecture"
          description="Building scalable systems with separated frontend and backend layers."
        />
        <hr className=" border-[#dcdcdc] z-10" />
        <ServiceItem
          name="Deployment & DevOps Workflow"
          description="Docker, Git workflows, CI/CD pipelines, environment setup, and cloud deployment."
        />
        <hr className=" border-[#dcdcdc] z-10" />
      </div>
    </section>
  );
};

export default ServicesSection;
