import React from "react";
import { PaystackButton } from "react-paystack";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2"; // Import SweetAlert
import { useCart } from "../utils/CartContext";

const PaystackPayment = ({ total, customerInfo, tx_ref }) => {
  const { updateCart } = useCart(); // Get the updateCart function from context
  const router = useRouter();

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_TEST_KEY;
  const amount = total * 100; // Convert to kobo (Nigerian currency)

  const config = {
    email: customerInfo.email,
    amount,
    publicKey,
    reference: tx_ref,
    currency: "NGN",
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
        await updateCart(); // Ensure cart is updated before routing
        Swal.fire({
          title: "Success!",
          text: "Payment completed successfully!",
          icon: "success",
          confirmButtonColor: "#000000",
          confirmButtonText: "Proceed",
        }).then(() => {
          // Navigate to the success page
          window.location.href = "/success";
        });
      } catch (error) {
        console.error("Error updating cart:", error);
        Swal.fire({
          title: "Error!",
          text: "An error occurred while updating your cart. Please try again.",
          icon: "error",
          confirmButtonColor: "#FF0000",
          confirmButtonText: "Close",
        });
      }
    } else {
      Swal.fire({
        title: "Payment Failed!",
        text: "Your payment was not successful. Please try again.",
        icon: "error",
        confirmButtonColor: "#FF0000",
        confirmButtonText: "Retry",
      });
    }
  };

  const handleClose = () => {
    Swal.fire({
      title: "Payment Cancelled",
      text: "You closed the payment modal without completing the transaction.",
      icon: "info",
      confirmButtonColor: "#000000",
      confirmButtonText: "Close",
    });
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
