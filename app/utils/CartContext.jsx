"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { useCurrency } from "./CurrencyContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isCartEmpty, setIsCartEmpty] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const { currency } = useCurrency();

  // Updated to handle nested product structure
  const calculateTotalPrice = (cartItems) => {
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0)
      return 0;

    return cartItems.reduce((sum, item) => {
      // Check for nested product structure
      if (!item || !item.product) return sum;

      const price =
        parseFloat(
          item.product.discount
            ? item.product.discount_price
            : item.product.price
        ) || 0;
      const quantity = parseInt(item.quantity) || 0;

      if (price === 0 || quantity === 0) {
        console.warn("Invalid cart item:", item);
      }

      return sum + price * quantity;
    }, 0);
  };

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

  useEffect(() => {
    const newTotal = calculateTotalPrice(cart);
    setTotalPrice(newTotal);
  }, [cart]);

  const fetchCartDetails = async () => {
    if (!currency) return;

    setLoading(true);
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CART_URL}?token=${token}&code=${currency}`,
        { method: "GET", headers }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const cartData = await response.json();

      // Validate cart data structure
      if (!Array.isArray(cartData)) {
        console.error("Invalid cart data format:", cartData);
        throw new Error("Invalid cart data format");
      }

      // Validate each cart item has the required nested structure
      const validatedCart = cartData.filter((item) => {
        const isValid =
          item &&
          typeof item === "object" &&
          item.product &&
          "price" in item.product &&
          "quantity" in item;

        if (!isValid) {
          console.warn("Invalid cart item filtered out:", item);
        }

        return isValid;
      });

      if (response.status === 401) {
        localStorage.removeItem("cartToken");
        localStorage.removeItem("accessToken");
      } else {
        setCart(validatedCart);
        updateCartCount(validatedCart.length);
        setIsCartEmpty(validatedCart.length === 0);
        const newTotal = calculateTotalPrice(validatedCart);
        setTotalPrice(newTotal);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart([]);
      setTotalPrice(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currency) {
      fetchCartDetails();
    }
  }, [currency, token]);

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
        totalPrice,
        calculateTotalPrice,
        currency,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
