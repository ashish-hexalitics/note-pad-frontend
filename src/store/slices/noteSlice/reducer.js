import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notes: [],
  note: {},
  collaborators: [],
};

export const createUserSlice = createSlice({
  name: "NOTE_ACTIONS",
  initialState,
  reducers: {
    getNotes: (state, action) => {
      state.notes = action.payload;
      return state;
    },
    addNote: (state, action) => {
      state.note = action.payload.note;
      return state;
    },
    updateNote: (state, action) => {
      state.note = action.payload.note;
      return state;
    },
    getCollaborators: (state, action) => {
      state.collaborators = action.payload.collaborators;
      return state;
    },
    resetNotes: (state) => {
      state.notes = [];
      state.note = {};
      state.collaborators = [];
      return state;
    },
  },
});

export const { getNotes, addNote, updateNote, getCollaborators, resetNotes } =
  createUserSlice.actions;

export default createUserSlice.reducer;
