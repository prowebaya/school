import { createSlice } from '@reduxjs/toolkit';
import { fetchDiscounts, createDiscount, updateDiscount, deleteDiscount } from './discountActions';

const discountSlice = createSlice({
  name: 'discounts',
  initialState: {
    discounts: [],
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
    getDiscountsSuccess: (state, action) => {
      state.discounts = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
      state.error = null;
      state.status = 'succeeded';
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = 'failed';
      console.error('Error in discount slice:', action.payload);
    },
    stuffDone: (state) => {
      state.status = 'idle';
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiscounts.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = 'pending';
      })
      .addCase(fetchDiscounts.fulfilled, (state, action) => {
        state.discounts = Array.isArray(action.payload) ? action.payload : [];
        state.loading = false;
        state.error = null;
        state.status = 'succeeded';
      })
      .addCase(fetchDiscounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch discounts';
        state.status = 'failed';
        console.error('Error fetching discounts:', action.error.message);
      })
      .addCase(createDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = 'pending';
      })
      .addCase(createDiscount.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.status = 'succeeded';
      })
      .addCase(createDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create discount';
        state.status = 'failed';
        console.error('Error creating discount:', action.error.message);
      })
      .addCase(updateDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = 'pending';
      })
      .addCase(updateDiscount.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.status = 'succeeded';
      })
      .addCase(updateDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update discount';
        state.status = 'failed';
        console.error('Error updating discount:', action.error.message);
      })
      .addCase(deleteDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = 'pending';
      })
      .addCase(deleteDiscount.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.status = 'succeeded';
      })
      .addCase(deleteDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete discount';
        state.status = 'failed';
        console.error('Error deleting discount:', action.error.message);
      });
  },
});

export const { getRequest, getDiscountsSuccess, getError, stuffDone } = discountSlice.actions;
export default discountSlice.reducer;