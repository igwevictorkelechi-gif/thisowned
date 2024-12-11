"use client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCart } from "../utils/CartContext";
import Swal from "sweetalert2";

const PaystackButton = dynamic(
  () => import("react-paystack").then((mod) => mod.PaystackButton),
  {
    ssr: false,
  }
);

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

        Swal.fire({
          icon: "success",
          title: "Payment Successful!",
          text: "Thank you for your purchase.",
          confirmButtonColor: "#000000",
          confirmButtonText: "Proceed",
        }).then(() => {
          window.location.href = `success`;
          // router.push("/success");
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          confirmButtonColor: "#000000",
          confirmButtonText: "Close",
        });
        console.error("Error updating cart:", error);
      }
    }
  };

  const handleClose = () => {
    Swal.fire({
      icon: "info",
      title: "Payment Cancelled",
      text: "You have closed the payment process.",
      confirmButtonColor: "#000000",
      confirmButtonText: "Close",
    });
  };

  return (
    <div className="flex justify-center text-center mt-6">
      <PaystackButton
        {...config}
        text="Pay with Paystack"
        className="w-full max-w-2xl rounded-md bg-[#09a3dbd8] py-4 font-semibold text-white text-center tracking-wider"
        onSuccess={handleSuccess}
        onClose={handleClose}
      />
    </div>
  );
};

export default PaystackPayment;
