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
        upsertByAuthId: builder.mutation({
            query: ({ id, data }) => ({
                url: `/user/add-user/${id}`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Auth", "User"]
        }),
    })
});

export const {
    useUpsertByAuthIdMutation,
    useGetUserByAuthIdQuery
} = userApi;