"use client";

import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { AuthProvider } from "../utils/AuthContext";
import { CartProvider } from "../utils/CartContext";
import { CurrencyProvider } from "../utils/CurrencyContext";
import { usePathname } from "next/navigation";

function ClientLayout({ children }) {
  const pathname = usePathname();
  const isWaitlist = pathname.startsWith("/waitlist");

  return (
    <CurrencyProvider>
      <CartProvider>
        <AuthProvider>
          {!isWaitlist && <Navbar />}
          {children}
          {!isWaitlist && <Footer />}
        </AuthProvider>
      </CartProvider>
    </CurrencyProvider>
  );
}

export default ClientLayout;
