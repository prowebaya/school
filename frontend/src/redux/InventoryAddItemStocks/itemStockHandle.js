// itemStockHandle.js
import axios from 'axios';
import {
  fetchItemStocksRequest,
  fetchItemStocksSuccess,
  fetchItemStocksFailed,
  getItemStockDetailsSuccess,
  addOrUpdateItemStockSuccess,
  deleteItemStockSuccess,
  itemStockOperationFailed,
  clearItemStockError
} from '../../redux/InventoryAddItemStocks/itemStockSlice.js';

const BASE_URL = process.env.REACT_APP_BASE_URL;

// GET ALL ITEM STOCKS
export const getAllItemStocks = (adminID) => async (dispatch) => {
  try {
    dispatch(fetchItemStocksRequest());
    const { data } = await axios.get(`${BASE_URL}/itemstocks?adminID=${adminID}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    dispatch(fetchItemStocksSuccess(data));
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch(fetchItemStocksFailed(message));
  }
};

// GET SINGLE ITEM STOCK DETAILS
export const getItemStockDetails = (id) => async (dispatch) => {
  dispatch(fetchItemStocksRequest());
  try {
    const { data } = await axios.get(`${BASE_URL}/itemstocks/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    dispatch(getItemStockDetailsSuccess(data));
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch(itemStockOperationFailed(message));
  }
};

// CREATE ITEM STOCK
export const createItemStock = (itemStockData) => async (dispatch) => {
  try {
    dispatch(fetchItemStocksRequest());
    const { data } = await axios.post(`${BASE_URL}/itemstocks`, itemStockData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    dispatch(addOrUpdateItemStockSuccess(data));
    return Promise.resolve();
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch(itemStockOperationFailed(message));
    return Promise.reject(message);
  }
};

// UPDATE ITEM STOCK
export const updateItemStock = (id, itemStockData) => async (dispatch) => {
  try {
    dispatch(fetchItemStocksRequest());
    const { data } = await axios.put(`${BASE_URL}/itemstocks/${id}`, itemStockData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    dispatch(addOrUpdateItemStockSuccess(data));
    return Promise.resolve();
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch(itemStockOperationFailed(message));
    return Promise.reject(message);
  }
};

// DELETE ITEM STOCK
export const deleteItemStock = (id, adminID) => async (dispatch) => {
  try {
    dispatch(fetchItemStocksRequest());
    await axios.delete(`${BASE_URL}/itemstocks/${id}`, {
      data: { adminID },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    dispatch(deleteItemStockSuccess(id));
    return Promise.resolve();
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch(itemStockOperationFailed(message));
    return Promise.reject(message);
  }
};

// CLEAR ERROR
export const clearItemStockErrorAction = () => (dispatch) => {
  dispatch(clearItemStockError());
};
