import axios from 'axios';
import {
  getRequest,
  getSuccess,
  getError,
  stuffDone,
  clearError,
  resetForm,
} from './formSlice.js';

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  } else {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

export const createTeacherForm = ({ adminID, formData }) => async (dispatch) => {
  if (!adminID) {
    return dispatch(getError('Admin ID is required'));
  }
  dispatch(getRequest());
  try {
    formData.append('adminID', adminID);
    console.log('Sending POST /teacher-form with FormData');
    await api.post('/teacher-form', formData);
    dispatch(getSuccess());
    dispatch(stuffDone());
    dispatch(resetForm());
    return { type: 'teacherForm/getSuccess' };
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error adding teacher form:', errorMessage);
    dispatch(getError(errorMessage));
    return { type: 'teacherForm/getError', payload: errorMessage };
  }
};

export const getAllTeachers = () => async (dispatch) => {
  dispatch(getRequest());
  try {
    const response = await api.get('/teachers');
    dispatch(getSuccess(response.data));
    dispatch(stuffDone());
    return { type: 'teacherForm/getSuccess', payload: response.data };
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(getError(errorMessage));
    return { type: 'teacherForm/getError', payload: errorMessage };
  }
};

export const updateTeacher = ({ id, formData }) => async (dispatch) => {
  dispatch(getRequest());
  try {
    await api.put(`/teachers/${id}`, formData);
    dispatch(getSuccess());
    dispatch(stuffDone());
    return { type: 'teacherForm/updateSuccess' };
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(getError(errorMessage));
    return { type: 'teacherForm/updateError', payload: errorMessage };
  }
};

export const deleteTeacher = (id) => async (dispatch) => {
  dispatch(getRequest());
  try {
    await api.delete(`/teachers/${id}`);
    dispatch(getSuccess());
    dispatch(stuffDone());
    return { type: 'teacherForm/deleteSuccess' };
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(getError(errorMessage));
    return { type: 'teacherForm/deleteError', payload: errorMessage };
  }
};

export const clearTeacherFormError = () => clearError();