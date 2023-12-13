import React from "react";

const CheckoutForm = () => {
  return (
    <div>
      {/* Your other React components and logic */}
      <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
      <stripe-pricing-table
        pricing-table-id="prctbl_1OFgWhHeAVaN0zE658WJbzRB"
        publishable-key="pk_test_51OFaejHeAVaN0zE6XCJRlC8T0JBsYzLCcZPsMQ6mFMOwrxpcDteh7t7s2BejVu3BhspYHObJMSMrfesHNN1YQAIu00C9Clv3aH"
      ></stripe-pricing-table>
    </div>
  );
};

export default CheckoutForm;
