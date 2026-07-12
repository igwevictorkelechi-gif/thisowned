import React from "react";
import Products from "../../component/Products";

function page() {
  return (
    <div className="min-h-screen bg-ink">
      <header className="border-b border-line bg-surface">
        <div className="section-x mx-auto max-w-7xl py-12 text-center">
          <p className="eyebrow text-primary">The Full Range</p>
          <h1 className="display mt-3 text-5xl sm:text-7xl">Shop All</h1>
          <p className="mx-auto mt-4 max-w-lg text-sm uppercase tracking-wide text-smoke">
            Every drop, every essential. Scroll the full Thisowned lineup.
          </p>
        </div>
      </header>
      <Products />
    </div>
  );
}

export default page;
