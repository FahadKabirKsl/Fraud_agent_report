import { apiSlice } from "./apiSlice";

const SUBSCRIPTIONS_URL = "/api/subscriptions";

export const subscriptionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createSubscription: builder.mutation({
      query: (data) => ({
        url: `${SUBSCRIPTIONS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    getSubscriptionById: builder.query({
      query: (subscriptionId) => ({
        url: `${SUBSCRIPTIONS_URL}/${subscriptionId}`,
        method: "GET",
      }),
    }),
    updateSubscription: builder.mutation({
      query: ({ subscriptionId, data }) => ({
        url: `${SUBSCRIPTIONS_URL}/${subscriptionId}`,
        method: "PUT",
        body: data,
      }),
    }),
    cancelSubscription: builder.mutation({
      query: (subscriptionId) => ({
        url: `${SUBSCRIPTIONS_URL}/${subscriptionId}`,
        method: "DELETE",
      }),
    }),
    listSubscriptions: builder.query({
      query: () => ({
        url: `${SUBSCRIPTIONS_URL}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateSubscriptionMutation,
  useGetSubscriptionByIdQuery,
  useUpdateSubscriptionMutation,
  useCancelSubscriptionMutation,
  useListSubscriptionsQuery,
} = subscriptionApiSlice;
