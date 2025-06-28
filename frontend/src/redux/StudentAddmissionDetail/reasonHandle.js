import axios from 'axios';
import {
  fetchReasonsRequest,
  fetchReasonsSuccess,
  fetchReasonsError,
  createReasonRequest,
  createReasonSuccess,
  createReasonError,
  updateReasonRequest,
  updateReasonSuccess,
  updateReasonError,
  deleteReasonRequest,
  deleteReasonSuccess,
  deleteReasonError,
} from './reasonSlice';

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

export const fetchAllReasons = (adminID) => async (dispatch) => {
  dispatch(fetchReasonsRequest());
  try {
    console.log(`Request URL: /reasons/${adminID}`);
    const response = await api.get(`/reasons/${adminID}`);
    console.log('Fetch reasons response:', response.data);
    dispatch(fetchReasonsSuccess(response.data.data || []));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error fetching reasons:', errorMessage, error);
    dispatch(fetchReasonsError(errorMessage));
  }
};

export const createReason = (adminID, text) => async (dispatch) => {
  dispatch(createReasonRequest());
  try {
    console.log(`Request URL: /reasons/${adminID}`, { text });
    const response = await api.post(`/reasons/${adminID}`, { text });
    console.log('Create reason response:', response.data);
    dispatch(createReasonSuccess(response.data.data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error creating reason:', errorMessage, error);
    dispatch(createReasonError(errorMessage));
  }
};

export const updateReason = (adminID, reasonId, text) => async (dispatch) => {
  dispatch(updateReasonRequest());
  try {
    console.log(`Request URL: /reasons/${adminID}/${reasonId}`, { text });
    const response = await api.put(`/reasons/${adminID}/${reasonId}`, { text });
    console.log('Update reason response:', response.data);
    dispatch(updateReasonSuccess(response.data.data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error updating reason:', errorMessage, error);
    dispatch(updateReasonError(errorMessage));
  }
};

export const deleteReason = (adminID, reasonId) => async (dispatch) => {
  dispatch(deleteReasonRequest());
  try {
    console.log(`Request URL: /reasons/${adminID}/${reasonId}`);
    const response = await api.delete(`/reasons/${adminID}/${reasonId}`);
    console.log('Delete reason response:', response.data);
    dispatch(deleteReasonSuccess(reasonId));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error deleting reason:', errorMessage, error);
    dispatch(deleteReasonError(errorMessage));
  }
};