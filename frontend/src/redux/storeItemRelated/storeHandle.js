// storeHandle.js (Frontend Redux Actions)
import axios from 'axios';
import {
  fetchRequest,
  fetchSuccess,
  fetchFailed,
  addOrUpdateSuccess,
  getDetailsSuccess,
  deleteSuccess,
  clearError,
  operationFailed,
} from './storeSlice.js';

const BASE_URL = process.env.REACT_APP_BASE_URL;

// ✅ Get all Stores by Admin ID
export const getAllStores = (adminID) => async (dispatch) => {
  dispatch(fetchRequest());
  try {
    const result = await axios.get(`${BASE_URL}/StoreList?adminID=${adminID}`);
    if (result.data.message) {
      dispatch(fetchFailed(result.data.message));
    } else {
      dispatch(fetchSuccess(result.data));
    }
  } catch (error) {
    dispatch(fetchFailed(error.message));
  }
};

// ✅ Get Section details by ID
              
export const getStoreDetails  = (id) => async (dispatch) => {
  dispatch(fetchRequest());
  try {
    const result = await axios.get(`${BASE_URL}/Store/${id}`);
    if (result.data) {
      dispatch(getDetailsSuccess(result.data));
    }
  } catch (error) {
    dispatch(fetchFailed(error.message));
  }
};

// ✅ Create Store
export const createStore = (data) => async (dispatch) => {
  dispatch(fetchRequest());
  try {
    const result = await axios.post(`${BASE_URL}/StoreCreate`, data);
    if (result?.data?.message === 'Store already exists') {
      dispatch(operationFailed('Store code already exists'));
    } else {
      dispatch(addOrUpdateSuccess(result.data));
    }
  } catch (error) {
    dispatch(operationFailed(error.message));
  }
};

// ✅ Update Store
export const updateStore = (id, data) => async (dispatch) => {
  dispatch(fetchRequest());
  try {
    const result = await axios.put(`${BASE_URL}/Store/${id}`, data);
    dispatch(addOrUpdateSuccess(result.data));
  } catch (error) {
    dispatch(operationFailed(error.message));
  }
};

// ✅ Delete Store with Admin ID
export const deleteStore = (id, adminID) => async (dispatch) => {
  dispatch(fetchRequest());
  try {
    await axios.delete(`${BASE_URL}/Store/${id}`, { data: { adminID } });
    dispatch(deleteSuccess(id));
  } catch (error) {
    dispatch(operationFailed(error.message));
  }
};

// ✅ Clear Errors
export const clearStoreError = () => (dispatch) => {
  dispatch(clearError());
};