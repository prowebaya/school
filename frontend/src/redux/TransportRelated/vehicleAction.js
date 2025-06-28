import axios from "axios";
import {
  getRequest,
  getSuccess,
  getError,
  stuffDone,
  clearError,
} from "./vehicleSlice";

// Create axios instance with default headers
const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:5000",
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

// Fetch all vehicles for a specific admin
export const getAllVehicles = (adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError("Admin ID is required"));
    return;
  }
  dispatch(getRequest());
  const url = `/vehicles/${adminID}`;
  console.log("Request URL:", url, "with adminID:", adminID);
  try {
    const response = await api.get(url);
    console.log("Fetch vehicles response:", response.data);
    dispatch(getSuccess(response.data.data || []));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error fetching vehicles:", errorMessage, "Status:", error.response?.status);
    dispatch(getError(errorMessage));
  }
};

// Add a new vehicle
export const createVehicle = (data, adminID) => async (dispatch, getState) => {
  if (!adminID) {
    dispatch(getError("Admin ID is required"));
    return;
  }
  if (!data.number || !data.model || !data.year || !data.regNumber || !data.chassis || !data.capacity || !data.driver || !data.license || !data.contact) {
    dispatch(getError("All vehicle fields are required"));
    return;
  }
  dispatch(getRequest());
  try {
    const payload = { ...data, adminID };
    console.log("Sending POST /vehicle:", payload);
    const response = await api.post("/vehicle", payload);
    const currentVehicles = getState().vehicle.vehiclesList;
    dispatch(getSuccess([...currentVehicles, response.data.data]));
    dispatch(stuffDone());
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error response from server (add):", JSON.stringify(error.response?.data, null, 2));
    console.error("Error message:", errorMessage);
    dispatch(getError(errorMessage));
  }
};

// Update an existing vehicle
export const updateVehicle = ({ id, vehicle, adminID }) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError("Admin ID is required"));
    return;
  }
  dispatch(getRequest());
  try {
    const payload = { ...vehicle, adminID };
    console.log("Sending PUT /vehicle:", payload);
    await api.put(`/vehicle/${id}`, payload);
    dispatch(stuffDone());
    dispatch(getAllVehicles(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error response from server (update):", JSON.stringify(error.response?.data, null, 2));
    console.error("Error message:", errorMessage);
    dispatch(getError(errorMessage));
  }
};

// Delete a vehicle
export const deleteVehicle = (id, adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError("Admin ID is required"));
    return;
  }
  dispatch(getRequest());
  try {
    console.log("Sending DELETE /vehicle:", id, "with adminID:", adminID);
    await api.delete(`/vehicle/${id}?adminID=${adminID}`);
    dispatch(stuffDone());
    dispatch(getAllVehicles(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error response from server (delete):", JSON.stringify(error.response?.data, null, 2));
    console.error("Error message:", errorMessage);
    dispatch(getError(errorMessage));
  }
};

// Clear error
export const clearVehicleError = () => clearError();