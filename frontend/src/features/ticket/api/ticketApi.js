import { baseApi } from "../../../app/baseApi";

const ticketApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createProject: builder.mutation({
            query: (data) => ({
                url: '/ticket/get-project',
                method: "POSt",
                body: data
            }),
            invalidatesTags: ["Tickets"]
        }),
        getMyProjects: builder.query({
            query: (data) => ({
                url: '/ticket/get-projects',
                method: "GET",
                params: data
            }),
            providesTags: ["Tickets"]
        }),
    })
});

export const {
    useCreateProjectMutation,
    useGetMyProjectsQuery,
} = ticketApi;