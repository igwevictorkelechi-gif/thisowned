import { useEffect, useState } from "react";
import { useCart } from "../utils/CartContext";

const PaypalPayment = ({ total }) => {
  const { updateCart } = useCart(); // Get the updateCart function from context
  const [usdTotal, setUsdTotal] = useState(null);
  const exchangeRateApiUrl =
    "https://v6.exchangerate-api.com/v6/3548e1e5032c8a275b7439cb/latest/USD";

  useEffect(() => {
    // Fetch conversion rate from USD to Naira (NGN)
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(exchangeRateApiUrl);
        const data = await response.json();
        const ngnToUsdRate = 1 / data.conversion_rates.NGN; // Get NGN to USD by reversing the USD to NGN rate
        const totalInUsd = (total * ngnToUsdRate).toFixed(2); // Convert and round to 2 decimal places
        setUsdTotal(totalInUsd);
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    };

    fetchExchangeRate();
  }, [total]);

  useEffect(() => {
    // Load PayPal script and render button once usdTotal is available
    if (usdTotal) {
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=AQ4bH-hSKoViyIpgKRqtTUoNCpVkZqxQoA7cUo189b4dMSuBjZyuHKPwR8Jip1686bWCu3yuztcIE2LO`;
      script.addEventListener("load", () => {
        if (window.paypal) {
          window.paypal
            .Buttons({
              createOrder: function (data, actions) {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: usdTotal, // Use the converted USD total here
                      },
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
  }, [usdTotal]);

  return (
    <div className="flex justify-center text-center mt-5">
      <div id="paypal-button-container" className="w-full max-w-2xl"></div>
      {!usdTotal && <p>Loading PayPal button...</p>} {/* Loading state */}
    </div>
  );
};

export default PaypalPayment;
