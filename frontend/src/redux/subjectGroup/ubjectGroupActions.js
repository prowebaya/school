import axios from 'axios';
import {
  getRequest,
  getSuccess,
  getError,
  stuffDone,
  clearError,
} from './subjectGroupSlice';
import { getAllFclasses } from '../fclass/fclassHandle';
import { getAllSections } from '../sectionRelated/sectionHandle';

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No token found in localStorage');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message || error.message || 'Request failed';
    if (error.response?.status === 403) {
      return Promise.reject(new Error('Forbidden: Invalid or expired token'));
    }
    return Promise.reject(new Error(errorMessage));
  }
);

export const fetchSubjectGroups = (adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  try {
    // Fetch classes and sections alongside subject groups
    await Promise.all([
      dispatch(getAllFclasses(adminID)),
      dispatch(getAllSections(adminID)),
    ]);
    const response = await api.get(`/subject-groups?adminID=${adminID}`);
    dispatch(getSuccess(response.data.data || []));
  } catch (error) {
    const errorMessage = error.message || 'Failed to fetch subject groups';
    console.error('Error fetching subject groups:', errorMessage);
    dispatch(getError(errorMessage));
  }
};

export const saveSubjectGroup = (subjectGroupData, adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  try {
    const payload = { ...subjectGroupData, adminID };
    const response = await api.post('/subject-group', payload);
    dispatch(stuffDone());
    dispatch(fetchSubjectGroups(adminID)); // Refresh the list
    return response.data.data;
  } catch (error) {
    const errorMessage = error.message || 'Failed to save subject group';
    console.error('Error saving subject group:', errorMessage);
    dispatch(getError(errorMessage));
    throw error;
  }
};

export const removeClassFromGroup = (groupId, classIndex, adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  try {
    const payload = { groupId, classIndex, adminID };
    await api.delete('/subject-group/class', { data: payload });
    dispatch(stuffDone());
    dispatch(fetchSubjectGroups(adminID)); // Refresh the list
  } catch (error) {
    const errorMessage = error.message || 'Failed to delete class from subject group';
    console.error('Error deleting class:', errorMessage);
    dispatch(getError(errorMessage));
    throw error;
  }
};

export const clearSubjectGroupError = () => clearError();