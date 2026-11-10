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
        updateTicketFields: builder.mutation({
            query: ({ ticketId, event, data, attachments = [] }) => {
                const formData = new FormData();

                Object.entries(data).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        formData.append(key, value);
                    }
                });

                attachments.forEach((item) => {
                    if (item.file instanceof File) {
                        formData.append("attachments", item.file);
                        formData.append("attachmentIds", item.id);
                    }
                });

                return {
                    url: `/ticket/update-ticket`,
                    method: "PATCH",
                    params: { ticketId, event },
                    body: formData,
                };
            },
            invalidatesTags: ["Tickets", "TicketHistory"]
        }),
        getTicketByProjectId: builder.query({
            query: (data) => ({
                url: `/ticket/get-tickets`,
                method: "GET",
                params: data,
            }),
            providesTags: ["Tickets"]
        }),
        getHistoryByTicketId: builder.query({
            query: (ticketId) => ({
                url: `/ticket/get-history/${ticketId}`,
                method: "GET",
            }),
            providesTags: ["TicketHistory"]
        }),
        getTicketById: builder.query({
            query: (id) => ({
                url: `/ticket/get-ticket/${id}`,
                method: "GET",
            }),
            providesTags: ["Tickets"]
        }),
        updateTicket: builder.mutation({
            query: (id) => ({
                url: `/ticket/get-ticket/${id}`,
                method: "POST",
            }),
            providesTags: ["Tickets", "TicketHistory"]
        }),
        updateMemberProject: builder.mutation({
            query: ({ id, data }) => ({
                url: `/ticket/add-member/${id}`,
                method: "PATCH",
                body: data
            }),
            invalidatesTags: ["Tickets", "TicketHistory"]
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
    useUpdateTicketFieldsMutation,
    useGetTicketByProjectIdQuery,
    useGetHistoryByTicketIdQuery,
    useGetTicketByIdQuery,
    useUpdateTicketMutation,
    useUpdateMemberProjectMutation
} = ticketApi;