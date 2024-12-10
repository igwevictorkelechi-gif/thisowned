import React from "react";

function Policy() {
  return (
    <div className="mx-auto px-4 py-10 sm:px-10 sm:py-20 lg:px-20 bg-black text-white">
      <h1 className="text-2xl font-semibold text-white sm:text-3xl tracking-wider">
        Delivery Policy
      </h1>
      <p className="mt-4 md:mt-5 text-sm md:text-base">
        At Thisowned, we strive to deliver your orders as quickly and
        efficiently as possible. Here&apos;s what you need to know:
      </p>

      <h2 className="text-lg font-semibold text-white mt-6">
        Delivery Options
      </h2>
      <ul className="mt-2 md:mt-3 text-sm md:text-base list-disc list-inside">
        <li>Standard Delivery: 3-5 business days</li>
        <li>Express Delivery: 1-2 business days</li>
        <li>International Delivery: 7-14 business days</li>
      </ul>

      <h2 className="text-lg font-semibold text-white mt-6">Delivery Fees</h2>
      <ul className="mt-2 md:mt-3 text-sm md:text-base list-disc list-inside">
        <li>Standard Delivery: 5,000 naira</li>
        <li>Express Delivery: 7,000 naira</li>
        <li>International Delivery: $35</li>
      </ul>

      <h2 className="text-lg font-semibold text-white mt-6">
        Estimated Delivery Times
      </h2>
      <p className="mt-2 md:mt-3 text-sm md:text-base">
        Orders placed before 3pm will be shipped the same day. Orders placed
        after 3pm will be shipped the next business day.
      </p>

      <h2 className="text-lg font-semibold text-white mt-6">
        Tracking Your Order
      </h2>
      <p className="mt-2 md:mt-3 text-sm md:text-base">
        Once your order has shipped, you will receive an email with tracking
        information.
      </p>

      <h2 className="text-lg font-semibold text-white mt-6">Return Policy</h2>
      <p className="mt-2 md:mt-3 text-sm md:text-base">
        For information on returns, please contact us through Email:{" "}
        <a href="mailto:thisownedrep@gmail.com" className="text-blue-500">
          thisownedrep@gmail.com
        </a>
      </p>

      <p className="mt-6 md:mt-8 text-sm md:text-base">
        By placing an order on our website, you acknowledge that you have read
        and agree to our delivery policy. Thank you for shopping with us!
      </p>
    </div>
  );
}

export default Policy;
