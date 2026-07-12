"use client";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useCart } from "../../utils/CartContext";
import { successToast } from "../../utils/toast";
import { useRouter } from "next/navigation";

function Cart({ setIsCartEmpty }) {
  const router = useRouter();
  const { cart, loading, applyCart, getCartToken } = useCart();
  const [headers, setHeaders] = useState({});
  const [busyItems, setBusyItems] = useState(new Set());

  // Fetch cart data from server
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    const mainHeaders = {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    };
    setHeaders(mainHeaders);
  }, []);

  const setItemBusy = (itemId, busy) => {
    setBusyItems((prev) => {
      const next = new Set(prev);
      if (busy) next.add(itemId);
      else next.delete(itemId);
      return next;
    });
  };

  // Update the quantity on the backend and apply the result locally —
  // no second full-cart refetch needed.
  const updateQuantity = async (itemId, newQuantity) => {
    if (busyItems.has(itemId)) return;
    setItemBusy(itemId, true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CART_URL}${itemId}/?token=${getCartToken()}`,
        {
          method: "PATCH",
          headers: {
            ...headers,
          },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      if (response.ok) {
        const updatedItem = await response.json();
        const updatedCart = cart.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        );
        applyCart(updatedCart);
      } else {
        console.error("Failed to update item quantity");
      }
    } catch (error) {
      console.error(`Error updating item quantity in cart:`, error);
    } finally {
      setItemBusy(itemId, false);
    }
  };

  const incrementQuantity = (itemId) => {
    const item = cart.find((cartItem) => cartItem.id === itemId);
    if (item) updateQuantity(itemId, item.quantity + 1);
  };

  const decrementQuantity = (itemId) => {
    const item = cart.find((cartItem) => cartItem.id === itemId);
    if (item && item.quantity > 1) {
      updateQuantity(itemId, item.quantity - 1);
    }
  };

  const removeItem = async (itemId) => {
    if (busyItems.has(itemId)) return;
    setItemBusy(itemId, true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CART_URL}${itemId}/?token=${getCartToken()}`,
        {
          method: "DELETE",
          headers: {
            ...headers,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove item");
      }

      const updatedCart = cart.filter((item) => item.id !== itemId);
      applyCart(updatedCart);
      setIsCartEmpty(updatedCart.length === 0);

      successToast("Item removed from cart");
    } catch (error) {
      console.error("Error removing item from cart:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to remove item from the cart. Please try again.",
        icon: "error",
        confirmButtonColor: "#e02e21",
        confirmButtonText: "Close",
      });
    } finally {
      setItemBusy(itemId, false);
    }
  };

  const symbol = cart.length > 0 ? cart[0].product.symbol : "";

  const calculateTotalPrice = () => {
    if (!Array.isArray(cart)) return 0;

    return cart.reduce((total, item) => {
      const price = item.product.discount
        ? item.product.discount_price
        : item.product.price;
      return total + price * item.quantity;
    }, 0);
  };

  const calculateTotalDiscount = () => {
    if (!Array.isArray(cart)) return 0;

    return cart.reduce((total, item) => {
      const discountAmount =
        (item.product.discount / 100) * item.product.price * item.quantity;
      return total + discountAmount;
    }, 0);
  };

  const totalDiscount = calculateTotalDiscount();
  const carttotal = parseFloat(calculateTotalPrice().toFixed(2));

  const handleProceedToCheckout = () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      Swal.fire({
        title: "Hold up!",
        text: "Please login to checkout",
        icon: "info",
        confirmButtonColor: "#e02e21",
        confirmButtonText: "Close",
      }).then(() => {
        router.push(`/login?from=${encodeURIComponent("/cart")}`);
        return;
      });
    } else {
      router.push("/checkout");
    }
  };

  return (
    <div>
      <section>
        <div className="section-x mx-auto max-w-5xl py-10 sm:py-14">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-line border-t-primary"></div>
            </div>
          ) : cart.length === 0 ? (
            <div className="my-10 flex flex-col items-center justify-center text-center text-white">
              <div className="flex size-20 items-center justify-center rounded-full border border-line bg-surface">
                <ShoppingCart size={34} className="text-primary" />
              </div>
              <h2 className="display mt-6 text-4xl sm:text-5xl">Your cart is empty</h2>
              <p className="mt-3 text-sm uppercase tracking-wide text-smoke">
                Time to fix that. Go find some heat.
              </p>
              <Link href="/shop" className="btn-primary mt-8">
                Return to Shop
              </Link>
            </div>
          ) : (
            <div>
              <h1 className="display mb-8 text-4xl sm:text-6xl">Shopping Cart</h1>
              <ul className="divide-y divide-line border-y border-line">
                {Array.isArray(cart) &&
                  cart.map((item, index) => (
                    <li key={index} className="flex items-center gap-4 py-5">
                      <Image
                        width={100}
                        height={100}
                        src={item.product.images[0].image}
                        alt={item.product.name}
                        className="size-20 shrink-0 border border-line object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-semibold uppercase text-white">
                          {item.product.name}
                        </h3>
                        <p className="mt-1 text-xs uppercase tracking-wide text-smoke">
                          Size: <span className="text-white">{item.size.rating}</span>
                        </p>
                        <p className="mt-1 text-sm">
                          {item.product.discount ? (
                            <span className="font-bold text-primary">
                              {item.product.symbol}
                              {item.product.discount_price.toFixed(2)}
                            </span>
                          ) : null}
                          <span
                            className={
                              item.product.discount
                                ? "ml-2 text-smoke line-through"
                                : "font-bold text-white"
                            }
                          >
                            {item.product.symbol}
                            {item.product.price.toFixed(2)}
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div
                          className={`flex items-center border border-line bg-surface ${
                            busyItems.has(item.id) ? "opacity-50" : ""
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => decrementQuantity(item.id)}
                            disabled={busyItems.has(item.id)}
                            aria-label="Decrease"
                            className="flex size-8 items-center justify-center text-white transition hover:text-primary disabled:cursor-wait"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => incrementQuantity(item.id)}
                            disabled={busyItems.has(item.id)}
                            aria-label="Increase"
                            className="flex size-8 items-center justify-center text-white transition hover:text-primary disabled:cursor-wait"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={busyItems.has(item.id)}
                          aria-label="Remove item"
                          className="text-smoke transition hover:text-primary disabled:cursor-wait disabled:opacity-50"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>

              <div className="mt-8 flex justify-end">
                <div className="w-full max-w-md border border-line bg-surface p-6">
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between text-smoke">
                      <dt className="uppercase tracking-wide">Discount</dt>
                      <dd className="font-semibold text-white">
                        {symbol}
                        {totalDiscount.toFixed(2)}
                      </dd>
                    </div>
                    <div className="flex justify-between border-t border-line pt-3 text-lg">
                      <dt className="font-bold uppercase tracking-wide text-white">Total</dt>
                      <dd className="font-bold text-primary">
                        {symbol}
                        {carttotal.toFixed(2)}
                      </dd>
                    </div>
                  </dl>
                  <button
                    onClick={handleProceedToCheckout}
                    className="btn-primary mt-6 w-full"
                  >
                    Proceed to Checkout
                  </button>
                  <Link
                    href="/shop"
                    className="mt-3 block text-center text-xs font-bold uppercase tracking-widest text-smoke transition hover:text-white"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Cart;
