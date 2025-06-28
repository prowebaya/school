// itemStockSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  itemStocksList: [],
  itemStockDetails: {},
  loading: false,
  error: null,
  response: null,
};

const itemStockSlice = createSlice({
  name: "itemStock",
  initialState,
  reducers: {
    fetchItemStocksRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchItemStocksSuccess: (state, action) => {
      state.itemStocksList = action.payload;
      state.loading = false;
    },
    fetchItemStocksFailed: (state, action) => {
      state.error =
        typeof action.payload === "string"
          ? action.payload
          : action.payload.message || "An error occurred";
      state.loading = false;
    },
    getItemStockDetailsSuccess: (state, action) => {
      state.itemStockDetails = action.payload;
      state.loading = false;
    },
    addOrUpdateItemStockSuccess: (state, action) => {
      const updated = action.payload;
      const index = state.itemStocksList.findIndex((i) => i._id === updated._id);
      if (index >= 0) {
        state.itemStocksList[index] = updated;
      } else {
        state.itemStocksList.push(updated);
      }
      state.loading = false;
      state.error = null;
    },
    deleteItemStockSuccess: (state, action) => {
      state.itemStocksList = state.itemStocksList.filter(
        (item) => item._id !== action.payload
      );
      state.loading = false;
    },
    itemStockOperationFailed: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearItemStockError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchItemStocksRequest,
  fetchItemStocksSuccess,
  fetchItemStocksFailed,
  getItemStockDetailsSuccess,
  addOrUpdateItemStockSuccess,
  deleteItemStockSuccess,
  itemStockOperationFailed,
  clearItemStockError,
} = itemStockSlice.actions;

export default itemStockSlice.reducer;
