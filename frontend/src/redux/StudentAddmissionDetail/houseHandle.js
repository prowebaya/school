import axios from 'axios';
import {
  fetchHousesRequest,
  fetchHousesSuccess,
  fetchHousesError,
  createHouseRequest,
  createHouseSuccess,
  createHouseError,
  deleteHouseRequest,
  deleteHouseSuccess,
  deleteHouseError,
} from './houseSlice';

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

export const fetchAllHouses = (adminID) => async (dispatch) => {
  dispatch(fetchHousesRequest());
  try {
    console.log(`Request URL: /houses/${adminID}`);
    const response = await api.get(`/houses/${adminID}`);
    console.log('Fetch houses response:', response.data);
    dispatch(fetchHousesSuccess(response.data.data || []));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error fetching houses:', errorMessage, error);
    dispatch(fetchHousesError(errorMessage));
  }
};

export const createHouse = (adminID, houseData) => async (dispatch) => {
  dispatch(createHouseRequest());
  try {
    console.log(`Request URL: /houses/${adminID}`, houseData);
    const response = await api.post(`/houses/${adminID}`, houseData);
    console.log('Create house response:', response.data);
    dispatch(createHouseSuccess(response.data.data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error creating house:', errorMessage, error);
    dispatch(createHouseError(errorMessage));
  }
};

export const deleteHouse = (adminID, houseId) => async (dispatch) => {
  dispatch(deleteHouseRequest());
  try {
    console.log(`Request URL: /houses/${adminID}/${houseId}`);
    const response = await api.delete(`/houses/${adminID}/${houseId}`);
    console.log('Delete house response:', response.data);
    dispatch(deleteHouseSuccess(houseId));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error deleting house:', errorMessage, error);
    dispatch(deleteHouseError(errorMessage));
  }
};