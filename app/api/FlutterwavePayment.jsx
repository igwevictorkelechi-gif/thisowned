import React from "react";
import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";
import { useRouter } from "next/navigation";

const FlutterwavePayment = ({ total, customerInfo, tx_ref }) => {
  const router = useRouter();
  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_TEST_KEY,
    // tx_ref: Date.now(),
    tx_ref: tx_ref,
    amount: total,
    currency: "NGN",
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
    callback: (response) => {
      console.log(response);
      closePaymentModal(); // Close payment modal after payment
      if (response.status === "successful") {
        // Route to another page after success
        router.push("success"); // Change '/success' to your desired route
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
