import { apiSlice } from "./apiSlice";
const ADMIN_URL = "/api/admin";
export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllAgents: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/agents`,
        method: "GET",
      }),
    }),
    getAllAgentCompanies: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/agentCompanies`,
        method: "GET",
      }),
    }),
    getAllFraudAgents: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/fraudAgents`,
        method: "GET",
      }),
    }),

    getAllFraudAgentCompanies: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/fraudAgentCompanies`,
        method: "GET",
      }),
    }),
    reportAgent: builder.mutation({
      query: (agentId, data) => ({
        url: `${ADMIN_URL}/agents/${agentId}`,
        method: "PUT",
        body: data,
      }),
    }),
    reportAgentCompany: builder.mutation({
      query: (companyId, data) => ({
        url: `${ADMIN_URL}/agentCompanies/${companyId}`,
        method: "PUT",
        body: data,
      }),
    }),
    banAgent: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/agents/${id}/ban`,
        method: "PUT",
      }),
    }),
    banAgentCompany: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/agentCompanies/${id}/ban`,
        method: "PUT",
      }),
    }),
    markSafeAgent: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/agents/${id}/markSafe`,
        method: "PUT",
      }),
    }),
    markSafeAgentCompany: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/agentCompanies/${id}/markSafe`,
        method: "PUT",
      }),
    }),
    getAllMoneyLendingEntities: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/moneyLendingEntities`,
        method: "GET",
      }),
    }),
    getAllBanned: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/bannedEntities`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAllAgentsQuery,
  useGetAllAgentCompaniesQuery,
  useReportAgentMutation,
  useReportAgentCompanyMutation,
  useBanAgentMutation,
  useBanAgentCompanyMutation,
  useMarkSafeAgentMutation,
  useMarkSafeAgentCompanyMutation,
  useGetAllMoneyLendingEntitiesQuery,
  useGetAllBannedQuery,
  useGetAllFraudAgentsQuery,
  useGetAllFraudAgentCompaniesQuery,
} = adminApiSlice;

// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const adminApi = createApi({
//   reducerPath: "adminApi",
//   baseQuery: fetchBaseQuery({ baseUrl: "/api/admin" }),
//   endpoints: (builder) => ({
//     banAgent: builder.mutation({
//       query: (agentId) => ({
//         url: `/agents/${agentId}/ban`,
//         method: "PUT",
//       }),
//     }),
//     banAgentCompany: builder.mutation({
//       query: (companyId) => ({
//         url: `/agentCompanies/${companyId}/ban`,
//         method: "PUT",
//       }),
//     }),
//     getAllAgents: builder.query({
//       query: () => "/agents",
//     }),
//     getAllAgentCompanies: builder.query({
//       query: () => "/agentCompanies",
//     }),
//     getAllMoneyLendingEntities: builder.query({
//       query: () => "/moneyLendingEntities",
//     }),
//     getAllBannedEntities: builder.query({
//       query: () => "/bannedEntities",
//     }),
//   }),
// });

// export const {
//   useBanAgentMutation,
//   useBanAgentCompanyMutation,
//   useGetAllAgentsQuery,
//   useGetAllAgentCompaniesQuery,
//   useGetAllMoneyLendingEntitiesQuery,
//   useGetAllBannedEntitiesQuery,
// } = adminApi;
// unbanAgentCompany: builder.mutation({
//   query: (id) => ({
//     url: `${ADMIN_URL}/agentCompanies/${id}/unban`,
//     method: "PUT",
//   }),
// }),    // unbanAgent: builder.mutation({
//   query: (id) => ({
//     url: `${ADMIN_URL}/agents/${id}/unban`,
//     method: "PUT",
//   }),
// }),
