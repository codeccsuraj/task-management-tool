"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _authRoutes = _interopRequireDefault(require("./routes/auth/auth.routes.js"));

var _cors = _interopRequireDefault(require("cors"));

var _corsConfig = require("./config/cors.config.js");

var _userRoutes = _interopRequireDefault(require("./routes/user/user.routes.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])(); // Middlewares

app.use((0, _cors["default"])(_corsConfig.corsConfig));
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use((0, _cookieParser["default"])());
app.use("/api/v1/auth", _authRoutes["default"]);
app.use("/api/v1/user", _userRoutes["default"]); // Health check

app.get("/", function (req, res) {
  res.status(200).json({
    success: true,
    message: "API is running"
  });
});
var _default = app;
exports["default"] = _default;