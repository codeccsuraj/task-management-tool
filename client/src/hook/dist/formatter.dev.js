"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatDate = void 0;

var _dayjs = _interopRequireDefault(require("dayjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var formatDate = function formatDate(date) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "DD-MM-YYYY";
  if (!date) return null;
  var parsedDate = (0, _dayjs["default"])(date);
  if (!parsedDate.isValid()) return null;
  return parsedDate.format(format);
};

exports.formatDate = formatDate;