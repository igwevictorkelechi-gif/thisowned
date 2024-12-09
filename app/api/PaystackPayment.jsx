import React from "react";
import { PaystackButton } from "react-paystack";
import { useRouter } from "next/navigation";
import { useCart } from "../utils/CartContext";

const PaystackPayment = ({ total, customerInfo, tx_ref, currency }) => {
  const { updateCart } = useCart(); // Get the updateCart function from context
  const router = useRouter();

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_TEST_KEY;
  const amount = total * 100; // Convert to kobo (Nigerian currency)

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
    // Close the Paystack modal
    // alert("Payment Successful!");

    // console.log(response.status);

    if (response.status === "success") {
      try {
        await updateCart(); // Ensure cart is updated before routing

        // Navigate to the success page
        window.location.href = "/success";

        // Optionally reload the page
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1000); // Ensure routing happens before reload
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
