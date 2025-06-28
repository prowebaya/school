import { createSlice } from '@reduxjs/toolkit';

const bulkDeleteSlice = createSlice({
  name: 'bulkDelete',
  initialState: {
    students: [],
    selectedStudents: [],
    searchTerm: '',
    visibleColumns: {
      admissionNo: true,
      name: true,
      class: true,
      dob: true,
      gender: true,
      mobile: true,
    },
    loading: false,
    error: null,
    status: 'idle',
  },
  reducers: {
    fetchStudentsRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.status = 'pending';
    },
    fetchStudentsSuccess: (state, action) => {
      console.log('fetchStudentsSuccess payload:', JSON.stringify(action.payload, null, 2));
      state.students = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
      state.error = null;
      state.status = 'succeeded';
    },
    fetchStudentsError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = 'failed';
      console.error('Error in bulk delete slice:', action.payload);
    },
    deleteStudentsRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.status = 'pending';
    },
    deleteStudentsSuccess: (state, action) => {
      state.students = state.students.filter(student => !action.payload.includes(student.id));
      state.selectedStudents = [];
      state.loading = false;
      state.error = null;
      state.status = 'succeeded';
    },
    deleteStudentsError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = 'failed';
      console.error('Error in bulk delete slice:', action.payload);
    },
    setSelectedStudents: (state, action) => {
      state.selectedStudents = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setVisibleColumns: (state, action) => {
      state.visibleColumns = action.payload;
    },
    resetBulkDelete: (state) => {
      state.students = [];
      state.selectedStudents = [];
      state.searchTerm = '';
      state.visibleColumns = {
        admissionNo: true,
        name: true,
        class: true,
        dob: true,
        gender: true,
        mobile: true,
      };
      state.loading = false;
      state.error = null;
      state.status = 'idle';
    },
  },
});

export const {
  fetchStudentsRequest,
  fetchStudentsSuccess,
  fetchStudentsError,
  deleteStudentsRequest,
  deleteStudentsSuccess,
  deleteStudentsError,
  setSelectedStudents,
  setSearchTerm,
  setVisibleColumns,
  resetBulkDelete,
} = bulkDeleteSlice.actions;

export default bulkDeleteSlice.reducer;