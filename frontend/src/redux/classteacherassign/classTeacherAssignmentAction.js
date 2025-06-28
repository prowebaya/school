import axios from 'axios';
import {
  getRequest,
  getSuccess,
  getError,
  stuffDone,
  clearError,
  setTeachers,
} from './classTeacherAssignmentSlice';

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

export const getAllClassTeacherAssignments = (adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  try {
    const response = await api.get(`/class-teacher-assignments/${adminID}`);
    dispatch(getSuccess(response.data.data || []));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error fetching class teacher assignments:', errorMessage);
    dispatch(getError(errorMessage));
  }
};

export const getTeachers = (adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  try {
    const response = await api.get(`/teachers/${adminID}`);
    dispatch(setTeachers(response.data.data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error fetching teachers:', errorMessage);
    dispatch(getError(errorMessage));
  }
};

export const createClassTeacherAssignment = (data, adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  if (!data.class || !data.section || !data.teacherId) {
    dispatch(getError('Class, section, and teacher are required'));
    return;
  }
  dispatch(getRequest());
  try {
    const payload = { ...data, adminID };
    await api.post('/class-teacher-assignment', payload);
    dispatch(stuffDone());
    dispatch(getAllClassTeacherAssignments(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error adding class teacher assignment:', errorMessage);
    dispatch(getError(errorMessage));
  }
};

export const updateClassTeacherAssignment = ({ id, assignment, adminID }) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  try {
    const payload = { ...assignment, adminID };
    await api.put(`/class-teacher-assignment/${id}`, payload);
    dispatch(stuffDone());
    dispatch(getAllClassTeacherAssignments(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error updating class teacher assignment:', errorMessage);
    dispatch(getError(errorMessage));
  }
};

export const deleteClassTeacherAssignment = (id, adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  try {
    await api.delete(`/class-teacher-assignment/${id}?adminID=${adminID}`);
    dispatch(stuffDone());
    dispatch(getAllClassTeacherAssignments(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error deleting class teacher assignment:', errorMessage);
    dispatch(getError(errorMessage));
  }
};

export const clearClassTeacherAssignmentError = () => clearError();