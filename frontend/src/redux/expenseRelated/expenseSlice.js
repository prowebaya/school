import { createSlice } from "@reduxjs/toolkit";

const expenseSlice = createSlice({
  name: "expense",
  initialState: {
    expensesList: [],
    loading: false,
    error: null,
    status: "idle",
  },
  reducers: {
    getRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.status = "pending";
    },
    getSuccess: (state, action) => {
      state.expensesList = action.payload;
      state.loading = false;
      state.error = null;
      state.status = "success";
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = "error";
      console.error("Error in expense slice:", action.payload);
    },
    stuffDone: (state) => {
      state.loading = false;
      state.status = "done";
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { getRequest, getSuccess, getError, stuffDone, clearError } = expenseSlice.actions;
export default expenseSlice.reducer;