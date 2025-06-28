import { createSlice } from '@reduxjs/toolkit';

const visitorSlice = createSlice({
  name: 'visitor',
  initialState: {
    visitors: [],
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
      state.visitors = action.payload;
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

export const { getRequest, getSuccess, getError, stuffDone, clearError } = visitorSlice.actions;
export default visitorSlice.reducer;