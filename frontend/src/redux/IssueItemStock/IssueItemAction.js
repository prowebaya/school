// src/store/IssueItemRelated/IssueItemAction.js
import axios from 'axios';
import {
  getRequest,
  getSuccess,
  getError,
  stuffDone,
  clearError,
} from './IssueItemSlice';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAllIssueItems = (adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  const url = `/issue-items/${adminID}`;
  console.log('Request URL:', url, 'with adminID:', adminID);
  try {
    const response = await api.get(url);
    console.log('Fetch issue items response:', response.data);
    dispatch(getSuccess(response.data.data || []));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error fetching issue items:', errorMessage);
    dispatch(getError(errorMessage));
  }
};

export const createIssueItem = (data, adminID) => async (dispatch, getState) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  if (!data.item || !data.category || !data.issueDate || !data.issueTo || !data.issuedBy || !data.quantity) {
    dispatch(getError('All required fields must be filled'));
    return;
  }
  dispatch(getRequest());
  try {
    const payload = {
      item: data.item,
      category: data.category,
      issueDate: data.issueDate,
      issueTo: data.issueTo,
      issuedBy: data.issuedBy,
      quantity: parseInt(data.quantity),
      status: data.status || 'Issued',
      adminID,
    };

    console.log('Sending POST /issue-item:', payload);
    const response = await api.post('/issue-item', payload);
    console.log('Create issue item response:', response.data); // Add this for debugging
    const currentIssueItems = getState().issueItem.issueItemsList;
    dispatch(getSuccess([...currentIssueItems, response.data.data]));
    dispatch(stuffDone());
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error creating issue item:', {
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
    dispatch(getError(errorMessage));
  }
};

export const updateIssueItem = ({ id, issueItem, adminID }) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  try {
    const payload = {
      item: issueItem.item,
      category: issueItem.category,
      issueDate: issueItem.issueDate,
      issueTo: issueItem.issueTo,
      issuedBy: issueItem.issuedBy,
      quantity: parseInt(issueItem.quantity),
      status: issueItem.status,
      adminID,
    };

    console.log('Sending PUT /issue-item:', payload);
    await api.put(`/issue-item/${id}`, payload);
    dispatch(stuffDone());
    dispatch(getAllIssueItems(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error response from server (update):', JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

export const deleteIssueItem = (id, adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  try {
    console.log('Sending DELETE /issue-item:', id, 'with adminID:', adminID);
    await api.delete(`/issue-item/${id}?adminID=${adminID}`);
    dispatch(stuffDone());
    dispatch(getAllIssueItems(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error response from server (delete):', JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

export const clearIssueItemError = () => clearError();