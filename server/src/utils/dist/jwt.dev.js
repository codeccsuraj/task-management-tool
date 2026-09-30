"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decodeToken = exports.generateToken = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _varConfig = require("../config/var.config.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var generateToken = function generateToken(user) {
  return _jsonwebtoken["default"].sign(user, _varConfig.config.JwtSecret, {
    expiresIn: "2h"
  });
};

exports.generateToken = generateToken;

var decodeToken = function decodeToken(token) {
  try {
    if (!token) {
      return null;
    }

    return _jsonwebtoken["default"].verify(token, _varConfig.config.JwtSecret);
  } catch (error) {
    return null;
  }
};

exports.decodeToken = decodeToken;