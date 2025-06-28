import axios from 'axios';
import {
  fetchCategoriesRequest,
  fetchCategoriesSuccess,
  fetchCategoriesError,
  createCategoryRequest,
  createCategorySuccess,
  createCategoryError,
  deleteCategoryRequest,
  deleteCategorySuccess,
  deleteCategoryError,
} from '../StudentAddmissionDetail/categorySlice';

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchAllCategories = (adminID) => async (dispatch) => {
  dispatch(fetchCategoriesRequest());
  try {
    console.log(`Request URL: /categories/${adminID}`);
    const response = await api.get(`/categories/${adminID}`);
    console.log('Fetch categories response:', response.data);
    dispatch(fetchCategoriesSuccess(response.data.data || []));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error fetching categories:', errorMessage, error);
    dispatch(fetchCategoriesError(errorMessage));
  }
};

export const createCategory = (adminID, name) => async (dispatch) => {
  dispatch(createCategoryRequest());
  try {
    console.log(`Request URL: /categories/${adminID}`, { name });
    const response = await api.post(`/categories/${adminID}`, { name });
    console.log('Create category response:', response.data);
    dispatch(createCategorySuccess(response.data.data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error creating category:', errorMessage, error);
    dispatch(createCategoryError(errorMessage));
  }
};

export const deleteCategory = (adminID, categoryId) => async (dispatch) => {
  dispatch(deleteCategoryRequest());
  try {
    console.log(`Request URL: /categories/${adminID}/${categoryId}`);
    const response = await api.delete(`/categories/${adminID}/${categoryId}`);
    console.log('Delete category response:', response.data);
    dispatch(deleteCategorySuccess(categoryId));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error deleting category:', errorMessage, error);
    dispatch(deleteCategoryError(errorMessage));
  }
};