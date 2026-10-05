"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var authSchema = new _mongoose["default"].Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    required: true,
    minlength: 4
  },
  user_group: {
    type: String,
    required: false
  },
  parentId: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Auth",
    "default": null,
    index: true
  },
  last_login: {
    type: Date,
    "default": null
  }
}, {
  timestamps: true
}); // Hash password before save

authSchema.pre("save", function _callee() {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (this.isModified("password")) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return");

        case 2:
          _context.next = 4;
          return regeneratorRuntime.awrap(_bcrypt["default"].hash(this.password, 12));

        case 4:
          this.password = _context.sent;

        case 5:
        case "end":
          return _context.stop();
      }
    }
  }, null, this);
});
/**
 * Compare plain password with hashed password
 */

authSchema.methods.comparePassword = function _callee2(password) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.abrupt("return", _bcrypt["default"].compare(password, this.password));

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  }, null, this);
};

var AuthModel = _mongoose["default"].model("Auth", authSchema);

var _default = AuthModel;
exports["default"] = _default;