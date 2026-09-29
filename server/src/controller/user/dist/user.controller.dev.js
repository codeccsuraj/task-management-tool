"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserByAuthId = exports.upsertByAuthId = void 0;

var _userService = require("../../service/user/user.service.js");

var upsertByAuthId = function upsertByAuthId(req, res) {
  var id, data, result;
  return regeneratorRuntime.async(function upsertByAuthId$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          id = req.params.id;
          data = req.body;
          _context.next = 5;
          return regeneratorRuntime.awrap(_userService.userService.upsertByAuthId(id, data));

        case 5:
          result = _context.sent;
          return _context.abrupt("return", res.status(result.status).json(result));

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          console.error("Logout controller error:", _context.t0);
          return _context.abrupt("return", res.status(500).json({
            success: false,
            message: "Something went wrong while adding data"
          }));

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.upsertByAuthId = upsertByAuthId;

var getUserByAuthId = function getUserByAuthId(req, res) {
  var id, result;
  return regeneratorRuntime.async(function getUserByAuthId$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          id = req.params.id;
          _context2.next = 4;
          return regeneratorRuntime.awrap(_userService.userService.getUserByAuthId(id));

        case 4:
          result = _context2.sent;
          return _context2.abrupt("return", res.status(result.status).json(result));

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          console.error("getUserByAuthId error:", _context2.t0);
          return _context2.abrupt("return", res.status(500).json({
            success: false,
            message: "Something went wrong while getting data"
          }));

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.getUserByAuthId = getUserByAuthId;