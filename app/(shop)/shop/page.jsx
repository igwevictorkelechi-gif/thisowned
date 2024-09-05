import React from "react";
import Products from "../../component/Products";

function page() {
  return (
    <div className="mx-auto bg-black">
      <header className="text-center pt-10 pb-2">
        <h2 className="text-xl font-bold text-white sm:text-3xl tracking-wider">
          Products
        </h2>
      </header>
      <Products />
    </div>
  );
}

export default page;
