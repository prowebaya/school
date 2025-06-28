import axios from 'axios';
import {
  getRequest,
  getSuccess,
  getFeeCollectionsSuccess,
  getOfflinePaymentsSuccess,
  getSearchPaymentsSuccess,
  getFeeGroupsSuccess,
  getFeeTypesSuccess,
  getFeesMastersSuccess,
  getDuesFeesSuccess,
  getDuesFeesOptionsSuccess,
  getQuickFeesOptionsSuccess,
  getError,
  stuffDone,
} from './studentAddmissionSlice';

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

export const fetchAdmissionForms = (adminID) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const response = await api.get(`/admissionForms/${adminID}`);
    dispatch(getSuccess(response.data.data || []));
    dispatch(stuffDone());
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error fetching admission hubs:', errorMessage, error);
    dispatch(getError(errorMessage));
    dispatch(stuffDone());
  }
};

export const addAdmissionForm = (data, adminID) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const payload = { ...data, adminID };
    await api.post('/admissionForm', payload);
    dispatch(stuffDone());
    dispatch(fetchAdmissionForms(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error adding admission hub:', errorMessage, error.stack);
    dispatch(getError(errorMessage));
  }
};

export const updateAdmissionForm = (id, formData, adminID) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const payload = { ...formData, adminID };
    await api.put(`/admissionForm/${id}`, payload);
    dispatch(stuffDone());
    dispatch(fetchAdmissionForms(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error updating admission hub:', errorMessage, error.stack);
    dispatch(getError(errorMessage));
  }
};

export const deleteAdmissionForm = (id, adminID) => async (dispatch) => {
  dispatch(getRequest());
  try {
    await api.delete(`/admissionForm/${id}?adminID=${adminID}`);
    dispatch(stuffDone());
    dispatch(fetchAdmissionForms(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error deleting admission hub:', errorMessage, error.stack);
    dispatch(getError(errorMessage));
  }
};

export const addFeeCollection = (data, adminID) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const payload = { ...data, adminID };
    await api.post('/fee-collection', payload);
    dispatch(stuffDone());
    dispatch(fetchAdmissionForms(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error adding fee collection:', errorMessage, error.stack);
    dispatch(getError(errorMessage));
  }
};

export const fetchFeeCollections = (adminID) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const response = await api.get(`/fee-collections/${adminID}`);
    dispatch(getFeeCollectionsSuccess(response.data.data || []));
    dispatch(stuffDone());
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error fetching fee collections:', errorMessage, error);
    dispatch(getError(errorMessage));
    dispatch(stuffDone());
  }
};

export const fetchOfflinePayments = (adminID) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const response = await api.get(`/offline-payments/${adminID}`);
    dispatch(getOfflinePaymentsSuccess(response.data.data || []));
    dispatch(stuffDone());
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error fetching offline payments:', errorMessage, error);
    dispatch(getError(errorMessage));
    dispatch(stuffDone());
  }
};

export const updateOfflinePayment = (requestId, data) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const payload = { ...data };
    await api.put(`/offline-payment/${requestId}`, payload);
    dispatch(stuffDone());
    dispatch(fetchOfflinePayments(payload.adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error updating offline payment:', errorMessage, error.stack);
    dispatch(getError(errorMessage));
  }
};

export const searchPayments = ({ paymentId, adminID }) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const response = await api.get(`/search-payments?paymentId=${encodeURIComponent(paymentId)}&adminID=${adminID}`);
    dispatch(getSearchPaymentsSuccess(response.data.data || []));
    dispatch(stuffDone());
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error searching payments:', errorMessage, error);
    dispatch(getError(errorMessage));
    dispatch(stuffDone());
  }
};

export const fetchFeeGroups = (adminID) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const response = await api.get(`/fee-groups/${adminID}`);
    dispatch(getFeeGroupsSuccess(response.data.data || []));
    dispatch(stuffDone());
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error fetching fee groups:', errorMessage, error);
    dispatch(getError(errorMessage));
    dispatch(stuffDone());
  }
};

export const addFeeGroup = (data) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const payload = { ...data };
    await api.post('/fee-group', payload);
    dispatch(stuffDone());
    dispatch(fetchFeeGroups(payload.adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error adding fee group:', errorMessage, error.stack);
    dispatch(getError(errorMessage));
  }
};

export const updateFeeGroup = (id, data) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const payload = { ...data };
    await api.put(`/fee-group/${id}`, payload);
    dispatch(stuffDone());
    dispatch(fetchFeeGroups(payload.adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error updating fee group:', errorMessage, error.stack);
    dispatch(getError(errorMessage));
  }
};

