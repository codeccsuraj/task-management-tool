"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authService = void 0;

var _authModel = _interopRequireDefault(require("../../model/auth/auth.model.js"));

var _jwt = require("../../utils/jwt.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AuthService =
/*#__PURE__*/
function () {
  function AuthService() {
    _classCallCheck(this, AuthService);
  }

  _createClass(AuthService, [{
    key: "create",
    value: function create(payload) {
      var isAlreadyExists, result, generatedToken;
      return regeneratorRuntime.async(function create$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return regeneratorRuntime.awrap(_authModel["default"].findOne({
                email: payload.email
              }));

            case 3:
              isAlreadyExists = _context.sent;

              if (!isAlreadyExists) {
                _context.next = 6;
                break;
              }

              return _context.abrupt("return", {
                status: 409,
                success: false,
                message: "Email already registered"
              });

            case 6:
              _context.next = 8;
              return regeneratorRuntime.awrap(_authModel["default"].create(payload));

            case 8:
              result = _context.sent;

              if (result) {
                _context.next = 11;
                break;
              }

              return _context.abrupt("return", {
                status: 500,
                success: false,
                message: "Unable to create user"
              });

            case 11:
              generatedToken = (0, _jwt.generateToken)({
                id: result._id,
                email: result.email
              });
              return _context.abrupt("return", {
                status: 201,
                success: true,
                message: "User added successfully",
                data: {
                  user: {
                    id: result._id,
                    name: result.name,
                    email: result.email,
                    role: result.role
                  },
                  token: generatedToken
                }
              });

            case 15:
              _context.prev = 15;
              _context.t0 = _context["catch"](0);
              console.error("Error occurred while adding user:", _context.t0);
              return _context.abrupt("return", {
                status: 500,
                success: false,
                message: "Something went wrong while adding user"
              });

            case 19:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[0, 15]]);
    }
  }, {
    key: "login",
    value: function login(payload) {
      var email, password, user, isPasswordValid, generatedToken;
      return regeneratorRuntime.async(function login$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              email = payload.email, password = payload.password;
              _context2.next = 4;
              return regeneratorRuntime.awrap(_authModel["default"].findOne({
                email: email
              }));

            case 4:
              user = _context2.sent;

              if (user) {
                _context2.next = 7;
                break;
              }

              return _context2.abrupt("return", {
                status: 401,
                success: false,
                message: "Invalid email or password"
              });

            case 7:
              _context2.next = 9;
              return regeneratorRuntime.awrap(user.comparePassword(password));

            case 9:
              isPasswordValid = _context2.sent;

              if (isPasswordValid) {
                _context2.next = 12;
                break;
              }

              return _context2.abrupt("return", {
                status: 401,
                success: false,
                message: "Invalid email or password"
              });

            case 12:
              generatedToken = (0, _jwt.generateToken)({
                id: user._id,
                email: user.email
              });
              return _context2.abrupt("return", {
                status: 200,
                success: true,
                message: "Login successful",
                data: {
                  user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                  },
                  token: generatedToken
                }
              });

            case 16:
              _context2.prev = 16;
              _context2.t0 = _context2["catch"](0);
              console.error("Error occurred while logging in:", _context2.t0);
              return _context2.abrupt("return", {
                status: 500,
                success: false,
                message: "Something went wrong while logging in"
              });

            case 20:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[0, 16]]);
    }
  }]);

  return AuthService;
}();

var authService = new AuthService();
exports.authService = authService;