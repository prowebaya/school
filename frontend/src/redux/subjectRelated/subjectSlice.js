// ✅ subjectSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  subjectsList: [],
  subjectDetails: {},
  loading: false,
  error: null,
  response: null,
};

const subjectSlice = createSlice({
  name: "subject",
  initialState,
  reducers: {
    fetchRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess: (state, action) => {
      state.subjectsList = action.payload;
      state.loading = false;
    },
    fetchFailed: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    getDetailsSuccess: (state, action) => {
      state.subjectDetails = action.payload;
      state.loading = false;
    },
    addOrUpdateSuccess: (state, action) => {
      const updated = action.payload;
      const index = state.subjectsList.findIndex((s) => s._id === updated._id);
      if (index >= 0) {
        state.subjectsList[index] = updated;
      } else {
        state.subjectsList.push(updated);
      }
      state.loading = false;
      state.error = null;
    },
    deleteSuccess: (state, action) => {
      state.subjectsList = state.subjectsList.filter(
        (subject) => subject._id !== action.payload
      );
      state.loading = false;
    },
    operationFailed: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchRequest,
  fetchSuccess,
  fetchFailed,
  getDetailsSuccess,
  addOrUpdateSuccess,
  deleteSuccess,
  operationFailed,
  clearError,
} = subjectSlice.actions;

export default subjectSlice.reducer;