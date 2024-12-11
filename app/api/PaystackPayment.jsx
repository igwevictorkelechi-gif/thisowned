"use client";
import React from "react";
import { PaystackButton } from "react-paystack";
import { useRouter } from "next/navigation";
import { useCart } from "../utils/CartContext";

const PaystackPayment = ({ total, customerInfo, tx_ref, currency }) => {
  const { updateCart } = useCart();
  const router = useRouter();

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_TEST_KEY;
  const amount = total * 100;

  const config = {
    email: customerInfo.email,
    amount,
    publicKey,
    reference: tx_ref,
    currency,
    metadata: {
      custom_fields: [
        {
          display_name: "Phone Number",
          variable_name: "phone_number",
          value: customerInfo.phone,
        },
      ],
    },
  };

  const handleSuccess = async (response) => {
    if (response.status === "success") {
      try {
        await updateCart();
        router.push("/success"); // Use router.push instead of window.location
      } catch (error) {
        console.error("Error updating cart:", error);
      }
    }
  };

  const handleClose = () => {
    console.log("Payment process closed.");
  };

  return (
    <div className="flex justify-center text-center mt-6">
      <PaystackButton
        {...config}
        text="Pay with Paystack"
        className="w-full max-w-2xl rounded-md bg-[#09A4DB] py-3 font-semibold text-white text-center tracking-wider"
        onSuccess={handleSuccess}
        onClose={handleClose}
      />
    </div>
  );
};

export default PaystackPayment;
