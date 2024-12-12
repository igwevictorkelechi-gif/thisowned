"use client";
import React, { useEffect, useState } from "react";
import ProductCollections from "../component/ProductCollections";
import { useCurrency } from "../../../../utils/CurrencyContext";

// Move fetch function inside the component to use dynamic currency
function CollectionsPage({ params }) {
  const [collections, setCollections] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currency } = useCurrency();

  useEffect(() => {
    if (!currency) return;

    async function fetchCollections() {
      try {
        setLoading(true);

        // Get the access token from localStorage
        const accessToken = localStorage.getItem("accessToken");

        // Construct the URL based on the slug
        const url =
          params?.slug === "all"
            ? `${process.env.NEXT_PUBLIC_COLLECTION_URL}all/?code=${currency}`
            : `${process.env.NEXT_PUBLIC_COLLECTION_URL}${params?.slug}/?code=${currency}`;

        // Set headers with the Authorization token if available
        const headers = {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        };

        // Fetch collections data with headers
        const response = await fetch(url, { headers });

        if (!response.ok) {
          throw new Error("Failed to fetch collections");
        }

        const data = await response.json();
        setCollections(data);
      } catch (error) {
        console.error("Error fetching collections:", error);
        setCollections(null);
      } finally {
        setLoading(false);
      }
    }

    fetchCollections();
  }, [currency, params?.slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-black">
        <div className="flex-col gap-4 w-full flex items-center justify-center">
          <div className="w-20 h-20 border-4 border-transparent text-gray-100 text-4xl animate-spin flex items-center justify-center border-t-gray-100 rounded-full">
            <div className="w-16 h-16 border-4 border-transparent text-red-500 text-2xl animate-spin flex items-center justify-center border-t-red-500 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

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

export default CollectionsPage;
