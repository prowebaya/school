// markGradeHandle.js
import axios from 'axios';
import {
  fetchMarkGradeDivisionsRequest,
  fetchMarkGradeDivisionsSuccess,
  fetchMarkGradeDivisionsFailure,
  getDivisionDetailsSuccess,
  addOrUpdateMarkGradeDivisionSuccess,
  deleteMarkGradeDivisionSuccess,
  deleteMarkGradeDivisionFailure,
  divisionOperationFailed,
  clearDivisionError
} from '../../redux/markGradeRelated/markGradeSlice.js';

const BASE_URL = process.env.REACT_APP_BASE_URL;

// GET ALL MARK GRADE DIVISIONS
export const getAllMarkGradeDivisions = (adminID) => async (dispatch) => {
  try {
    dispatch(fetchMarkGradeDivisionsRequest());
    const { data } = await axios.get(`${BASE_URL}/markgrade`, { // Changed to singular
      params: { adminID }
    });
    dispatch(fetchMarkGradeDivisionsSuccess(data));
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch(fetchMarkGradeDivisionsFailure(message));
  }
};

// GET SINGLE MARK GRADE DIVISION
export const getMarkGradeDivisionDetails = (id) => async (dispatch) => {
  try {
    dispatch(fetchMarkGradeDivisionsRequest());
    const { data } = await axios.get(`${BASE_URL}/markgrade/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    });
    dispatch(getDivisionDetailsSuccess(data));
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch(divisionOperationFailed(message));
  }
};

// CREATE MARK GRADE DIVISION
export const createMarkGradeDivision = (divisionData) => async (dispatch) => {
  try {
    dispatch(fetchMarkGradeDivisionsRequest());
    const { data } = await axios.post(`${BASE_URL}/markgrade`, divisionData) // Changed to singular
    dispatch(addOrUpdateMarkGradeDivisionSuccess(data));
  } catch (error) {
    // ... error handling
  }
}

// UPDATE MARK GRADE DIVISION
export const updateMarkGradeDivision = (id, divisionData) => async (dispatch) => {
  try {
    dispatch(fetchMarkGradeDivisionsRequest());
    const { data } = await axios.put(`${BASE_URL}/markgrade/${id}`, divisionData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    });
    dispatch(addOrUpdateMarkGradeDivisionSuccess(data));
    return Promise.resolve();
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch(divisionOperationFailed(message));
    return Promise.reject(message);
  }
};

// DELETE MARK GRADE DIVISION
export const deleteMarkGradeDivision = (id, adminID) => async (dispatch) => {
  try {
    await axios.delete(`${BASE_URL}/markgrade/${id}`, {
      params: { adminID } // Send as query params
    });
    dispatch(deleteMarkGradeDivisionSuccess(id));
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch(deleteMarkGradeDivisionFailure(message)); // Send only message
  }
};

// CLEAR ERROR
export const clearMarkGradeDivisionErrorAction = () => (dispatch) => {
  dispatch(clearDivisionError());
};
