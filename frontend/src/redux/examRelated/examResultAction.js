import axios from 'axios';
import {
  getRequest,
  getSuccess,
  getError,
  stuffDone,
  clearError,
} from './examResultSlice';

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

export const getAllExamResults = (adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  try {
    const response = await api.get(`/exam-results/${adminID}`);
    dispatch(getSuccess(response.data.data || []));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(getError(errorMessage));
  }
};

export const createExamResult = (data, adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  if (!data.admissionNo || !data.rollNo || !data.studentName || !data.examGroup || !data.examType || !data.session || !data.classId || !data.section || !data.subjects) {
    dispatch(getError('All required fields must be filled'));
    return;
  }
  dispatch(getRequest());
  try {
    const payload = { ...data, adminID };
    await api.post('/exam-result', payload);
    dispatch(stuffDone());
    dispatch(getAllExamResults(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(getError(errorMessage));
  }
};

export const updateExamResult = ({ id, examResult, adminID }) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  try {
    const payload = { ...examResult, adminID };
    await api.put(`/exam-result/${id}`, payload);
    dispatch(stuffDone());
    dispatch(getAllExamResults(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(getError(errorMessage));
  }
};

export const deleteExamResult = (id, adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  try {
    await api.delete(`/exam-result/${id}?adminID=${adminID}`);
    dispatch(stuffDone());
    dispatch(getAllExamResults(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(getError(errorMessage));
  }
};

export const clearExamResultError = () => clearError();