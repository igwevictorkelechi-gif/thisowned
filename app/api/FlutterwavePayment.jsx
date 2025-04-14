import React from "react";
import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";
import { useRouter } from "next/navigation";
import { useCart } from "../utils/CartContext";

const FlutterwavePayment = ({ total, customerInfo, tx_ref, currency }) => {
  const { updateCart } = useCart(); // Get the updateCart function from context
  // const { updateCart } = useCart();
  // console.log("updateCart function:", updateCart);
  const router = useRouter();
  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_TEST_KEY,
    // tx_ref: Date.now(),
    tx_ref: tx_ref,
    amount: total,
    currency: currency,
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: customerInfo.email,
      phone_number: customerInfo.phone,
      name: `${customerInfo.firstName} ${customerInfo.lastName}`,
    },
    customizations: {
      title: "Thisowned",
      description: "Payment for items in cart",
      logo: "https://i.ibb.co/L0YYH85/logored.jpg",
    },
  };

  const fwConfig = {
    ...config,
    callback: async (response) => {
      closePaymentModal(); // Close payment modal after payment
      if (response.status === "successful") {
        try {
          await updateCart(); // Ensure cart is updated before routing
          // console.log("Cart updated successfully");

          // First, navigate to the success page
          // router.push("/success"); // Route to '/success'
          window.location.href = `success`;

          // Then force the page to reload after navigating
          // setTimeout(() => {
          //   window.location.reload();
          // }, 1000); // Adding a delay to ensure the routing happens before reload
        } catch (error) {
          console.error("Error updating cart:", error);
        }
      }
    },
    onClose: () => {},
  };

  return (
    <div className="flex justify-center text-center mt-12">
      <FlutterWaveButton
        {...fwConfig}
        className="w-full max-w-2xl rounded-md bg-[#FF9B00] py-3 font-semibold text-white text-center tracking-wider"
        text="Pay with Flutterwave"
      />
    </div>
  );
};

export default FlutterwavePayment;
