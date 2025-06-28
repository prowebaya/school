import axios from 'axios';
import {
  fetchSuppliersRequest,
  fetchSuppliersSuccess,
  fetchSuppliersFailed,
  addOrUpdateSupplierSuccess,
  getSupplierDetailsSuccess,
  deleteSupplierSuccess,
  supplierOperationFailed,
  clearError
} from '../../redux/supplierRelated/supplierSlice.js';

const BASE_URL = process.env.REACT_APP_BASE_URL;

// GET ALL SUPPLIERS
export const getAllSupplier = (adminID) => async (dispatch) => {
  try {
    dispatch(fetchSuppliersRequest());
    const { data } = await axios.get(`${BASE_URL}/suppliers?adminID=${adminID}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    });
    dispatch(fetchSuppliersSuccess(data));
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch(fetchSuppliersFailed(message));
  }
};


// GET SINGLE SUPPLIER DETAILS
export const getSupplierDetails = (id) => async (dispatch) => {
  dispatch(fetchSuppliersRequest());
  try {
    const { data } = await axios.get(`${BASE_URL}/suppliers/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    dispatch(getSupplierDetailsSuccess(data));
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch(supplierOperationFailed(message));
  }
};

// CREATE SUPPLIER
export const createSupplier = (supplierData) => async (dispatch) => {
  try {
    dispatch(fetchSuppliersRequest());
    const { data } = await axios.post(`${BASE_URL}/suppliers`, supplierData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    });
    dispatch(addOrUpdateSupplierSuccess(data));
    return Promise.resolve();
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch(supplierOperationFailed(message));
    return Promise.reject(message);
  }
};

// UPDATE SUPPLIER
export const updateSupplier = (id, supplierData) => async (dispatch) => {
  try {
    dispatch(fetchSuppliersRequest());
    const { data } = await axios.put(`${BASE_URL}/suppliers/${id}`, supplierData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    });
    dispatch(addOrUpdateSupplierSuccess(data));
    return Promise.resolve();
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch(supplierOperationFailed(message));
    return Promise.reject(message);
  }
};

// DELETE SUPPLIER
export const deleteSupplier = (id, adminID) => async (dispatch) => {
  try {
    dispatch(fetchSuppliersRequest());
    await axios.delete(`${BASE_URL}/suppliers/${id}`, {
      data: { adminID },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    });
    dispatch(deleteSupplierSuccess(id));
    return Promise.resolve();
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch(supplierOperationFailed(message));
    return Promise.reject(message);
  }
};

// CLEAR ERROR
export const clearSupplierError = () => (dispatch) => {
  dispatch(clearError());
};