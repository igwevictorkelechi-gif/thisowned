"use client";
import Image from "next/image";
import Link from "next/link";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // State to handle loading
  const [hoveredProductId, setHoveredProductId] = useState(null); // State to track hovered product

  useEffect(() => {
    // Fetch the products data from the API
    fetch(process.env.NEXT_PUBLIC_PRODUCTS_URL)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        // console.log(data);
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false); // Set loading to false in case of error
      });
  }, []);

  return (
    <div>
      <section>
        <div className="mx-auto px-4 py-8 sm:px-6 sm:py-8 lg:px-12">
          {/* Loader */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex-col gap-4 w-full flex items-center justify-center">
                <div className="w-20 h-20 border-4 border-transparent text-gray-100 text-4xl animate-spin flex items-center justify-center border-t-gray-100 rounded-full">
                  <div className="w-16 h-16 border-4 border-transparent text-red-500 text-2xl animate-spin flex items-center justify-center border-t-red-500 rounded-full"></div>
                </div>
              </div>
            </div>
          ) : (
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`shop/${product.id}`}
                    className="group block overflow-hidden"
                    onMouseEnter={() => setHoveredProductId(product.id)}
                    onMouseLeave={() => setHoveredProductId(null)}
                  >
                    <Image
                      width={500}
                      height={500}
                      src={
                        hoveredProductId === product.id
                          ? product.images[1].image
                          : product.images[0].image
                      }
                      alt={product.name}
                      className="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px] text-white"
                    />

                    <div className="relative pt-3">
                      <h3 className="text-sm group-hover:underline group-hover:underline-offset-4 text-white">
                        {product.name}
                      </h3>

                      <p className="mt-2">
                        <span className="tracking-wider text-white">
                          ₦{product.price.toLocaleString()} NGN
                        </span>
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

export default Products;
