import { createSlice } from '@reduxjs/toolkit';

export const routePickupPointSlice = createSlice({
  name: 'routePickupPoint',
  initialState: {
    routePickupPointsList: [],
    loading: false,
    error: null,
  },
  reducers: {
    getRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getSuccess: (state, action) => {
      state.routePickupPointsList = action.payload;
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

export const { getRequest, getSuccess, getError, stuffDone, clearError } = routePickupPointSlice.actions;
export default routePickupPointSlice.reducer;