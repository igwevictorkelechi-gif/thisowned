"use client";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useCart } from "../../utils/CartContext";
import { useRouter } from "next/navigation";

function Cart({ setIsCartEmpty }) {
  const router = useRouter();
  const {
    cart,
    setCart,
    loading,
    updateCart,
    updateCartCount,
    token,
    updateTotalPrice,
  } = useCart();
  const [headers, setHeaders] = useState({});

  // Fetch cart data from server
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const mainHeaders = {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    };
    setHeaders(mainHeaders);
  }, []);

  // Helper function to update the quantity directly on the backend
  const updateQuantity = async (itemId, newQuantity) => {
    try {
      // Call API to update the cart item with the new quantity
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CART_URL}${itemId}/?token=${token}`,
        {
          method: "PATCH",
          headers: {
            ...headers,
          },
          body: JSON.stringify({ quantity: newQuantity }), // Send the new quantity directly
        }
      );

      if (response.ok) {
        const updatedItem = await response.json();

        // Find the index of the updated item in the current cart
        const updatedCart = cart.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        );

        setCart(updatedCart); // Update the cart with the updated item
        updateCartCount(updatedCart.length);
      } else {
        console.error("Failed to update item quantity");
      }
    } catch (error) {
      console.error(`Error updating item quantity in cart:`, error);
    }
  };

  // Increment item quantity by adding 1
  const incrementQuantity = (itemId) => {
    const item = cart.find((cartItem) => cartItem.id === itemId);
    const newQuantity = item.quantity + 1;
    updateQuantity(itemId, newQuantity); // Call the update function with the new quantity
  };

  // Decrement item quantity by subtracting 1 (but not below 1)
  const decrementQuantity = (itemId) => {
    const item = cart.find((cartItem) => cartItem.id === itemId);
    if (item && item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      updateQuantity(itemId, newQuantity); // Call the update function with the new quantity
    }
  };
  // Remove item from cart
  const removeItem = async (itemId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CART_URL}${itemId}/?token=${token}`,
        {
          method: "DELETE", // Delete item from cart
          headers: {
            ...headers,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove item");
      }

      // Optimistically update UI
      const updatedCart = cart.filter((item) => item.id !== itemId);
      setCart(updatedCart); // Update cart state locally
      setIsCartEmpty(updatedCart.length === 0); // Update cart empty status

      await updateCart(); // This will fetch the latest cart data and update the context

      // Only show success alert after successful removal
      Swal.fire({
        title: "Success!",
        text: "Item has been successfully removed from the cart.",
        icon: "success",
        confirmButtonColor: "#000000",
        confirmButtonText: "Close",
      });

      // No need to call response.json() if no response body
      if (
        response.status !== 204 &&
        response.headers.get("content-length") !== "0"
      ) {
        await response.json(); // Only attempt to parse if there is a response body
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      // Show error alert
      Swal.fire({
        title: "Error!",
        text: "Failed to remove item from the cart. Please try again.",
        icon: "error",
        confirmButtonColor: "#000000",
        confirmButtonText: "Close",
      });
    }
  };

  const symbol = cart.length > 0 ? cart[0].product.symbol : ""; // Get symbol from the first item

  const calculateTotalPrice = () => {
    if (!Array.isArray(cart)) return 0;

    return cart.reduce((total, item) => {
      // Check if the item has a discount
      const price = item.product.discount
        ? item.product.discount_price
        : item.product.price;
      return total + price * item.quantity;
    }, 0);
  };

  // Function to calculate total discount
  const calculateTotalDiscount = () => {
    if (!Array.isArray(cart)) return 0;

    return cart.reduce((total, item) => {
      // Calculate discount amount for each item
      const discountAmount =
        (item.product.discount / 100) * item.product.price * item.quantity;
      return total + discountAmount;
    }, 0);
  };

  // Get the total discount
  const totalDiscount = calculateTotalDiscount();

  // Calculate totals
  const carttotal = parseFloat(calculateTotalPrice().toFixed(2)); // Use toFixed to handle precision
  // console.log(totalBeforeDiscount);

  // const totalDiscount = parseFloat(calculateTotalDiscount().toFixed(2)); // Use toFixed for discount
  // console.log(totalDiscount);

  // Calculate total after applying the discount
  // const totalAfterDiscount = parseFloat(
  //   (
  //     totalBeforeDiscount - Math.min(totalDiscount, totalBeforeDiscount)
  //   ).toFixed(2)
  // ); // Use toFixed to ensure precision

  // console.log(totalAfterDiscount); // This should show a properly rounded value

  // Handle proceed to checkout
  const handleProceedToCheckout = () => {
    router.push("/checkout");
  };

  return (
    <div>
      <section>
        <div className="mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="mx-auto max-w-6xl">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="flex-col gap-4 w-full flex items-center justify-center">
                  <div className="w-20 h-20 border-4 border-transparent text-gray-100 text-4xl animate-spin flex items-center justify-center border-t-gray-100 rounded-full">
                    <div className="w-16 h-16 border-4 border-transparent text-red-500 text-2xl animate-spin flex items-center justify-center border-t-red-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            ) : cart.length === 0 ? (
              <div className="flex flex-col items-center text-center justify-center my-7 text-white">
                <ShoppingCart size={40} />

                <p className="text-gray-100 text-2xl md:text-3xl font-semibold my-8">
                  Your cart is currently empty.
                </p>

                <Link
                  href="shop"
                  className="block rounded bg-gray-100 text-center py-3 px-10 text-sm text-red-600 font-semibold transition hover:bg-gray-200 mt-2"
                >
                  Return to Shop
                </Link>
              </div>
            ) : (
              <div className="mt-8">
                <ul className="space-y-6">
                  {Array.isArray(cart) &&
                    cart.map((item, index) => (
                      <li key={index} className="flex items-center gap-4">
                        <Image
                          width={100}
                          height={100}
                          src={item.product.images[0].image}
                          alt={item.product.name}
                          className="size-14 rounded object-cover"
                        />
                        <div>
                          <h3 className="text-sm text-gray-100">
                            {item.product.name}
                          </h3>
                          <dl className="mt-0.5 space-y-1 text-[11.2px] text-gray-100">
                            <div className="flex gap-3">
                              <dt className="inline">Size:</dt>
                              <dd className="inline">{item.size.rating}</dd>
                            </div>
                            <div className="flex gap-3">
                              <dt className="inline">Price:</dt>
                              <dd className="inline">
                                {item.product.discount && (
                                  <span>
                                    {" "}
                                    {item.product.symbol}{" "}
                                    {item.product.discount_price.toFixed(2)}
                                  </span>
                                )}
                                <span
                                  className={
                                    item.product.discount
                                      ? "line-through ml-1"
                                      : ""
                                  }
                                >
                                  {item.product.symbol}{" "}
                                  {item.product.price.toFixed(2)}
                                </span>
                              </dd>
                            </div>
                          </dl>
                        </div>

                        <div className="flex flex-1 items-center justify-end gap-4 md:gap-5">
                          <form className="flex flex-row gap-2">
                            <button
                              type="button"
                              onClick={() => decrementQuantity(item.id)}
                              className="text-white"
                            >
                              <Minus size={14} />
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              readOnly
                              className="h-7 w-8 md:w-10 rounded border border-gray-200 bg-black p-0 text-center text-xs text-gray-100"
                            />
                            <button
                              type="button"
                              onClick={() => incrementQuantity(item.id)}
                              className="text-white"
                            >
                              <Plus size={14} />
                            </button>
                          </form>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-100 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </li>
                    ))}
                </ul>

                <div className="mt-8 flex justify-end border-t border-gray-400 pt-8">
                  <div className="w-screen max-w-lg space-y-4">
                    <dl className="space-y-0.5 text-sm text-gray-100">
                      <div className="flex justify-between">
                        <dt>Discount</dt>
                        <dd className="font-semibold tracking-wider">
                          {symbol}
                          {totalDiscount.toFixed(2)}
                        </dd>
                      </div>
                      <div className="flex justify-between text-base">
                        <dt>Total</dt>
                        <dd className="font-semibold tracking-wider">
                          {symbol}
                          {carttotal.toFixed(2)}
                        </dd>
                      </div>
                    </dl>
                    <div className="flex justify-end">
                      <button
                        onClick={handleProceedToCheckout}
                        className="block rounded bg-white px-10 py-2.5 text-sm text-gray-800 transition hover:bg-gray-100"
                      >
                        Checkout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Cart;
