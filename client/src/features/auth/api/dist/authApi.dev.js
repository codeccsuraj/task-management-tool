"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useLogoutMutation = exports.useLoginMutation = exports.useRegisterMutation = void 0;

var _baseApi = require("../../../app/baseApi");

var authApi = _baseApi.baseApi.injectEndpoints({
  endpoints: function endpoints(builder) {
    return {
      register: builder.mutation({
        query: function query(credentials) {
          return {
            url: "/auth/create",
            method: "POST",
            body: credentials
          };
        },
        invalidatesTags: ["Auth"]
      }),
      login: builder.mutation({
        query: function query(credentials) {
          return {
            url: "/auth/login",
            method: "POST",
            body: credentials
          };
        },
        invalidatesTags: ["Auth"]
      }),
      logout: builder.mutation({
        query: function query() {
          return {
            url: "/auth/logout",
            method: "POST"
          };
        },
        invalidatesTags: ["Auth"]
      })
    };
  }
});

var useRegisterMutation = authApi.useRegisterMutation,
    useLoginMutation = authApi.useLoginMutation,
    useLogoutMutation = authApi.useLogoutMutation;
exports.useLogoutMutation = useLogoutMutation;
exports.useLoginMutation = useLoginMutation;
exports.useRegisterMutation = useRegisterMutation;