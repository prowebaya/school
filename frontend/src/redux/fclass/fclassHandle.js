import axios from "axios";
import {
  getRequest,
  getSuccess,
  getError,
  stuffDone,
  clearError,
} from "./fclassSlice";

// Create axios instance with default headers
const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
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

// Fetch all classes for a specific admin
export const getAllFclasses = (adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError("Admin ID is required"));
    return;
  }
  dispatch(getRequest());
  const url = `/classes/${adminID}`;
  console.log("Request URL:", url, "with adminID:", adminID);
  try {
    const response = await api.get(url);
    console.log("Fetch classes response:", response.data);
    dispatch(getSuccess(response.data.data || []));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error fetching classes:", errorMessage, "Status:", error.response?.status);
    dispatch(getError(errorMessage));
  }
};

// Add a new class


export const createFclass = (data, adminID) => async (dispatch, getState) => {
  if (!adminID) {
    dispatch(getError("Admin ID is required"));
    return;
  }
  if (!data.name) {
    dispatch(getError("Class name is required"));
    return;
  }
  dispatch(getRequest());
  try {
    const payload = { ...data, adminID };
    console.log("Sending POST /class:", payload);
    const response = await api.post("/class", payload);
    const currentClasses = getState().fclass.fclassesList;
    dispatch(getSuccess([...currentClasses, response.data.data]));
    dispatch(stuffDone());
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error response from server (add):", JSON.stringify(error.response?.data, null, 2));
    console.error("Error message:", errorMessage);
    dispatch(getError(errorMessage));
  }
};

// Update an existing class
export const updateFclass = ({ id, fclass, adminID }) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError("Admin ID is required"));
    return;
  }
  dispatch(getRequest());
  try {
    const payload = { ...fclass, adminID };
    console.log("Sending PUT /class:", payload);
    await api.put(`/class/${id}`, payload);
    dispatch(stuffDone());
    dispatch(getAllFclasses(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error response from server (update):", JSON.stringify(error.response?.data, null, 2));
    console.error("Error message:", errorMessage);
    dispatch(getError(errorMessage));
  }
};

// Delete a class
export const deleteFclass = (id, adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError("Admin ID is required"));
    return;
  }
  dispatch(getRequest());
  try {
    console.log("Sending DELETE /class:", id, "with adminID:", adminID);
    await api.delete(`/class/${id}?adminID=${adminID}`);
    dispatch(stuffDone());
    dispatch(getAllFclasses(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error response from server (delete):", JSON.stringify(error.response?.data, null, 2));
    console.error("Error message:", errorMessage);
    dispatch(getError(errorMessage));
  }
};

// Clear error
export const clearFclassError = () => clearError();