"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { useCurrency } from "../utils/CurrencyContext";

function Products() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [nextPageUrl, setNextPageUrl] = useState(
    process.env.NEXT_PUBLIC_PRODUCTS_URL
  );
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [clickedProductId, setClickedProductId] = useState(null);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const observerRef = useRef(null);
  const { currency } = useCurrency();

  const fetchProducts = async (isInitialLoad = false) => {
    if (!nextPageUrl || loadingMore) return;

    if (isInitialLoad) {
      setInitialLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const accessToken = localStorage.getItem("accessToken");

      const headers = {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      };

      const separator = nextPageUrl.includes("?") ? "&" : "?";
      const urlWithCurrency = `${nextPageUrl}${separator}code=${currency}`;

      const response = await fetch(urlWithCurrency, { headers });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      setProducts((prev) => {
        const uniqueProducts = new Map();
        [...(isInitialLoad ? [] : prev), ...data.results].forEach((product) => {
          uniqueProducts.set(product.id, product);
        });

        return Array.from(uniqueProducts.values());
      });

      setNextPageUrl(data.next);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      if (isInitialLoad) {
        setInitialLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  useEffect(() => {
    setProducts([]); // Clear products on currency change
    setNextPageUrl(process.env.NEXT_PUBLIC_PRODUCTS_URL);
    fetchProducts(true);
  }, [currency]);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!nextPageUrl) return;

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchProducts(false);
      }
    });

    const observerTarget = document.getElementById("loadMoreTrigger");
    if (observerTarget) observerRef.current.observe(observerTarget);

    return () => observerRef.current?.disconnect();
  }, [nextPageUrl]);

  const handleImageClick = (productId) => {
    if (!isLargeScreen) {
      if (clickedProductId === productId) {
        router.push(`/shop/${productId}`);
      } else {
        setClickedProductId(productId);
        router.push(`/shop/${productId}`);
      }
    }
  };

  const handleLargeScreenClick = (productId) => {
    if (isLargeScreen) {
      router.push(`/shop/${productId}`);
    }
  };

  const handleImageLoad = (productId) => {
    setLoadedImages((prev) => new Set(prev).add(productId));
  };

  return (
    <div>
      <section>
        <div className="mx-auto px-4 py-8 sm:px-6 sm:py-8 lg:px-12">
          {/* Initial Loader */}
          {initialLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex-col gap-4 w-full flex items-center justify-center">
                <div className="w-20 h-20 border-4 border-transparent text-gray-100 text-4xl animate-spin flex items-center justify-center border-t-gray-100 rounded-full">
                  <div className="w-16 h-16 border-4 border-transparent text-red-500 text-2xl animate-spin flex items-center justify-center border-t-red-500 rounded-full"></div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <ul className="mt-8 grid gap-4 gap-y-16 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <li key={product.id}>
                    <div
                      className="group block overflow-hidden cursor-pointer"
                      onClick={() =>
                        isLargeScreen
                          ? handleLargeScreenClick(product.id)
                          : handleImageClick(product.id)
                      }
                      onMouseEnter={() =>
                        isLargeScreen && setHoveredProductId(product.id)
                      }
                      onMouseLeave={() =>
                        isLargeScreen && setHoveredProductId(null)
                      }
                    >
                      <div className="relative h-[180px] md:h-[450px] w-full overflow-hidden">
                        {/* Blurred Placeholder */}
                        {!loadedImages.has(product.id) && (
                          <div className="absolute inset-0 animate-pulse"></div>
                        )}

                        <Image
                          width={500}
                          height={500}
                          src={
                            (isLargeScreen &&
                              hoveredProductId === product.id) ||
                            (!isLargeScreen && clickedProductId === product.id)
                              ? product.images[1]?.image
                              : product.images[0]?.image
                          }
                          alt={product.name}
                          className={`h-[180px] md:h-[450px] w-full object-cover transition duration-500 group-hover:scale-105 text-white ${
                            !loadedImages.has(product.id)
                              ? "blur-md scale-110"
                              : "blur-0 scale-100"
                          }`}
                          onLoad={() => handleImageLoad(product.id)}
                          onError={() => handleImageLoad(product.id)}
                        />
                      </div>

                      <div className="relative pt-3">
                        <h3 className="text-sm group-hover:underline group-hover:underline-offset-4 text-white">
                          {product.name}
                        </h3>

                        <p className="mt-2">
                          <span className="tracking-wider text-white">
                            {product.symbol}
                            {product.price.toFixed(2)}{" "}
                            <span className="uppercase">
                              {product.currency}
                            </span>
                          </span>
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Infinite Scroll Trigger */}
              <div id="loadMoreTrigger" style={{ height: "50px" }}></div>

              {/* Separate Loader for New Products */}
              {loadingMore && (
                <div className="flex justify-center items-center py-10">
                  <div className="flex justify-center items-center py-4">
                    <div className="flex-col gap-2 w-full flex items-center justify-center">
                      <div className="w-10 h-10 border-2 border-transparent text-gray-100 text-lg animate-spin flex items-center justify-center border-t-gray-100 rounded-full">
                        <div className="w-8 h-8 border-2 border-transparent text-red-500 text-sm animate-spin flex items-center justify-center border-t-red-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* <span className="text-gray-300 text-sm animate-pulse">Loading more products...</span> */}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default Products;
