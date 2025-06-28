import { createSlice } from '@reduxjs/toolkit';

export const addTransportFeeSlice = createSlice({
  name: 'addTransportFee',
  initialState: {
    transportFeesList: [],
    loading: false,
    error: null,
  },
  reducers: {
    getRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getSuccess: (state, action) => {
      state.transportFeesList = action.payload;
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

export const { getRequest, getSuccess, getError, stuffDone, clearError } = addTransportFeeSlice.actions;
export default addTransportFeeSlice.reducer;