import { baseApi } from "../../../app/baseApi";

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (credentials) => ({
                url: "/auth/create",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["Auth"]
        }),
        login: builder.mutation({
            query: (credentials) => ({
                url: "/auth/login",
                method: "POST",
                body: credentials
            }),
            invalidatesTags: ["Auth"]
        }),
        logout: builder.mutation({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
            invalidatesTags: ["Auth"]
        }),
    })
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useLogoutMutation
} = authApi;