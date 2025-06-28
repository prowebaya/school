import axios from "axios";
import {
  getRequest,
  getSuccess,
  getError,
  stuffDone,
  clearError,
} from "./postalDispatchSlice";

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

// Fetch all postal dispatches for a specific admin
export const getAllPostalDispatches = (adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError("Admin ID is required"));
    return;
  }
  dispatch(getRequest());
  const url = `/postal-dispatches/${adminID}`;
  console.log("Request URL:", url, "with adminID:", adminID);
  try {
    const response = await api.get(url);
    console.log("Fetch postal dispatches response:", response.data);
    dispatch(getSuccess(response.data.data || []));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error fetching postal dispatches:", errorMessage, "Status:", error.response?.status);
    dispatch(getError(errorMessage));
  }
};

// Add a new postal dispatch
export const createPostalDispatch = (data, adminID) => async (dispatch, getState) => {
  if (!adminID) {
    dispatch(getError("Admin ID is required"));
    return;
  }
  if (!data.toTitle || !data.referenceNo || !data.fromTitle || !data.date) {
    dispatch(getError("All fields except document are required"));
    return;
  }
  dispatch(getRequest());
  try {
    const formData = new FormData();
    formData.append("toTitle", data.toTitle);
    formData.append("referenceNo", data.referenceNo);
    formData.append("fromTitle", data.fromTitle);
    formData.append("date", data.date);
    formData.append("adminID", adminID);
    if (data.document) {
      formData.append("document", data.document);
    }

    console.log("Sending POST /postal-dispatch:", formData);
    const response = await api.post("/postal-dispatch", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const currentDispatches = getState().postalDispatch.dispatchesList;
    dispatch(getSuccess([...currentDispatches, response.data.data]));
    dispatch(stuffDone());
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error response from server (add):", JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

// Update an existing postal dispatch
export const updatePostalDispatch = ({ id, dispatchData, adminID }) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError("Admin ID is required"));
    return;
  }
  dispatch(getRequest());
  try {
    const formData = new FormData();
    formData.append("toTitle", dispatchData.toTitle);
    formData.append("referenceNo", dispatchData.referenceNo);
    formData.append("fromTitle", dispatchData.fromTitle);
    formData.append("date", dispatchData.date);
    formData.append("adminID", adminID);
    if (dispatchData.document) {
      formData.append("document", dispatchData.document);
    }

    console.log("Sending PUT /postal-dispatch:", formData);
    await api.put(`/postal-dispatch/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    dispatch(stuffDone());
    dispatch(getAllPostalDispatches(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error response from server (update):", JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

// Delete a postal dispatch
export const deletePostalDispatch = (id, adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError("Admin ID is required"));
    return;
  }
  dispatch(getRequest());
  try {
    console.log("Sending DELETE /postal-dispatch:", id, "with adminID:", adminID);
    await api.delete(`/postal-dispatch/${id}?adminID=${adminID}`);
    dispatch(stuffDone());
    dispatch(getAllPostalDispatches(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error response from server (delete):", JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

// Clear error
export const clearPostalDispatchError = () => clearError();