import { createSlice } from '@reduxjs/toolkit';

const teacherFormSlice = createSlice({
  name: 'teacherForm',
  initialState: {
    formData: {},
    teachers: [],
    loading: false,
    error: null,
    status: 'idle',
  },
  reducers: {
    getRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.status = 'pending';
    },
    getSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.status = 'success';
      if (Array.isArray(action.payload)) {
        state.teachers = action.payload;
      }
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = 'error';
      console.error('Error in teacher form slice:', action.payload);
    },
    stuffDone: (state) => {
      state.loading = false;
      state.status = 'done';
    },
    clearError: (state) => {
      state.error = null;
    },
    setFormData: (state, action) => {
      state.formData = action.payload;
    },
    resetForm: (state) => {
      state.formData = {};
    },
  },
});

export const { getRequest, getSuccess, getError, stuffDone, clearError, setFormData, resetForm } = teacherFormSlice.actions;
export default teacherFormSlice.reducer;