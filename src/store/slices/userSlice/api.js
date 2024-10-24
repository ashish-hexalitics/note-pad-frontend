import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithInterceptor } from "../../baseQuery";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithInterceptor,
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => ({
        url: `/user/getMe`,
        method: "GET",
        headers: {
          authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }),
    }),
    getAllUsers: builder.query({
      query: (query) => ({
        url: `/user/all${query?query:''}`,
        method: "GET",
        headers: {
          authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }),
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetAllUsersQuery
} = userApi;
