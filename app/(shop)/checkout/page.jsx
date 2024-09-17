"use client";
import React, { useState } from "react";
import FlutterwavePayment from "../../api/FlutterwavePayment";
import PaypalPayment from "../../api/PaypalPayment";
import { useCart } from "../../utils/CartContext";
import Swal from "sweetalert2";

function CheckoutPage() {
  const { totalPrice } = useCart();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    postcode: "",
    address: "",
  });
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [loading, setLoading] = useState(false); // State to handle loading

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const checkFormValidity = () => {
    const { firstName, lastName, email, phone, city, address } = formData;
    return firstName && lastName && email && phone && city && address;
  };

  const handleProceedToPayment = () => {
    if (checkFormValidity()) {
      setLoading(true); // Start loading
      setTimeout(() => {
        setLoading(false); // Stop loading after 3 seconds
        setShowPaymentOptions(true); // Show payment options
      }, 1000);
    } else {
      Swal.fire({
        title: "Error!",
        text: "Please fill in all required fields before proceeding with payment.",
        icon: "error",
        confirmButtonColor: "#000000",
        confirmButtonText: "Close",
      });
    }
  };

  return (
    <div className="mx-auto bg-black">
      <header className="text-center pt-10 pb-2">
        <h2 className="text-xl font-bold text-white sm:text-3xl tracking-wider">
          Checkout
        </h2>
      </header>

      <section>
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-x-16 gap-y-8 ">
            <div className="rounded-lg shadow-lg lg:p-12">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-5">
                  <div className="w-full">
                    <label className="sr-only" htmlFor="firstname">
                      First Name
                    </label>
                    <input
                      className="w-full rounded-lg bg-black border border-gray-500 p-3 text-sm text-white"
                      placeholder="First Name"
                      type="text"
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="w-full">
                    <label className="sr-only" htmlFor="lastname">
                      Last Name
                    </label>
                    <input
                      className="w-full rounded-md bg-black border border-gray-500 p-3 text-sm text-white"
                      placeholder="Last Name"
                      type="text"
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-5">
                  <div className="w-full">
                    <label className="sr-only" htmlFor="email">
                      Email
                    </label>
                    <input
                      className="w-full rounded-md bg-black border border-gray-500 p-3 text-sm text-white"
                      placeholder="Email address"
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="w-full">
                    <label className="sr-only" htmlFor="phone">
                      Phone
                    </label>
                    <input
                      className="w-full rounded-md bg-black border border-gray-500 p-3 text-sm text-white"
                      placeholder="Phone Number"
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-5">
                  <div className="w-full">
                    <label className="sr-only" htmlFor="city">
                      City
                    </label>
                    <input
                      className="w-full rounded-md bg-black border border-gray-500 p-3 text-sm text-white"
                      placeholder="City"
                      type="text"
                      id="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="w-full">
                    <label className="sr-only" htmlFor="postcode">
                      Postcode
                    </label>
                    <input
                      className="w-full rounded-md bg-black border border-gray-500 p-3 text-sm text-white"
                      placeholder="Postcode (Optional)"
                      type="text"
                      id="postcode"
                      value={formData.postcode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="sr-only" htmlFor="address">
                    Address
                  </label>

                  <textarea
                    className="w-full rounded-md bg-black border text-white border-gray-500 p-3 text-sm"
                    placeholder="Address"
                    rows="8"
                    id="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>

                {loading ? (
                  <div className="w-full flex justify-center items-center py-10">
                    <div className="w-20 h-20 border-4 border-transparent text-gray-100 text-4xl animate-spin flex items-center justify-center border-t-gray-100 rounded-full">
                      <div className="w-16 h-16 border-4 border-transparent text-red-500 text-2xl animate-spin flex items-center justify-center border-t-red-500 rounded-full"></div>
                    </div>
                  </div>
                ) : showPaymentOptions ? (
                  <div className="w-full">
                    <FlutterwavePayment
                      total={totalPrice}
                      customerInfo={formData}
                    />
                    <PaypalPayment total={totalPrice} />
                  </div>
                ) : (
                  <div className="mt-4 w-full">
                    <button
                      onClick={handleProceedToPayment}
                      className="inline-block w-full rounded-lg bg-white px-5 py-3 font-medium text-black text-center cursor-pointer"
                    >
                      Pay Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CheckoutPage;
