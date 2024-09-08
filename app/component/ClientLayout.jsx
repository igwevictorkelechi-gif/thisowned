"use client";

import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { AuthProvider } from "../utils/AuthContext";

function ClientLayout({ children }) {
  return (
    <AuthProvider>
      <Navbar />
      {children}
      <Footer />
    </AuthProvider>
  );
}

export default ClientLayout;
