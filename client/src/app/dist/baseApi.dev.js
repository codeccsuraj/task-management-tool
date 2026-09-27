"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.baseApi = void 0;

var _react = require("@reduxjs/toolkit/query/react");

var baseQuery = (0, _react.fetchBaseQuery)({
  baseUrl: process.env.REACT_APP_API_URL,
  credentials: 'include',
  prepareHeaders: function prepareHeaders(headers) {
    headers.set("Content-Type", "application/json");
    return headers;
  }
});
var baseApi = (0, _react.createApi)({
  reducerPath: "api",
  baseQuery: baseQuery,
  tagTypes: ["Auth", "User"],
  endpoints: function endpoints() {
    return {};
  }
});
exports.baseApi = baseApi;