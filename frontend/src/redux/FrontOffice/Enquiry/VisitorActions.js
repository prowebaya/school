import axios from 'axios';
import { getRequest, getSuccess, getError, stuffDone, clearError } from './VisitorSlice';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchVisitors = (adminID: string) => async (dispatch: any) => {
  dispatch(getRequest());
  try {
    const response = await api.get(`/visitors/${adminID}`);
    dispatch(getSuccess(response.data.data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(getError(errorMessage));
  }
};

export const addVisitor = (visitorData: any, adminID: string) => async (dispatch: any) => {
  dispatch(getRequest());
  try {
    const response = await api.post('/visitor', { ...visitorData, adminID });
    dispatch(stuffDone());
    dispatch(fetchVisitors(adminID));
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(getError(errorMessage));
    throw error;
  }
};

export const updateVisitor = (id: string, visitorData: any, adminID: string) => async (dispatch: any) => {
  dispatch(getRequest());
  try {
    const response = await api.put(`/visitor/${id}`, { ...visitorData, adminID });
    dispatch(stuffDone());
    dispatch(fetchVisitors(adminID));
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(getError(errorMessage));
    throw error;
  }
};

export const deleteVisitor = (id: string, adminID: string) => async (dispatch: any) => {
  dispatch(getRequest());
  try {
    await api.delete(`/visitor/${id}`, { data: { adminID } });
    dispatch(stuffDone());
    dispatch(fetchVisitors(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(getError(errorMessage));
    throw error;
  }
};

export { clearError };