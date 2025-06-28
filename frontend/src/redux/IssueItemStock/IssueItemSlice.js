// src/store/IssueItemRelated/IssueItemSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const issueItemSlice = createSlice({
  name: 'issueItem',
  initialState: {
    issueItemsList: [],
    loading: false,
    error: null,
  },
  reducers: {
    getRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getSuccess: (state, action) => {
      state.issueItemsList = action.payload;
      state.loading = false;
    },
    getError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    stuffDone: (state) => {
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { getRequest, getSuccess, getError, stuffDone, clearError } = issueItemSlice.actions;
export default issueItemSlice.reducer;