"use client";
import React, { useState } from "react";
import Cart from "../component/Cart";

function page() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isCartEmpty, setIsCartEmpty] = useState(true);
  return (
    <div className="mx-auto bg-black">
      {!isCartEmpty && (
        <header className="text-center pt-10 pb-2">
          <h2 className="text-xl font-bold text-white sm:text-3xl tracking-wider">
            Shopping Cart
          </h2>
        </header>
      )}

      <Cart setIsCartEmpty={setIsCartEmpty} />
    </div>
  );
}

export default page;
