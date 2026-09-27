"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.corsConfig = void 0;
var corsConfig = {
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};
exports.corsConfig = corsConfig;