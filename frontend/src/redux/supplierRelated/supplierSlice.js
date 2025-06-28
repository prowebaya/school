// supplierSlice.js (Frontend Redux Slice)
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  suppliersList: [],
  supplierDetails: {},
  loading: false,
  error: null,
  response: null,
};

const supplierSlice = createSlice({
  name: "supplier",
  initialState,
  reducers: {
    fetchSuppliersRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSuppliersSuccess: (state, action) => {
      state.suppliersList = action.payload;
      state.loading = false;
    },
    fetchSuppliersFailed: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    getSupplierDetailsSuccess: (state, action) => {
      state.supplierDetails = action.payload;
      state.loading = false;
    },
    addOrUpdateSupplierSuccess: (state, action) => {
      const updated = action.payload;
      const index = state.suppliersList.findIndex((s) => s._id === updated._id);
      if (index >= 0) {
        state.suppliersList[index] = updated;
      } else {
        state.suppliersList.push(updated);
      }
      state.loading = false;
      state.error = null;
    },
    deleteSupplierSuccess: (state, action) => {
      state.suppliersList = state.suppliersList.filter(
        (supplier) => supplier._id !== action.payload
      );
      state.loading = false;
    },
    supplierOperationFailed: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchSuppliersRequest,
  fetchSuppliersSuccess,
  fetchSuppliersFailed,  
  getSupplierDetailsSuccess,
  addOrUpdateSupplierSuccess,
  deleteSupplierSuccess,
  supplierOperationFailed,
  clearError,
} = supplierSlice.actions;

export default supplierSlice.reducer;