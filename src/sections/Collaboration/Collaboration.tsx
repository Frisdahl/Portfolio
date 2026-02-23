import React from "react";
import AnimatedButton from "../../components/AnimatedButton";

const Collaboration: React.FC = () => {
  return (
    <section
      id="collaboration"
      className="py-16 pb-48 w-full max-w-[1700px] mx-auto px-4 md:px-8 text-[var(--foreground)]"
    >
      <div className="flex flex-col lg:flex-row justify-between items-end mb-24">
        <h2 className="text-6xl md:text-6xl lg:text-7xl xl:text-8xl font-newroman uppercase text-[var(--foreground)] w-full lg:w-1/2 text-left">
          Two ways to <br></br>
          <span className="font-newroman pl-48">collaborate</span>
        </h2>
        <p className="text-lg w-full text-left lg:w-1/3 lg:text-right opacity-80 font-switzer">
          Two packages designed to precisely meet your needs. Discover the one
          that suits your project and let's move your ideas forward.
        </p>
      </div>

      <div className="flex flex-col md:flex-row mt-12 gap-8 items-stretch">
        <div className="w-full md:w-2/3 bg-[var(--foreground)] px-8 rounded-2xl text-[var(--background)] flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 flex flex-col justify-between py-8">
            <div className="bg-[var(--background)] text-[var(--foreground)] px-4 py-2 rounded-full text-sm self-start font-switzer">
              2 strategies, 100% results
            </div>
            <p className="text-3xl max-w-[90%] text-left font-newroman uppercase mt-8 text-[var(--background)]">
              Two ways of working together
            </p>
          </div>

          <div className="w-full md:w-1/2 flex flex-col py-8 pl-8 rounded-3xl border-l border-[var(--background)]">
            <h3 className="text-3xl font-[500] italic mb-4 text-left text-[var(--background)] font-newroman">
              Monthly subscription
            </h3>
            <p className="text-md mb-8 text-left text-[var(--background)] opacity-70 font-switzer">
              The monthly payment offer is a solution to be able to have a
              project quickly without paying a certain amount upfront.
            </p>
            <hr className="border-[var(--background)] opacity-20 mb-8" />
            <ul className="list-none space-y-4 font-switzer mb-8 text-left text-[var(--background)]">
              <li>✔ Easy & fast</li>
              <li>✔ Classic project process</li>
              <li>✔ Can be combined with packages.</li>
            </ul>
            <div className="mt-auto">
              <AnimatedButton
                text="See offer"
                baseBgColor="bg-[var(--background)]"
                baseTextColor="text-[var(--foreground)]"
                hoverTextColor="group-hover/btn:text-[var(--background)]"
                baseBorderColor="border-[var(--background)]"
                hoverBgColor="bg-[var(--foreground)]"
                hoverBorderColor="group-hover:border-[var(--background)]"
                className="w-full !py-3 font-switzer"
              />
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/3 bg-[var(--foreground)] rounded-lg flex flex-col justify-between">
          <div className="bg-[var(--background)] py-8 px-8 rounded-2xl h-full flex flex-col">
            <h3 className="text-3xl font-[500] italic mb-4 text-left text-[var(--foreground)] font-newroman">
              Fixed-price packages
            </h3>
            <p className="text-md mb-8 text-left text-[var(--foreground)] opacity-80 font-switzer">
              A classic approach in project design: you choose the formula that
              suits you best, we adapt it, and payment is made at the end.
            </p>
            <hr className="border-[var(--foreground)] opacity-20 mb-8" />
            <ul className="list-none space-y-4 mb-8 font-switzer text-left text-[var(--foreground)]">
              <li>✔ Easy & fast</li>
              <li>✔ Classic project process</li>
              <li>✔ Can be combined with packages.</li>
            </ul>
            <div className="mt-auto">
              <AnimatedButton
                text="See offer"
                baseBgColor="bg-[var(--foreground)]"
                baseTextColor="text-[var(--background)]"
                hoverTextColor="group-hover/btn:text-[var(--foreground)]"
                hoverBgColor="bg-[var(--background)]"
                className="w-full !py-3 font-switzer"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Collaboration;
