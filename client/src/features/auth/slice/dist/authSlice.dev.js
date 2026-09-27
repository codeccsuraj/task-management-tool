"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.clearUser = exports.setUser = void 0;

var _toolkit = require("@reduxjs/toolkit");

var getStoredUser = function getStoredUser() {
  try {
    var user = sessionStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error reading user from sessionStorage:", error);
    return null;
  }
};

var storedUser = getStoredUser();
var initialState = {
  user: storedUser,
  isAuthenticated: !!storedUser
};
var authSlice = (0, _toolkit.createSlice)({
  name: "auth",
  initialState: initialState,
  reducers: {
    setUser: function setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      sessionStorage.setItem("user", JSON.stringify(action.payload));
    },
    clearUser: function clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
      sessionStorage.removeItem("user");
    }
  }
});
var _authSlice$actions = authSlice.actions,
    setUser = _authSlice$actions.setUser,
    clearUser = _authSlice$actions.clearUser;
exports.clearUser = clearUser;
exports.setUser = setUser;
var _default = authSlice.reducer;
exports["default"] = _default;