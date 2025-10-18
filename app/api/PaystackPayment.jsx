"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../utils/CartContext";
import Swal from "sweetalert2";

const PaystackPayment = ({
  total,
  customerInfo,
  tx_ref,
  currency,
  onInitiatePayment,
  onPaymentClosed,
}) => {
  const { updateCart } = useCart();
  const router = useRouter();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [paymentInProgress, setPaymentInProgress] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  // Load Paystack script
  useEffect(() => {
    if (window.PaystackPop) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;

    script.onload = () => {
      setScriptLoaded(true);
    };

    script.onerror = () => {
      console.error("Failed to load Paystack script");
      Swal.fire({
        icon: "error",
        title: "Payment Error",
        text: "Could not load payment system. Please try again later.",
        confirmButtonColor: "#000000",
        confirmButtonText: "Close",
      });
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Handle automatic payment initiation - only if payment not yet completed
  useEffect(() => {
    let timer;
    if (scriptLoaded && onInitiatePayment && !paymentInProgress && !paymentCompleted) {
      timer = setTimeout(() => {
        initiatePayment();
      }, 300);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [scriptLoaded, onInitiatePayment, paymentInProgress, paymentCompleted]);

  const initiatePayment = () => {
    if (!scriptLoaded || !window.PaystackPop) {
      console.error("Paystack script not loaded yet");
      Swal.fire({
        icon: "error",
        title: "Please Wait",
        text: "Payment system is still loading. Please try again in a moment.",
        confirmButtonColor: "#000000",
        confirmButtonText: "Close",
      });
      return;
    }

    if (paymentCompleted) {
      console.log("Payment already completed, skipping initiation");
      return;
    }

    try {
      setPaymentInProgress(true);

      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_TEST_KEY;
      const amount = Math.round(total * 100);

      const paymentConfig = {
        email: customerInfo.email,
        amount,
        key: publicKey,
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
        // Define inline callback functions
        callback: function(response) {
          setPaymentInProgress(false);
          setPaymentCompleted(true); // Mark payment as completed to prevent re-showing modal
          
          if (response.status === "success") {
            // Use the existing updateCart function to sync with backend
            updateCart()
              .then(() => {
                Swal.fire({
                  icon: "success",
                  title: "Payment Successful!",
                  text: "Thank you for your purchase.",
                  confirmButtonColor: "#000000",
                  confirmButtonText: "Proceed",
                }).then(() => {
                  // Pass the payment reference to the success page
                  window.location.href = `/success?ref=${response.reference}`;
                });
              })
              .catch((error) => {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Something went wrong updating your cart!",
                  confirmButtonColor: "#000000",
                  confirmButtonText: "Close",
                });
                console.error("Error updating cart:", error);
              });
          }
        },
        onClose: function() {
          setPaymentInProgress(false);
          if (onPaymentClosed) {
            onPaymentClosed();
          }
        }
      };

      const handler = window.PaystackPop.setup(paymentConfig);
      handler.openIframe();
    } catch (error) {
      setPaymentInProgress(false);
      console.error("Error initiating Paystack payment:", error);
      Swal.fire({
        icon: "error",
        title: "Payment Error",
        text: "An error occurred while initiating payment. Please try again.",
        confirmButtonColor: "#000000",
        confirmButtonText: "Close",
      });
    }
  };

  return (
    <div className="flex justify-center text-center mt-6">
      <button
        onClick={initiatePayment}
        disabled={!scriptLoaded || paymentInProgress || paymentCompleted}
        className={`inline-block w-full rounded-lg px-5 py-3 font-medium text-center cursor-pointer ${
          scriptLoaded && !paymentInProgress && !paymentCompleted
            ? "bg-white text-black"
            : "bg-gray-300 text-gray-600 cursor-not-allowed"
        }`}
      >
        {!scriptLoaded
          ? "Loading Payment System..."
          : paymentInProgress
          ? "Payment in Progress..."
          : paymentCompleted
          ? "Payment Completed"
          : "Pay with Paystack"}
      </button>
    </div>
  );
};

export default PaystackPayment;