import React from "react";
import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";

const FlutterwavePayment = ({ total, customerInfo }) => {
  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_TEST_KEY,
    tx_ref: Date.now(),
    amount: total,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: customerInfo.email,
      phone_number: customerInfo.phone,
      name: `${customerInfo.firstName} ${customerInfo.lastName}`,
    },
    customizations: {
      title: "Payment for clothings",
      //   description: "Payment for subscription",
      logo: "https://i.ibb.co/L0YYH85/logored.jpg",
    },
  };

  const fwConfig = {
    ...config,
    callback: (response) => {
      console.log(response);
      closePaymentModal(); // Close payment modal after payment
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
