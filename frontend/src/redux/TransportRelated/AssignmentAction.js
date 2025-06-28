import axios from 'axios';
import {
  getRequest,
  getSuccess,
  getError,
  stuffDone,
  clearError,
} from './AssignmentSlice'; // Update path if needed, e.g., '../redux/assignmentSlice'

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

export const getAllAssignments = (adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  const url = `/assignments/${adminID}`;
  console.log('Request URL:', url, 'with adminID:', adminID);
  try {
    const response = await api.get(url);
    console.log('Fetch assignments response:', response.data);
    dispatch(getSuccess(response.data.data || []));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error fetching assignments:', errorMessage);
    dispatch(getError(errorMessage));
  }
};

export const createAssignment = (data, adminID) => async (dispatch, getState) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  if (!data.route || !data.vehicle) {
    dispatch(getError('Route and vehicle are required'));
    return;
  }
  dispatch(getRequest());
  try {
    const payload = { ...data, adminID };
    console.log('Sending POST /assignment:', payload);
    const response = await api.post('/assignment', payload);
    const currentAssignments = getState().assignment.assignmentsList;
    dispatch(getSuccess([...currentAssignments, response.data.data]));
    dispatch(stuffDone());
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error response from server (add):', JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

export const updateAssignment = ({ id, assignment, adminID }) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  try {
    const payload = { ...assignment, adminID };
    console.log('Sending PUT /assignment:', payload);
    await api.put(`/assignment/${id}`, payload);
    dispatch(stuffDone());
    dispatch(getAllAssignments(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error response from server (update):', JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

export const deleteAssignment = (id, adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  try {
    console.log('Sending DELETE /assignment:', id, 'with adminID:', adminID);
    await api.delete(`/assignment/${id}?adminID=${adminID}`);
    dispatch(stuffDone());
    dispatch(getAllAssignments(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error response from server (delete):', JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

export const clearAssignmentError = () => clearError();