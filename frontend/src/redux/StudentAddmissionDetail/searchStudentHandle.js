import axios from 'axios';

const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchClasses = (adminID) => async (dispatch) => {
  try {
    dispatch({ type: 'SEARCH_STUDENT_REQUEST' });
    const response = await axiosInstance.get(`/search-class/${adminID}`); // Line 23
    dispatch({
      type: 'FETCH_CLASSES_SUCCESS',
      payload: response.data.data,
    });
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch classes';
    dispatch({
      type: 'SEARCH_STUDENT_FAIL',
      payload: errorMessage,
    });
  }
};

export const searchStudents = (filters) => async (dispatch) => {
  try {
    dispatch({ type: 'SEARCH_STUDENT_REQUEST' });
    const response = await axiosInstance.get('/search-student', {
      params: { ...filters },
    });
    dispatch({
      type: 'SEARCH_STUDENTS_SUCCESS',
      payload: response.data.data,
    });
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to search students';
    dispatch({
      type: 'SEARCH_STUDENT_FAIL',
      payload: errorMessage,
    });
  }
};

export const clearSearchError = () => ({
  type: 'CLEAR_SEARCH_STUDENT_ERROR',
});