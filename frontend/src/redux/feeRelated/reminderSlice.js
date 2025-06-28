import { createSlice } from '@reduxjs/toolkit';

// Debug export
console.log('Exporting actions from reminderSlice.js');

const reminderSlice = createSlice({
  name: 'reminders',
  initialState: {
    reminders: [],
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
    getRemindersSuccess: (state, action) => {
      state.reminders = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
      state.error = null;
      state.status = 'succeeded';
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = 'failed';
      console.error('Error in reminder slice:', action.payload);
    },
    stuffDone: (state) => {
      state.status = 'idle';
      state.loading = false;
    },
  },
});

export const { getRequest, getRemindersSuccess, getError, stuffDone } = reminderSlice.actions;
export default reminderSlice.reducer;