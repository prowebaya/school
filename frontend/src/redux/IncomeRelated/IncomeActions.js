import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  getRequest,
  getSuccess,
  getHeadsSuccess,
  getExpensesSuccess,
  getExpenseHeadsSuccess,
  getError,
  stuffDone,
  clearError,
} from './IncomeSlice';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchIncomes = createAsyncThunk(
  'income/fetchIncomes',
  async (adminID: string, { dispatch }) => {
    dispatch(getRequest());
    try {
      const response = await api.get(`/incomes/${adminID}`);
      dispatch(getSuccess(response.data.data));
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(getError(errorMessage));
      throw error;
    }
  }
);

export const searchIncomes = createAsyncThunk(
  'income/searchIncomes',
  async (
    { adminID, searchType, searchQuery }: { adminID: string; searchType: string; searchQuery: string },
    { dispatch }
  ) => {
    dispatch(getRequest());
    try {
      const response = await api.get(`/incomes/search/${adminID}`, {
        params: { searchType, searchQuery },
      });
      dispatch(getSuccess(response.data.data));
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(getError(errorMessage));
      throw error;
    }
  }
);

export const addIncome = createAsyncThunk(
  'income/addIncome',
  async ({ incomeData, adminID }: { incomeData: any; adminID: string }, { dispatch }) => {
    dispatch(getRequest());
    try {
      const response = await api.post('/income', { ...incomeData, adminID });
      dispatch(stuffDone());
      await dispatch(fetchIncomes(adminID)).unwrap();
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(getError(errorMessage));
      throw error;
    }
  }
);

export const updateIncome = createAsyncThunk(
  'income/updateIncome',
  async (
    { id, incomeData, adminID }: { id: string; incomeData: any; adminID: string },
    { dispatch }
  ) => {
    dispatch(getRequest());
    try {
      const response = await api.put(`/income/${id}`, { ...incomeData, adminID });
      dispatch(stuffDone());
      await dispatch(fetchIncomes(adminID)).unwrap();
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(getError(errorMessage));
      throw error;
    }
  }
);

export const deleteIncome = createAsyncThunk(
  'income/deleteIncome',
  async ({ id, adminID }: { id: string; adminID: string }, { dispatch }) => {
    dispatch(getRequest());
    try {
      await api.delete(`/income/${id}`, { data: { adminID } });
      dispatch(stuffDone());
      await dispatch(fetchIncomes(adminID)).unwrap();
      return { id };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(getError(errorMessage));
      throw error;
    }
  }
);

export const fetchIncomeHeads = createAsyncThunk(
  'income/fetchIncomeHeads',
  async (adminID: string, { dispatch }) => {
    dispatch(getRequest());
    try {
      const response = await api.get(`/income-heads/${adminID}`);
      dispatch(getHeadsSuccess(response.data.data));
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(getError(errorMessage));
      throw error;
    }
  }
);

export const addIncomeHead = createAsyncThunk(
  'income/addIncomeHead',
  async ({ headData, adminID }: { headData: { name: string; description: string }; adminID: string }, { dispatch }) => {
    dispatch(getRequest());
    try {
      const response = await api.post('/income-head', { ...headData, adminID });
      dispatch(stuffDone());
      await dispatch(fetchIncomeHeads(adminID)).unwrap();
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(getError(errorMessage));
      throw error;
    }
  }
);

export const updateIncomeHead = createAsyncThunk(
  'income/updateIncomeHead',
  async (
    { id, headData, adminID }: { id: string; headData: { name: string; description: string }; adminID: string },
    { dispatch }
  ) => {
    dispatch(getRequest());
    try {
      const response = await api.put(`/income-head/${id}`, { ...headData, adminID });
      dispatch(stuffDone());
      await dispatch(fetchIncomeHeads(adminID)).unwrap();
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(getError(errorMessage));
      throw error;
    }
  }
);

