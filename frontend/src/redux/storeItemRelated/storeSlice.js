// storeSlice.js (Frontend Redux Slice)
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  storesList: [],
  storDetails: {},
  loading: false,
  error: null,
  response: null,
};

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    fetchRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess: (state, action) => {
      state.storesList = action.payload;
      state.loading = false;
    },
    fetchFailed: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    getDetailsSuccess: (state, action) => {
      state.storeDetails = action.payload;
      state.loading = false;
    },
    addOrUpdateSuccess: (state, action) => {
      const updated = action.payload;
      const index = state.storesList.findIndex((s) => s._id === updated._id);
      if (index >= 0) {
        state.storesList[index] = updated;
      } else {
        state.storesList.push(updated);
      }
      state.loading = false;
      state.error = null;
    },
    deleteSuccess: (state, action) => {
      state.storesList = state.storesList.filter(
        (store) => store._id !== action.payload
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
} = storeSlice.actions;

export default storeSlice.reducer;