import Link from "next/link";
import React from "react";

function OrdersTable() {
  const tableItems = [
    {
      name: "MALFUNCTION SWEATPANTS GREY MARL",
      price: "300",
      quantity: "4",
      size: "2XL",
      status: "pending",
    },
    {
      name: "MALFUNCTION SWEATPANTS BLACK",
      price: "180",
      quantity: "2",
      size: "M",
      status: "success",
    },
    {
      name: "MALFUNCTION SWEATPANTS BLACK",
      price: "600",
      quantity: "8",
      size: "S",
      status: "cancelled",
    },
  ];

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
            {tableItems.map((item, idx) => (
              <tr key={idx}>
                <td className="pl-4 py-4 whitespace-nowrap">{idx + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">₦{item.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.size}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.status === "cancelled" ? (
                    <span
                      className="inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-0.5
                text-white"
                    >
                      <p className="whitespace-nowrap text-sm">Cancelled</p>
                    </span>
                  ) : item.status === "success" ? (
                    <span className="inline-flex items-center justify-center rounded-full bg-green-500 px-2 py-0.5 text-white">
                      <p className="whitespace-nowrap text-sm">Success</p>
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center rounded-full bg-yellow-300 px-2 py-0.5 text-yellow-800">
                      <p className="whitespace-nowrap text-sm">Pending</p>
                    </span>
                  )}
                </td>
                <td className="px-4 md:px-2 py-4 whitespace-nowrap">
                  <Link
                    href="orders/244"
                    className="bg-white text-black px-3 py-1 border-none rounded-sm"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrdersTable;
