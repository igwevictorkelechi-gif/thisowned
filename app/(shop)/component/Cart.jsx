"use client";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";

// Helper to generate token

// Helper to generate token
function generateRandomToken(length = 12) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters[randomIndex];
  }
  return token;
}

// Get token from localStorage or create a new one
function getToken() {
  if (typeof window !== "undefined") {
    let token = localStorage.getItem("cartToken");
    if (!token) {
      token = generateRandomToken();
      localStorage.setItem("cartToken", token);
    }
    return token;
  }
  return generateRandomToken();
}

function Cart({ setIsCartEmpty }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true); // State to handle loading
  // const [loading, setLoading] = useState(true); // State to handle loading
  const token = getToken(); // Retrieve or generate token
  const [headers, setHeaders] = useState({});

  // Fetch cart data from server
  useEffect(() => {
    setLoading(true); // Set loading to true before fetching
    // Set headers with accessToken from localStorage
    const accessToken = localStorage.getItem("accessToken");
    const mainHeaders = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      mainHeaders.Authorization = `Bearer ${accessToken}`;
    }

    setHeaders(mainHeaders);

    const fetchCartDetails = async () => {
      try {
        // setLoading(true); // Set loading to true before fetching
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CART_URL}token/${token}/`,
          {
            method: "GET",
            headers: mainHeaders,
          }
        );
        const cartData = await response.json();
        console.log(cartData);
        // setCart(cartData);
        if (response.statusCode !== 401) {
          setCart(cartData);
          setIsCartEmpty(cartData.length === 0); // Notify parent of cart status
        }
      } catch (error) {
        console.error("Error fetching cart details:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching is done
      }
    };
    fetchCartDetails();
  }, [token, setIsCartEmpty]);

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!Array.isArray(cart)) return 0;
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  // Calculate discount
  const discount = cart.discount || 0;

  // Calculate final total after discount
  const totalAfterDiscount = calculateTotalPrice() - discount;

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
                              <dd className="inline">₦{item.product.price}</dd>
                            </div>
                          </dl>
                        </div>

                        <div className="flex flex-1 items-center justify-end gap-4 md:gap-5">
                          <form className="flex flex-row gap-2">
                            <button
                              type="button"
                              // onClick={() => decrementQuantity(item.product.id)}
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
                              // onClick={() => incrementQuantity(item.product.id)}
                              className="text-white"
                            >
                              <Plus size={14} />
                            </button>
                          </form>

                          <button
                            // onClick={() => removeItem(item.product.id)}
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
                          -₦{discount}
                        </dd>
                      </div>
                      <div className="flex justify-between text-base">
                        <dt>Total</dt>
                        <dd className="font-semibold tracking-wider">
                          ₦{totalAfterDiscount.toFixed(2)}
                        </dd>
                      </div>
                    </dl>
                    <div className="flex justify-end">
                      <Link
                        href="checkout"
                        className="block rounded bg-white px-10 py-2.5 text-sm text-gray-800 transition hover:bg-gray-100"
                      >
                        Checkout
                      </Link>
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
