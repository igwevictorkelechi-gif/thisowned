"use client";

import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { AuthProvider } from "../utils/AuthContext";
import { CartProvider } from "../utils/CartContext";

function ClientLayout({ children }) {
  return (
    <CartProvider>
      <AuthProvider>
        <Navbar />
        {children}
        <Footer />
      </AuthProvider>
    </CartProvider>
  );
}

export default ClientLayout;
