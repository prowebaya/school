import axios from 'axios';
import {
  fetchStudentsRequest,
  fetchStudentsSuccess,
  fetchStudentsError,
  deleteStudentsRequest,
  deleteStudentsSuccess,
  deleteStudentsError,
} from '../StudentAddmissionDetail/bulkDeleteSlice';

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

export const fetchAllStudents = (adminID) => async (dispatch) => {
  dispatch(fetchStudentsRequest());
  try {
    console.log(`Request URL: /bulkDeleteStudents/${adminID}`);
    const response = await api.get(`/bulkDeleteStudents/${adminID}`);
    console.log('Fetch students response:', response.data);
    dispatch(fetchStudentsSuccess(response.data.data || []));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error fetching students:', errorMessage, error);
    dispatch(fetchStudentsError(errorMessage));
  }
};

export const bulkDeleteStudents = (adminID, studentIds) => async (dispatch) => {
  dispatch(deleteStudentsRequest());
  try {
    console.log(`Request URL: /bulkDeleteStudents/${adminID}`, { studentIds });
    const response = await api.delete(`/bulkDeleteStudents/${adminID}`, { data: { studentIds } });
    console.log('Delete students response:', response.data);
    dispatch(deleteStudentsSuccess(studentIds));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error deleting students:', errorMessage, error);
    dispatch(deleteStudentsError(errorMessage));
  }
};