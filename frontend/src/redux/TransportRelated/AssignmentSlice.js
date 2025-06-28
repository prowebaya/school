import { createSlice } from '@reduxjs/toolkit';

export const assignmentSlice = createSlice({
  name: 'assignment',
  initialState: {
    assignmentsList: [],
    loading: false,
    error: null,
  },
  reducers: {
    getRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getSuccess: (state, action) => {
      state.assignmentsList = action.payload;
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
export const { getRequest, getSuccess, getError, stuffDone, clearError } = assignmentSlice.actions;
export default assignmentSlice.reducer;