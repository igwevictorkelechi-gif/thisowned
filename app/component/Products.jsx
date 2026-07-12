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

  const Spinner = ({ size = "lg" }) => (
    <div className="flex w-full items-center justify-center">
      <div
        className={`${
          size === "lg" ? "h-16 w-16 border-4" : "h-9 w-9 border-2"
        } animate-spin rounded-full border-line border-t-primary`}
      ></div>
    </div>
  );

  return (
    <div>
      <section>
        <div className="section-x mx-auto max-w-7xl py-8">
          {initialLoading ? (
            <div className="flex items-center justify-center py-24">
              <Spinner />
            </div>
          ) : (
            <>
              <ul className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-4 xl:grid-cols-4">
                {products.map((product) => (
                  <li key={product.id}>
                    <div
                      className="group block cursor-pointer border border-line bg-surface transition-colors duration-200 hover:border-primary"
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
                      <div className="relative h-[220px] w-full overflow-hidden bg-surface2 md:h-[420px]">
                        {product.discount > 0 && (
                          <span className="absolute left-0 top-0 z-10 bg-primary px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-white">
                            -{product.discount}%
                          </span>
                        )}
                        {!loadedImages.has(product.id) && (
                          <div className="absolute inset-0 animate-pulse bg-surface2"></div>
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
                          className={`h-[220px] w-full object-cover transition duration-500 group-hover:scale-105 md:h-[420px] ${
                            !loadedImages.has(product.id)
                              ? "scale-110 blur-md"
                              : "scale-100 blur-0"
                          }`}
                          onLoad={() => handleImageLoad(product.id)}
                          onError={() => handleImageLoad(product.id)}
                        />

                        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-primary py-2.5 text-center text-xs font-bold uppercase tracking-widest text-white transition-transform duration-300 group-hover:translate-y-0">
                          View Product
                        </div>
                      </div>

                      <div className="p-3">
                        <h3 className="truncate text-sm font-semibold uppercase tracking-wide text-white">
                          {product.name}
                        </h3>

                        <p className="mt-2 flex items-center gap-2">
                          {product.discount > 0 ? (
                            <>
                              <span className="text-base font-bold text-primary">
                                {product.symbol}
                                {product.discount_price.toFixed(2)}
                              </span>
                              <span className="text-sm text-smoke line-through">
                                {product.symbol}
                                {product.price.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="text-base font-bold text-white">
                              {product.symbol}
                              {product.price.toFixed(2)}
                            </span>
                          )}
                          <span className="text-[0.7rem] uppercase text-smoke">
                            {product.currency}
                          </span>
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div id="loadMoreTrigger" style={{ height: "50px" }}></div>

              {loadingMore && (
                <div className="flex items-center justify-center py-10">
                  <Spinner size="sm" />
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
