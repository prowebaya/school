import { createSlice } from '@reduxjs/toolkit';

const studentSearchSlice = createSlice({
  name: 'studentSearch',
  initialState: {
    students: [],
    loading: false,
    error: null,
    status: 'idle',
  },
  reducers: {
    searchRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.status = 'pending';
    },
    searchSuccess: (state, action) => {
      console.log('searchSuccess payload:', JSON.stringify(action.payload, null, 2));
      state.students = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
      state.error = null;
      state.status = 'succeeded';
    },
    searchError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = 'failed';
      console.error('Error in student search slice:', action.payload);
    },
    searchReset: (state) => {
      state.status = 'idle';
      state.loading = false;
      state.students = [];
      state.error = null;
    },
  },
});

export const { searchRequest, searchSuccess, searchError, searchReset } = studentSearchSlice.actions;
export default studentSearchSlice.reducer;