export const deleteFeeGroup = (id, adminID) => async (dispatch) => {
  dispatch(getRequest());
  try {
    await api.delete(`/fee-group/${id}?adminID=${adminID}`);
    dispatch(stuffDone());
    dispatch(fetchFeeGroups(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error deleting fee group:', errorMessage, error.stack);
    dispatch(getError(errorMessage));
  }
};

export const fetchFeeTypes = (adminID) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const response = await api.get(`/fee-types/${adminID}`);
    dispatch(getFeeTypesSuccess(response.data.data || []));
    dispatch(stuffDone());
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error fetching fee types:', errorMessage, error);
    dispatch(getError(errorMessage));
    dispatch(stuffDone());
  }
};

export const addFeeType = (data) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const payload = { ...data };
    await api.post('/fee-type', payload);
    dispatch(stuffDone());
    dispatch(fetchFeeTypes(payload.adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error adding fee type:', errorMessage, error.stack);
    dispatch(getError(errorMessage));
  }
};

export const updateFeeType = (id, data) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const payload = { ...data };
    await api.put(`/fee-type/${id}`, payload);
    dispatch(stuffDone());
    dispatch(fetchFeeTypes(payload.adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error updating fee type:', errorMessage, error.stack);
    dispatch(getError(errorMessage));
  }
};

export const deleteFeeType = (id, adminID) => async (dispatch) => {
  dispatch(getRequest());
  try {
    await api.delete(`/fee-type/${id}?adminID=${adminID}`);
    dispatch(stuffDone());
    dispatch(fetchFeeTypes(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error deleting fee type:', errorMessage, error.stack);
    dispatch(getError(errorMessage));
  }
};

export const fetchFeesMasters = (adminID) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const response = await api.get(`/fees-masters/${adminID}`);
    dispatch(getFeesMastersSuccess(response.data.data || []));
    dispatch(stuffDone());
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error fetching fees masters:', errorMessage, error);
    dispatch(getError(errorMessage));
    dispatch(stuffDone());
  }
};

export const addFeesMaster = (data) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const payload = { ...data };
    await api.post('/fees-master', payload);
    dispatch(stuffDone());
    dispatch(fetchFeesMasters(payload.adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error adding fees master:', errorMessage, error.stack);
    dispatch(getError(errorMessage));
  }
};

export const updateFeesMaster = (id, data) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const payload = { ...data };
    await api.put(`/fees-master/${id}`, payload);
    dispatch(stuffDone());
    dispatch(fetchFeesMasters(payload.adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error updating fees master:', errorMessage, error.stack);
    dispatch(getError(errorMessage));
  }
};

export const deleteFeesMaster = (id, adminID) => async (dispatch) => {
  dispatch(getRequest());
  try {
    await api.delete(`/fees-master/${id}?adminID=${adminID}`);
    dispatch(stuffDone());
    dispatch(fetchFeesMasters(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error deleting fees master:', errorMessage, error.stack);
    dispatch(getError(errorMessage));
  }
};

export const fetchDuesFees = (params) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const response = await api.get('/dues-fees', { params });
    dispatch(getDuesFeesSuccess(response.data.data || []));
    dispatch(stuffDone());
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error fetching dues fees:', errorMessage, error);
    dispatch(getError(errorMessage));
    dispatch(stuffDone());
  }
};

export const fetchDuesFeesOptions = (adminID) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const response = await api.get(`/dues-fees-options/${adminID}`);
    dispatch(getDuesFeesOptionsSuccess(response.data.data || {}));
    dispatch(stuffDone());
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error fetching dues fees options:', errorMessage, error);
    dispatch(getError(errorMessage));
    dispatch(stuffDone());
  }
};

export const generateInstallmentPlan = (data) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const payload = { ...data };
    console.log('Generating installment plan with payload:', payload);
    const response = await api.post('/quick-fees-master', payload);
    console.log('Response from quick-fees-master:', response.data);
    dispatch(stuffDone());
    return Promise.resolve(response.data);
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to generate installment plan';
    console.error('Error generating installment plan:', errorMessage, error.stack);
    dispatch(getError(errorMessage));
    return Promise.reject(errorMessage);
  }
};

export const fetchQuickFeesOptions = (adminID) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const response = await api.get(`/quick-fees-options/${adminID}`);
    dispatch(getQuickFeesOptionsSuccess(response.data.data || {}));
    dispatch(stuffDone());
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error fetching quick fees options:', errorMessage, error);
    dispatch(getError(errorMessage));
    dispatch(stuffDone());
  }
};