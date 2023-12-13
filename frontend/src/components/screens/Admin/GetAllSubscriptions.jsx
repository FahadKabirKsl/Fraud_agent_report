import React, { useEffect, useState } from "react";
import {
  useCreateSubscriptionMutation,
  useGetSubscriptionByIdQuery,
  useUpdateSubscriptionMutation,
  useCancelSubscriptionMutation,
  useListSubscriptionsQuery,
} from "../../../slices/subscriptionApiSlice";

const GetAllSubscriptions = () => {
  const { data, error, isLoading } = useListSubscriptionsQuery();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2>All Subscriptions</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Price</th>
            <th>Customer ID</th>
            <th>Trial Start Date</th>
            <th>Trial End Date</th>
            <th>Plan End Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((subscription) => (
            <tr key={subscription.id}>
              <td>{subscription.id}</td>
              <td>{subscription.status}</td>
              <td>{subscription.items.data[0].price.unit_amount / 100} USD</td>
              <td>{subscription.customer}</td>
              <td>
                {new Date(subscription.trial_start * 1000).toLocaleDateString()}
              </td>
              <td>
                {new Date(subscription.trial_end * 1000).toLocaleDateString()}
              </td>
              <td>
                {new Date(
                  subscription.current_period_end * 1000
                ).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GetAllSubscriptions;
