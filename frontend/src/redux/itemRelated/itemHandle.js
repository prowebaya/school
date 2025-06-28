// redux/itemRelated/ItemAction.js
import axios from 'axios';
import {
  fetchRequest,
  fetchSuccess,
  fetchFailed,
  addOrUpdateSuccess,
  deleteSuccess,
  operationFailed,
  clearError,
} from './itemSlice';

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

export const getAllItems = (adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(fetchFailed('Admin ID is required'));
    return;
  }
  dispatch(fetchRequest());
  const url = `/items/${adminID}`;
  console.log('Request URL:', url, 'with adminID:', adminID);
  try {
    const response = await api.get(url);
    console.log('Fetch items response:', response.data);
    dispatch(fetchSuccess(response.data.data || []));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error fetching items:', errorMessage);
    dispatch(fetchFailed(errorMessage));
  }
};

export const createItem = (data, adminID) => async (dispatch, getState) => {
  if (!adminID) {
    dispatch(fetchFailed('Admin ID is required'));
    return;
  }
  if (!data.item || !data.category || !data.unit || !data.availableQuantity) {
    dispatch(fetchFailed('Item, category, unit, and available quantity are required'));
    return;
  }
  dispatch(fetchRequest());
  try {
    const payload = { ...data, adminID };
    console.log('Sending POST /items:', payload);
    const response = await api.post('/items', payload);
    const currentItems = getState().item.itemsList;
    dispatch(fetchSuccess([...currentItems, response.data.data]));
    dispatch(addOrUpdateSuccess(response.data.data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error response from server (add):', JSON.stringify(error.response?.data, null, 2));
    dispatch(operationFailed(errorMessage));
  }
};

export const updateItem = (id, data, adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(fetchFailed('Admin ID is required'));
    return;
  }
  dispatch(fetchRequest());
  try {
    const payload = { ...data, adminID };
    console.log('Sending PUT /items:', payload);
    const response = await api.put(`/items/${id}`, payload);
    dispatch(addOrUpdateSuccess(response.data.data));
    dispatch(getAllItems(adminID)); // Refresh the list
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error response from server (update):', JSON.stringify(error.response?.data, null, 2));
    dispatch(operationFailed(errorMessage));
  }
};

export const deleteItem = (id, adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(fetchFailed('Admin ID is required'));
    return;
  }
  dispatch(fetchRequest());
  try {
    console.log('Sending DELETE /items:', id, 'with adminID:', adminID);
    await api.delete(`/items/${id}?adminID=${adminID}`);
    dispatch(deleteSuccess(id));
    dispatch(getAllItems(adminID)); // Refresh the list
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error response from server (delete):', JSON.stringify(error.response?.data, null, 2));
    dispatch(operationFailed(errorMessage));
  }
};

export const clearItemError = () => clearError();