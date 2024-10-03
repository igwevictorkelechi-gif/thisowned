"use client";
import React, { useEffect, useState } from "react";
import FlutterwavePayment from "../../api/FlutterwavePayment";
import PaypalPayment from "../../api/PaypalPayment";
import { useCart } from "../../utils/CartContext";
import Swal from "sweetalert2";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

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
  const [paymentloading, setPaymentLoading] = useState(false); // State to handle loading
  const [dataloading, setdataLoading] = useState(false); // State to handle loading
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState("");
  // const [selectedShippingPrice, setSelectedShippingPrice] = useState(0); // Default to 0 or a predefined shipping value
  const [selectedShippingPrice, setSelectedShippingPrice] = useState(null);
  const [txRef, setTxRef] = useState(null); // State to hold the transaction reference
  // Fetch countries when component mounts
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_AUTH_SHIPPING_URL}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "country") {
          setCountries(data.options);
        }
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (selectedCountry) {
      fetch(
        `${process.env.NEXT_PUBLIC_AUTH_SHIPPING_URL}?country=${selectedCountry}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "state") {
            setStates(data.options);
          }
        })
        .catch((error) => {
          console.error("Error fetching states:", error);
        });
    }
  }, [selectedCountry]);

  const fetchShippingMethods = async (selectedState) => {
    try {
      setdataLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_SHIPPING_URL}?country=${selectedCountry}&state=${selectedState}`
      );
      const data = await response.json();
      // console.log(data);
      setShippingMethods(data.method);
      setdataLoading(false);
    } catch (error) {
      console.error("Error fetching shipping methods:", error);
      setdataLoading(false);
    }
  };

  // Trigger the fetch when a state is selected
  useEffect(() => {
    if (selectedState) {
      fetchShippingMethods(selectedState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedState]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
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

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const mainHeaders = {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    };
    setHeaders(mainHeaders);
  }, []);

  const handleProceedToPayment = async () => {
    if (!checkFormValidity()) {
      Swal.fire({
        title: "Error!",
        text: "Please fill in all required fields before proceeding with payment.",
        icon: "error",
        confirmButtonColor: "#000000",
        confirmButtonText: "Close",
      });
      return;
    }

    setPaymentLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_CHECKOUT_URL}`, {
        method: "POST",
        headers: headers, // Use the headers from state
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
      });

      // Check the response type and handle errors
      const contentType = response.headers.get("content-type");
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (!response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          const textResponse = await response.text();
          console.error("Server response:", textResponse);
        }
        throw new Error(errorMessage);
      }

      // Handle successful response
      const result = await response.json();
      // console.log("API response:", result);

      // Extract tx_ref from the response
      const { tx_ref } = result;

      // Set tx_ref in state
      setTxRef(tx_ref);

      setTimeout(() => {
        setPaymentLoading(false);
        setShowPaymentOptions(true);
      }, 1000);
    } catch (error) {
      // console.error("API error:", error);com
      Swal.fire({
        title: "Error!",
        text:
          error.message ||
          "There was an issue processing your request. Please try again.",
        icon: "error",
        confirmButtonColor: "#000000",
        confirmButtonText: "Close",
      });
    } finally {
      setPaymentLoading(false);
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
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-16 px-4 py-16 sm:px-10 xl:px-[12rem]">
          <div className="lg:col-span-2">
            <div className="mx-auto max-w-screen-xl">
              <div className="grid grid-cols-1 gap-x-16 gap-y-8">
                <div className="rounded-lg shadow-lg">
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
                        <div className="relative">
                          <ChevronDown className="absolute top-0 bottom-0 w-4 h-4 my-auto text-gray-400 right-3" />
                          <select
                            name="country"
                            id="country"
                            className="w-full rounded-md bg-black border border-gray-500 p-3 text-sm text-gray-400 outline-none appearance-none"
                            value={selectedCountry || ""}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            required
                          >
                            <option disabled value="">
                              Select Country
                            </option>
                            {countries.map((country, index) => (
                              <option key={index} value={country}>
                                {country}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="w-full">
                        <div className="relative">
                          <ChevronDown className="absolute top-0 bottom-0 w-4 h-4 my-auto text-gray-400 right-3" />
                          <select
                            name="state"
                            id="state"
                            className="w-full rounded-md bg-black border border-gray-500 p-3 text-sm text-gray-400 outline-none appearance-none "
                            value={selectedState || ""}
                            onChange={(e) => setSelectedState(e.target.value)}
                            disabled={!states.length}
                            required
                          >
                            <option disabled value="">
                              Select State
                            </option>
                            {states.map((state, index) => (
                              <option key={index} value={state}>
                                {state}
                              </option>
                            ))}
                          </select>
                        </div>
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
                    {shippingMethods.length > 0 && (
                      <p className="text-gray-300 text-sm">Shipping Method</p>
                    )}
                    <div className="flex flex-col md:flex-row gap-5">
                      {dataloading ? (
                        <p>Loading shipping methods...</p>
                      ) : shippingMethods.length > 0 ? (
                        <ul className="flex flex-col md:flex-row items-center gap-5 w-full mt-[-0.45rem] mb-5 lg:mb-8">
                          {shippingMethods.map((item, idx) => (
                            <li key={item.id} className="w-full">
                              <label
                                htmlFor={item.name}
                                className="block relative cursor-pointer"
                              >
                                <input
                                  id={item.name}
                                  type="radio"
                                  required
                                  // defaultChecked={idx === 0}
                                  name="shipping_method"
                                  className="sr-only peer"
                                  onChange={() => {
                                    setSelectedShippingPrice(
                                      item.shipping_price
                                    ); // Set the shipping price
                                    setSelectedShippingMethod(item.id); // Set the selected shipping method
                                  }}
                                />
                                <div className="w-full p-4 cursor-pointer rounded-lg border border-gray-500 bg-black shadow-sm ring-red-500 peer-checked:ring-1 duration-200">
                                  <div className="pl-7">
                                    <h3 className="leading-none text-gray-400 font-medium">
                                      {item.name} - {item.delivery_time}
                                      {/* - ₦ {item.shipping_price} */}
                                    </h3>
                                  </div>
                                </div>
                                <span className="block absolute top-4 left-5 border peer-checked:border-[5px] peer-checked:border-red-500 w-4 h-4 rounded-full"></span>
                              </label>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No shipping methods available</p>
                      )}
                    </div>

                    {/* {paymentloading ? (
                      <div className="w-full flex justify-center items-center py-10">
                        <div className="w-20 h-20 border-4 border-transparent text-gray-100 text-4xl animate-spin flex items-center justify-center border-t-gray-100 rounded-full">
                          <div className="w-16 h-16 border-4 border-transparent text-red-500 text-2xl animate-spin flex items-center justify-center border-t-red-500 rounded-full"></div>
                        </div>
                      </div>
                    ) : showPaymentOptions ? (
                      <div className="w-full">
                        <FlutterwavePayment
                          total={totalPrice + selectedShippingPrice}
                          customerInfo={formData}
                        />
                        <PaypalPayment total={totalPrice} />
                      </div>
                    ) : (
                      <div className="w-full">
                        <button
                          onClick={handleProceedToPayment}
                          className="inline-block w-full rounded-lg bg-white px-5 py-3 font-medium text-black text-center cursor-pointer"
                        >
                          Pay Now
                        </button>
                      </div>
                    )} */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="space-y-6">
              <h1 className="text-2xl text-gray-300 font-semibold">
                Order summary
              </h1>
              <ul className="space-y-6 border-t border-b border-gray-600 py-5">
                {!loading && !isCartEmpty ? (
                  cart.map((item, index) => (
                    <li key={index} className="flex items-center gap-5">
                      <div className="relative inline-block">
                        <Image
                          src={item.product.images[0].image}
                          alt={item.product.name}
                          className="size-14 rounded object-cover"
                          width={100}
                          height={100}
                        />

                        {/* Badge */}
                        <span className="absolute  -top-2 right-1 bg-red-600 text-white text-[0.60rem] font-semibold px-1.5 py-0.5 rounded-full">
                          {item.quantity}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-sm text-gray-200 font-semibold">
                          {item.product.name}
                        </h3>

                        <dl className="mt-1 space-y-0.5 text-xs text-gray-300">
                          <div>
                            <dt className="inline">Size:</dt>
                            <dd className="inline ml-1.5">
                              {item.size.rating}
                            </dd>
                          </div>

                          <div>
                            <dt className="inline">Price:</dt>
                            <dd className="inline ml-1.5">
                              ₦{item.product.price}.00
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-400 text-center">
                    {loading ? "Loading your cart..." : "Your cart is empty"}
                  </p>
                )}
              </ul>

              <div className="mt-8 flex justify-end pt-4">
                <div className="w-screen space-y-4">
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="dicount"
                      className="relative block rounded-md border border-gray-500  w-full"
                    >
                      <input
                        type="text"
                        id="dicount"
                        className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 w-full text-white text-sm py-2 mt-2.5 ml-3"
                        placeholder="Discount code or gift card"
                      />

                      <span className="absolute start-3 top-10 -translate-y-1/2 text-xs text-gray-400 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs">
                        Discount code or gift card
                      </span>
                    </label>

                    <div>
                      <button className="block rounded bg-gray-900 px-7 py-3.5 text-sm text-gray-100 transition hover:bg-gray-800">
                        Apply
                      </button>
                    </div>
                  </div>

                  <dl className="space-y-2.5 text-sm text-gray-100">
                    <div className="flex justify-between">
                      <dt>Subtotal</dt>
                      <dd className="font-semibold tracking-wider">
                        ₦{totalPrice}.00
                      </dd>
                    </div>

                    <div className="flex justify-between">
                      <dt>Shipping</dt>
                      <dd className="font-semibold tracking-wider">
                        {selectedShippingPrice !== null ? (
                          <p>₦ {selectedShippingPrice.toFixed(2)}</p>
                        ) : (
                          <p className="text-xs">₦0.00</p>
                        )}
                      </dd>
                    </div>
                  </dl>
                  <div className="flex justify-between text-lg pt-3 text-gray-50">
                    <dt className="font-semibold">Total</dt>
                    <dd className="font-semibold tracking-wider">
                      ₦{totalPrice + selectedShippingPrice}.00
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 lg:gap-16 px-4 py-16 sm:px-6 lg:px-[12rem] -mt-[5rem] lg:-mt-[8rem]">
          <div className="lg:col-span-2">
            {paymentloading ? (
              <div className="w-full flex justify-center items-center">
                <div className="w-20 h-20 border-4 border-transparent text-gray-100 text-4xl animate-spin flex items-center justify-center border-t-gray-100 rounded-full">
                  <div className="w-16 h-16 border-4 border-transparent text-red-500 text-2xl animate-spin flex items-center justify-center border-t-red-500 rounded-full"></div>
                </div>
              </div>
            ) : showPaymentOptions ? (
              <div className="w-full">
                <FlutterwavePayment
                  total={totalPrice + selectedShippingPrice}
                  tx_ref={txRef}
                  customerInfo={formData}
                />
                <PaypalPayment total={totalPrice + selectedShippingPrice} />
              </div>
            ) : (
              <div className="w-full mx-auto max-w-screen-xl">
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
      </section>
    </div>
  );
}

export default CheckoutPage;
