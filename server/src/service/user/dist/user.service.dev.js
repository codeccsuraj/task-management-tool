"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userService = void 0;

var _userModel = _interopRequireDefault(require("../../model/user/model/user.model.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var UserServices =
/*#__PURE__*/
function () {
  function UserServices() {
    _classCallCheck(this, UserServices);
  }

  _createClass(UserServices, [{
    key: "upsertByAuthId",
    value: function upsertByAuthId(id, data) {
      var result;
      return regeneratorRuntime.async(function upsertByAuthId$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;

              if (!(!id || id.trim() === "")) {
                _context.next = 3;
                break;
              }

              return _context.abrupt("return", {
                status: 400,
                success: false,
                message: "Provide valid credentials to update data"
              });

            case 3:
              ;
              _context.next = 6;
              return regeneratorRuntime.awrap(_userModel["default"].findOneAndUpdate({
                authId: id
              }, {
                $set: data,
                $setOnInsert: {
                  authId: id
                }
              }, {
                returnDocument: "after",
                upsert: true,
                runValidators: true
              }));

            case 6:
              result = _context.sent;
              return _context.abrupt("return", {
                status: 200,
                success: true,
                message: "User document saved successfully",
                data: result
              });

            case 10:
              _context.prev = 10;
              _context.t0 = _context["catch"](0);
              console.error("Error upserting user document:", _context.t0);
              return _context.abrupt("return", {
                status: 500,
                success: false,
                message: "Failed to save user document",
                error: _context.t0.message
              });

            case 14:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[0, 10]]);
    }
  }, {
    key: "getUserByAuthId",
    value: function getUserByAuthId(id) {
      var user;
      return regeneratorRuntime.async(function getUserByAuthId$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;

              if (!(!id || id.trim() === "")) {
                _context2.next = 3;
                break;
              }

              return _context2.abrupt("return", {
                status: 400,
                success: false,
                message: "Provide valid credentials to get user data"
              });

            case 3:
              _context2.next = 5;
              return regeneratorRuntime.awrap(_userModel["default"].findOne({
                authId: id
              }).populate({
                path: "authId"
              }).lean());

            case 5:
              user = _context2.sent;

              if (user) {
                _context2.next = 8;
                break;
              }

              return _context2.abrupt("return", {
                status: 404,
                success: false,
                message: "User profile not found",
                data: null
              });

            case 8:
              return _context2.abrupt("return", {
                status: 200,
                success: true,
                message: "User data fetched successfully",
                data: user
              });

            case 11:
              _context2.prev = 11;
              _context2.t0 = _context2["catch"](0);
              console.error("Error fetching user document:", _context2.t0);
              return _context2.abrupt("return", {
                status: 500,
                success: false,
                message: "Failed to fetch user data",
                error: _context2.t0.message
              });

            case 15:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[0, 11]]);
    }
  }]);

  return UserServices;
}();

var userService = new UserServices();
exports.userService = userService;