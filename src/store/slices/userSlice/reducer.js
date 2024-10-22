import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  user: {},
  isLoggedin: false,
  accessToken: null,
};

export const createUserSlice = createSlice({
  name: "USER_ACTIONS",
  initialState,
  reducers: {
    setAllUsers: (state, action) => {
      state.users = action.payload;
      return state;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      return state;
    },
    setLoggedInUser: (state, action) => {
      state.isLoggedin = action.payload.isLoggedin;
      state.accessToken = action.payload.accessToken;
      return state;
    },
    logout: (state) => {
      state.user = {};
      state.accessToken = null;
      state.isLoggedin = false;
      localStorage.removeItem("access_token");
      window.location.href = "/login";
      return state;
    },
  },
});

export const { setAllUsers, setUser, logout, setLoggedInUser } =
  createUserSlice.actions;

export default createUserSlice.reducer;
