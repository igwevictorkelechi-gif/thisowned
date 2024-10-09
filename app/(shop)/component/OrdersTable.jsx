"use client";
import { Grid2x2Check } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useCurrency } from "../../utils/CurrencyContext";

function OrdersTable() {
  const [orders, setOrders] = useState([]); // Orders as an array
  const [headers, setHeaders] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const { currency } = useCurrency();

  // Fetch cart data with access token
  useEffect(() => {
    if (!currency) return;

    async function fetchOrders() {
      const accessToken = localStorage.getItem("accessToken");
      const mainHeaders = {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      };
      setHeaders(mainHeaders);

      try {
        setLoading(true);
        const url = `${process.env.NEXT_PUBLIC_ORDERS_URL}?code=${currency}`;

        const response = await fetch(url, {
          method: "GET",
          headers: mainHeaders,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched orders data:", data);
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Error fetching orders data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [currency]); // Added currency to the dependency array
  // Display error if there's an issue fetching the data
  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  // Show loading spinner when data is being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="flex-col gap-4 w-full flex items-center justify-center">
          <div className="w-20 h-20 border-4 border-transparent text-gray-100 text-4xl animate-spin flex items-center justify-center border-t-gray-100 rounded-full">
            <div className="w-16 h-16 border-4 border-transparent text-red-500 text-2xl animate-spin flex items-center justify-center border-t-red-500 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-black">
        <div className="flex flex-col items-center text-center justify-center py-16 text-white">
          <Grid2x2Check size={40} />

          <p className="text-gray-100 text-2xl md:text-3xl font-semibold my-6 tracking-wider">
            No orders found.
          </p>

          <Link
            href="shop"
            className="block rounded bg-gray-100 text-center py-2.5 px-14 text-sm text-red-600 font-semibold transition hover:bg-gray-200 mt-1"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  // Calculate total items before rendering to use as counter
  let totalItemCounter = 1;

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-14">
      <div className="max-w-lg">
        <h3 className="text-white text-xl font-bold sm:text-2xl">
          Order History
        </h3>
      </div>
      <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
        <table className="w-full table-auto text-sm text-left">
          <thead className="bg-white text-black font-bold border-b">
            <tr>
              <th className="py-3 pl-3">S/N</th>
              <th className="py-3 px-6">Item</th>
              <th className="py-3 px-6">Price</th>
              <th className="py-3 px-6">Quantity</th>
              <th className="py-3 px-6">Size</th>
              <th className="py-3 px-6">Status</th>
              <th className="py-3 px-6"></th>
            </tr>
          </thead>
          <tbody className="text-white divide-y">
            {orders.map((order) =>
              order.items.map((item, itemIdx) => (
                <tr key={`${order.id}-${itemIdx}`}>
                  <td className="pl-4 py-4 whitespace-nowrap">
                    {totalItemCounter++}.
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.product?.name ?? "Unknown Product"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.product?.symbol}
                    {item.product?.price.toFixed(2) ?? "Unknown Price"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.quantity ?? 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.size ?? "Unknown Size"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.status === "cancelled" ? (
                      <span className="inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-0.5 text-white">
                        <p className="whitespace-nowrap text-xs">Cancelled</p>
                      </span>
                    ) : order.status === "completed" ? (
                      <span className="inline-flex items-center justify-center rounded-full bg-green-500 px-2 py-0.5 text-white">
                        <p className="whitespace-nowrap text-xs">Success</p>
                      </span>
                    ) : order.status === "processing" ? (
                      <span className="inline-flex items-center justify-center rounded-full bg-orange-500 px-2 py-0.5 text-orange-100">
                        <p className="whitespace-nowrap text-xs">Processing</p>
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center rounded-full bg-yellow-300 px-2 py-0.5 text-yellow-900">
                        <p className="whitespace-nowrap text-xs">Pending</p>
                      </span>
                    )}
                  </td>
                  <td className="px-4 md:px-2 py-4 whitespace-nowrap">
                    <Link
                      href={`/orders/${order.id}?itemId=${item.product.id}`}
                      className="bg-white text-black px-3 py-1 border-none rounded-sm"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrdersTable;
