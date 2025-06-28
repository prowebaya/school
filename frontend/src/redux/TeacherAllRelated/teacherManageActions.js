import axios from 'axios';
import {
  fetchTeachersStart,
  fetchTeachersSuccess,
  fetchTeachersFailure,
  updateTeacherSuccess,
  deleteTeacherSuccess,
  clearError,
  setSelectedTeacher,
} from './teacherManageSlice';

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

export const fetchTeachers = () => async (dispatch) => {
  dispatch(fetchTeachersStart());
  try {
    const response = await api.get('/teachers');
    dispatch(fetchTeachersSuccess(response.data));
    return { type: 'teacherManage/fetchTeachersSuccess' };
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error fetching teachers:', errorMessage);
    dispatch(fetchTeachersFailure(errorMessage));
    return { type: 'teacherManage/fetchTeachersFailure', payload: errorMessage };
  }
};

export const updateTeacher = (teacherId, formData) => async (dispatch) => {
  dispatch(fetchTeachersStart());
  try {
    const response = await api.put(`/teachers/${teacherId}`, formData);
    dispatch(setSelectedTeacher(response.data));
    dispatch(updateTeacherSuccess(response.data));
    return { type: 'teacherManage/updateTeacherSuccess' };
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error updating teacher:', errorMessage);
    dispatch(fetchTeachersFailure(errorMessage));
    return { type: 'teacherManage/fetchTeachersFailure', payload: errorMessage };
  }
};

export const deleteTeacher = (teacherId) => async (dispatch) => {
  dispatch(fetchTeachersStart());
  try {
    await api.delete(`/teachers/${teacherId}`);
    dispatch(deleteTeacherSuccess(teacherId));
    return { type: 'teacherManage/deleteTeacherSuccess' };
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error deleting teacher:', errorMessage);
    dispatch(fetchTeachersFailure(errorMessage));
    return { type: 'teacherManage/fetchTeachersFailure', payload: errorMessage };
  }
};

export const clearTeacherManageError = () => clearError();