"use client";
import { Grid2x2Check, MoveLeft, MoveRight } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useCurrency } from "../../utils/CurrencyContext";

function OrdersTable() {
  const [orders, setOrders] = useState([]); // Orders as an array
  const [headers, setHeaders] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const { currency } = useCurrency();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of orders to show per page

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

        if (response.status === 401) {
          localStorage.removeItem("cartToken");
          localStorage.removeItem("accessToken");
        } else {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        setError(
          "Error fetching order data. Please try again later or log out and try again."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [currency]);

  const statusBadge = (status) => {
    const map = {
      cancelled: "bg-primary text-white",
      completed: "bg-green-600 text-white",
      processing: "bg-orange-500 text-white",
    };
    const label = {
      cancelled: "Cancelled",
      completed: "Success",
      processing: "Processing",
    };
    const cls = map[status] || "bg-yellow-400 text-black";
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${cls}`}>
        {label[status] || "Pending"}
      </span>
    );
  };

  if (error) {
    return (
      <div className="section-x mx-auto max-w-3xl py-20 text-center">
        <p className="text-sm uppercase tracking-wide text-primary">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-line border-t-primary"></div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center text-white">
        <div className="flex size-20 items-center justify-center rounded-full border border-line bg-surface">
          <Grid2x2Check size={34} className="text-primary" />
        </div>
        <h2 className="display mt-6 text-4xl sm:text-5xl">No orders yet</h2>
        <p className="mt-3 text-sm uppercase tracking-wide text-smoke">
          Your order history will show up here.
        </p>
        <Link href="/shop" className="btn-primary mt-8">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const totalOrders = orders.reduce(
    (acc, order) => acc + order.items.length,
    0
  );
  const totalPages = Math.ceil(totalOrders / itemsPerPage);

  const currentOrders = orders
    .reduce((acc, order) => {
      return acc.concat(
        order.items.map((item) => ({ ...item, orderId: order.id }))
      );
    }, [])
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="section-x mx-auto max-w-7xl py-14">
      <p className="eyebrow text-primary">Your Account</p>
      <h1 className="display mt-2 text-4xl sm:text-6xl">Order History</h1>

      <div className="mt-10 overflow-x-auto border border-line">
        <table className="w-full table-auto text-left text-sm">
          <thead className="border-b border-line bg-surface2 text-xs font-bold uppercase tracking-wider text-white">
            <tr>
              <th className="py-3 pl-4">S/N</th>
              <th className="px-6 py-3">Item</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Qty</th>
              <th className="px-6 py-3">Size</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-white/90">
            {currentOrders.map((item, itemIdx) => (
              <tr key={`${item.orderId}-${itemIdx}`} className="transition hover:bg-surface">
                <td className="whitespace-nowrap py-4 pl-4">
                  {(currentPage - 1) * itemsPerPage + itemIdx + 1}.
                </td>
                <td className="whitespace-nowrap px-6 py-4 font-semibold">
                  {item.product?.name ?? "Unknown Product"}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {item.product?.symbol}
                  {item.product?.price.toFixed(2) ?? "Unknown Price"}
                </td>
                <td className="whitespace-nowrap px-6 py-4">{item.quantity ?? 1}</td>
                <td className="whitespace-nowrap px-6 py-4">{item.size ?? "—"}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  {statusBadge(item.orderId.status)}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <Link
                    href={`/orders/${item.orderId}?itemId=${item.product.id}`}
                    className="border border-line bg-surface2 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white transition hover:border-primary hover:text-primary"
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${
            currentPage === 1 ? "cursor-not-allowed text-line" : "text-white hover:text-primary"
          }`}
        >
          <MoveLeft size={16} />
          Previous
        </button>
        <span className="text-xs font-bold uppercase tracking-widest text-smoke">
          Page <span className="text-primary">{currentPage}</span> of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${
            currentPage === totalPages ? "cursor-not-allowed text-line" : "text-white hover:text-primary"
          }`}
        >
          Next
          <MoveRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default OrdersTable;
