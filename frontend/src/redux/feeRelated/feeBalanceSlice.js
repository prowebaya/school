import { createSlice } from '@reduxjs/toolkit';

const feeBalanceSlice = createSlice({
  name: 'feeBalances',
  initialState: {
    feeBalances: [],
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
    getFeeBalancesSuccess: (state, action) => {
      state.feeBalances = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
     state.error = null;
      state.status = 'succeeded';
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = 'failed';
      console.error('Error in fee balance slice:', action.payload);
    },
    stuffDone: (state) => {
      state.status = 'idle';
      state.loading = false;
    },
  },
});

export const { getRequest, getFeeBalancesSuccess, getError, stuffDone } = feeBalanceSlice.actions;
export default feeBalanceSlice.reducer;