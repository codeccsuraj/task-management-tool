"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logout = exports.loginAuth = exports.createAuth = void 0;

var _authService = require("../../service/auth/auth.service.js");

var createAuth = function createAuth(req, res) {
  var data, _result;

  return regeneratorRuntime.async(function createAuth$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          data = req.body;
          _context.next = 4;
          return regeneratorRuntime.awrap(_authService.authService.create(data));

        case 4:
          _result = _context.sent;

          if (_result.success) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.status(_result.status).json({
            success: false,
            message: _result.message
          }));

        case 7:
          ;

          if (_result.success) {
            res.cookie("accessToken", _result.data.token, {
              httpOnly: true,
              secure: false,
              sameSite: "lax",
              maxAge: 24 * 60 * 60 * 1000
            });
          }

          return _context.abrupt("return", res.status(_result.status).json({
            success: true,
            message: _result.message,
            data: {
              user: _result.data.user
            }
          }));

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          console.error("Error in create controller:", _context.t0);
          return _context.abrupt("return", res.status(500).json({
            success: false,
            message: "Internal server error"
          }));

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

exports.createAuth = createAuth;

var loginAuth = function loginAuth(req, res) {
  var data, _result2;

  return regeneratorRuntime.async(function loginAuth$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          data = req.body;
          _context2.next = 4;
          return regeneratorRuntime.awrap(_authService.authService.login(data));

        case 4:
          _result2 = _context2.sent;

          if (_result2.success) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.status(_result2.status).json({
            success: false,
            message: _result2.message
          }));

        case 7:
          ;

          if (_result2.success) {
            res.cookie("accessToken", _result2.data.token, {
              httpOnly: true,
              secure: false,
              sameSite: "lax",
              maxAge: 24 * 60 * 60 * 1000
            });
          }

          return _context2.abrupt("return", res.status(_result2.status).json({
            success: true,
            message: _result2.message,
            data: {
              user: _result2.data.user
            }
          }));

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](0);
          console.error("Error in create controller:", _context2.t0);
          return _context2.abrupt("return", res.status(500).json({
            success: false,
            message: "Internal server error"
          }));

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

exports.loginAuth = loginAuth;

var logout = function logout(req, res) {
  return regeneratorRuntime.async(function logout$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          res.clearCookie("accessToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
          });
          return _context3.abrupt("return", res.status(result.status).json({
            success: true,
            message: "Logged out successfully"
          }));

        case 5:
          _context3.prev = 5;
          _context3.t0 = _context3["catch"](0);
          console.error("Logout controller error:", _context3.t0);
          return _context3.abrupt("return", res.status(500).json({
            success: false,
            message: "Something went wrong while logging out"
          }));

        case 9:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 5]]);
};

exports.logout = logout;