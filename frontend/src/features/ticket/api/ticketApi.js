import { baseApi } from "../../../app/baseApi";

const ticketApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createProject: builder.mutation({
            query: (data) => ({
                url: '/ticket/create-project',
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
        getTeamProjects: builder.query({
            query: () => ({
                url: '/ticket/get-member-projects',
                method: "GET",
            }),
            providesTags: ["Tickets"]
        }),
    })
});

export const {
    useCreateProjectMutation,
    useGetMyProjectsQuery,
    useGetTeamProjectsQuery
} = ticketApi;