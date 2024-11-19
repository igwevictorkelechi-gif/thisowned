import { useEffect, useState } from "react";
import { useCart } from "../utils/CartContext";

const PaypalPayment = ({ total, tx_ref }) => {
  const { updateCart } = useCart(); // Get the updateCart function from context

  useEffect(() => {
    // Load PayPal script and render button once total is available
    if (total) {
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=AYbIKPKQiRhMh1SQNDCWz7qCKmor-wlCG-aSza3RGaje_eZ_5YdNxeos1xpqUfRExJlm7PpSb1PHCEbO`;
      script.addEventListener("load", () => {
        if (window.paypal) {
          window.paypal
            .Buttons({
              createOrder: function (data, actions) {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: total, // Use the converted USD total here
                      },
                      invoice_id: tx_ref, // Add transaction reference here
                      description: `Order Reference: ${tx_ref}`, // Include in description for visibility
                    },
                  ],
                });
              },
              onApprove: async function (data, actions) {
                // Make this function async
                const details = await actions.order.capture(); // Await the capture
                // alert(
                //   "Transaction completed by " + details.payer.name.given_name
                // );
                await updateCart(); // Ensure cart is updated before routing
                window.location.href = `success`;
              },
            })
            .render("#paypal-button-container");
        }
      });
      script.async = true;
      document.body.appendChild(script);
    }
  }, [total]);

  return (
    <div className="flex justify-center text-center mt-5">
      <div id="paypal-button-container" className="w-full max-w-2xl"></div>
      {!total && <p>Loading PayPal button...</p>} {/* Loading state */}
    </div>
  );
};

export default PaypalPayment;
