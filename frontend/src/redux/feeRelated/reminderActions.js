import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getRequest, getRemindersSuccess, getError, stuffDone } from './reminderSlice';

console.log('Exporting fetchReminders from reminderActions.js');

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

export const fetchReminders = createAsyncThunk(
  'reminders/fetchReminders',
  async ({ adminID }, { dispatch }) => {
    dispatch(getRequest());
    try {
      const response = await api.get(`/reminders/${adminID}`);
      console.log('fetchReminders response:', response.data);
      dispatch(getRemindersSuccess(response.data.data || []));
      dispatch(stuffDone());
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('Error fetching reminders:', errorMessage, error);
      dispatch(getError(errorMessage));
      dispatch(stuffDone());
      throw error;
    }
  }
);

export const updateReminders = createAsyncThunk(
  'reminders/updateReminders',
  async ({ adminID, reminders }, { dispatch }) => {
    dispatch(getRequest());
    try {
      console.log('Updating reminders with payload:', { adminID, reminders });
      const response = await api.put(`/reminders/${adminID}`, reminders);
      console.log('updateReminders response:', response.data);
      dispatch(stuffDone());
      dispatch(fetchReminders({ adminID }));
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('Error updating reminders:', errorMessage, error);
      dispatch(getError(errorMessage));
      throw error;
    }
  }
);