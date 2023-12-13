import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const agentCompanyApi = createApi({
  reducerPath: "agentCompanyApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/agents" }),
  endpoints: (builder) => ({
    addAgent: builder.mutation({
      query: (agentData) => ({
        url: "/add-agent",
        method: "POST",
        body: agentData,
      }),
    }),
    getMyAgents: builder.query({
      query: () => "/myagents",
    }),
  }),
});

export const { useAddAgentMutation, useGetMyAgentsQuery } = agentCompanyApi;

