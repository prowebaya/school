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
} from './subjectSlice.js';

// ✅ Get all Subjects
export const getAllSubjects = () => async (dispatch) => {
  dispatch(fetchRequest());
  try {
    const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/subjectList`);
    if (result.data.message) {
      dispatch(fetchFailed(result.data.message));
    } else {
      dispatch(fetchSuccess(result.data));
    }
  } catch (error) {
    dispatch(fetchFailed(error.message));
  }
};

// ✅ Get Subject details by ID
export const getSubjectDetails = (id) => async (dispatch) => {
  dispatch(fetchRequest());
  try {
    const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/subject/${id}`);
    if (result.data) {
      dispatch(getDetailsSuccess(result.data));
    }
  } catch (error) {
    dispatch(fetchFailed(error.message));
  }
};

// ✅ Create Subject
export const createSubject = (data) => async (dispatch) => {
  dispatch(fetchRequest());
  try {
    const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/subjectCreate`, data);
    if (result?.data?.message === 'Subject already exists') {
      dispatch(operationFailed('Subject already exists'));
    } else {
      dispatch(addOrUpdateSuccess(result.data));
    }
  } catch (error) {
    dispatch(operationFailed(error.message));
  }
};

// ✅ Update Subject
export const updateSubject = (id, data) => async (dispatch) => {
  dispatch(fetchRequest());
  try {
    const result = await axios.put(`${process.env.REACT_APP_BASE_URL}/subject/${id}`, data);
    dispatch(addOrUpdateSuccess(result.data));
  } catch (error) {
    dispatch(operationFailed(error.message));
  }
};

// ✅ Delete Subject
export const deleteSubject = (id) => async (dispatch) => {
  dispatch(fetchRequest());
  try {
    await axios.delete(`${process.env.REACT_APP_BASE_URL}/subject/${id}`);
    dispatch(deleteSuccess(id));
  } catch (error) {
    dispatch(operationFailed(error.message));
  }
};

// ✅ Clear Errors
export const clearSubjectError = () => (dispatch) => {
  dispatch(clearError());
};