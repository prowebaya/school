import { createSlice } from "@reduxjs/toolkit";

const vehicleSlice = createSlice({
  name: "vehicle",
  initialState: {
    vehiclesList: [],
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
      console.log('Updated vehiclesList:', action.payload);
      state.vehiclesList = action.payload;
      state.loading = false;
      state.error = null;
      state.status = "success";
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = "error";
      console.error("Error in vehicle slice:", action.payload);
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
export const { getRequest, getSuccess, getError, stuffDone, clearError } = vehicleSlice.actions;
export default vehicleSlice.reducer;