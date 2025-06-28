// markGradeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  markGradeDivisionsList: [],
  markGradeDivisionsDetails: {},
  loading: false,
  error: null,
};

const markGradeSlice = createSlice({
  name: 'markgrades',
  initialState,
  reducers: {
    fetchMarkGradeDivisionsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchMarkGradeDivisionsSuccess: (state, action) => {
      state.markGradeDivisionsList = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchMarkGradeDivisionsFailure: (state, action) => {
      state.error = action.payload.message; // Store error message only
      state.loading = false;
    },

    getDivisionDetailsSuccess: (state, action) => {
      state.markGradeDivisionsDetails = action.payload;
      state.loading = false;
      state.error = null;
    },

    addOrUpdateMarkGradeDivisionSuccess: (state, action) => {
      const updated = action.payload;
      const index = state.markGradeDivisionsList.findIndex((d) => d._id === updated._id);
      if (index >= 0) {
        state.markGradeDivisionsList[index] = updated;
      } else {
        state.markGradeDivisionsList.push(updated);
      }
      state.loading = false;
      state.error = null;
    },

    deleteMarkGradeDivisionSuccess: (state, action) => {
      state.markGradeDivisionsList = state.markGradeDivisionsList.filter(
        (d) => d._id !== action.payload
      );
      state.loading = false;
      state.error = null;
    },

    deleteMarkGradeDivisionFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    divisionOperationFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    clearDivisionError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchMarkGradeDivisionsRequest,
  fetchMarkGradeDivisionsSuccess,
  fetchMarkGradeDivisionsFailure,
  getDivisionDetailsSuccess,
  addOrUpdateMarkGradeDivisionSuccess,
  deleteMarkGradeDivisionSuccess,
  deleteMarkGradeDivisionFailure,
  divisionOperationFailed,
  clearDivisionError,
} = markGradeSlice.actions;

export default markGradeSlice.reducer;
