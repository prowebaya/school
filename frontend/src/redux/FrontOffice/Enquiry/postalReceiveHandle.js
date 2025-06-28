import axios from "axios";
import {
  getRequest,
  getSuccess,
  getError,
  stuffDone,
  clearError,
} from "./postalReceiveSlice";

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAllPostalReceives = (adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError("Admin ID is required"));
    return;
  }
  dispatch(getRequest());
  const url = `/postal-receives/${adminID}`;
  console.log("Request URL:", url, "with adminID:", adminID);
  try {
    const response = await api.get(url);
    console.log("Fetch postal receives response:", response.data);
    dispatch(getSuccess(response.data.data || []));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
    console.error("Error fetching postal receives:", {
      message: errorMessage,
      status: error.response?.status,
      response: error.response?.data,
      error: error.message,
    });
    dispatch(getError(errorMessage));
  }
};

export const createPostalReceive = (data, adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError("Admin ID is required"));
    return;
  }
  if (!data.fromTitle || !data.date) {
    dispatch(getError("From Title and Date are required"));
    return;
  }
  dispatch(getRequest());
  try {
    const formData = new FormData();
    formData.append("fromTitle", data.fromTitle);
    formData.append("referenceNo", data.referenceNo || '');
    formData.append("address", data.address || '');
    formData.append("note", data.note || '');
    formData.append("toTitle", data.toTitle || '');
    formData.append("date", data.date);
    formData.append("adminID", adminID);
    if (data.document) {
      formData.append("document", data.document);
    }

    console.log("Sending POST /postal-receive with data:", [...formData.entries()]);
    const response = await api.post("/postal-receive", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("Create postal receive response:", response.data);
    
    // Reload receives list from server
    dispatch(getAllPostalReceives(adminID));
    dispatch(stuffDone());
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
    console.error("Error creating postal receive:", {
      message: errorMessage,
      status: error.response?.status,
      response: error.response?.data,
      error: error.message,
      stack: error.stack,
    });
    dispatch(getError(errorMessage));
  }
};


// ... (rest of the file remains unchanged)
// Update an existing postal receive
export const updatePostalReceive = ({ id, receiveData, adminID }) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError("Admin ID is required"));
    return;
  }
  dispatch(getRequest());
  try {
    const formData = new FormData();
    formData.append("fromTitle", receiveData.fromTitle);
    formData.append("referenceNo", receiveData.referenceNo);
    formData.append("address", receiveData.address);
    formData.append("note", receiveData.note);
    formData.append("toTitle", receiveData.toTitle);
    formData.append("date", receiveData.date);
    formData.append("adminID", adminID);
    if (receiveData.document) {
      formData.append("document", receiveData.document);
    }

    console.log("Sending PUT /postal-receive:", formData);
    await api.put(`/postal-receive/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    dispatch(stuffDone());
    dispatch(getAllPostalReceives(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error response from server (update):", JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

// Delete a postal receive
export const deletePostalReceive = (id, adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError("Admin ID is required"));
    return;
  }
  dispatch(getRequest());
  try {
    console.log("Sending DELETE /postal-receive:", id, "with adminID:", adminID);
    await api.delete(`/postal-receive/${id}?adminID=${adminID}`);
    dispatch(stuffDone());
    dispatch(getAllPostalReceives(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error response from server (delete):", JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

// Clear error
export const clearPostalReceiveError = () => clearError();