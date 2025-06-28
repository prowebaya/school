import { createSlice } from '@reduxjs/toolkit';

export const classTeacherAssignmentSlice = createSlice({
  name: 'classTeacherAssignment',
  initialState: {
    assignmentsList: [],
    teachers: [],
    loading: false,
    error: null,
  },
  reducers: {
    getRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getSuccess: (state, action) => {
      state.assignmentsList = action.payload;
      state.loading = false;
    },
    getError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    stuffDone: (state) => {
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setTeachers: (state, action) => {
      state.teachers = action.payload || [];
      state.loading = false;
    },
  },
});

export const { getRequest, getSuccess, getError, stuffDone, clearError, setTeachers } =
  classTeacherAssignmentSlice.actions;
export default classTeacherAssignmentSlice.reducer;