import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  itemsList: [],
  itemDetails: {},
  loading: false,
  error: null,
};

const itemSlice = createSlice({
  name: 'item',
  initialState,
  reducers: {
    fetchRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess: (state, action) => {
      state.itemsList = action.payload;
      state.loading = false;
    },
    fetchFailed: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    getDetailsSuccess: (state, action) => {
      state.itemDetails = action.payload;
      state.loading = false;
    },
    addOrUpdateSuccess: (state, action) => {
      const updated = action.payload;
      const index = state.itemsList.findIndex((i) => i._id === updated._id);
      if (index >= 0) {
        state.itemsList[index] = updated;
      } else {
        state.itemsList.push(updated);
      }
      state.loading = false;
      state.error = null;
    },
    deleteSuccess: (state, action) => {
      state.itemsList = state.itemsList.filter((item) => item._id !== action.payload);
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
} = itemSlice.actions;

export default itemSlice.reducer;