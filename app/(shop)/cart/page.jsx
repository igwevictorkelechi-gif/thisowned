"use client";
import React, { useState } from "react";
import Cart from "../component/Cart";

function page() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isCartEmpty, setIsCartEmpty] = useState(true);
  return (
    <div className="min-h-screen bg-ink">
      <Cart setIsCartEmpty={setIsCartEmpty} />
    </div>
  );
}

export default page;
