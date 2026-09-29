"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGetUserByAuthIdQuery = exports.useUpsertByAuthIdMutation = void 0;

var _baseApi = require("../../../app/baseApi");

var userApi = _baseApi.baseApi.injectEndpoints({
  endpoints: function endpoints(builder) {
    return {
      getUserByAuthId: builder.query({
        query: function query(id) {
          return {
            url: "/user/get-user/".concat(id),
            method: "GET"
          };
        },
        providesTags: ["User"]
      }),
      upsertByAuthId: builder.mutation({
        query: function query(_ref) {
          var id = _ref.id,
              data = _ref.data;
          return {
            url: "/user/add-user/".concat(id),
            method: "POST",
            body: data
          };
        },
        invalidatesTags: ["Auth", "User"]
      })
    };
  }
});

var useUpsertByAuthIdMutation = userApi.useUpsertByAuthIdMutation,
    useGetUserByAuthIdQuery = userApi.useGetUserByAuthIdQuery;
exports.useGetUserByAuthIdQuery = useGetUserByAuthIdQuery;
exports.useUpsertByAuthIdMutation = useUpsertByAuthIdMutation;