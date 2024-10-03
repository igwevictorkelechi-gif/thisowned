"use client";
import { useState, useEffect } from "react";
import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function OrderDetailsPage({ params }) {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_ORDERS_URL}${params.id}`
        );
        if (!response.ok) throw new Error("Failed to fetch order details");
        const data = await response.json();
        setOrderDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [params.id]);

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

  if (error) {
    return (
      <div className="bg-black min-h-screen">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-14">
          <div className="text-red-500 text-center">{error}</div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-yellow-400 text-yellow-700",
      processing: "bg-orange-500 text-orange-100",
      cancelled: "bg-red-500 text-white",
      completed: "bg-green-500 text-white",
    };

    const statusText = {
      pending: "Pending",
      processing: "Processing",
      cancelled: "Cancelled",
      completed: "Success",
    };

    return (
      <span
        className={`inline-flex items-center justify-center rounded-full ${statusStyles[status]} px-2 py-0.5`}
      >
        <p className="whitespace-nowrap text-sm">{statusText[status]}</p>
      </span>
    );
  };

  const { shipping_address, payment_detail, items, status } = orderDetails;

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-14">
        <div className="flex py-10">
          <h1 className="text-2xl font-semibold flex gap-4 items-center text-white">
            <Link href="../orders">
              <ArrowLeftCircle size={22} />
            </Link>
            Order Details
          </h1>
        </div>

        <div className="grid gap-8">
          {/* Customer Information */}
          <div className="flow-root rounded-lg border border-gray-600 py-3 shadow-sm">
            <dl className="-my-3 divide-y divide-gray-600 text-sm">
              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-semibold text-white">Full name</dt>
                <dd className="text-white sm:col-span-2">
                  {shipping_address.first_name} {shipping_address.last_name}
                </dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-semibold text-white">Phone number</dt>
                <dd className="text-white sm:col-span-2">
                  {shipping_address.phone}
                </dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-semibold text-white">Email</dt>
                <dd className="text-white sm:col-span-2">
                  {shipping_address.email}
                </dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-semibold text-white">Address</dt>
                <dd className="text-white sm:col-span-2">
                  {shipping_address.address}
                </dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-semibold text-white">City</dt>
                <dd className="text-white sm:col-span-2">
                  {shipping_address.city}
                </dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-semibold text-white">State</dt>
                <dd className="text-white sm:col-span-2">
                  {shipping_address.state}
                </dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-semibold text-white">Status</dt>
                <dd className="text-white sm:col-span-2">
                  {getStatusBadge(status)}
                </dd>
              </div>
            </dl>
          </div>

          {/* Order Items */}
          <div className="flow-root rounded-lg border border-gray-600 py-3 shadow-sm">
            <h2 className="text-xl font-semibold text-white px-3 mb-4">
              Order Items
            </h2>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 border-t border-gray-600"
                >
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                    width={100}
                    height={100}
                  />
                  <div className="flex-1">
                    <h3 className="text-white font-medium">
                      {item.product.name}
                    </h3>
                    <p className="text-gray-400 text-sm">Size: {item.size}</p>
                    <p className="text-gray-400 text-sm">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-white text-sm">
                      <span className="capitalize">
                        {item.product.currency}:
                      </span>{" "}
                      {item.product.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Details */}
          <div className="flow-root rounded-lg border border-gray-600 py-3 shadow-sm">
            <h2 className="text-xl font-semibold text-white px-3 mb-4">
              Payment Details
            </h2>
            <dl className="-my-3 divide-y divide-gray-600 text-sm px-3">
              <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-semibold text-white">Payment Method</dt>
                <dd className="text-white sm:col-span-2">
                  {payment_detail.method}
                </dd>
              </div>
              <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-semibold text-white">
                  Transaction Reference
                </dt>
                <dd className="text-white sm:col-span-2">
                  {payment_detail.tx_ref}
                </dd>
              </div>
              <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-semibold text-white">Payment Status</dt>
                <dd className="text-white sm:col-span-2">
                  {payment_detail.status}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