export const deleteIncomeHead = createAsyncThunk(
  'income/deleteIncomeHead',
  async ({ id, adminID }: { id: string; adminID: string }, { dispatch }) => {
    dispatch(getRequest());
    try {
      await api.delete(`/income-head/${id}`, { data: { adminID } });
      dispatch(stuffDone());
      await dispatch(fetchIncomeHeads(adminID)).unwrap();
      return { id };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(getError(errorMessage));
      throw error;
    }
  }
);

export const fetchExpenses = createAsyncThunk(
  'income/fetchExpenses',
  async (adminID: string, { dispatch }) => {
    dispatch(getRequest());
    try {
      const response = await api.get(`/expenses/${adminID}`);
      dispatch(getExpensesSuccess(response.data.data));
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(getError(errorMessage));
      throw error;
    }
  }
);

export const addExpense = createAsyncThunk(
  'income/addExpense',
  async ({ expenseData, adminID }: { expenseData: FormData; adminID: string }, { dispatch }) => {
    dispatch(getRequest());
    try {
      const response = await api.post('/expense', expenseData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      dispatch(stuffDone());
      await dispatch(fetchExpenses(adminID)).unwrap();
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(getError(errorMessage));
      throw error;
    }
  }
);

export const updateExpense = createAsyncThunk(
  'income/updateExpense',
  async (
    { id, expenseData, adminID }: { id: string; expenseData: FormData; adminID: string },
    { dispatch }
  ) => {
    dispatch(getRequest());
    try {
      const response = await api.put(`/expense/${id}`, expenseData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      dispatch(stuffDone());
      await dispatch(fetchExpenses(adminID)).unwrap();
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(getError(errorMessage));
      throw error;
    }
  }
);

export const deleteExpense = createAsyncThunk(
  'income/deleteExpense',
  async ({ id, adminID }: { id: string; adminID: string }, { dispatch }) => {
    dispatch(getRequest());
    try {
      await api.delete(`/expense/${id}`, { data: { adminID } });
      dispatch(stuffDone());
      await dispatch(fetchExpenses(adminID)).unwrap();
      return { id };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(getError(errorMessage));
      throw error;
    }
  }
);

export const fetchExpenseHeads = createAsyncThunk(
  'income/fetchExpenseHeads',
  async (adminID: string, { dispatch }) => {
    dispatch(getRequest());
    try {
      const response = await api.get(`/expense-heads/${adminID}`);
      dispatch(getExpenseHeadsSuccess(response.data.data));
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(getError(errorMessage));
      throw error;
    }
  }
);

export const addExpenseHead = createAsyncThunk(
  'income/addExpenseHead',
  async ({ headData, adminID }: { headData: { name: string; description: string }; adminID: string }, { dispatch }) => {
    dispatch(getRequest());
    try {
      const response = await api.post('/expense-head', { ...headData, adminID });
      dispatch(stuffDone());
      await dispatch(fetchExpenseHeads(adminID)).unwrap();
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(getError(errorMessage));
      throw error;
    }
  }
);

export const updateExpenseHead = createAsyncThunk(
  'income/updateExpenseHead',
  async (
    { id, headData, adminID }: { id: string; headData: { name: string; description: string }; adminID: string },
    { dispatch }
  ) => {
    dispatch(getRequest());
    try {
      const response = await api.put(`/expense-head/${id}`, { ...headData, adminID });
      dispatch(stuffDone());
      await dispatch(fetchExpenseHeads(adminID)).unwrap();
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(getError(errorMessage));
      throw error;
    }
  }
);


export const deleteExpenseHead = createAsyncThunk(
  'income/deleteExpenseHead',
  async ({ id, adminID }: { id: string; adminID: string }, { dispatch }) => {
    dispatch(getRequest());
    try {
      await api.delete(`/expense-head/${id}`, { data: { adminID } });
      dispatch(stuffDone());
      await dispatch(fetchExpenseHeads(adminID)).unwrap();
      return { id };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(getError(errorMessage));
      throw error;
    }
  }
);

export { clearError };