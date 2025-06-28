import { createSlice } from '@reduxjs/toolkit';

const incomeSlice = createSlice({
  name: 'income',
  initialState: {
    incomes: [],
    incomeHeads: [],
    expenses: [],
    expenseHeads: [],
    loading: false,
    error: null,
    status: 'idle',
  },
  reducers: {
    getRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.status = 'pending';
    },
    getSuccess: (state, action) => {
      state.incomes = action.payload;
      state.loading = false;
      state.error = null;
      state.status = 'success';
    },
    getHeadsSuccess: (state, action) => {
      state.incomeHeads = action.payload;
      state.loading = false;
      state.error = null;
      state.status = 'success';
    },
    getExpensesSuccess: (state, action) => {
      state.expenses = action.payload;
      state.loading = false;
      state.error = null;
      state.status = 'success';
    },
    getExpenseHeadsSuccess: (state, action) => {
      state.expenseHeads = action.payload;
      state.loading = false;
      state.error = null;
      state.status = 'success';
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = 'error';
    },
    stuffDone: (state) => {
      state.loading = false;
      state.status = 'done';
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  getRequest,
  getSuccess,
  getHeadsSuccess,
  getExpensesSuccess,
  getExpenseHeadsSuccess,
  getError,
  stuffDone,
  clearError,
} = incomeSlice.actions;
export default incomeSlice.reducer;