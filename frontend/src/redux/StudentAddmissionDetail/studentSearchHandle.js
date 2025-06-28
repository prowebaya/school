import axios from 'axios';
import { searchRequest, searchSuccess, searchError, searchReset } from './studentSearchSlice';

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
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

export const searchStudents = (adminID, searchParams) => async (dispatch) => {
  dispatch(searchRequest());
  try {
    const queryString = new URLSearchParams(searchParams).toString();
    console.log(`Request URL: /searchStudents/${adminID}?${queryString}`);
    const response = await api.get(`/searchStudents/${adminID}?${queryString}`);
    console.log('Search students response:', response.data);
    dispatch(searchSuccess(response.data.data || []));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error searching students:', errorMessage, error);
    dispatch(searchError(errorMessage));
  }
};

export const resetSearch = () => (dispatch) => {
  dispatch(searchReset());
};