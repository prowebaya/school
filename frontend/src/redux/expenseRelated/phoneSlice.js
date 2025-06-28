import { createSlice } from "@reduxjs/toolkit";

const phoneCallLogsSlice = createSlice({
  name: "phoneCallLogs",
  initialState: {
    callLogs: [],
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
      state.callLogs = action.payload;
      state.loading = false;
      state.error = null;
      state.status = "success";
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = "error";
      console.error("Error in phone call logs slice:", action.payload);
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

export const { getRequest, getSuccess, getError, stuffDone, clearError } = phoneCallLogsSlice.actions;
export default phoneCallLogsSlice.reducer;