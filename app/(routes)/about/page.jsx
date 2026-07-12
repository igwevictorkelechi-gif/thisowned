import React from "react";

function AboutUs() {
  return (
    <div className="min-h-screen bg-ink text-white">
      <header className="border-b border-line bg-surface">
        <div className="section-x mx-auto max-w-5xl py-16 text-center">
          <p className="eyebrow text-primary">The Movement</p>
          <h1 className="display mt-3 text-5xl sm:text-7xl">About Us</h1>
        </div>
      </header>

      <div className="section-x mx-auto max-w-3xl py-16">
        <p className="text-lg font-semibold uppercase tracking-wide text-white">
          Thisowned is a positive form of differentiation.
        </p>
        <p className="mt-6 leading-relaxed text-smoke">
          Thisowned means to be different in so many ways — being different in
          the sense that your being scares people to the extent they&apos;ll treat
          you like a Thisowned (Disowned) or reject member of a family or an
          organization.
        </p>

        <div className="mt-14 border-t border-line pt-10">
          <h2 className="display text-4xl">Contact</h2>
          <div className="mt-6 space-y-3 text-sm uppercase tracking-wide text-smoke">
            <p>
              Manager:{" "}
              <a href="tel:+2347035075777" className="font-bold text-white transition hover:text-primary">
                +234 703 507 5777
              </a>
            </p>
            <p>
              Email:{" "}
              <a href="mailto:thisownedrep@gmail.com" className="font-bold text-white transition hover:text-primary">
                thisownedrep@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
