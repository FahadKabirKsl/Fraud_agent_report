import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const moneyLendingApi = createApi({
  reducerPath: "moneyLendingApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getAgents: builder.query({
      query: () => "/agents/list-agents",
    }),
    getAgentCompanies: builder.query({
      query: () => "/agents/agentCompanies",
    }),
    getAllFraudAgents: builder.query({
      query: () => "/agents/fraudAgents",
    }),
    getAllFraudAgentCompanies: builder.query({
      query: () => "/agents/fraudAgentCompanies",
    }),
    reportAgent: builder.mutation({
      query: (agentId) => ({
        url: `/agents/reportAgent/${agentId}`,
        method: "PUT",
      }),
    }),
    reportAgentCompany: builder.mutation({
      query: (companyId) => ({
        url: `/agents/reportAgentCompany/${companyId}`,
        method: "PUT",
      }),
    }),
  }),
});

export const {
  useGetAgentsQuery,
  useGetAgentCompaniesQuery,
  useReportAgentMutation,
  useReportAgentCompanyMutation,
} = moneyLendingApi;
