import axios from 'axios';
import {
  getRequest,
  getSuccess,
  getError,
  stuffDone,
  clearError,
} from './promotionSlice';

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
  } else {
    console.warn('No token found in localStorage. Please log in again.');
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message || error.message || 'Request failed';
    if (error.response?.status === 403) {
      return Promise.reject(new Error('Forbidden: Invalid or expired token. Please log in again.'));
    }
    return Promise.reject(new Error(errorMessage));
  }
);

export const getAllPromotions = (adminID, className, section, session) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  if (!className || !section || !session) {
    dispatch(getError('Class, section, and session are required'));
    return;
  }
  dispatch(getRequest());
  const url = `/promotions?adminID=${adminID}&className=${encodeURIComponent(className)}&section=${section}&session=${session}`;
  try {
    const response = await api.get(url);
    dispatch(getSuccess(response.data.data || []));
  } catch (error) {
    const errorMessage = error.message || 'Failed to fetch promotions';
    console.error('Error fetching promotions:', errorMessage);
    dispatch(getError(errorMessage));
  }
};

export const updatePromotion = (id, promotionData, adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  try {
    const payload = { ...promotionData, adminID };
    await api.put(`/promotion/${id}`, payload);
    dispatch(stuffDone());
  } catch (error) {
    const errorMessage = error.message || 'Failed to update promotion';
    console.error('Error updating promotion:', errorMessage);
    dispatch(getError(errorMessage));
  }
};

export const promotePromotions = (promotionIds, promoteClass, promoteSection, promoteSession, adminID) => async (dispatch) => {
  if (!localStorage.getItem('token')) {
    dispatch(getError('Authentication required. Please log in.'));
    return;
  }
  if (!adminID || !/^[0-9a-fA-F]{24}$/.test(adminID)) {
    dispatch(getError('Valid Admin ID is required'));
    return;
  }
  if (!promotionIds || !Array.isArray(promotionIds) || promotionIds.length === 0) {
    dispatch(getError('At least one promotion ID is required'));
    return;
  }
  if (!promoteClass || !promoteSection || !promoteSession) {
    dispatch(getError('Promote class, section, and session are required'));
    return;
  }
  dispatch(getRequest());
  try {
    const payload = { promotionIds, promoteClass, promoteSection, promoteSession, adminID };
    console.log('Promote payload:', payload); // Debug payload
    const response = await api.post('/promote-promotions', payload);
    dispatch(stuffDone());
    dispatch(getSuccess([])); // Clear promotion list after promotion
    return response.data;
  } catch (error) {
    const errorMessage = error.message || 'Failed to promote students';
    console.error('Error promoting promotions:', errorMessage);
    dispatch(getError(errorMessage));
    throw error;
  }
};

export const clearPromotionError = () => clearError();