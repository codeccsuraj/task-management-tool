"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserByAuthId = exports.upsertByAuthId = exports.getUsers = exports.createUser = void 0;

var _userService = require("../../service/user/user.service.js");

var _jwt = require("../../utils/jwt.js");

var createUser = function createUser(req, res) {
  var token, user, data, result;
  return regeneratorRuntime.async(function createUser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          token = req.cookies.accessToken;
          user = (0, _jwt.decodeToken)(token);
          data = req.body;
          _context.next = 6;
          return regeneratorRuntime.awrap(_userService.userService.createUser(user.id, data));

        case 6:
          result = _context.sent;
          return _context.abrupt("return", res.status(result.status).json(result));

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          console.error("UserController createUser error:", _context.t0);
          return _context.abrupt("return", res.status(500).json({
            success: false,
            message: "Something went wrong while adding data"
          }));

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.createUser = createUser;

var getUsers = function getUsers(req, res) {
  var token, user, result;
  return regeneratorRuntime.async(function getUsers$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          token = req.cookies.accessToken;
          user = (0, _jwt.decodeToken)(token);
          _context2.next = 5;
          return regeneratorRuntime.awrap(_userService.userService.getUsers(user.id));

        case 5:
          result = _context2.sent;
          return _context2.abrupt("return", res.status(result.status).json(result));

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          console.error("UserController getUsers error:", _context2.t0);
          return _context2.abrupt("return", res.status(500).json({
            success: false,
            message: "Something went wrong while adding data"
          }));

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.getUsers = getUsers;

var upsertByAuthId = function upsertByAuthId(req, res) {
  var id, data, result;
  return regeneratorRuntime.async(function upsertByAuthId$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          id = req.params.id;
          data = req.body;
          _context3.next = 5;
          return regeneratorRuntime.awrap(_userService.userService.upsertByAuthId(id, data));

        case 5:
          result = _context3.sent;
          return _context3.abrupt("return", res.status(result.status).json(result));

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          console.error("Logout controller error:", _context3.t0);
          return _context3.abrupt("return", res.status(500).json({
            success: false,
            message: "Something went wrong while adding data"
          }));

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.upsertByAuthId = upsertByAuthId;

var getUserByAuthId = function getUserByAuthId(req, res) {
  var id, result;
  return regeneratorRuntime.async(function getUserByAuthId$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          id = req.params.id;
          _context4.next = 4;
          return regeneratorRuntime.awrap(_userService.userService.getUserByAuthId(id));

        case 4:
          result = _context4.sent;
          return _context4.abrupt("return", res.status(result.status).json(result));

        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](0);
          console.error("getUserByAuthId error:", _context4.t0);
          return _context4.abrupt("return", res.status(500).json({
            success: false,
            message: "Something went wrong while getting data"
          }));

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.getUserByAuthId = getUserByAuthId;