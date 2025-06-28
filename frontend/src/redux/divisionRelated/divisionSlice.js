import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  divisionsList: [],
  divisionDetails: {},
  loading: false,
  error: null,
  response: null,
};

const divisionSlice = createSlice({
  name: "division",
  initialState,
  reducers: {
    fetchRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess: (state, action) => {
      state.divisionsList = action.payload;
      state.loading = false;
    },
    fetchFailed: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    getDetailsSuccess: (state, action) => {
      state.divisionDetails = action.payload;
      state.loading = false;
    },
    addOrUpdateSuccess: (state, action) => {
      const updated = action.payload;
      const index = state.divisionsList.findIndex(d => d._id === updated._id);
      
      if (index >= 0) {
        state.divisionsList[index] = updated;
      } else {
        state.divisionsList.push(updated);
      }
      state.loading = false;
      state.error = null;
    },
    deleteSuccess: (state, action) => {
      state.divisionsList = state.divisionsList.filter(
        division => division._id !== action.payload
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
} = divisionSlice.actions;

export default divisionSlice.reducer;