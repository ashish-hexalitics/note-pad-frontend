import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithInterceptor } from "../../baseQuery";

export const noteApi = createApi({
  reducerPath: "noteApi",
  baseQuery: baseQueryWithInterceptor,
  endpoints: (builder) => ({
    getNotesApi: builder.query({
      query: (noteId) => ({
        url: `/notes/${noteId}`,
        method: "GET",
        headers: {
          authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }),
    }),
    addNotesApi: builder.mutation({
      query: (credentials) => ({
        url: "/notes",
        method: "POST",
        body: credentials,
        headers: {
          authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }),
    }),
    updateNotesApi: builder.mutation({
      query: (credentials) => ({
        url: `/notes/${credentials.noteId}`,
        method: "PUT",
        body: credentials,
        headers: {
          authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }),
    }),
    deleteNotesApi: builder.mutation({
      query: (noteId) => ({
        url: `/notes/${noteId}`,
        method: "DELETE",
        headers: {
          authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }),
    }),
  }),
});

export const { useGetUserQuery } = noteApi;
