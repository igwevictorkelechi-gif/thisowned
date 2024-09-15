"use client";
import { createContext, useState, useEffect, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isCartEmpty, setIsCartEmpty] = useState(true);

  const updateCartCount = (count) => {
    setCartCount(count);
    setIsCartEmpty(count === 0);
  };

  const generateRandomToken = (length = 12) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let token = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters[randomIndex];
    }
    return token;
  };

  const getToken = () => {
    if (typeof window !== "undefined") {
      let token = localStorage.getItem("cartToken");
      if (!token) {
        token = generateRandomToken();
        localStorage.setItem("cartToken", token);
      }
      return token;
    }
    return generateRandomToken();
  };

  const token = getToken();

  const fetchCartDetails = async () => {
    setLoading(true);
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CART_URL}?token=${token}`,
        { method: "GET", headers }
      );
      const cartData = await response.json();

      if (response.ok) {
        setCart(cartData);
        updateCartCount(cartData.length);
        setIsCartEmpty(cartData.length === 0);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartDetails();
  }, [token]);

  // Helper to update cart
  const updateCart = async () => {
    await fetchCartDetails();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        loading,
        updateCart,
        isCartEmpty,
        cartCount,
        updateCartCount,
        token,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
