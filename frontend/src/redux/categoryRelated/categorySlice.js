import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categoryCardsList: [],
  categoryCardDetails: {},
  loading: false,
  error: null,
  response: null,
};

const categoryCardSlice = createSlice({
  name: "categoryCard",
  initialState,
  reducers: {
    fetchCategoryCardsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCategoryCardsSuccess: (state, action) => {
      state.categoryCardsList = action.payload;
      state.loading = false;
    },
    fetchCategoryCardsFailed: (state, action) => {
      state.error = typeof action.payload === "string"
        ? action.payload
        : action.payload.message || "An error occurred";
      state.loading = false;
    },

    getCategoryCardDetailsSuccess: (state, action) => {
      state.categoryCardDetails = action.payload;
      state.loading = false;
    },

    addOrUpdateCategoryCardSuccess: (state, action) => {
      const updated = action.payload;
      const index = state.categoryCardsList?.findIndex((c) => c._id === updated._id) ?? -1;
      if (index >= 0) {
        state.categoryCardsList[index] = updated;
      } else {
        state.categoryCardsList.push(updated);
      }
      state.loading = false;
      state.error = null;
    },

    deleteCategoryCardSuccess: (state, action) => {
      state.categoryCardsList = state.categoryCardsList.filter(
        (categoryCard) => categoryCard._id !== action.payload
      );
      state.loading = false;
    },

    categoryCardOperationFailed: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchCategoryCardsRequest,
  fetchCategoryCardsSuccess,
  fetchCategoryCardsFailed,
  getCategoryCardDetailsSuccess,
  addOrUpdateCategoryCardSuccess,
  deleteCategoryCardSuccess,
  categoryCardOperationFailed,
  clearError,
} = categoryCardSlice.actions;

export default categoryCardSlice.reducer;