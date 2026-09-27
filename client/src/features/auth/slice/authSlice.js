import { createSlice } from "@reduxjs/toolkit";

const getStoredUser = () => {
  try {
    const user = sessionStorage.getItem("user");

    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error reading user from sessionStorage:", error);
    return null;
  }
};

const storedUser = getStoredUser();

const initialState = {
  user: storedUser,
  isAuthenticated: !!storedUser,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;

      sessionStorage.setItem(
        "user",
        JSON.stringify(action.payload)
      );
    },

    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;

      sessionStorage.removeItem("user");
    },
  },
});

export const {
  setUser,
  clearUser,
} = authSlice.actions;

export default authSlice.reducer;