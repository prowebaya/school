import axios from 'axios';
import { getRequest, getSuccess, getError, stuffDone } from './frontOfficeSlice';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor for JWT token (if needed)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fetch entries
export const fetchEntries = (adminID, type) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const response = await api.get(`/entries/${adminID}/${type}`);
    dispatch(getSuccess({ type, data: response.data.data }));
  } catch (error) {
    dispatch(getError(error.response?.data?.message || error.message));
  }
};

// Add entry
export const addEntry = (data, adminID) => async (dispatch) => {
  dispatch(getRequest());
  try {
    await api.post('/entry', { ...data, adminID });
    dispatch(stuffDone());
    dispatch(fetchEntries(adminID, data.type));
  } catch (error) {
    dispatch(getError(error.response?.data?.message || error.message));
  }
};

// Update entry
export const updateEntry = (id, data, adminID) => async (dispatch) => {
  dispatch(getRequest());
  try {
    await api.put(`/entry/${id}`, { ...data, adminID });
    dispatch(stuffDone());
    dispatch(fetchEntries(adminID, data.type));
  } catch (error) {
    dispatch(getError(error.response?.data?.message || error.message));
  }
};

// Delete entry
export const deleteEntry = (id, adminID, type) => async (dispatch) => {
  dispatch(getRequest());
  try {
    await api.delete(`/entry/${id}?adminID=${adminID}`);
    dispatch(stuffDone());
    dispatch(fetchEntries(adminID, type));
  } catch (error) {
    dispatch(getError(error.response?.data?.message || error.message));
  }
};