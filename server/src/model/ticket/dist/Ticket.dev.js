"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _mongoose = _interopRequireWildcard(require("mongoose"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var ticketDocumentSchema = new _mongoose["default"].Schema({
  ticketId: {
    type: String,
    unique: true
  },
  project: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: false
  },
  sprint: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Sprint',
    "default": null
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    trim: true
  },
  priority: {
    type: String,
    trim: true
  },
  storyPoints: {
    type: Number,
    min: 0,
    "default": 0
  },
  assignee: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Auth',
    "default": null
  },
  reporter: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Auth',
    required: true
  },
  dueDate: {
    type: Date
  },
  startDate: {
    type: Date
  },
  isDeleted: {
    type: Boolean,
    "default": false
  }
}, {
  timestamps: true
});