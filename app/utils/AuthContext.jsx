"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import { useCart } from "./CartContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { updateCart } = useCart(); // Get the updateCart function from context

  useEffect(() => {
    const syncLoginState = () => {
      const accessToken = localStorage.getItem("accessToken");
      setIsLoggedIn(!!accessToken);
    };

    // On mount only sync the flag — CartProvider already fetches the cart,
    // so fetching it here too would duplicate the request on every load.
    syncLoginState();

    // On login/logout (storage events) also refresh the cart, since the
    // auth header changes what the server returns.
    const handleAuthChange = async () => {
      syncLoginState();
      await updateCart();
    };
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
