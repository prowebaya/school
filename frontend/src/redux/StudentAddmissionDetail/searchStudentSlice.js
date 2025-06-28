import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  classes: [],
  searchResults: [],
  loading: false,
  error: null,
};

const searchStudentSlice = createSlice({
  name: 'searchStudent',
  initialState,
  reducers: {
    SEARCH_STUDENT_REQUEST(state) {
      state.loading = true;
      state.error = null;
    },
    FETCH_CLASSES_SUCCESS(state, action) {
      state.loading = false;
      state.classes = action.payload;
    },
    SEARCH_STUDENTS_SUCCESS(state, action) {
      state.loading = false;
      state.searchResults = action.payload;
    },
    SEARCH_STUDENT_FAIL(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    CLEAR_SEARCH_STUDENT_ERROR(state) {
      state.error = null;
    },
  },
});

export const {
  SEARCH_STUDENT_REQUEST,
  FETCH_CLASSES_SUCCESS,
  SEARCH_STUDENTS_SUCCESS,
  SEARCH_STUDENT_FAIL,
  CLEAR_SEARCH_STUDENT_ERROR,
} = searchStudentSlice.actions;

export default searchStudentSlice.reducer;