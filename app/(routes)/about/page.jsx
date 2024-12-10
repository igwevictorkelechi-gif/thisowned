import React from "react";

function AboutUs() {
  return (
    <div className="mx-auto px-4 py-10 sm:px-10 sm:py-20 lg:px-20 bg-black text-white">
      <h1 className="text-2xl font-semibold text-white sm:text-3xl tracking-wider">
        About Us
      </h1>
      <p className="mt-4 md:mt-5 text-sm md:text-base">
        THISOWNED is a positive form of differentiation.
      </p>

      <p className="mt-2 md:mt-1 text-sm md:text-base">
        THISOWNED MEANS TO BE DIFFERENT IN SO MANY WAYS BEING DIFFERENT IN THE
        SENSE THAT YOUR BEING SCARES PEOPLE TO THE EXTENT THEYLL TREAT YOU LIKE
        A THISOWNED (DISOWNED) or Reject MEMBER OF A FAMILY OR AN ORGANIZATION.
      </p>

      <h1 className="text-2xl font-semibold text-white sm:text-3xl tracking-wider mt-14">
        Contact
      </h1>
      <p className="mt-4 md:mt-5 text-sm md:text-base">
        Manager: <a href="tel:+2347035075777">+234 703 507 5777</a>
      </p>

      <p className="mt-2 md:mt-1 text-sm md:text-base">
        Email:{" "}
        <a href="mailto:thisownedrep@gmail.com">thisownedrep@gmail.com</a>
      </p>
    </div>
  );
}

export default AboutUs;
