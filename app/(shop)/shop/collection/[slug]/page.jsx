import React from "react";
import ProductCollections from "../component/ProductCollections";

// Fetch data server-side

async function fetchCollections(slug) {
  try {
    const url =
      slug === "all"
        ? `${process.env.NEXT_PUBLIC_COLLECTION_URL}all`
        : `${process.env.NEXT_PUBLIC_COLLECTION_URL}${slug}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch collections");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching collections:", error);
    return null;
  }
}

async function page({ params }) {
  const collections = await fetchCollections(params?.slug);
  return (
    <div className="mx-auto bg-black">
      <header className="text-center pt-10 pb-2">
        <h2 className="text-xl font-bold text-white sm:text-3xl tracking-wider">
          {params?.slug === "all"
            ? "All Collections"
            : collections?.name || "Collections"}
        </h2>
      </header>
      {collections && (
        <ProductCollections
          collections={collections}
          isAllCollections={params?.slug === "all"}
        />
      )}
    </div>
  );
}

export default page;
