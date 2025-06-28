import axios from 'axios';
import {
  getRequest,
  getSuccess,
  getError,
  stuffDone,
  clearError,
} from './/route-pickup-pointSlice';

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

export const getAllRoutePickupPoints = (adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  const url = `/route-pickup-points/${adminID}`;
  console.log('Request URL:', url, 'with adminID:', adminID);
  try {
    const response = await api.get(url);
    console.log('Fetch route pickup points response:', response.data);
    dispatch(getSuccess(response.data.data || []));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error fetching route pickup points:', errorMessage);
    dispatch(getError(errorMessage));
  }
};

export const createRoutePickupPoint = (data, adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  if (!data.routeId || !data.pointId || !data.fee || !data.distance || !data.time) {
    dispatch(getError('Route, pickup point, fee, distance, and time are required'));
    return;
  }
  dispatch(getRequest());
  try {
    const payload = { ...data, adminID };
    console.log('Sending POST /route-pickup-point:', payload);
    const response = await api.post('/route-pickup-point', payload);
    dispatch(stuffDone());
    dispatch(getAllRoutePickupPoints(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error response from server (add):', JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

export const updateRoutePickupPoint = ({ id, routePickupPoint, adminID }) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  try {
    const payload = { ...routePickupPoint, adminID };
    console.log('Sending PUT /route-pickup-point:', payload);
    await api.put(`/route-pickup-point/${id}`, payload);
    dispatch(stuffDone());
    dispatch(getAllRoutePickupPoints(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error response from server (update):', JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

export const deleteRoutePickupPoint = (id, adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  try {
    console.log('Sending DELETE /route-pickup-point:', id, 'with adminID:', adminID);
    await api.delete(`/route-pickup-point/${id}?adminID=${adminID}`);
    dispatch(stuffDone());
    dispatch(getAllRoutePickupPoints(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error response from server (delete):', JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

export const clearRoutePickupPointError = () => clearError();