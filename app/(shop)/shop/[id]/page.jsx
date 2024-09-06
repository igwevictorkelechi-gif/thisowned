"use client";
import { ChevronRight, Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import ImageGallery from "../../component/ImageGallery";

function ShopDetails({ params }) {
  const [product, setProduct] = useState(null); // Store product data
  const [quantity, setQuantity] = useState(1);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [activeTab, setActiveTab] = useState("description");

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
  }, [params.id]);

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
    setSelectedSizes((prevSelectedSizes) => {
      if (prevSelectedSizes.includes(size)) {
        // If the size is already selected, remove it
        return prevSelectedSizes.filter(
          (selectedSize) => selectedSize !== size
        );
      } else {
        // If the size is not selected, add it
        return [...prevSelectedSizes, size];
      }
    });
  };

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
              <div className="md:mt-20 ml-0">
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
                    {(() => {
                      let sizes = [];

                      try {
                        // Sanitize and parse the available_size string
                        const sanitizedSizes = product.available_size
                          .replace(/'/g, '"') // Replace single quotes with double quotes
                          .trim(); // Trim any extra whitespace

                        sizes = JSON.parse(sanitizedSizes);
                      } catch (error) {
                        console.error("Error parsing available_size:", error);
                        return (
                          <p className="text-sm text-red-500">
                            Invalid size data
                          </p>
                        );
                      }

                      return sizes.map((size) => (
                        <div key={size}>
                          <label
                            htmlFor={`Size${size}`}
                            className={`flex cursor-pointer items-center justify-center rounded-md border px-2 py-0.5 ${
                              selectedSizes.includes(size)
                                ? "border-red-500 bg-white text-red-500 font-bold"
                                : "border-gray-100 bg-white text-gray-900 hover:border-gray-200"
                            }`}
                          >
                            <input
                              type="checkbox"
                              name="SizeOption"
                              value={size}
                              id={`Size${size}`}
                              className="sr-only"
                              checked={selectedSizes.includes(size)} // Mark as checked if it's selected
                              onChange={() => handleSizeChange(size)} // Handle multiple selections
                            />
                            <p className="text-sm font-medium">{size}</p>
                          </label>
                        </div>
                      ));
                    })()}
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
                  <button className="bg-white hover:opacity-95 hover:text-red-500  hover:font-medium text-whte p-3 w-[100%] md:max-w-[52%] shadow-sm rounded-sm">
                    Add to Cart
                  </button>
                </div>
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
              {activeTab === "description" && <p>{product.details}</p>}
              {activeTab === "delivery" && <p>{product.delivery_and_return}</p>}
              {activeTab === "care" && <p>{product.care}</p>}
            </div>
          </div>
        </>
      </section>
    </div>
  );
}

export default ShopDetails;
