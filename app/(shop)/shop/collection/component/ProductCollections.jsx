"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef, useCallback } from "react";

function ProductCollections({
  collections,
  isAllCollections,
  loading,
  loadMore,
  hasNext,
}) {
  const router = useRouter();
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [clickedProductId, setClickedProductId] = useState(null);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const loaderRef = useRef();

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasNext) {
        loadMore();
      }
    },
    [hasNext, loadMore]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [handleObserver]);

  const handleImageClick = (productId) => {
    if (!isLargeScreen) {
      if (clickedProductId === productId) {
        router.push(`/shop/${productId}`);
      } else {
        setClickedProductId(productId);
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

  const renderProducts = () => (
    <ul className="mt-8 grid gap-4 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
      {collections.map((product) => (
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
            onMouseLeave={() => isLargeScreen && setHoveredProductId(null)}
          >
            <div className="relative h-[180px] xl:h-[450px] w-full overflow-hidden">
              {/* Blurred Placeholder */}
              {!loadedImages.has(product.id) && (
                <div className="absolute inset-0 animate-pulse"></div>
              )}

              <Image
                width={500}
                height={500}
                src={
                  (isLargeScreen && hoveredProductId === product.id) ||
                  (!isLargeScreen && clickedProductId === product.id)
                    ? product.images[1]?.image
                    : product.images[0]?.image
                }
                alt={product.name}
                className={`h-[180px] w-full object-cover transition duration-500 group-hover:scale-105 xl:h-[450px] text-white ${
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
    <section>
      <div className="mx-auto px-4 py-8 sm:px-6 sm:py-8 lg:px-12">
        {/* === Full Page Loader === */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex-col gap-4 w-full flex items-center justify-center">
              <div className="w-20 h-20 border-4 border-transparent text-gray-100 text-4xl animate-spin flex items-center justify-center border-t-gray-100 rounded-full">
                <div className="w-16 h-16 border-4 border-transparent text-red-500 text-2xl animate-spin flex items-center justify-center border-t-red-500 rounded-full"></div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {renderProducts()}

            {/* === Mini Loader for infinite scroll === */}
            <div ref={loaderRef} className="flex justify-center py-10">
              {hasNext && (
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
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default ProductCollections;
