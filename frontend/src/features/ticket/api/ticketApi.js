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
        createSprint: builder.mutation({
            query: (data) => ({
                url: '/ticket/create-sprint',
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
        getProjectTeam: builder.query({
            query: (id) => ({
                url: `/ticket/get-member/${id}`,
                method: "GET",
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
        getSprintByProjectId: builder.query({
            query: (key) => ({
                url: `/ticket/get-projects-sprint/${key}`,
                method: "GET",
            }),
            providesTags: ["Sprint"]
        }),
        createTicket: builder.mutation({
            query: (data) => ({
                url: `/ticket/create-ticket`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Tickets"]
        }),
        getTicketByProjectId: builder.query({
            query: (data) => ({
                url: `/ticket/get-tickets`,
                method: "GET",
                params: data,
            }),
            providesTags: ["Tickets"]
        }),
    })
});

export const {
    useCreateProjectMutation,
    useCreateSprintMutation,
    useGetMyProjectsQuery,
    useGetTeamProjectsQuery,
    useGetProjectTeamQuery,
    useGetSprintByProjectIdQuery,
    useCreateTicketMutation,
    useGetTicketByProjectIdQuery,
} = ticketApi;