import axios from "axios";
import {
  getRequest,
  getSuccess,
  getError,
  stuffDone,
  clearError,
} from "./expenseHeadSlice";

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:5000",
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

export const getAllExpenseHeads = (adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError("Admin ID is required"));
    return;
  }
  dispatch(getRequest());
  const url = `/expense-heads/${adminID}`;
  console.log("Request URL:", url, "with adminID:", adminID);
  try {
    const response = await api.get(url);
    console.log("Fetch expense heads response:", response.data);
    dispatch(getSuccess(response.data.data || []));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error fetching expense heads:", errorMessage);
    dispatch(getError(errorMessage));
  }
};

export const createExpenseHead = (data, adminID) => async (dispatch, getState) => {
  if (!adminID) {
    dispatch(getError("Admin ID is required"));
    return;
  }
  if (!data.name || !data.description) {
    dispatch(getError("All required fields must be filled"));
    return;
  }
  dispatch(getRequest());
  try {
    const payload = { ...data, adminID };
    console.log("Sending POST /expense-head:", payload);
    const response = await api.post("/expense-head", payload);
    const currentExpenseHeads = getState().expenseHead.expenseHeadsList;
    dispatch(getSuccess([...currentExpenseHeads, response.data.data]));
    dispatch(stuffDone());
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error response from server (add):", JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

export const updateExpenseHead = ({ id, expenseHead, adminID }) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError("Admin ID is required"));
    return;
  }
  dispatch(getRequest());
  try {
    const payload = { ...expenseHead, adminID };
    console.log("Sending PUT /api/expense-head:", payload);
    await api.put(`/expense-head/${id}`, payload);
    dispatch(stuffDone());
    dispatch(getAllExpenseHeads(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error response from server (update):", JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

export const deleteExpenseHead = (id, adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError("Admin ID is required"));
    return;
  }
  dispatch(getRequest());
  try {
    console.log("Sending DELETE /api/expense-head:", id, "with adminID:", adminID);
    await api.delete(`/expense-head/${id}?adminID=${adminID}`);
    dispatch(stuffDone());
    dispatch(getAllExpenseHeads(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error response from server (delete):", JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

export const clearExpenseHeadError = () => clearError();