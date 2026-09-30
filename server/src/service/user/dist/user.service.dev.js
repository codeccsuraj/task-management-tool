"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userService = void 0;

var _authModel = _interopRequireDefault(require("../../model/auth/auth.model.js"));

var _userModel = _interopRequireDefault(require("../../model/user/model/user.model.js"));

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
    key: "createUser",
    value: function createUser(parentId, payload) {
      var session, email, password, full_name, phone, role, existingEmail, existingPhone, _ref, _ref2, auth, _ref3, _ref4, user, duplicateField;

      return regeneratorRuntime.async(function createUser$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return regeneratorRuntime.awrap(_mongoose["default"].startSession());

            case 2:
              session = _context.sent;
              _context.prev = 3;
              session.startTransaction();
              email = payload.email, password = payload.password, full_name = payload.full_name, phone = payload.phone, role = payload.role;
              _context.next = 8;
              return regeneratorRuntime.awrap(_authModel["default"].findOne({
                email: email.toLowerCase().trim()
              }).session(session));

            case 8:
              existingEmail = _context.sent;

              if (!existingEmail) {
                _context.next = 11;
                break;
              }

              return _context.abrupt("return", {
                status: 409,
                success: false,
                message: "User already exists with this email"
              });

            case 11:
              _context.next = 13;
              return regeneratorRuntime.awrap(_userModel["default"].findOne({
                phone: phone.trim()
              }).session(session));

            case 13:
              existingPhone = _context.sent;

              if (!existingPhone) {
                _context.next = 16;
                break;
              }

              return _context.abrupt("return", {
                status: 409,
                success: false,
                message: "User already exists with this phone"
              });

            case 16:
              _context.next = 18;
              return regeneratorRuntime.awrap(_authModel["default"].create([{
                email: email.toLowerCase().trim(),
                password: password,
                parentId: parentId
              }], {
                session: session
              }));

            case 18:
              _ref = _context.sent;
              _ref2 = _slicedToArray(_ref, 1);
              auth = _ref2[0];
              _context.next = 23;
              return regeneratorRuntime.awrap(_userModel["default"].create([{
                authId: auth._id,
                full_name: full_name,
                phone: phone,
                role: role
              }], {
                session: session
              }));

            case 23:
              _ref3 = _context.sent;
              _ref4 = _slicedToArray(_ref3, 1);
              user = _ref4[0];
              _context.next = 28;
              return regeneratorRuntime.awrap(session.commitTransaction());

            case 28:
              return _context.abrupt("return", {
                status: 201,
                success: true,
                message: "Member created successfully",
                data: {
                  auth: auth,
                  user: user
                }
              });

            case 31:
              _context.prev = 31;
              _context.t0 = _context["catch"](3);
              _context.next = 35;
              return regeneratorRuntime.awrap(session.abortTransaction());

            case 35:
              if (!(_context.t0.message === "EMAIL_ALREADY_EXISTS")) {
                _context.next = 37;
                break;
              }

              return _context.abrupt("return", {
                status: 409,
                success: false,
                message: "Email already registered"
              });

            case 37:
              if (!(_context.t0.message === "PHONE_ALREADY_EXISTS")) {
                _context.next = 39;
                break;
              }

              return _context.abrupt("return", {
                status: 409,
                success: false,
                message: "Phone number already registered"
              });

            case 39:
              if (!(_context.t0.code === 11000)) {
                _context.next = 42;
                break;
              }

              duplicateField = Object.keys(_context.t0.keyPattern || {})[0];
              return _context.abrupt("return", {
                status: 409,
                success: false,
                message: "".concat(duplicateField, " already exists")
              });

            case 42:
              console.error("Create member error:", _context.t0);
              return _context.abrupt("return", {
                status: 500,
                success: false,
                message: "Failed to create member"
              });

            case 44:
              _context.prev = 44;
              _context.next = 47;
              return regeneratorRuntime.awrap(session.endSession());

            case 47:
              return _context.finish(44);

            case 48:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[3, 31, 44, 48]]);
    }
  }, {
    key: "upsertByAuthId",
    value: function upsertByAuthId(id, data) {
      var result;
      return regeneratorRuntime.async(function upsertByAuthId$(_context2) {
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
                message: "Provide valid credentials to update data"
              });

            case 3:
              ;
              _context2.next = 6;
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
              result = _context2.sent;
              return _context2.abrupt("return", {
                status: 200,
                success: true,
                message: "User document saved successfully",
                data: result
              });

            case 10:
              _context2.prev = 10;
              _context2.t0 = _context2["catch"](0);
              console.error("Error upserting user document:", _context2.t0);
              return _context2.abrupt("return", {
                status: 500,
                success: false,
                message: "Failed to save user document",
                error: _context2.t0.message
              });

            case 14:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[0, 10]]);
    }
  }, {
    key: "getUserByAuthId",
    value: function getUserByAuthId(id) {
      var user;
      return regeneratorRuntime.async(function getUserByAuthId$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;

              if (!(!id || id.trim() === "")) {
                _context3.next = 3;
                break;
              }

              return _context3.abrupt("return", {
                status: 400,
                success: false,
                message: "Provide valid credentials to get user data"
              });

            case 3:
              _context3.next = 5;
              return regeneratorRuntime.awrap(_userModel["default"].findOne({
                authId: id
              }).populate({
                path: "authId"
              }).lean());

            case 5:
              user = _context3.sent;

              if (user) {
                _context3.next = 8;
                break;
              }

              return _context3.abrupt("return", {
                status: 404,
                success: false,
                message: "User profile not found",
                data: null
              });

            case 8:
              return _context3.abrupt("return", {
                status: 200,
                success: true,
                message: "User data fetched successfully",
                data: user
              });

            case 11:
              _context3.prev = 11;
              _context3.t0 = _context3["catch"](0);
              console.error("Error fetching user document:", _context3.t0);
              return _context3.abrupt("return", {
                status: 500,
                success: false,
                message: "Failed to fetch user data",
                error: _context3.t0.message
              });

            case 15:
            case "end":
              return _context3.stop();
          }
        }
      }, null, null, [[0, 11]]);
    }
  }, {
    key: "getUser",
    value: function getUser(id) {
      return regeneratorRuntime.async(function getUser$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              try {} catch (error) {}

            case 1:
            case "end":
              return _context4.stop();
          }
        }
      });
    }
  }]);

  return UserServices;
}();

var userService = new UserServices();
exports.userService = userService;