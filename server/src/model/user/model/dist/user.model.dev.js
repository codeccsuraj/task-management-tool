"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var userDocumentSchema = new _mongoose["default"].Schema({
  authId: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Auth",
    required: true,
    unique: true,
    index: true
  },
  full_name: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  profile_picture: {
    type: String
  },
  date_of_birth: {
    type: Date,
    "default": null
  },
  gender: {
    type: String,
    "enum": ["male", "female", "other", ""],
    "default": ""
  },
  address: {
    type: String,
    trim: true,
    "default": ""
  },
  bio: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    trim: true
  }
});

var UserModel = _mongoose["default"].model("UserDocument", userDocumentSchema);

var _default = UserModel;
exports["default"] = _default;