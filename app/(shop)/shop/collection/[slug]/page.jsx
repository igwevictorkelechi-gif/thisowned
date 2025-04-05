"use client";
import React, { useEffect, useState } from "react";
import ProductCollections from "../component/ProductCollections";
import { useCurrency } from "../../../../utils/CurrencyContext";

function CollectionsPage({ params }) {
  const [collections, setCollections] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currency } = useCurrency();

  useEffect(() => {
    if (!currency) return;

    const fetchCollections = async () => {
      try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_PRODUCTS_URL;

        let url;
        if (params?.slug === "all") {
          url = `${baseUrl}c/`;
        } else {
          url = `${baseUrl}c/${params?.slug}/`;
        }

        const accessToken = localStorage.getItem("accessToken");

        const headers = {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        };

        const response = await fetch(url, { headers });

        if (!response.ok) throw new Error("Failed to fetch collections");

        const data = await response.json();

        setCollections(data.results || []);
        setNextPage(data.next);
      } catch (error) {
        console.error("Error fetching collections:", error);
        setCollections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [currency, params?.slug]);

  const loadMoreCollections = async () => {
    if (!nextPage) return;

    try {
      const response = await fetch(nextPage);
      const data = await response.json();

      setCollections((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const filteredNew = data.results.filter(
          (item) => !existingIds.has(item.id)
        );
        return [...prev, ...filteredNew];
      });

      setNextPage(data.next);
    } catch (error) {
      console.error("Failed to load more collections:", error);
    }
  };

  return (
    <div className="mx-auto bg-black">
      <header className="text-center pt-10 pb-2">
        <h2 className="text-xl font-bold text-white sm:text-3xl tracking-wider">
          {params?.slug === "all" ? "All Collections" : "Collections"}
        </h2>
      </header>
      <ProductCollections
        collections={collections}
        isAllCollections={params?.slug === "all"}
        loading={loading}
        loadMore={loadMoreCollections}
        hasNext={!!nextPage}
      />
    </div>
  );
}

export default CollectionsPage;
