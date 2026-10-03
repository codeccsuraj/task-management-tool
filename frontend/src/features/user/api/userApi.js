import { baseApi } from "../../../app/baseApi";


const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUserByAuthId: builder.query({
            query: (id) => ({
                url: `/user/get-user/${id}`,
                method: "GET",
            }),
            providesTags: ["User"]
        }),
        createUser: builder.mutation({
            query: (data) => ({
                url: `/user/create-user`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Auth", "User"]
        }),
        upsertByAuthId: builder.mutation({
            query: ({ id, data }) => ({
                url: `/user/upsert-user/${id}`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Auth", "User"]
        }),
        getUsers: builder.query({
            query: (query) => ({
                url: `/user/get-users`,
                method: "GET",
                params: query
            }),
            invalidatesTags: ["User"]
        }),
    })
});

export const {
    useUpsertByAuthIdMutation,
    useCreateUserMutation,
    useGetUserByAuthIdQuery,
    useGetUsersQuery
} = userApi;