import { useEffect } from "react";

const PaypalPayment = ({ total }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=CLIENT_ID`;
    script.addEventListener("load", () => {
      if (window.paypal) {
        window.paypal
          .Buttons({
            createOrder: function (data, actions) {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: total, // Replace with the amount
                    },
                  },
                ],
              });
            },
            onApprove: function (data, actions) {
              return actions.order.capture().then(function (details) {
                alert(
                  "Transaction completed by " + details.payer.name.given_name
                );
              });
            },
          })
          .render("#paypal-button-container");
      }
    });
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="flex justify-center text-center mt-5">
      <div id="paypal-button-container" className="w-full max-w-2xl"></div>
    </div>
  );
};

export default PaypalPayment;
