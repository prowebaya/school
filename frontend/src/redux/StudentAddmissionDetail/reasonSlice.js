import { createSlice } from '@reduxjs/toolkit';

const reasonSlice = createSlice({
  name: 'reason',
  initialState: {
    reasons: [],
    newReason: '',
    loading: false,
    error: null,
    status: 'idle',
  },
  reducers: {
    fetchReasonsRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.status = 'pending';
    },
    fetchReasonsSuccess: (state, action) => {
      console.log('fetchReasonsSuccess payload:', JSON.stringify(action.payload, null, 2));
      state.reasons = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
      state.error = null;
      state.status = 'succeeded';
    },
    fetchReasonsError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = 'failed';
      console.error('Error in reason slice:', action.payload);
    },
    createReasonRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.status = 'pending';
    },
    createReasonSuccess: (state, action) => {
      state.reasons.push(action.payload);
      state.newReason = '';
      state.loading = false;
      state.error = null;
      state.status = 'succeeded';
    },
    createReasonError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = 'failed';
      console.error('Error in reason slice:', action.payload);
    },
    updateReasonRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.status = 'pending';
    },
    updateReasonSuccess: (state, action) => {
      state.reasons = state.reasons.map((reason) =>
        reason._id === action.payload._id ? { ...action.payload, isEditing: false } : reason
      );
      state.loading = false;
      state.error = null;
      state.status = 'succeeded';
    },
    updateReasonError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = 'failed';
      console.error('Error in reason slice:', action.payload);
    },
    deleteReasonRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.status = 'pending';
    },
    deleteReasonSuccess: (state, action) => {
      state.reasons = state.reasons.filter((reason) => reason._id !== action.payload);
      state.loading = false;
      state.error = null;
      state.status = 'succeeded';
    },
    deleteReasonError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = 'failed';
      console.error('Error in reason slice:', action.payload);
    },
    setNewReason: (state, action) => {
      state.newReason = action.payload;
    },
    setEditReason: (state, action) => {
      state.reasons = state.reasons.map((reason) =>
        reason._id === action.payload.id ? { ...reason, text: action.payload.text } : reason
      );
    },
    toggleEditReason: (state, action) => {
      state.reasons = state.reasons.map((reason) =>
        reason._id === action.payload ? { ...reason, isEditing: !reason.isEditing } : reason
      );
    },
    resetReason: (state) => {
      state.reasons = [];
      state.newReason = '';
      state.loading = false;
      state.error = null;
      state.status = 'idle';
    },
  },
});

export const {
  fetchReasonsRequest,
  fetchReasonsSuccess,
  fetchReasonsError,
  createReasonRequest,
  createReasonSuccess,
  createReasonError,
  updateReasonRequest,
  updateReasonSuccess,
  updateReasonError,
  deleteReasonRequest,
  deleteReasonSuccess,
  deleteReasonError,
  setNewReason,
  setEditReason,
  toggleEditReason,
  resetReason,
} = reasonSlice.actions;

export default reasonSlice.reducer;