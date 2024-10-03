"use client";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import ImageGallery from "../../component/ImageGallery";
import Image from "next/image";
import Swal from "sweetalert2";
import { useCart } from "../../../utils/CartContext";

function ShopDetails({ params }) {
  const { updateCart } = useCart(); // Use the context to access updateCart function
  const [product, setProduct] = useState(null); // Store product data
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedSetItems, setSelectedSetItems] = useState([]); // Track selected set items
  const [selectedSetSizes, setSelectedSetSizes] = useState({}); // Track selected sizes for each set item
  const [totalPrice, setTotalPrice] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [token, setToken] = useState("");

  useEffect(() => {
    // Fetch product details based on the id from params
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_PRODUCTS_URL}${params.id}`
        );
        const data = await response.json();
        setProduct(data); // Store the fetched product data
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
    // Generate or retrieve token
    let storedToken = localStorage.getItem("cartToken");
    if (!storedToken) {
      storedToken = generateToken();
      localStorage.setItem("cartToken", storedToken);
    }
    setToken(storedToken);
  }, [params.id]);

  const generateToken = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 12; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  const handleQuantityChange = (event) => {
    setQuantity(Number(event.target.value));
  };

  const incrementQuantity = () => {
    setQuantity((quantity) => quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((quantity) => quantity - 1);
    }
  };

  // Function to handle size selection
  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const addToCart = async () => {
    if (!selectedSize) {
      Swal.fire({
        title: "Error!",
        text: "Please select a size",
        icon: "error",
        confirmButtonColor: "#000000",
        confirmButtonText: "Close",
      });
      // alert("Please select a size");
      return;
    }

    const payload = {
      product: product.id,
      size: selectedSize,
      quantity: quantity,
      token: token,
    };

    // console.log("Request body:", payload);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CART_URL}?token=${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          title: "Success!",
          text: "Product added to cart successfully!",
          icon: "success",
          confirmButtonColor: "#000000",
          confirmButtonText: "Close",
        });

        // Update the cart context
        updateCart(data); // Assuming the API returns the updated cart
        // alert("Product added to cart successfully!");
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to add product to cart. Please try again.",
          icon: "error",
          confirmButtonColor: "#000000",
          confirmButtonText: "Close",
        });
        // alert("Failed to add product to cart. Please try again.");
        console.log(
          `Failed to add product to cart: ${
            data.message || response.statusText
          }`
        );
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred. Please try again.",
        icon: "error",
        confirmButtonColor: "#000000",
        confirmButtonText: "Close",
      });

      // alert("An error occurred. Please try again.");
    }
  };

  const handleSetItemChange = (item, isChecked) => {
    setSelectedSetItems((prevSelected) => {
      if (isChecked) {
        return [...prevSelected, item];
      } else {
        return prevSelected.filter(
          (selectedItem) => selectedItem.id !== item.id
        );
      }
    });

    // Update total price based on selected items
    if (isChecked) {
      setTotalPrice((prevTotal) => prevTotal + item.price);
    } else {
      setTotalPrice((prevTotal) => prevTotal - item.price);
    }
  };
  // Function to handle size change for a specific set item
  const handleSetSizeChange = (itemId, size) => {
    setSelectedSetSizes((prevSizes) => ({
      ...prevSizes,
      [itemId]: size,
    }));
  };

  const addSelectedToCart = async () => {
    if (selectedSetItems.length === 0) {
      Swal.fire({
        title: "Error!",
        text: "Please select at least one set item.",
        icon: "error",
        confirmButtonColor: "#000000",
        confirmButtonText: "Close",
      });
      return;
    }

    const payloads = selectedSetItems
      .map((item) => {
        const selectedSize = selectedSetSizes[item.id]; // Get the selected size for this item
        if (!selectedSize) {
          Swal.fire({
            title: "Error!",
            text: `Please select a size for ${item.name}`,
            icon: "error",
            confirmButtonColor: "#000000",
            confirmButtonText: "Close",
          });
          return null; // Skip this item if no size is selected
        }

        return {
          product: item.id,
          size: selectedSize, // Use the selected size for this item
          quantity: 1,
          token: token,
        };
      })
      .filter(Boolean); // Remove null items from the payload

    if (payloads.length === 0) {
      // If all payloads are invalid
      Swal.fire({
        title: "Error!",
        text: "Please select valid sizes for all items.",
        icon: "error",
        confirmButtonColor: "#000000",
        confirmButtonText: "Close",
      });
      return;
    }

    try {
      for (const payload of payloads) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CART_URL}?token=${token}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
        const data = await response.json();
        // Update the cart context
        updateCart(data); // Assuming the API returns the updated cart

        if (!response.ok) {
          Swal.fire({
            title: "Error!",
            text: `Failed to add product to cart: ${
              data.message || response.statusText
            }`,
            icon: "error",
            confirmButtonColor: "#000000",
            confirmButtonText: "Close",
          });
          return;
        }
      }

      Swal.fire({
        title: "Success!",
        text: "Selected items added to cart successfully!",
        icon: "success",
        confirmButtonColor: "#000000",
        confirmButtonText: "Close",
      });
    } catch (error) {
      console.error("Error adding selected items to cart:", error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred. Please try again.",
        icon: "error",
        confirmButtonColor: "#000000",
        confirmButtonText: "Close",
      });
    }
  };

  // SPIN LOADER
  if (!product) {
    return (
      <div className="bg-black">
        <div className="flex justify-center items-center py-20">
          <div className="flex-col gap-4 w-full flex items-center justify-center">
            <div className="w-20 h-20 border-4 border-transparent text-gray-100 text-4xl animate-spin flex items-center justify-center border-t-gray-100 rounded-full">
              <div className="w-16 h-16 border-4 border-transparent text-red-500 text-2xl animate-spin flex items-center justify-center border-t-red-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    ); // Display a loading message while fetching
  }

  return (
    <div className="bg-black">
      <section className="mx-4 lg:mx-auto px-4 py-8 sm:px-32 max-w-[95%] sm:py-12">
        <>
          <div className="flex">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-1 text-xs text-white">
                <li>
                  <Link
                    href="/"
                    className="block transition hover:text-gray-200"
                  >
                    <span className="sr-only"> Home </span>
                    <Home size={15} />
                  </Link>
                </li>
                <li className="rtl:rotate-180">
                  <ChevronRight size={15} />
                </li>
                <li>
                  <Link
                    href="/../shop"
                    className="block transition hover:text-gray-200"
                  >
                    Shop
                  </Link>
                </li>
                <li className="rtl:rotate-180">
                  <ChevronRight size={15} />
                </li>
                <li>
                  <span className="block transition hover:text-gray-200">
                    {product.name}
                  </span>
                </li>
              </ol>
            </nav>
          </div>
          <div className="flex flex-col lg:flex-row gap-12 md:gap-28 mt-8">
            <div className="w-full">
              <ImageGallery images={product.images} />
            </div>
            <div className="w-full">
              <div className="md:mt-16 ml-0">
                <h1 className="font-semibold text-2xl text-white">
                  {product.name}
                </h1>
                <p className="font-light text-[1.3rem] mt-4 text-white">
                  ₦{product.price.toLocaleString()}.00
                </p>

                <div className="mt-6 flex items-center gap-6">
                  <label className="block text-base font-medium text-white">
                    Size:
                  </label>

                  <fieldset className="flex flex-wrap gap-3">
                    {product.size_guide.map(
                      (size) =>
                        size.is_available && (
                          <div key={size.id}>
                            <label
                              htmlFor={`Size${size.rating}`}
                              className={`flex cursor-pointer items-center justify-center rounded-md border px-2 py-0.5 ${
                                selectedSize === size.id
                                  ? "border-red-500 bg-white text-red-500 font-bold"
                                  : "border-gray-100 bg-white text-gray-900 hover:border-gray-200"
                              }`}
                            >
                              <input
                                type="radio"
                                name="SizeOption"
                                value={size.id}
                                id={`Size${size.rating}`}
                                className="sr-only"
                                checked={selectedSize === size.id}
                                onChange={() => handleSizeChange(size.id)}
                              />
                              <p className="text-sm font-medium">
                                {size.rating}
                              </p>
                            </label>
                          </div>
                        )
                    )}
                  </fieldset>
                </div>

                <div className="mt-10 flex items-center gap-x-5">
                  <label
                    htmlFor="Quantity"
                    className="font-medium text-base text-white"
                  >
                    Quantity:
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={decrementQuantity}
                      type="button"
                      className="size-10 leading-10 text-white transition hover:opacity-75"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="Quantity"
                      min={1}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="h-10 w-16 rounded border bg-black border-gray-200 text-center text-white"
                    />
                    <button
                      onClick={incrementQuantity}
                      type="button"
                      className="size-10 leading-10 text-white transition hover:opacity-75"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mt-12">
                  <button
                    onClick={addToCart}
                    className="bg-white hover:opacity-95 hover:text-red-500  hover:font-medium text-whte p-3 w-[100%] md:max-w-[52%] shadow-sm rounded-sm"
                  >
                    Add to Cart
                  </button>
                </div>
                {/* Conditionally render "Complete the Set" */}
                {product.complete_set && product.complete_set.length > 0 && (
                  <div className="mt-20">
                    <hr className="md:w-[90%] mb-6 border-gray-700" />

                    <h1 className="text-white tracking-tigher mb-10 font-semibold text-base">
                      COMPLETE THE SET
                    </h1>
                    <div className="w-full grid grid-cols-2 gap-20 lg:grid-cols-3 lg:gap-[6rem]">
                      {product.complete_set.map((setItem) =>
                        setItem.products.map((item) => (
                          <div key={item.id}>
                            <div className="flex flex-col justify-center items-center">
                              <Image
                                width={160}
                                height={160}
                                src={item.images[0].image}
                                alt={item.name}
                                className="rounded object-cover"
                              />
                            </div>
                            <div className="mt-3">
                              <h3 className="font-medium text-sm text-gray-100 group-hover:underline group-hover:underline-offset-4">
                                {item.name}
                              </h3>
                              <div className="relative w-72 max-w-full mx-auto my-5">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="absolute top-0 bottom-0 w-5 h-5 my-auto text-gray-400 right-3"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <select
                                  className="w-full px-3 py-1 text-sm text-gray-100 bg-black border rounded-lg shadow-sm outline-none appearance-none focus:ring-offset-2 focus:ring-red-500 focus:ring-1"
                                  value={selectedSetSizes[item.id] || ""} // Track selected size for this item
                                  onChange={(e) =>
                                    handleSetSizeChange(item.id, e.target.value)
                                  } // Handle size change
                                >
                                  <option value="" disabled>
                                    Select size
                                  </option>
                                  {item.size.map((size) => (
                                    <option key={size} value={size[0]}>
                                      {size[1]}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex items-center justify-between mt-3">
                                <input
                                  type="checkbox"
                                  className="size-4 rounded border-gray-300"
                                  id={`Option${item.id}`}
                                  onChange={(e) =>
                                    handleSetItemChange(item, e.target.checked)
                                  }
                                />
                                <p className="text-sm text-gray-200">
                                  ₦{item.price.toLocaleString()}.00
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="my-10">
                      <h1 className="text-white font-bold text-base tracking-wider">
                        TOTAL PRICE:{" "}
                        <span className="ml-10">
                          ₦{totalPrice.toLocaleString()}
                        </span>
                      </h1>
                      <button
                        className="bg-white hover:opacity-95 hover:text-red-500 hover:font-medium text-whte p-1.5 w-[100%]
                       md:max-w-[38%] shadow-sm rounded-sm mt-6"
                        onClick={addSelectedToCart}
                      >
                        Add selected to Cart
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-10">
            {/* Tab navigation */}
            <div className="pb-8 md:pb-0 border-b border-gray-200">
              <nav className="-mb-px flex flex-col md:flex-row gap-4 md:gap-6">
                {/* Product Description Tab */}
                <button
                  onClick={() => setActiveTab("description")}
                  className={`shrink-0 rounded-t-lg md:border p-1.5 md:p-3 text-sm font-medium tracking-wider ${
                    activeTab === "description"
                      ? "border-gray-300 border-b-white text-white border-l border-r"
                      : "border-transparent text-gray-400"
                  }`}
                >
                  Product Description
                </button>

                {/* Delivery Tab */}
                <button
                  onClick={() => setActiveTab("delivery")}
                  className={`shrink-0 rounded-t-lg md:border p-1.5 md:p-3 text-sm font-medium tracking-wider ${
                    activeTab === "delivery"
                      ? "border-gray-300 border-b-white text-white border-l border-r"
                      : "border-transparent text-gray-400"
                  }`}
                >
                  Delivery and return
                </button>

                {/* Delivery Tab */}
                <button
                  onClick={() => setActiveTab("care")}
                  className={`shrink-0 rounded-t-lg md:border p-1.5 md:p-3 text-sm font-medium tracking-wider ${
                    activeTab === "care"
                      ? "border-gray-300 border-b-white text-white border-l border-r"
                      : "border-transparent text-gray-400"
                  }`}
                >
                  Care
                </button>
              </nav>
            </div>

            {/* Tab content */}
            <div className="mt-7 text-white text-sm">
              {activeTab === "description" && (
                <div>
                  <ul>
                    {product.details.split("\r\n").map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === "delivery" && (
                <div>
                  <ul>
                    {product.delivery_and_return
                      .split("\r\n")
                      .map((detail, index) => (
                        <li key={index}>{detail}</li>
                      ))}
                  </ul>
                </div>
              )}

              {activeTab === "care" && (
                <div>
                  <p>
                    {product.care.split("\r\n").map((line, index) => (
                      <span key={index}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      </section>
    </div>
  );
}

export default ShopDetails;
