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
} from './divisionSlice.js';

const BASE_URL = process.env.REACT_APP_BASE_URL;

// ✅ Get all Divisions by Admin ID
export const getAllDivisions = (adminID) => async (dispatch) => {
  dispatch(fetchRequest());
  try {
    const result = await axios.get(`${BASE_URL}/DivisionList?adminID=${adminID}`);
    if (result.data.message) {
      dispatch(fetchFailed(result.data.message));
    } else {
      dispatch(fetchSuccess(result.data));
    }
  } catch (error) {
    dispatch(fetchFailed(error.message));
  }
};

// ✅ Get Division details by ID
export const getDivisionDetails = (id) => async (dispatch) => {
  dispatch(fetchRequest());
  try {
    const result = await axios.get(`${BASE_URL}/Division/${id}`);
    if (result.data) {
      dispatch(getDetailsSuccess(result.data));
    }
  } catch (error) {
    dispatch(fetchFailed(error.message));
  }
};

// ✅ Create Division
export const createDivision = (data) => async (dispatch) => {
  dispatch(fetchRequest());
  try {
    /* const result = await axios.post(`${BASE_URL}/DivisionCreate`, data);
    if (result?.data?.message === 'Division already exists') {
      dispatch(operationFailed('Division name already exists'));
    } else {
      dispatch(addOrUpdateSuccess(result.data));
    } */
   const result = await axios.post(`${BASE_URL}/DivisionCreate`, data);
    dispatch(addOrUpdateSuccess(result.data)); // This updates state
  } catch (error) {
    dispatch(operationFailed(error.message));
  }
};

// ✅ Update Division
export const updateDivision = (id, data) => async (dispatch) => {
  dispatch(fetchRequest());
  try {
    const result = await axios.put(`${BASE_URL}/Divisions/${id}`, data);
    dispatch(addOrUpdateSuccess(result.data));
  } catch (error) {
    dispatch(operationFailed(error.message));
  }
};

// ✅ Delete Division with Admin ID
export const deleteDivision = (id, adminID) => async (dispatch) => {
  dispatch(fetchRequest());
  try {
    await axios.delete(`${BASE_URL}/Divisions/${id}`, { data: { adminID } });
    dispatch(deleteSuccess(id));
  } catch (error) {
    dispatch(operationFailed(error.message));
  }
};

// ✅ Clear Errors
export const clearDivisionError = () => (dispatch) => {
  dispatch(clearError());
};