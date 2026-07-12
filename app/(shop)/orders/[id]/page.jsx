"use client";
import { useState, useEffect } from "react";
import { ArrowLeftCircle, BadgeInfo } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useCurrency } from "../../../utils/CurrencyContext";

export default function OrderDetailsPage({ params }) {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const itemId = searchParams.get("itemId");
  const { currency } = useCurrency();

  useEffect(() => {
    if (!currency || !itemId) return;

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem("accessToken");
        const headers = {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_ORDERS_URL}${params.id}?code=${currency}`,
          {
            method: "GET",
            headers,
          }
        );

        if (!response.ok) throw new Error("Failed to fetch order details");

        const data = await response.json();

        const selectedItem = data.items.find(
          (item) => item.product.id === parseInt(itemId)
        );

        if (!selectedItem) {
          throw new Error("Item not found in order");
        }

        setOrderDetails({
          ...data,
          items: [selectedItem],
        });
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [currency, params.id, itemId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-ink">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-line border-t-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-ink text-center text-white">
        <BadgeInfo size={48} className="text-primary" />
        <p className="mt-6 text-lg font-semibold uppercase tracking-wide">{error}</p>
        <Link href="/orders" className="btn-primary mt-8">
          Back to Orders
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-yellow-400 text-black",
      processing: "bg-orange-500 text-white",
      cancelled: "bg-primary text-white",
      completed: "bg-green-600 text-white",
    };
    const statusText = {
      pending: "Pending",
      processing: "Processing",
      cancelled: "Cancelled",
      completed: "Success",
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${statusStyles[status] || "bg-yellow-400 text-black"}`}
      >
        {statusText[status] || "Pending"}
      </span>
    );
  };

  const { shipping_address, payment_detail, items, status } = orderDetails;

  const Row = ({ label, children }) => (
    <div className="grid grid-cols-1 gap-1 p-4 sm:grid-cols-3 sm:gap-4">
      <dt className="text-xs font-bold uppercase tracking-wider text-smoke">{label}</dt>
      <dd className="text-sm text-white sm:col-span-2">{children}</dd>
    </div>
  );

  return (
    <div className="min-h-screen bg-ink">
      <div className="section-x mx-auto max-w-4xl py-14">
        <h1 className="display flex items-center gap-4 text-4xl sm:text-5xl">
          <Link href="/orders" className="text-white transition hover:text-primary">
            <ArrowLeftCircle size={30} />
          </Link>
          Order Details
        </h1>

        <div className="mt-10 grid gap-6">
          {/* Customer Information */}
          <div className="border border-line bg-surface">
            <h2 className="border-b border-line px-4 py-3 text-xs font-bold uppercase tracking-widest text-primary">
              Shipping
            </h2>
            <dl className="divide-y divide-line">
              <Row label="Full Name">
                {shipping_address.first_name} {shipping_address.last_name}
              </Row>
              <Row label="Phone">{shipping_address.phone}</Row>
              <Row label="Email">{shipping_address.email}</Row>
              <Row label="Address">{shipping_address.address}</Row>
              <Row label="City">{shipping_address.city}</Row>
              <Row label="State">{shipping_address.state}</Row>
              <Row label="Status">{getStatusBadge(status)}</Row>
            </dl>
          </div>

          {/* Order Items */}
          <div className="border border-line bg-surface">
            <h2 className="border-b border-line px-4 py-3 text-xs font-bold uppercase tracking-widest text-primary">
              Order Item
            </h2>
            {items[0] && (
              <div className="flex items-center gap-4 p-4">
                <Image
                  src={items[0].product.image}
                  alt={items[0].product.name}
                  className="size-20 border border-line object-cover"
                  width={100}
                  height={100}
                />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold uppercase text-white">
                    {items[0].product.name}
                  </h3>
                  <p className="mt-1 text-xs text-smoke">Size: {items[0].size}</p>
                  <p className="text-xs text-smoke">Quantity: {items[0].quantity}</p>
                  <p className="mt-1 text-sm font-bold text-white">
                    <span className="uppercase">{items[0].product.currency} </span>
                    {items[0].product.price.toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Payment Details */}
          <div className="border border-line bg-surface">
            <h2 className="border-b border-line px-4 py-3 text-xs font-bold uppercase tracking-widest text-primary">
              Payment
            </h2>
            <dl className="divide-y divide-line">
              <Row label="Payment Method">{payment_detail.method}</Row>
              <Row label="Transaction Ref">{payment_detail.tx_ref}</Row>
              <Row label="Payment Status">{payment_detail.status}</Row>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
