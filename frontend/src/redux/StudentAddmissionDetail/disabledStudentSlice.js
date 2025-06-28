import { createSlice } from '@reduxjs/toolkit';

const disabledStudentSlice = createSlice({
  name: 'disabledStudent',
  initialState: {
    disabledStudents: [],
    newDisabledStudent: { reasonId: '', studentId: '' },
    loading: false,
    error: null,
    status: 'idle',
  },
  reducers: {
    fetchDisabledStudentsRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.status = 'pending';
    },
    fetchDisabledStudentsSuccess: (state, action) => {
      console.log('fetchDisabledStudentsSuccess payload:', JSON.stringify(action.payload, null, 2));
      state.disabledStudents = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
      state.error = null;
      state.status = 'succeeded';
    },
    fetchDisabledStudentsError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = 'failed';
      console.error('Error in disabled student slice:', action.payload);
    },
    createDisabledStudentRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.status = 'pending';
    },
    createDisabledStudentSuccess: (state, action) => {
      state.disabledStudents.push(action.payload);
      state.newDisabledStudent = { reasonId: '', studentId: '' };
      state.loading = false;
      state.error = null;
      state.status = 'succeeded';
    },
    createDisabledStudentError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = 'failed';
      console.error('Error in disabled student slice:', action.payload);
    },
    updateDisabledStudentRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.status = 'pending';
    },
    updateDisabledStudentSuccess: (state, action) => {
      state.disabledStudents = state.disabledStudents.map((ds) =>
        ds._id === action.payload._id ? { ...action.payload, isEditing: false } : ds
      );
      state.loading = false;
      state.error = null;
      state.status = 'succeeded';
    },
    updateDisabledStudentError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = 'failed';
      console.error('Error in disabled student slice:', action.payload);
    },
    deleteDisabledStudentRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.status = 'pending';
    },
    deleteDisabledStudentSuccess: (state, action) => {
      state.disabledStudents = state.disabledStudents.filter((ds) => ds._id !== action.payload);
      state.loading = false;
      state.error = null;
      state.status = 'succeeded';
    },
    deleteDisabledStudentError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = 'failed';
      console.error('Error in disabled student slice:', action.payload);
    },
    setNewDisabledStudent: (state, action) => {
      state.newDisabledStudent = action.payload;
    },
    setEditDisabledStudent: (state, action) => {
      state.disabledStudents = state.disabledStudents.map((ds) =>
        ds._id === action.payload.id
          ? { ...ds, reasonId: action.payload.reasonId || ds.reasonId, studentId: action.payload.studentId || ds.studentId }
          : ds
      );
    },
    toggleEditDisabledStudent: (state, action) => {
      state.disabledStudents = state.disabledStudents.map((ds) =>
        ds._id === action.payload ? { ...ds, isEditing: !ds.isEditing } : ds
      );
    },
    resetDisabledStudent: (state) => {
      state.disabledStudents = [];
      state.newDisabledStudent = { reasonId: '', studentId: '' };
      state.loading = false;
      state.error = null;
      state.status = 'idle';
    },
  },
});

export const {
  fetchDisabledStudentsRequest,
  fetchDisabledStudentsSuccess,
  fetchDisabledStudentsError,
  createDisabledStudentRequest,
  createDisabledStudentSuccess,
  createDisabledStudentError,
  updateDisabledStudentRequest,
  updateDisabledStudentSuccess,
  updateDisabledStudentError,
  deleteDisabledStudentRequest,
  deleteDisabledStudentSuccess,
  deleteDisabledStudentError,
  setNewDisabledStudent,
  setEditDisabledStudent,
  toggleEditDisabledStudent,
  resetDisabledStudent,
} = disabledStudentSlice.actions;

export default disabledStudentSlice.reducer;