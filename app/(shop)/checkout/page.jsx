"use client";
import React, { useEffect, useState } from "react";
import FlutterwavePayment from "../../api/FlutterwavePayment";
import PaypalPayment from "../../api/PaypalPayment";
import PaystackPayment from "../../api/PaystackPayment";
import { useCart } from "../../utils/CartContext";
import Swal from "sweetalert2";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useCurrency } from "../../utils/CurrencyContext";

function CheckoutPage() {
  const {
    cart, // Cart data
    loading, // Loading state
    isCartEmpty, // Whether cart is empty
    totalPrice,
  } = useCart();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    postcode: "",
    address: "",
  });
  const [headers, setHeaders] = useState({});
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [paymentloading, setPaymentLoading] = useState(false);
  const [dataloading, setdataLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState("");
  const [selectedShippingPrice, setSelectedShippingPrice] = useState(null);
  const [txRef, setTxRef] = useState(null);
  const [totalInUsd, setTotalInUsd] = useState(null);
  const [totalInNgn, setTotalInNgn] = useState(null);
  const [total, setTotal] = useState(null);
  const { currency } = useCurrency();

  const [initiatePayment, setInitiatePayment] = useState(false);

  // Reset everything when currency changes
  useEffect(() => {
    if (!currency) return;

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postcode: "",
    });

    setCountries([]);
    setStates([]);
    setShippingMethods([]);
    setSelectedCountry("");
    setSelectedState("");

    setSelectedShippingMethod("");
    setSelectedShippingPrice(null);

    setShowPaymentOptions(false);
    setTxRef(null);
    setTotalInUsd(null);
    setTotalInNgn(null);
    setTotal(null);

    fetchCountries();
  }, [currency]);

  const fetchCountries = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_SHIPPING_URL}`
      );
      const data = await response.json();
      if (data.status === "country") {
        setCountries(data.options);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchStates = async (country) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_SHIPPING_URL}?country=${country}`
      );
      const data = await response.json();
      if (data.status === "state") {
        setStates(data.options);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const fetchShippingMethods = async (state) => {
    try {
      setdataLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_SHIPPING_URL}?country=${selectedCountry}&state=${state}&code=${currency}`
      );
      const data = await response.json();
      setShippingMethods(data.method);
    } catch (error) {
      console.error("Error fetching shipping methods:", error);
    } finally {
      setdataLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCountry) {
      setSelectedState("");
      setShippingMethods([]);
      setSelectedShippingMethod("");
      setSelectedShippingPrice(null);
      setShowPaymentOptions(false);
      fetchStates(selectedCountry);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState && selectedCountry) {
      setSelectedShippingMethod("");
      setSelectedShippingPrice(null);
      setShowPaymentOptions(false);
      fetchShippingMethods(selectedState);
    }
  }, [selectedState, selectedCountry]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const mainHeaders = {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    };
    setHeaders(mainHeaders);
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
    setShowPaymentOptions(false);
  };

  const checkFormValidity = () => {
    const { firstName, lastName, email, phone, city, address } = formData;
    return (
      firstName &&
      lastName &&
      email &&
      phone &&
      city &&
      address &&
      selectedCountry &&
      selectedState &&
      selectedShippingPrice
    );
  };

  const handleProceedToPayment = async () => {
    if (!checkFormValidity()) {
      Swal.fire({
        title: "Error!",
        text: "Please fill in all required fields before proceeding with payment.",
        icon: "error",
        confirmButtonColor: "#e02e21",
        confirmButtonText: "Close",
      });
      return;
    }

    setPaymentLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CHECKOUT_URL}?code=${currency}`,
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            shipping_address: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              email: formData.email,
              phone: formData.phone,
              address: formData.address,
              city: formData.city,
              postal_code: formData.postcode,
              country: selectedCountry,
              state: selectedState,
            },
            shipping_method: selectedShippingMethod,
          }),
        }
      );

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = "An unexpected error occurred. Please try again.";

        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          const textResponse = await response.text();
          console.error("Server response:", textResponse);
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();

      let { tx_ref, amount, amount_usd, amount_ngn } = result;

      const rawAmount = Number(amount);

      setTxRef(tx_ref);

      setTotalInUsd(amount_usd);
      setTotalInNgn(amount_ngn);
      setTotal(rawAmount);

      setPaymentLoading(false);

      setShowPaymentOptions(true);

      setTimeout(() => {
        setInitiatePayment(true);
      }, 300);
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text:
          error.message ||
          "There was an issue processing your request. Please try again.",
        icon: "error",
        confirmButtonColor: "#e02e21",
        confirmButtonText: "Close",
      });
      setPaymentLoading(false);
    }
  };

  const handlePaymentClosed = () => {
    setInitiatePayment(false);
  };

  const handleShippingMethodSelect = (method, price) => {
    setSelectedShippingMethod(method);
    setSelectedShippingPrice(price);
    setShowPaymentOptions(false);
  };

  const symbol = cart.length > 0 ? cart[0].product.symbol : "";

  const inputClass =
    "w-full border border-line bg-surface p-3 text-sm text-white placeholder:text-smoke focus:border-primary focus:outline-none";
  const selectClass =
    "w-full appearance-none border border-line bg-surface p-3 text-sm text-white outline-none focus:border-primary";

  return (
    <div className="min-h-screen bg-ink">
      <header className="border-b border-line bg-surface">
        <div className="section-x mx-auto max-w-7xl py-10 text-center">
          <p className="eyebrow text-primary">Almost Yours</p>
          <h1 className="display mt-2 text-4xl sm:text-6xl">Checkout</h1>
        </div>
      </header>

      <section className="section-x mx-auto max-w-7xl py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-14">
          {/* Left: form */}
          <div className="lg:col-span-2">
            <h2 className="eyebrow mb-5 text-white">Shipping Details</h2>
            <div className="space-y-4">
              <div className="flex flex-col gap-4 md:flex-row">
                <input className={inputClass} placeholder="First Name" type="text" id="firstName" value={formData.firstName} onChange={handleInputChange} required />
                <input className={inputClass} placeholder="Last Name" type="text" id="lastName" value={formData.lastName} onChange={handleInputChange} required />
              </div>

              <div className="flex flex-col gap-4 md:flex-row">
                <input className={inputClass} placeholder="Email address" type="email" id="email" value={formData.email} onChange={handleInputChange} required />
                <input className={inputClass} placeholder="Phone Number" type="tel" id="phone" value={formData.phone} onChange={handleInputChange} required />
              </div>

              <div className="flex flex-col gap-4 md:flex-row">
                <div className="relative w-full">
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-smoke" />
                  <select id="country" className={selectClass} value={selectedCountry || ""} onChange={(e) => setSelectedCountry(e.target.value)} required>
                    <option disabled value="">Select Country</option>
                    {countries.map((country, index) => (
                      <option key={index} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
                <div className="relative w-full">
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-smoke" />
                  <select id="state" className={selectClass} value={selectedState || ""} onChange={(e) => setSelectedState(e.target.value)} disabled={!states.length} required>
                    <option disabled value="">Select State</option>
                    {states.map((state, index) => (
                      <option key={index} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-4 md:flex-row">
                <input className={inputClass} placeholder="City" type="text" id="city" value={formData.city} onChange={handleInputChange} required />
                <input className={inputClass} placeholder="Postcode (Optional)" type="text" id="postcode" value={formData.postcode} onChange={handleInputChange} />
              </div>

              <textarea className={inputClass} placeholder="Address" rows="6" id="address" value={formData.address} onChange={handleInputChange} required></textarea>

              {/* Shipping methods */}
              {(shippingMethods.length > 0 || dataloading) && (
                <div className="pt-2">
                  <h2 className="eyebrow mb-3 text-white">Shipping Method</h2>
                  {dataloading ? (
                    <p className="text-sm text-smoke">Loading shipping methods...</p>
                  ) : (
                    <ul className="flex flex-col gap-3 md:flex-row">
                      {shippingMethods.map((item) => (
                        <li key={item.id} className="w-full">
                          <label htmlFor={item.name} className="relative block cursor-pointer">
                            <input
                              id={item.name}
                              type="radio"
                              required
                              name="shipping_method"
                              className="peer sr-only"
                              onChange={() => {
                                setSelectedShippingPrice(item.shipping_price);
                                setSelectedShippingMethod(item.id);
                              }}
                            />
                            <div className="border border-line bg-surface p-4 pl-11 transition peer-checked:border-primary peer-checked:bg-primary/5">
                              <h3 className="text-sm font-semibold uppercase text-white">
                                {item.name} — {item.delivery_time}
                              </h3>
                            </div>
                            <span className="absolute left-4 top-1/2 size-4 -translate-y-1/2 rounded-full border border-line peer-checked:border-[5px] peer-checked:border-primary"></span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Payment / proceed */}
            <div className="mt-8">
              {paymentloading ? (
                <div className="flex w-full items-center justify-center py-6">
                  <div className="h-14 w-14 animate-spin rounded-full border-4 border-line border-t-primary"></div>
                </div>
              ) : showPaymentOptions ? (
                <div className="w-full">
                  <FlutterwavePayment
                    total={total}
                    tx_ref={txRef}
                    customerInfo={formData}
                    currency={currency}
                  />
                </div>
              ) : (
                <button onClick={handleProceedToPayment} className="btn-primary w-full">
                  Proceed to Payment
                </button>
              )}
            </div>
          </div>

          {/* Right: order summary */}
          <div>
            <div className="border border-line bg-surface p-6">
              <h2 className="display text-2xl">Order Summary</h2>
              <ul
                className="mt-5 max-h-64 space-y-5 overflow-y-auto border-y border-line py-5 scrollbar scrollbar-track-surface2 scrollbar-thumb-line scrollbar-w-1.5"
                data-lenis-prevent
              >
                {!loading && !isCartEmpty ? (
                  cart.map((item, index) => (
                    <li key={index} className="flex items-center gap-4">
                      <div className="relative shrink-0">
                        <Image
                          src={item.product.images[0].image}
                          alt={item.product.name}
                          className="size-14 border border-line object-cover"
                          width={100}
                          height={100}
                        />
                        <span className="absolute -right-2 -top-2 flex min-w-[1.1rem] items-center justify-center rounded-full bg-primary px-1 text-[0.6rem] font-bold text-white">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold uppercase text-white">
                          {item.product.name}
                        </h3>
                        <p className="mt-1 text-xs text-smoke">
                          Size: <span className="text-white">{item.size.rating}</span>
                        </p>
                        <p className="mt-0.5 text-xs">
                          {item.product.discount > 0 ? (
                            <>
                              <span className="text-smoke line-through">
                                {item.product.symbol}
                                {item.product.price.toFixed(2)}
                              </span>
                              <span className="ml-2 font-bold text-primary">
                                {item.product.symbol}
                                {item.product.discount_price.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="font-bold text-white">
                              {item.product.symbol}
                              {item.product.price.toFixed(2)}
                            </span>
                          )}
                        </p>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-center text-sm text-smoke">
                    {loading ? "Loading your cart..." : "Your cart is empty"}
                  </p>
                )}
              </ul>

              <div className="mt-5 flex gap-2">
                <input
                  type="text"
                  className="w-full border border-line bg-ink px-3 py-2.5 text-sm text-white placeholder:text-smoke focus:border-primary focus:outline-none"
                  placeholder="Discount code"
                />
                <button className="shrink-0 border border-line bg-surface2 px-5 text-xs font-bold uppercase tracking-widest text-white transition hover:border-primary">
                  Apply
                </button>
              </div>

              <dl className="mt-5 space-y-2.5 text-sm text-white/80">
                <div className="flex justify-between">
                  <dt className="uppercase tracking-wide">Subtotal</dt>
                  <dd className="font-semibold text-white">
                    {symbol}
                    {totalPrice.toFixed(2)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="uppercase tracking-wide">Shipping</dt>
                  <dd className="font-semibold text-white">
                    {symbol}
                    {(selectedShippingPrice || 0).toFixed(2)}
                  </dd>
                </div>
              </dl>
              <div className="mt-3 flex justify-between border-t border-line pt-3 text-lg">
                <dt className="font-bold uppercase tracking-wide text-white">Total</dt>
                <dd className="font-bold text-primary">
                  {symbol}
                  {(totalPrice + (selectedShippingPrice || 0)).toFixed(2)}
                </dd>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CheckoutPage;
