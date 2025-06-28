
import axios from 'axios';
import {
  getRequest,
  getSuccess,
  getError,
  stuffDone,
  clearError,
} from './exam-schedule-slice';

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

export const getAllExamSchedules = (adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  const url = `/exam-schedules/${adminID}`;
  console.log('Request URL:', url, 'with adminID:', adminID);
  try {
    const response = await api.get(url);
    console.log('Fetch exam schedules response:', response.data);
    dispatch(getSuccess(response.data.data || []));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error fetching exam schedules:', errorMessage);
    dispatch(getError(errorMessage));
  }
};

export const createExamSchedule = (data, adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  if (!data.name || !data.date || !data.time || !data.duration || !data.room || !data.maxMarks || !data.minMarks || !data.examGroup || !data.examType) {
    dispatch(getError('All fields are required'));
    return;
  }
  dispatch(getRequest());
  try {
    const payload = { ...data, adminID };
    console.log('Sending POST /exam-schedule:', payload);
    const response = await api.post('/exam-schedule', payload);
    dispatch(stuffDone());
    dispatch(getAllExamSchedules(adminID));
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error response from server (add):', JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
    throw error;
  }
};

export const updateExamSchedule = ({ id, examSchedule, adminID }) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  try {
    const payload = { ...examSchedule, adminID };
    console.log('Sending PUT /exam-schedule:', payload);
    await api.put(`/exam-schedule/${id}`, payload);
    dispatch(stuffDone());
    dispatch(getAllExamSchedules(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error response from server (update):', JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
    throw error;
  }
};

export const deleteExamSchedule = (id, adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  try {
    console.log('Sending DELETE /exam-schedule:', id, 'with adminID:', adminID);
    await api.delete(`/exam-schedule/${id}?adminID=${adminID}`);
    dispatch(stuffDone());
    dispatch(getAllExamSchedules(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error response from server (delete):', JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
    throw error;
  }
};

export const clearExamScheduleError = () => clearError();