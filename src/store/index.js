import { configureStore, Store } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice/reducer";
import { authAPi } from "./slices/authSlice/api";
import { userApi } from "./slices/userSlice/api";
import { noteApi } from "./slices/noteSlice/api";
import noteSlice from "./slices/noteSlice/reducer";

export const store = configureStore({
  reducer: {
    [authAPi.reducerPath]: authAPi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [noteApi.reducerPath]: noteApi.reducer,
    userSlice,
    noteSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authAPi.middleware)
      .concat(userApi.middleware)
      .concat(noteApi.middleware),
});
