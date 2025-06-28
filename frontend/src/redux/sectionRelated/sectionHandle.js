import axios from "axios";
import {
  getRequest,
  getSuccess,
  getError,
  stuffDone,
  clearError,
} from "./sectionSlice";

// Create axios instance with default headers
const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL ,
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

// Fetch all sections for a specific admin
export const getAllSections = (adminID) => async (dispatch) => {
  dispatch(getRequest());
  const url = `/sections/${adminID}`;
  console.log("Request URL:", url, "with adminID:", adminID);
  try {
    const response = await api.get(url);
    console.log("Fetch sections response:", response.data);
    dispatch(getSuccess(response.data.data || []));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error fetching sections:", errorMessage, "Status:", error.response?.status);
    dispatch(getError(errorMessage));
  }
};

// Add a new section
export const createSection = (data, adminID) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const payload = { ...data, adminID };
    console.log("Sending POST /section:", payload);
    await api.post("/section", payload);
    dispatch(stuffDone());
    dispatch(getAllSections(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error response from server (add):", JSON.stringify(error.response?.data, null, 2));
    console.error("Error message:", errorMessage);
    dispatch(getError(errorMessage));
  }
};

// Update an existing section
export const updateSection = (id, section, adminID) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const payload = { ...section, adminID };
    console.log("Sending PUT /section:", payload);
    await api.put(`/section/${id}`, payload);
    dispatch(stuffDone());
    dispatch(getAllSections(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error response from server (update):", JSON.stringify(error.response?.data, null, 2));
    console.error("Error message:", errorMessage);
    dispatch(getError(errorMessage));
  }
};

// Delete a section
export const deleteSection = (id, adminID) => async (dispatch) => {
  dispatch(getRequest());
  try {
    console.log("Sending DELETE /section:", id, "with adminID:", adminID);
    await api.delete(`/section/${id}?adminID=${adminID}`);
    dispatch(stuffDone());
    dispatch(getAllSections(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error response from server (delete):", JSON.stringify(error.response?.data, null, 2));
    console.error("Error message:", errorMessage);
    dispatch(getError(errorMessage));
  }
};

// Clear error
export const clearSectionError = () => clearError();