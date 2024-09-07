import React from "react";
import Cart from "../component/Cart";

function page() {
  return (
    <div className="mx-auto bg-black">
      <header className="text-center pt-10 pb-2">
        <h2 className="text-xl font-bold text-white sm:text-3xl tracking-wider">
          Shopping Cart
        </h2>
      </header>

      <Cart />
    </div>
  );
}

export default page;
