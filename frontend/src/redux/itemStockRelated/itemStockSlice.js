// redux/StockItemRelated/StockItemSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const stockItemSlice = createSlice({
  name: 'stockItem',
  initialState: {
    stockItemsList: [],
    loading: false,
    error: null,
  },
  reducers: {
    getRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getSuccess: (state, action) => {
      state.stockItemsList = action.payload;
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

export const { getRequest, getSuccess, getError, stuffDone, clearError } = stockItemSlice.actions;
export default stockItemSlice.reducer;