import axios from "axios";
import {
  getRequest,
  getSuccess,
  getError,
  stuffDone,
} from "./complaintSlice";

// Create axios instance with default headers
const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL , // Fallback for development
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to include JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fetch all complaints for a specific admin
export const fetchComplaints = (adminID) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const response = await api.get(`/complaints/${adminID}`);
    dispatch(getSuccess(response.data.data || []));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error fetching complaints:", errorMessage, error.stack);
    dispatch(getError(errorMessage));
  }
};

// Add a new complaint
export const addComplaint = (data, adminID) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const payload = { ...data, adminID };
    await api.post("/complaint", payload);
    dispatch(stuffDone());
    dispatch(fetchComplaints(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error adding complaint:", errorMessage, error.stack);
    dispatch(getError(errorMessage));
  }
};

// Update an existing complaint
export const updateComplaint = (id, formData, adminID) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const payload = { ...formData, adminID };
    await api.put(`/complaint/${id}`, payload);
    dispatch(stuffDone());
    dispatch(fetchComplaints(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error updating complaint:", errorMessage, error.stack);
    dispatch(getError(errorMessage));
  }
};

// Delete a complaint
export const deleteComplaint = (id, adminID) => async (dispatch) => {
  dispatch(getRequest());
  try {
    await api.delete(`/complaint/${id}?adminID=${adminID}`);
    dispatch(stuffDone());
    dispatch(fetchComplaints(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error deleting complaint:", errorMessage, error.stack);
    dispatch(getError(errorMessage));
  }
};