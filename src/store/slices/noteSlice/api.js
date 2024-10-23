import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithInterceptor } from "../../baseQuery";

export const noteApi = createApi({
  reducerPath: "noteApi",
  baseQuery: baseQueryWithInterceptor,
  endpoints: (builder) => ({
    getNotesApi: builder.query({
      query: ({ userId, searchTerm }) => {
        const searchParams = new URLSearchParams();
    
        // Add searchTerm if provided
        if (searchTerm) {
          searchParams.append("search", searchTerm);
        }
    
        return {
          url: `/notes/user/${userId}?${searchParams.toString()}`, // Append search query
          method: "GET",
          headers: {
            authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        };
      },
    }),    
    getNotesByCollaboratorIdApi: builder.query({
      query: (collaboratorId) => ({
        url: `/notes/collaborator/${collaboratorId}`,
        method: "GET",
        headers: {
          authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }),
    }),
    getNoteByIdApi: builder.query({
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
    updateNotesCollaboratorsApi: builder.mutation({
      query: ({ noteId, collaboratorId, permission }) => ({
        url: `/notes/collaborators/${noteId}`,
        body: collaboratorId
          ? {
              collaboratorId,
              permission,
            }
          : {},
        method: "POST",
        headers: {
          authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }),
    }),
    removeNotesCollaboratorsApi: builder.mutation({
      query: (data) => ({
        url: `/notes/collaborators/${data.noteId}/${data.collaboratorId}`,
        method: "DELETE",
        headers: {
          authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }),
    }),
    updatePermissionCollaboratorsApi: builder.mutation({
      query: (data) => ({
        url: `/notes/collaborators/${data.collaboratorId}`,
        body: data,
        method: "PUT",
        headers: {
          authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }),
    }),
    checkPermissionCollaboratorsApi: builder.mutation({
      query: (noteId) => ({
        url: `/notes/permission/${noteId}`,
        method: "POST",
        headers: {
          authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }),
    }),
  }),
});

export const {
  useGetNotesApiQuery,
  useGetNotesByCollaboratorIdApiQuery,
  useGetNoteByIdApiQuery,
  useAddNotesApiMutation,
  useUpdateNotesApiMutation,
  useDeleteNotesApiMutation,
  useUpdateNotesCollaboratorsApiMutation,
  useRemoveNotesCollaboratorsApiMutation,
  useUpdatePermissionCollaboratorsApiMutation,
  useCheckPermissionCollaboratorsApiMutation
} = noteApi;
