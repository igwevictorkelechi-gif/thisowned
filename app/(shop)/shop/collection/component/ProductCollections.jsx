"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

function ProductCollections({ collections, isAllCollections }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hoveredProductId, setHoveredProductId] = useState(null); // State to track hovered product for large screens
  const [clickedProductId, setClickedProductId] = useState(null); // State to track clicked product for small screens
  const [isLargeScreen, setIsLargeScreen] = useState(false); // State to check if it's a large screen

  useEffect(() => {
    if (collections) {
      setLoading(false);
    }

    // Check if the screen size is large
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 640); // For 'sm' breakpoint (640px and above)
    };

    // Set the initial screen size
    handleResize();

    // Add event listener to check for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [collections]);

  // Function to handle the image click for small screens
  const handleImageClick = (productId) => {
    if (!isLargeScreen) {
      // For small screens
      if (clickedProductId === productId) {
        // If the image has already been clicked, navigate to the product page
        router.push(`/shop/${productId}`);
      } else {
        // Otherwise, toggle the image
        setClickedProductId(productId);
      }
    }
  };

  // Function to handle the image click for large screens
  const handleLargeScreenClick = (productId) => {
    if (isLargeScreen) {
      // Directly navigate to the product page on large screens
      router.push(`/shop/${productId}`);
    }
  };

  const renderProducts = (products) => (
    <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <li key={product.id}>
          <div
            className="group block overflow-hidden cursor-pointer"
            onClick={() => {
              isLargeScreen
                ? handleLargeScreenClick(product.id)
                : handleImageClick(product.id);
            }} // Click behavior varies based on screen size
            onMouseEnter={() =>
              isLargeScreen && setHoveredProductId(product.id)
            } // Only allow hover behavior on large screens
            onMouseLeave={() => isLargeScreen && setHoveredProductId(null)} // Reset hover on large screens
          >
            <Image
              width={500}
              height={500}
              src={
                (isLargeScreen && hoveredProductId === product.id) ||
                (!isLargeScreen &&
                  clickedProductId === product.id &&
                  product.images.length > 1)
                  ? product.images[1]?.image // Ensure product.images[1] exists
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
                  {product.symbol}
                  {product.price.toFixed(2)}{" "}
                  <span className="uppercase">{product.currency}</span>
                </span>
              </p>
              {product.discount > 0 && (
                <p className="mt-1 text-sm text-red-500">
                  Discount: {product.discount}%
                </p>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      <section>
        <div className="mx-auto px-4 py-8 sm:px-6 sm:py-8 lg:px-12">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex-col gap-4 w-full flex items-center justify-center">
                <div className="w-20 h-20 border-4 border-transparent text-gray-100 text-4xl animate-spin flex items-center justify-center border-t-gray-100 rounded-full">
                  <div className="w-16 h-16 border-4 border-transparent text-red-500 text-2xl animate-spin flex items-center justify-center border-t-red-500 rounded-full"></div>
                </div>
              </div>
            </div>
          ) : isAllCollections ? (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                {/* {collections.name} */}
              </h2>
              {renderProducts(collections.products)}
            </div>
          ) : (
            renderProducts(collections.products)
          )}
        </div>
      </section>
    </div>
  );
}

export default ProductCollections;
