import axios from "axios";
import { getRequest, getSuccess, getError, stuffDone } from "../../expenseRelated/phoneSlice";

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

export const fetchCallLogs = (adminID) => async (dispatch) => {
  dispatch(getRequest());
  const url = `/phoneCallLogs/${adminID}`;
  console.log("Request URL:", url, "with adminID:", adminID);
  try {
    const response = await api.get(url);
    console.log("Fetch response:", response.data);
    dispatch(getSuccess(response.data.data || []));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error fetching phone call logs:", errorMessage, "Status:", error.response?.status);
    dispatch(getError(errorMessage));
  }
};

export const addCallLog = (data, adminID) => async (dispatch) => {
  dispatch(getRequest());
  try {
    console.log("Sending POST /phoneCallLog:", { ...data, adminID });
    const response = await api.post('/phoneCallLog', { ...data, adminID });
    console.log("Response from adding phone call log:", response.data);
    dispatch(stuffDone());
    dispatch(fetchCallLogs(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error response from server (add):", JSON.stringify(error.response?.data, null, 2));
    console.error("Error message:", errorMessage);
    dispatch(getError(errorMessage));
  }
};

export const updateCallLog = ({ id, log, adminID }) => async (dispatch) => {
  dispatch(getRequest());
  try {
    console.log("Sending PUT /phoneCallLog:", { ...log, adminID });
    await api.put(`/phoneCallLog/${id}`, { ...log, adminID });
    dispatch(stuffDone());
    dispatch(fetchCallLogs(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error response from server (update):", JSON.stringify(error.response?.data, null, 2));
    console.error("Error message:", errorMessage);
    dispatch(getError(errorMessage));
  }
};

export const deleteCallLog = (id, adminID) => async (dispatch) => {
  dispatch(getRequest());
  try {
    console.log("Sending DELETE /phoneCallLog:", id, "with adminID:", adminID);
    await api.delete(`/phoneCallLog/${id}?adminID=${adminID}`);
    dispatch(stuffDone());
    dispatch(fetchCallLogs(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error response from server (delete):", JSON.stringify(error.response?.data, null, 2));
    console.error("Error message:", errorMessage);
    dispatch(getError(errorMessage));
  }
};