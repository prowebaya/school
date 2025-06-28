import axios from 'axios';
import {
  fetchCategoryCardsRequest,
  fetchCategoryCardsSuccess,
  fetchCategoryCardsFailed,
  addOrUpdateCategoryCardSuccess,
  getCategoryCardDetailsSuccess,
  deleteCategoryCardSuccess,
  categoryCardOperationFailed,
  clearError 
} from './categorySlice.js';

const BASE_URL = process.env.REACT_APP_BASE_URL;

// GET ALL CATEGORYCARDS
// categoryCardHandle.js
export const getAllCategoryCards = (adminID) => async (dispatch) => {
  try {
    dispatch(fetchCategoryCardsRequest());
    const { data } = await axios.get(`${BASE_URL}/categoryCards?adminID=${adminID}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    });
    dispatch(fetchCategoryCardsSuccess(data));
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch(fetchCategoryCardsFailed(message));
  }
};

// GET SINGLE CATEGORYCARD DETAILS
export const getCategoryCardDetails = (id) => async (dispatch) => {
  dispatch(fetchCategoryCardsRequest());
  try {
    const { data } = await axios.get(`${BASE_URL}/categoryCards/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    dispatch(getCategoryCardDetailsSuccess(data));
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch(categoryCardOperationFailed(message));
  }
};

// CREATE CATEGORYCARD
export const createCategoryCard = (categoryCardData) => async (dispatch) => {
  try {
    dispatch(fetchCategoryCardsRequest());
    const { data } = await axios.post(`${BASE_URL}/categoryCards`, categoryCardData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    });
    dispatch(addOrUpdateCategoryCardSuccess(data));
    return Promise.resolve();
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch(categoryCardOperationFailed(message));
    return Promise.reject(message);
  }
};

// UPDATE CATEGORYCARD
export const updateCategoryCard = (id, categoryCardData) => async (dispatch) => {
  try {
    dispatch(fetchCategoryCardsRequest());
    const { data } = await axios.put(`${BASE_URL}/categoryCards/${id}`, categoryCardData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    });
    dispatch(addOrUpdateCategoryCardSuccess(data));
    return Promise.resolve();
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch(categoryCardOperationFailed(message));
    return Promise.reject(message);
  }
};

// DELETE CATEGORYCARD
export const deleteCategoryCard = (id, adminID) => async (dispatch) => {
  try {
    dispatch(fetchCategoryCardsRequest());
    await axios.delete(`${BASE_URL}/categoryCards/${id}`, {
      data: { adminID },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    });
    dispatch(deleteCategoryCardSuccess(id));
    return Promise.resolve();
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch(categoryCardOperationFailed(message));
    return Promise.reject(message);
  }
};

// CLEAR ERROR
export const clearCategoryCardErrorAction = () => (dispatch) => {
  dispatch(clearError());
};