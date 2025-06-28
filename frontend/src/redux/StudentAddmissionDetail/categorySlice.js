import { createSlice } from '@reduxjs/toolkit';

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    categories: [],
    newCategory: '',
    search: '',
    loading: false,
    error: null,
    status: 'idle',
  },
  reducers: {
    fetchCategoriesRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.status = 'pending';
    },
    fetchCategoriesSuccess: (state, action) => {
      console.log('fetchCategoriesSuccess payload:', JSON.stringify(action.payload, null, 2));
      state.categories = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
      state.error = null;
      state.status = 'succeeded';
    },
    fetchCategoriesError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = 'failed';
      console.error('Error in category slice:', action.payload);
    },
    createCategoryRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.status = 'pending';
    },
    createCategorySuccess: (state, action) => {
      state.categories.push(action.payload);
      state.newCategory = '';
      state.loading = false;
      state.error = null;
      state.status = 'succeeded';
    },
    createCategoryError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = 'failed';
      console.error('Error in category slice:', action.payload);
    },
    deleteCategoryRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.status = 'pending';
    },
    deleteCategorySuccess: (state, action) => {
      state.categories = state.categories.filter(cat => cat._id !== action.payload);
      state.loading = false;
      state.error = null;
      state.status = 'succeeded';
    },
    deleteCategoryError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = 'failed';
      console.error('Error in category slice:', action.payload);
    },
    setNewCategory: (state, action) => {
      state.newCategory = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    resetCategory: (state) => {
      state.categories = [];
      state.newCategory = '';
      state.search = '';
      state.loading = false;
      state.error = null;
      state.status = 'idle';
    },
  },
});

export const {
  fetchCategoriesRequest,
  fetchCategoriesSuccess,
  fetchCategoriesError,
  createCategoryRequest,
  createCategorySuccess,
  createCategoryError,
  deleteCategoryRequest,
  deleteCategorySuccess,
  deleteCategoryError,
  setNewCategory,
  setSearch,
  resetCategory,
} = categorySlice.actions;

export default categorySlice.reducer;