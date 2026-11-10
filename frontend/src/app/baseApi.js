import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',

    prepareHeaders: (headers, { getState, arg }) => {
        if (!(arg?.body instanceof FormData)) {
            headers.set("Content-Type", "application/json");
        }

        return headers;
    }
});

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery,
    tagTypes: ["Auth", "User", "Tickets", "TicketHistory", "Sprint"],
    endpoints: () => ({}),
})