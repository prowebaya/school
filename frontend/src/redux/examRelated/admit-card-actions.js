import axios from 'axios';
import { getRequest, getSuccess, getError, stuffDone, clearError } from './admit-card-slice';

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

export const getAllAdmitCards = (adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  const url = `/admit-cards/${adminID}`;
  console.log('Request URL:', url, 'with adminID:', adminID);
  try {
    const response = await api.get(url);
    console.log('Fetch admit cards response:', response.data);
    dispatch(getSuccess(response.data.data || []));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error fetching admit cards:', errorMessage);
    dispatch(getError(errorMessage));
  }
};

export const createAdmitCard = (data, adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  if (!data.template || !data.studentName || !data.examName || !data.examDate || !data.examCenter) {
    dispatch(getError('Template, student name, exam name, exam date, and exam center are required'));
    return;
  }
  dispatch(getRequest());
  try {
    const payload = { ...data, adminID };
    console.log('Sending POST /admit-card:', payload);
    const response = await api.post('/admit-card', payload);
    dispatch(stuffDone());
    dispatch(getAllAdmitCards(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error response from server (add):', JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

export const updateAdmitCard = ({ id, admitCard, adminID }) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  try {
    const payload = { ...admitCard, adminID };
    console.log('Sending PUT /admit-card:', payload);
    await api.put(`/admit-card/${id}`, payload);
    dispatch(stuffDone());
    dispatch(getAllAdmitCards(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error response from server (update):', JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

export const deleteAdmitCard = (id, adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  try {
    console.log('Sending DELETE /admit-card:', id, 'with adminID:', adminID);
    await api.delete(`/admit-card/${id}?adminID=${adminID}`);
    dispatch(stuffDone());
    dispatch(getAllAdmitCards(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error response from server (delete):', JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

export const clearAdmitCardError = () => clearError();