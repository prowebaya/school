import axios from 'axios';
import {
  getRequest,
  getSuccess,
  getError,
  stuffDone,
  clearError,
} from './transport-fees-slice';

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

export const getAllTransportFees = (adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  const url = `transport-fees/${adminID}`;
  console.log('Request URL:', url, 'with adminID:', adminID);
  try {
    const response = await api.get(url);
    console.log('Fetch transport fees response:', response.data);
    dispatch(getSuccess(response.data.data || []));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error fetching transport fees:', errorMessage);
    dispatch(getError(errorMessage));
  }
};

export const createTransportFees = (data, adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  if (!data.month || !data.dueDate || !data.fineType) {
    dispatch(getError('Month, due date, and fine type are required'));
    return;
  }
  dispatch(getRequest());
  try {
    const payload = { ...data, adminID };
    console.log('Sending POST /transport-fees:', payload);
    const response = await api.post('transport-fees', payload);
    dispatch(stuffDone());
    dispatch(getAllTransportFees(adminID));
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error response from server (add):', JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
    throw error;
  }
};

export const updateTransportFees = ({ id, transportFees, adminID }) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  try {
    const payload = { ...transportFees, adminID };
    console.log('Sending PUT /transport-fees:', payload);
    await api.put(`transport-fees/${id}`, payload);
    dispatch(stuffDone());
    dispatch(getAllTransportFees(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error response from server (update):', JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
    throw error;
  }
};

export const deleteTransportFees = (id, adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  try {
    console.log('Sending DELETE /transport-fees:', id, 'with adminID:', adminID);
    await api.delete(`transport-fees/${id}?adminID=${adminID}`);
    dispatch(stuffDone());
    dispatch(getAllTransportFees(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error response from server (delete):', JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
    throw error;
  }
};

export const copyTransportFees = (adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  try {
    console.log('Sending POST /transport-fees/copy:', { adminID });
    await api.post('transport-fees/copy', { adminID });
    dispatch(stuffDone());
    dispatch(getAllTransportFees(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error response from server (copy):', JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
    throw error;
  }
};

export const clearTransportFeesError = () => clearError();