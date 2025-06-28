import { createSlice } from "@reduxjs/toolkit";

const postalReceiveSlice = createSlice({
  name: "postalReceive",
  initialState: {
    receivesList: [],
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
      console.log('Updated receivesList:', action.payload);
      state.receivesList = action.payload;
      state.loading = false;
      state.error = null;
      state.status = "success";
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = "error";
      console.error("Error in postal receive slice:", action.payload);
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

export const { getRequest, getSuccess, getError, stuffDone, clearError } = postalReceiveSlice.actions;
export default postalReceiveSlice.reducer;