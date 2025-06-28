import axios from "axios";
import {
  getRequest,
  getSuccess,
  getError,
  stuffDone,
  clearError,
} from "./admissionEnquirySlice";

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

export const getAllAdmissionEnquiries = (adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError("Admin ID is required"));
    return;
  }
  dispatch(getRequest());
  const url = `/admission-enquiries/${adminID}`;
  console.log("Request URL:", url, "with adminID:", adminID);
  try {
    const response = await api.get(url);
    console.log("Fetch admission enquiries response:", response.data);
    dispatch(getSuccess(response.data.data || []));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Full error response:", JSON.stringify(error.response?.data, null, 2));
    console.error("Error fetching admission enquiries:", errorMessage);
    dispatch(getError(errorMessage));
  }
};

export const createAdmissionEnquiry = (data, adminID) => async (dispatch, getState) => {
  if (!adminID) {
    dispatch(getError("Admin ID is required"));
    return;
  }
  if (!data.name || !data.phone || !data.source || !data.className || !data.enquiryDate || !data.lastFollowUp || !data.nextFollowUp) {
    dispatch(getError("All fields are required"));
    return;
  }
  dispatch(getRequest());
  try {
    const payload = { ...data, adminID };
    console.log("Sending POST /admission-enquiry:", payload);
    const response = await api.post("/admission-enquiry", payload);
    const currentEnquiries = getState().admissionEnquiry.enquiriesList;
    dispatch(getSuccess([...currentEnquiries, response.data.data]));
    dispatch(stuffDone());
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error response from server (add):", JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

export const updateAdmissionEnquiry = ({ id, enquiry, adminID }) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError("Admin ID is required"));
    return;
  }
  dispatch(getRequest());
  try {
    const payload = { ...enquiry, adminID };
    console.log("Sending PUT /admission-enquiry:", payload);
    await api.put(`/admission-enquiry/${id}`, payload);
    dispatch(stuffDone());
    dispatch(getAllAdmissionEnquiries(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error response from server (update):", JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

export const deleteAdmissionEnquiry = (id, adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError("Admin ID is required"));
    return;
  }
  dispatch(getRequest());
  try {
    console.log("Sending DELETE /admission-enquiry:", id, "with adminID:", adminID);
    await api.delete(`/admission-enquiry/${id}?adminID=${adminID}`);
    dispatch(stuffDone());
    dispatch(getAllAdmissionEnquiries(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error response from server (delete):", JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

export const clearAdmissionEnquiryError = () => clearError();