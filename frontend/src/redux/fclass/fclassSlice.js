import { createSlice } from "@reduxjs/toolkit";

const fclassSlice = createSlice({
  name: "fclass",
  initialState: {
    fclassesList: [],
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
  console.log('Updated fclassesList:', action.payload);
  state.fclassesList = action.payload;
  state.loading = false;
  state.error = null;
  state.status = "success";
},
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = "error";
      console.error("Error in class slice:", action.payload);
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

export const { getRequest, getSuccess, getError, stuffDone, clearError } = fclassSlice.actions;
export default fclassSlice.reducer;