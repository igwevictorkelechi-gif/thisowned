import React from "react";

function Policy() {
  return (
    <div className="min-h-screen bg-ink text-white">
      <header className="border-b border-line bg-surface">
        <div className="section-x mx-auto max-w-5xl py-16 text-center">
          <p className="eyebrow text-primary">The Fine Print</p>
          <h1 className="display mt-3 text-5xl sm:text-7xl">Delivery Policy</h1>
        </div>
      </header>

      <div className="section-x mx-auto max-w-3xl py-16">
        <p className="leading-relaxed text-smoke">
          At Thisowned, we strive to deliver your orders as quickly and
          efficiently as possible. Here&apos;s what you need to know:
        </p>

        <h2 className="display mt-10 text-2xl">Delivery Options</h2>
        <ul className="mt-3 space-y-2 text-sm text-white/80">
          <li className="border-l-2 border-primary pl-3">Standard Delivery: 3-5 business days</li>
          <li className="border-l-2 border-primary pl-3">Express Delivery: 1-2 business days</li>
          <li className="border-l-2 border-primary pl-3">International Delivery: 7-14 business days</li>
        </ul>

        <h2 className="display mt-10 text-2xl">Delivery Fees</h2>
        <ul className="mt-3 space-y-2 text-sm text-white/80">
          <li className="border-l-2 border-primary pl-3">Standard Delivery: 5,000 naira</li>
          <li className="border-l-2 border-primary pl-3">Express Delivery: 7,000 naira</li>
          <li className="border-l-2 border-primary pl-3">International Delivery: $35</li>
        </ul>

        <h2 className="display mt-10 text-2xl">Estimated Delivery Times</h2>
        <p className="mt-3 leading-relaxed text-white/80">
          Orders placed before 3pm will be shipped the same day. Orders placed
          after 3pm will be shipped the next business day.
        </p>

        <h2 className="display mt-10 text-2xl">Tracking Your Order</h2>
        <p className="mt-3 leading-relaxed text-white/80">
          Once your order has shipped, you will receive an email with tracking
          information.
        </p>

        <h2 className="display mt-10 text-2xl">Return Policy</h2>
        <p className="mt-3 leading-relaxed text-white/80">
          For information on returns, please contact us via email:{" "}
          <a href="mailto:thisownedrep@gmail.com" className="font-bold text-primary transition hover:text-primary-dark">
            thisownedrep@gmail.com
          </a>
        </p>

        <p className="mt-10 border-t border-line pt-8 text-sm uppercase tracking-wide text-smoke">
          By placing an order on our website, you acknowledge that you have read
          and agree to our delivery policy. Thank you for shopping with us.
        </p>
      </div>
    </div>
  );
}

export default Policy;
