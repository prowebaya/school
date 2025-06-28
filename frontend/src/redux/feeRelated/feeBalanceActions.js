import axios from 'axios';
import { getRequest, getFeeBalancesSuccess, getError, stuffDone } from './feeBalanceSlice';

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

export const fetchFeeBalances = (adminID, filters = {}) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await api.get(`/fee-balances/${adminID}?${queryParams}`);
    dispatch(getFeeBalancesSuccess(response.data.data || []));
    dispatch(stuffDone());
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error fetching fee balances:', errorMessage, error);
    dispatch(getError(errorMessage));
    dispatch(stuffDone());
  }
};

export const updateFeeBalances = (adminID, balances) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const payload = { adminID, balances };
    await api.put('/fee-balances', payload);
    dispatch(stuffDone());
    dispatch(fetchFeeBalances(adminID)); // Refresh the list after update
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error updating fee balances:', errorMessage, error.stack);
    dispatch(getError(errorMessage));
  }
};