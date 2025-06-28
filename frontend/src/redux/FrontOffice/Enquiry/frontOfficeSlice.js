import { createSlice } from '@reduxjs/toolkit';

const frontOfficeSlice = createSlice({
  name: 'frontOffice',
  initialState: {
    entries: {
      Purpose: [],
      'Complaint Type': [],
      Source: [],
      Reference: [],
    },
    loading: false,
    error: null,
    status: 'idle',
  },
  reducers: {
    getRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.status = 'pending';
    },
    getSuccess: (state, action) => {
      const { type, data } = action.payload;
      state.entries[type] = data;
      state.loading = false;
      state.error = null;
      state.status = 'success';
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = 'error';
    },
    stuffDone: (state) => {
      state.loading = false;
      state.status = 'done';
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { getRequest, getSuccess, getError, stuffDone, clearError } = frontOfficeSlice.actions;
export default frontOfficeSlice.reducer;