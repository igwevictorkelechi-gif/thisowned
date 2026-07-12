"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { useCurrency } from "./CurrencyContext";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";
// import Swal from "sweetalert2";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isCartEmpty, setIsCartEmpty] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const { currency } = useCurrency();
  const { isLoggedIn = false, setIsLoggedIn = () => {} } = useAuth() || {};

  const calculateTotalPrice = (cartItems) => {
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0)
      return 0;

    return cartItems.reduce((sum, item) => {
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

  const updateCartCount = (newCart) => {
    const count = newCart.reduce(
      (total, item) => total + (parseInt(item.quantity) || 0),
      0
    );
    setCartCount(count);
    setIsCartEmpty(count === 0);
  };

  const fetchCartDetails = async () => {
    if (!currency) return;

    setLoading(true);
    const token = localStorage.getItem("cartToken");
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
      if (response.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsLoggedIn(false);
        // Await the cart update before showing the success message
        // Swal.fire({
        //   title: "Info!",
        //   text: "Session expired, please login again.",
        //   icon: "info",
        //   confirmButtonColor: "#000000",
        //   confirmButtonText: "Close",
        // });
        // .then(() => {
        //   // Redirect to the login page after the alert is closed
        router.push("/");

        //   // Trigger a custom event to notify other components
        window.dispatchEvent(new Event("storage"));
        // });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const cartData = await response.json();

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

      setCart(validatedCart);
      updateCartCount(validatedCart);
      const newTotal = calculateTotalPrice(validatedCart);
      setTotalPrice(newTotal);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart([]);
      updateCartCount([]);
      setTotalPrice(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currency) {
      fetchCartDetails();
    }
  }, [currency]);

  const updateCart = async () => {
    await fetchCartDetails();
  };

  // Apply an already-known cart state locally (after a PATCH/DELETE) so the
  // UI updates instantly without a second round-trip to the server.
  const applyCart = (newCart) => {
    const safeCart = Array.isArray(newCart) ? newCart : [];
    setCart(safeCart);
    updateCartCount(safeCart);
    setTotalPrice(calculateTotalPrice(safeCart));
  };

  const getCartToken = () => {
    try {
      return localStorage.getItem("cartToken") || "";
    } catch (e) {
      return "";
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        loading,
        updateCart,
        applyCart,
        getCartToken,
        isCartEmpty,
        cartCount,
        updateCartCount,
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
