"use client";
import React, { useEffect, useState } from "react";
import ProductCollections from "../component/ProductCollections";
import { useCurrency } from "../../../../utils/CurrencyContext";
import { Loader, LoaderPinwheelIcon } from "lucide-react";

function CollectionsPage({ params }) {
  const [collections, setCollections] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [collectionName, setCollectionName] = useState("");
  const [nameLoading, setNameLoading] = useState(params?.slug !== "all");
  const { currency } = useCurrency();

  useEffect(() => {
    if (!currency) return;

    const fetchCollectionDetails = async () => {
      if (params?.slug !== "all") {
        try {
          setNameLoading(true);
          const response = await fetch(process.env.NEXT_PUBLIC_COLLECTION_URL);
          if (response.ok) {
            const collectionsData = await response.json();
            const currentCollection = collectionsData.find(
              (collection) => collection.id.toString() === params?.slug
            );
            if (currentCollection) {
              setCollectionName(currentCollection.name);
            }
          }
        } catch (error) {
          console.error("Error fetching collection details:", error);
        } finally {
          setNameLoading(false);
        }
      }
    };

    const fetchCollections = async () => {
      try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_PRODUCTS_URL;

        let url;
        if (params?.slug === "all") {
          url = `${baseUrl}c/`;
        } else {
          url = `${baseUrl}c${params?.slug}/`;
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

    fetchCollectionDetails();
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
    <div className="min-h-screen bg-ink">
      <header className="border-b border-line bg-surface">
        <div className="section-x mx-auto max-w-7xl py-12 text-center">
          <p className="eyebrow text-primary">Curated Drops</p>
          {params?.slug === "all" ? (
            <h1 className="display mt-3 text-5xl sm:text-7xl">All Collections</h1>
          ) : nameLoading ? (
            <div className="mt-3 flex h-14 items-center justify-center">
              <Loader className="animate-spin text-primary" />
            </div>
          ) : (
            <h1 className="display mt-3 text-5xl sm:text-7xl">{collectionName}</h1>
          )}
        </div>
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
