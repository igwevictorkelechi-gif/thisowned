"use client";
import { ChevronRight, Home, Minus, Plus } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import ImageGallery from "../../component/ImageGallery";
import Image from "next/image";
import Swal from "sweetalert2";
import { useCart } from "../../../utils/CartContext";
import { useCurrency } from "../../../utils/CurrencyContext";
import { successToast } from "../../../utils/toast";

function ShopDetails({ params }) {
  const { updateCart } = useCart(); // Use the context to access updateCart function
  const [product, setProduct] = useState(null); // Store product data
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedSetItems, setSelectedSetItems] = useState([]); // Track selected set items
  const [selectedSetSizes, setSelectedSetSizes] = useState({}); // Track selected sizes for each set item
  const [activeTab, setActiveTab] = useState("description");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingSet, setAddingSet] = useState(false);
  const { currency } = useCurrency();

  // Derived — never stored, so it can't drift out of sync
  const setTotalPrice_ =
    (product ? Number(product.price) || 0 : 0) * quantity +
    selectedSetItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  useEffect(() => {
    let mounted = true;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        // Get the access token from localStorage
        const accessToken = localStorage.getItem("accessToken");

        // Set headers with the Authorization token if available
        const headers = {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }), // Add token if it exists
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_PRODUCTS_URL}${params.id}/?code=${currency}`,
          { headers }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();
        if (mounted) {
          setProduct(data);
          setSelectedSetItems([]);
          setSelectedSetSizes({});

          // Automatically select the first available size
          const firstAvailableSize = data.size_guide.find(
            (size) => size.is_available
          );

          if (firstAvailableSize) {
            setSelectedSize(firstAvailableSize.id);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Get or generate token
    let storedToken = localStorage.getItem("cartToken");
    if (!storedToken) {
      storedToken = generateToken();
      localStorage.setItem("cartToken", storedToken);
    }
    setToken(storedToken);

    // Only fetch if we have a currency
    if (currency) {
      fetchProduct();
    }

    return () => {
      mounted = false;
    };
    // NOTE: quantity must NOT be a dependency here — it used to be, which
    // refetched the whole product (with a full-page spinner) on every
    // quantity +/- click.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency, params.id]);

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
        confirmButtonColor: "#e02e21",
        confirmButtonText: "Close",
      });
      return;
    }
    if (addingToCart) return;
    setAddingToCart(true);

    const payload = {
      product: product.id,
      size: selectedSize,
      quantity: quantity,
      token: token,
    };

    try {
      // Get the access token from localStorage
      const accessToken = localStorage.getItem("accessToken");

      // Set headers with the Authorization token if available
      const headers = {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }), // Add token if it exists
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CART_URL}?token=${token}`,
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        successToast("Added to cart");
        updateCart(data); // Assuming the API returns the updated cart
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to add product to cart. Please try again.",
          icon: "error",
          confirmButtonColor: "#e02e21",
          confirmButtonText: "Close",
        });
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
        confirmButtonColor: "#e02e21",
        confirmButtonText: "Close",
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleSetItemChange = (item, isChecked) => {
    // Total is derived from selectedSetItems, so only the list needs updating
    setSelectedSetItems((prevSelected) => {
      if (isChecked) {
        return [...prevSelected, item];
      } else {
        return prevSelected.filter(
          (selectedItem) => selectedItem.id !== item.id
        );
      }
    });
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
        confirmButtonColor: "#e02e21",
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
            confirmButtonColor: "#e02e21",
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
        confirmButtonColor: "#e02e21",
        confirmButtonText: "Close",
      });
      return;
    }

    if (addingSet) return;
    setAddingSet(true);

    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      };

      // Fire all POSTs in parallel instead of one-by-one
      const responses = await Promise.all(
        payloads.map((payload) =>
          fetch(`${process.env.NEXT_PUBLIC_CART_URL}?token=${token}`, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
          })
        )
      );

      const failed = responses.filter((r) => !r.ok);

      // One refetch after all items are added, not one per item
      await updateCart();

      if (failed.length > 0) {
        Swal.fire({
          title: "Error!",
          text: `${failed.length} item(s) could not be added to the cart. Please try again.`,
          icon: "error",
          confirmButtonColor: "#e02e21",
          confirmButtonText: "Close",
        });
        return;
      }

      successToast("Selected items added to cart");
    } catch (error) {
      console.error("Error adding selected items to cart:", error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred. Please try again.",
        icon: "error",
        confirmButtonColor: "#e02e21",
        confirmButtonText: "Close",
      });
    } finally {
      setAddingSet(false);
    }
  };

  const Loader = () => (
    <div className="flex min-h-[60vh] items-center justify-center bg-ink">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-line border-t-primary"></div>
    </div>
  );

  if (loading) return <Loader />;
  if (!product) return <Loader />;

  const tabs = [
    { id: "description", label: "Description" },
    { id: "delivery", label: "Delivery & Return" },
    { id: "care", label: "Care" },
  ];

  const tabContent = {
    description: product.details,
    delivery: product.delivery_and_return,
    care: product.care,
  };

  return (
    <div className="min-h-screen bg-ink">
      <section className="section-x mx-auto max-w-7xl py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-smoke">
            <li>
              <Link href="/" className="transition hover:text-primary">
                <Home size={14} />
              </Link>
            </li>
            <li>
              <ChevronRight size={13} />
            </li>
            <li>
              <Link href="/shop" className="transition hover:text-primary">
                Shop
              </Link>
            </li>
            <li>
              <ChevronRight size={13} />
            </li>
            <li className="truncate text-white">{product.name}</li>
          </ol>
        </nav>

        <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
          {/* Gallery */}
          <div className="w-full lg:w-1/2">
            <ImageGallery images={product.images} />
          </div>

          {/* Details */}
          <div className="w-full lg:w-1/2">
            <h1 className="display text-3xl sm:text-5xl">{product.name}</h1>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {product.discount > 0 ? (
                <>
                  <span className="text-2xl font-bold text-primary">
                    {product.symbol} {product.discount_price.toFixed(2)}
                  </span>
                  <span className="text-lg text-smoke line-through">
                    {product.symbol} {product.price.toFixed(2)}
                  </span>
                  <span className="bg-primary px-2 py-0.5 text-xs font-bold uppercase text-white">
                    -{product.discount}%
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-white">
                  {product.symbol} {product.price.toFixed(2)}
                </span>
              )}
              <span className="text-xs uppercase text-smoke">
                {product.currency}
              </span>
            </div>

            {!product.in_stock ? (
              <p className="mt-8 border border-primary bg-primary/10 px-4 py-3 text-sm font-bold uppercase tracking-widest text-primary">
                Out of stock
              </p>
            ) : (
              <>
                <div className="mt-8">
                  <label className="eyebrow text-white">Select Size</label>
                  <fieldset className="mt-3 flex flex-wrap gap-2.5">
                    {product.size_guide.map(
                      (size) =>
                        size.is_available && (
                          <label
                            key={size.id}
                            htmlFor={`Size${size.rating}`}
                            className={`flex min-w-[3rem] cursor-pointer items-center justify-center border px-4 py-2 text-sm font-bold uppercase transition ${
                              selectedSize === size.id
                                ? "border-primary bg-primary text-white"
                                : "border-line bg-surface text-white hover:border-white"
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
                            {size.rating}
                          </label>
                        )
                    )}
                  </fieldset>
                </div>

                <div className="mt-8">
                  <label className="eyebrow text-white">Quantity</label>
                  <div className="mt-3 inline-flex items-center border border-line bg-surface">
                    <button
                      onClick={decrementQuantity}
                      type="button"
                      aria-label="Decrease quantity"
                      className="flex size-11 items-center justify-center text-white transition hover:text-primary"
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      id="Quantity"
                      min={1}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="h-11 w-14 border-x border-line bg-ink text-center font-bold text-white [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      onClick={incrementQuantity}
                      type="button"
                      aria-label="Increase quantity"
                      className="flex size-11 items-center justify-center text-white transition hover:text-primary"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="mt-10">
                  <button
                    onClick={addToCart}
                    disabled={addingToCart}
                    className="btn-light w-full disabled:cursor-wait disabled:opacity-70 md:w-auto md:min-w-[18rem]"
                  >
                    {addingToCart ? "Adding..." : "Add to Cart"}
                  </button>
                </div>
              </>
            )}

            {/* Complete the set */}
            {product.complete_set && product.complete_set.length > 0 && (
              <div className="mt-14 border-t border-line pt-10">
                <h2 className="display mb-8 text-2xl">Complete the Set</h2>
                <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
                  {product.complete_set.map((setItem) =>
                    setItem.products.map((item) => (
                      <div key={item.id} className="border border-line bg-surface p-3">
                        <Image
                          width={200}
                          height={200}
                          src={item.images[0].image}
                          alt={item.name}
                          className="h-40 w-full object-cover"
                        />
                        <h3 className="mt-3 truncate text-sm font-semibold uppercase text-white">
                          {item.name}
                        </h3>
                        <select
                          className="mt-3 w-full appearance-none border border-line bg-ink px-3 py-2 text-sm text-white outline-none focus:border-primary"
                          value={selectedSetSizes[item.id] || ""}
                          onChange={(e) =>
                            handleSetSizeChange(item.id, e.target.value)
                          }
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
                        <div className="mt-3 flex items-center justify-between">
                          <p className="text-sm font-bold text-white">
                            {item.symbol} {item.price.toFixed(2)}
                          </p>
                          <input
                            type="checkbox"
                            className="size-4 accent-primary"
                            id={`Option${item.id}`}
                            onChange={(e) =>
                              handleSetItemChange(item, e.target.checked)
                            }
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-bold uppercase tracking-widest text-white">
                    Total: <span className="text-primary">{setTotalPrice_.toFixed(2)}</span>
                  </p>
                  <button
                    className="btn-primary disabled:cursor-wait disabled:opacity-70"
                    onClick={addSelectedToCart}
                    disabled={addingSet}
                  >
                    {addingSet ? "Adding..." : "Add Selected to Cart"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex flex-wrap gap-2 border-b border-line">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 text-xs font-bold uppercase tracking-widest transition ${
                  activeTab === tab.id
                    ? "border-b-2 border-primary text-white"
                    : "text-smoke hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="mt-6 space-y-1 text-sm leading-relaxed text-white/80">
            {(tabContent[activeTab] || "")
              .split("\r\n")
              .map((line, index) => (
                <p key={index}>{line}</p>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ShopDetails;
