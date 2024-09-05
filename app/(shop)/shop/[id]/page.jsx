"use client";
import { ChevronRight, Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import ImageGallery from "../../component/ImageGallery";

function ShopDetails({ params }) {
  const [product, setProduct] = useState(null); // Store product data
  const [quantity, setQuantity] = useState(1);

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
          <div className="flex flex-col lg:flex-row gap- gap-28 mt-8">
            <div className="w-full">
              <ImageGallery />
            </div>
            <div className="w-full">
              <div className="mt-6 ml-0">
                <h1 className="font-semibold text-2xl text-white">
                  {product.name}
                </h1>
                <p className="font-light text-[1.3rem] mt-4 text-white">
                  ₦{product.price.toLocaleString()}
                </p>

                <div className="mt-6 flex items-center gap-6">
                  <label className="block text-base font-medium text-white">
                    Size:
                  </label>

                  <fieldset className="flex flex-wrap gap-3">
                    {/* {product.sizes.map((size) => ( */}
                    <div>
                      <label
                        //   htmlFor={`Size${size}`}
                        className="flex cursor-pointer items-center justify-center rounded-md border border-gray-100 bg-white px-2 py-0.5 text-gray-900 hover:border-gray-200"
                      >
                        <input
                          type="radio"
                          name="SizeOption"
                          //   value={size}
                          // id={`Size${size}`}
                          className="sr-only"
                        />
                        <p className="text-sm font-medium">S</p>
                      </label>
                    </div>

                    <div>
                      <label
                        //   htmlFor={`Size${size}`}
                        className="flex cursor-pointer items-center justify-center rounded-md border border-gray-100 bg-white px-2 py-0.5 text-gray-900 hover:border-gray-200"
                      >
                        <input
                          type="radio"
                          name="SizeOption"
                          //   value={size}
                          // id={`Size${size}`}
                          className="sr-only"
                        />
                        <p className="text-sm font-bold text-red-500">M</p>
                      </label>
                    </div>

                    <div>
                      <label
                        //   htmlFor={`Size${size}`}
                        className="flex cursor-pointer items-center justify-center rounded-md border border-gray-100 bg-white px-2 py-0.5 text-gray-900 hover:border-gray-200"
                      >
                        <input
                          type="radio"
                          name="SizeOption"
                          //   value={size}
                          // id={`Size${size}`}
                          className="sr-only"
                        />
                        <p className="text-sm font-bold text-red-500">L</p>
                      </label>
                    </div>

                    <div>
                      <label
                        //   htmlFor={`Size${size}`}
                        className="flex cursor-pointer items-center justify-center rounded-md border border-gray-100 bg-white px-2 py-0.5 text-gray-900 hover:border-gray-200"
                      >
                        <input
                          type="radio"
                          name="SizeOption"
                          //   value={size}
                          // id={`Size${size}`}
                          className="sr-only"
                        />
                        <p className="text-sm font-medium">XL</p>
                      </label>
                    </div>

                    <div>
                      <label
                        //   htmlFor={`Size${size}`}
                        className="flex cursor-pointer items-center justify-center rounded-md border border-gray-100 bg-white px-2 py-0.5 text-gray-900 hover:border-gray-200"
                      >
                        <input
                          type="radio"
                          name="SizeOption"
                          //   value={size}
                          // id={`Size${size}`}
                          className="sr-only"
                        />
                        <p className="text-sm text-red-500 font-bold">XXL</p>
                      </label>
                    </div>
                    {/* ))} */}
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
                  <button className="bg-white hover:opacity-95 hover:text-red-500  hover:font-medium text-whte p-3 w-[100%] md:max-w-[50%] shadow-sm rounded-sm">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex gap-6">
                <p className="shrink-0 rounded-t-lg border border-gray-300 border-b-white p-3 text-sm font-medium text-white tracking-wider">
                  Product Description
                </p>
              </nav>
            </div>
            <p className="mt-7 text-white text-sm">
              {/* {product.description} */}
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis
              aperiam quis ullam suscipit animi deserunt necessitatibus dicta
              vitae minus molestias molestiae, mollitia perspiciatis officiis
              quam unde earum eveniet culpa voluptas. Lorem ipsum dolor sit amet
              consectetur adipisicing elit. Iusto minima facere totam, assumenda
              dolore eius magni asperiores modi ipsa saepe neque non nisi
              ducimus ut reprehenderit quae veniam libero alias?
            </p>
          </div>
        </>
      </section>
    </div>
  );
}

export default ShopDetails;
