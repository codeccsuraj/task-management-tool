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
                "new": true,
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
  }]);

  return UserServices;
}();

var userService = new UserServices();
exports.userService = userService;