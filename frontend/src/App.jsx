import React from "react";
import AppLayout from "./AppLayout";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./components/CheckoutForm";

const stripePromise = loadStripe(
  "pk_test_51OFaejHeAVaN0zE6XCJRlC8T0JBsYzLCcZPsMQ6mFMOwrxpcDteh7t7s2BejVu3BhspYHObJMSMrfesHNN1YQAIu00C9Clv3aH"
);

const App = () => {
  return (
    <>
      <AppLayout>
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </AppLayout>
      {/* <AppLayout /> */}
    </>
  );
};

export default App;
