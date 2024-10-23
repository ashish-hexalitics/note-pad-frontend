import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "./slices/userSlice/reducer";

const baseQueryWithInterceptor = async (args, api, extraOptions) => {
  const result = await fetchBaseQuery({
    // baseUrl: "http://localhost:3000/api",
    baseUrl: process.env.REACT_APP_API_URL,
  })(args, api, extraOptions);

  // Check for 403 status
  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
    return {
      error: {
        status: 401,
        data: "You have been logged out due to a 403 response",
      },
    };
  }

  if (result.error && result.error.status === 403) {
    window.location.href = '/user/notes'
  }

  return result;
};

export { baseQueryWithInterceptor };
