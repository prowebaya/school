import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  teachers: [],
  selectedTeacher: null,
  loading: false,
  error: null,
};

const teacherManageSlice = createSlice({
  name: 'teacherManage',
  initialState,
  reducers: {
    fetchTeachersStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTeachersSuccess(state, action) {
      state.loading = false;
      state.teachers = action.payload || [];
    },
    fetchTeachersFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    updateTeacherSuccess(state, action) {
      state.loading = false;
      state.teachers = state.teachers.map((teacher) =>
        teacher._id === action.payload._id ? action.payload : teacher
      );
    },
    deleteTeacherSuccess(state, action) {
      state.loading = false;
      state.teachers = state.teachers.filter((teacher) => teacher._id !== action.payload);
    },
    setSelectedTeacher(state, action) {
      state.selectedTeacher = action.payload || null;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const {
  fetchTeachersStart,
  fetchTeachersSuccess,
  fetchTeachersFailure,
  updateTeacherSuccess,
  deleteTeacherSuccess,
  setSelectedTeacher,
  clearError,
} = teacherManageSlice.actions;

export default teacherManageSlice.reducer;