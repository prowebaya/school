import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getRequest, getDiscountsSuccess, getError, stuffDone } from './discountSlice';

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
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

export const fetchDiscounts = createAsyncThunk(
  'discounts/fetchDiscounts',
  async ({ adminID, searchQuery = '' }, { dispatch }) => {
    dispatch(getRequest());
    try {
      const queryParams = searchQuery ? `?searchQuery=${encodeURIComponent(searchQuery)}` : '';
      const response = await api.get(`/discounts/${adminID}${queryParams}`);
      dispatch(getDiscountsSuccess(response.data.data || []));
      dispatch(stuffDone());
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('Error fetching discounts:', errorMessage, error);
      dispatch(getError(errorMessage));
      dispatch(stuffDone());
      throw error;
    }
  }
);

export const createDiscount = createAsyncThunk(
  'discounts/createDiscount',
  async ({ adminID, discountData }, { dispatch }) => {
    dispatch(getRequest());
    try {
      console.log('Creating discount with payload:', { adminID, discountData });
      const response = await api.post(`/discounts/${adminID}`, discountData);
      dispatch(stuffDone());
      dispatch(fetchDiscounts({ adminID }));
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('Error creating discount:', errorMessage, error);
      dispatch(getError(errorMessage));
      throw error;
    }
  }
);

export const updateDiscount = createAsyncThunk(
  'discounts/updateDiscount',
  async ({ adminID, id, discountData }, { dispatch }) => {
    dispatch(getRequest());
    try {
      console.log('Updating discount with payload:', { adminID, id, discountData });
      const response = await api.put(`/discounts/${adminID}/${id}`, discountData);
      dispatch(stuffDone());
      dispatch(fetchDiscounts({ adminID }));
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('Error updating discount:', errorMessage, error);
      dispatch(getError(errorMessage));
      throw error;
    }
  }
);

export const deleteDiscount = createAsyncThunk(
  'discounts/deleteDiscount',
  async ({ adminID, id }, { dispatch }) => {
    dispatch(getRequest());
    try {
      console.log('Deleting discount with payload:', { adminID, id });
      await api.delete(`/discounts/${adminID}/${id}`);
      dispatch(stuffDone());
      dispatch(fetchDiscounts({ adminID }));
      return id;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('Error deleting discount:', errorMessage, error);
      dispatch(getError(errorMessage));
      throw error;
    }
  }
);