import axios from "axios";
import {
  getRequest,
  getSuccess,
  getError,
  stuffDone,
  clearError,
} from "./expenseSlice";

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "multipart/form-data", // Required for file uploads
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAllExpenses = (adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError("Admin ID is required"));
    return;
  }
  dispatch(getRequest());
  const url = `/expenses/${adminID}`;
  console.log("Request URL:", url, "with adminID:", adminID);
  try {
    const response = await api.get(url);
    console.log("Fetch expenses response:", response.data);
    dispatch(getSuccess(response.data.data || []));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error fetching expenses:", errorMessage);
    dispatch(getError(errorMessage));
  }
};

export const createExpense = (data, adminID) => async (dispatch, getState) => {
  if (!adminID) {
    dispatch(getError("Admin ID is required"));
    return;
  }
  if (!data.expenseHead || !data.name || !data.date || !data.amount) {
    dispatch(getError("All required fields must be filled"));
    return;
  }
  dispatch(getRequest());
  try {
    const formData = new FormData();
    formData.append("expenseHead", data.expenseHead);
    formData.append("name", data.name);
    formData.append("invoiceNumber", data.invoiceNumber);
    formData.append("date", data.date);
    formData.append("amount", data.amount);
    formData.append("description", data.description);
    formData.append("adminID", adminID);
    if (data.attachedFile) {
      formData.append("attachedFile", data.attachedFile);
    }

    console.log("Sending POST /expense:", formData);
    const response = await api.post("/expense", formData);
    const currentExpenses = getState().expense.expensesList;
    dispatch(getSuccess([...currentExpenses, response.data.data]));
    dispatch(stuffDone());
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error response from server (add):", JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

export const updateExpense = ({ id, expense, adminID }) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError("Admin ID is required"));
    return;
  }
  dispatch(getRequest());
  try {
    const formData = new FormData();
    formData.append("expenseHead", expense.expenseHead);
    formData.append("name", expense.name);
    formData.append("invoiceNumber", expense.invoiceNumber);
    formData.append("date", expense.date);
    formData.append("amount", expense.amount);
    formData.append("description", expense.description);
    formData.append("adminID", adminID);
    if (expense.attachedFile && typeof expense.attachedFile !== "string") {
      formData.append("attachedFile", expense.attachedFile);
    }

    console.log("Sending PUT /expense:", formData);
    await api.put(`/expense/${id}`, formData);
    dispatch(stuffDone());
    dispatch(getAllExpenses(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error response from server (update):", JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

export const deleteExpense = (id, adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError("Admin ID is required"));
    return;
  }
  dispatch(getRequest());
  try {
    console.log("Sending DELETE /expense:", id, "with adminID:", adminID);
    await api.delete(`/expense/${id}?adminID=${adminID}`);
    dispatch(stuffDone());
    dispatch(getAllExpenses(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error response from server (delete):", JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

export const clearExpenseError = () => clearError();