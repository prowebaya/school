// redux/StockItemRelated/StockItemAction.js
// frontend/src/redux/StockItemRelated/StockItemAction.js
import axios from 'axios';
import {
  getRequest,
  getSuccess,
  getError,
  stuffDone,
  clearError,
} from './itemStockSlice';

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || 'http://localhost:5000', // Add /api
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAllStockItems = (adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  const url = `/stock-items/${adminID}`; // Relative to /api
  console.log('Request URL:', url, 'with adminID:', adminID);
  try {
    const response = await api.get(url);
    console.log('Fetch stock items response:', response.data);
    dispatch(getSuccess(response.data.data || []));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error fetching stock items:', errorMessage);
    dispatch(getError(errorMessage));
  }
};

export const createStockItem = (data, adminID) => async (dispatch, getState) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  if (!data.item || !data.category || !data.supplier || !data.store || !data.quantity || !data.purchasePrice || !data.purchaseDate) {
    dispatch(getError('All required fields must be filled'));
    return;
  }
  dispatch(getRequest());
  try {
    const formData = new FormData();
    formData.append('item', data.item);
    formData.append('category', data.category);
    formData.append('supplier', data.supplier);
    formData.append('store', data.store);
    formData.append('quantity', data.quantity);
    formData.append('purchasePrice', data.purchasePrice);
    formData.append('purchaseDate', data.purchaseDate);
    if (data.document) formData.append('document', data.document);
    if (data.description) formData.append('description', data.description);
    formData.append('adminID', adminID);

    console.log('Sending POST /stock-item:', [...formData.entries()]);
    const response = await api.post('/stock-item', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const currentStockItems = getState().stockItem.stockItemsList;
    dispatch(getSuccess([...currentStockItems, response.data.data]));
    dispatch(stuffDone());
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error response from server (add):', JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

// ... (updateStockItem and deleteStockItem remain unchanged)
export const updateStockItem = ({ id, stockItem, adminID }) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  try {
    const formData = new FormData();
    formData.append('item', stockItem.item);
    formData.append('category', stockItem.category);
    formData.append('supplier', stockItem.supplier);
    formData.append('store', stockItem.store);
    formData.append('quantity', stockItem.quantity);
    formData.append('purchasePrice', stockItem.purchasePrice);
    formData.append('purchaseDate', stockItem.purchaseDate);
    if (stockItem.document) formData.append('document', stockItem.document);
    if (stockItem.description) formData.append('description', stockItem.description);
    formData.append('adminID', adminID);

    console.log('Sending PUT /stock-item:', [...formData.entries()]);
    await api.put(`/stock-item/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    dispatch(stuffDone());
    dispatch(getAllStockItems(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error response from server (update):', JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

export const deleteStockItem = (id, adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  try {
    console.log('Sending DELETE /stock-item:', id, 'with adminID:', adminID);
    await api.delete(`/stock-item/${id}?adminID=${adminID}`);
    dispatch(stuffDone());
    dispatch(getAllStockItems(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error response from server (delete):', JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

export const clearStockItemError = () => clearError();