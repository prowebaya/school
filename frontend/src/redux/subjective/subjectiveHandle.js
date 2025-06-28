import axios from 'axios';
import {
  getRequest,
  getSuccess,
  getError,
  stuffDone,
  clearError,
} from './subjectiveSlice';

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

export const getAllSubjectives = (adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  const url = `/subjectives/${adminID}`;
  console.log('Request URL:', url, 'with adminID:', adminID);
  try {
    const response = await api.get(url);
    console.log('Fetch subjectives response:', response.data);
    dispatch(getSuccess(response.data.data || []));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error fetching subjectives:', errorMessage);
    dispatch(getError(errorMessage));
  }
};

export const createSubjective = (data, adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  if (!data.name || !data.code || !data.type) {
    dispatch(getError('Name, code, and type are required'));
    return;
  }
  dispatch(getRequest());
  try {
    const payload = { ...data, adminID };
    console.log('Sending POST /subjective:', payload);
    const response = await api.post('/subjective', payload);
    dispatch(stuffDone());
    dispatch(getAllSubjectives(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error response from server (add):', JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

export const updateSubjective = ({ id, subjective, adminID }) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  try {
    const payload = { ...subjective, adminID };
    console.log('Sending PUT /subjective:', payload);
    await api.put(`/subjective/${id}`, payload);
    dispatch(stuffDone());
    dispatch(getAllSubjectives(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error response from server (update):', JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

export const deleteSubjective = (id, adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  try {
    console.log('Sending DELETE /subjective:', id, 'with adminID:', adminID);
    await api.delete(`/subjective/${id}?adminID=${adminID}`);
    dispatch(stuffDone());
    dispatch(getAllSubjectives(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error response from server (delete):', JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

export const clearSubjectiveError = () => clearError();