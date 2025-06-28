import axios from 'axios';
import {
  getRequest,
  getSuccess,
  getError,
  stuffDone,
  clearError,
} from './AddTransportFeeSlice';

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

export const getAllAddTransportFees = (adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  const url = `/add-transport-fees/${adminID}`;
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

export const createAddTransportFee = (data, adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  if (!data.admissionNo || !data.studentName || !data.class || !data.fatherName || !data.dob || !data.route || !data.vehicleNo || !data.pickupPoint || !data.feeAmount || !data.dueDate) {
    dispatch(getError('All fields are required'));
    return;
  }
  dispatch(getRequest());
  try {
    const payload = { ...data, adminID };
    console.log('Sending POST /add-transport-fee:', payload);
    const response = await api.post('/add-transport-fee', payload);
    dispatch(stuffDone());
    dispatch(getAllAddTransportFees(adminID));
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error response from server (add):', JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
    throw error;
  }
};

export const updateAddTransportFee = ({ id, transportFee, adminID }) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  try {
    const payload = { ...transportFee, adminID };
    console.log('Sending PUT /add-transport-fee:', payload);
    await api.put(`/add-transport-fee/${id}`, payload);
    dispatch(stuffDone());
    dispatch(getAllAddTransportFees(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error response from server (update):', JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

export const deleteAddTransportFee = (id, adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  try {
    console.log('Sending DELETE /add-transport-fee:', id, 'with adminID:', adminID);
    await api.delete(`/add-transport-fee/${id}?adminID=${adminID}`);
    dispatch(stuffDone());
    dispatch(getAllAddTransportFees(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error response from server (delete):', JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

export const clearAddTransportFeeError = () => clearError();