"use client";

import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { AuthProvider } from "../utils/AuthContext";
import { CartProvider } from "../utils/CartContext";
import { CurrencyProvider } from "../utils/CurrencyContext";

function ClientLayout({ children }) {
  return (
    <CurrencyProvider>
      <CartProvider>
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </CartProvider>
    </CurrencyProvider>
  );
}

export default ClientLayout;
