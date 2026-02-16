import React from "react";
import AnimatedButton from "./AnimatedButton"; // Import AnimatedButton

const CollaborationSection: React.FC = () => {
  return (
    <section className="py-16 pb-48 w-full max-w-[1400px] mx-auto px-4 md:px-8">
      {/* Row for Header and Paragraph */}
      <div className="flex flex-col lg:flex-row justify-between items-end mb-12">
        <h2 className="text-6xl font-[granary] uppercase text-[#121723] w-full lg:w-1/2 text-left">
          Two ways to <br></br>
          <span className="font-bold">collaborate</span>
        </h2>
        <p className="text-lg w-full text-left lg:w-1/3 lg:text-right">
          Two packages designed to precisely meet your needs. Discover the one
          that suits your project and let's move your ideas forward.
        </p>
      </div>

      {/* Columns for collaboration options */}
      <div className="flex flex-col md:flex-row mt-12 gap-8 items-stretch">
        {/* 66% width main column, now contains two inner columns */}
        <div className="w-full md:w-2/3 bg-[#0a0a0a] px-8 rounded-2xl text-white flex flex-col md:flex-row gap-8">
          {/* Left Inner Column - for "2 strategies" and "Two ways of working together" */}
          <div className="w-full md:w-1/2 flex flex-col justify-between py-8">
            <div className="bg-black text-white px-4 py-2 rounded-full text-sm self-start">
              2 strategies, 100% results
            </div>
            <p className="text-3xl max-w-[90%] text-left font-[granary] uppercase mt-8">
              Two ways of working together
            </p>
          </div>

          {/* Right Inner Column - for Monthly Subscription */}
          <div className="w-full md:w-1/2 flex flex-col py-8 pl-8 rounded-2xl border-l border-[#333]">
            <h3 className="text-3xl font-[500] italic mb-4 text-left">
              Monthly subscription
            </h3>
            <p className="text-md mb-8 text-left text-gray-300">
              The monthly payment offer is a solution to be able to have a
              project quickly without paying a certain amount upfront.
            </p>
            <hr className="border-gray-600 mb-8" />
            <ul className="list-none space-y-4 mb-8 text-left">
              <li>✔ Easy & fast</li>
              <li>✔ Classic project process</li>
              <li>✔ Can be combined with packages.</li>
            </ul>
            <div className="mt-auto">
              {" "}
              {/* Push button to bottom */}
              <AnimatedButton
                text="See offer"
                baseBgColor="bg-white"
                baseTextColor="text-black"
                hoverTextColor="text-white"
                baseBorderColor="border-white"
                hoverBgColor="bg-[#0a0a0a]"
                hoverBorderColor="group-hover:border-[#0a0a0a]"
                className="w-full !py-3"
              />
            </div>
          </div>
        </div>

        {/* 33% width column (reverted to placeholder) */}
        <div className="w-full md:w-1/3 bg-gray-100 rounded-lg flex flex-col justify-between">
          <div className="bg-white py-8 px-8 rounded-2xl h-full flex flex-col">
            <h3 className="text-3xl font-[500] italic mb-4 text-left">
              Fixed-price packages
            </h3>
            <p className="text-md mb-8 text-left text-black">
              A classic approach in project design: you choose the formula that
              suits you best, we adapt it, and payment is made at the end.
            </p>
            <hr className="border-gray-600 mb-8" />
            <ul className="list-none space-y-4 mb-8 text-left">
              <li>✔ Easy & fast</li>
              <li>✔ Classic project process</li>
              <li>✔ Can be combined with packages.</li>
            </ul>
            <div className="mt-auto">
              {" "}
              {/* Push button to bottom */}
              <AnimatedButton
                text="See offer"
                baseBgColor="bg-black"
                baseTextColor="text-white"
                hoverTextColor="text-black"
                hoverBgColor="bg-white"
                className="w-full !py-3"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollaborationSection;
