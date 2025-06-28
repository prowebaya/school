// redux/Timetable/timetableSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  timetable: {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  },
  loading: false,
  error: null,
};

const api = axios.create({
  baseURL: 'http://localhost:5000', // Ensure this matches your backend port
  headers: { 'Content-Type': 'application/json' },
});

export const getTeacherTimetable = createAsyncThunk(
  'timetable/getTeacherTimetable',
  async ({ adminID, teacherId }, { rejectWithValue }) => {
    try {
      console.log(`Fetching timetable for adminID: ${adminID}, teacherId: ${teacherId}`);
      const response = await api.get(`/timetable/${adminID}/${teacherId}`);
      console.log('Timetable response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching timetable:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch timetable');
    }
  }
);

export const addAttendance = createAsyncThunk(
  'timetable/addAttendance',
  async ({ adminID, timetableId, date, status }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/timetable/attendance/${adminID}`, { timetableId, date, status });
      console.log('Attendance added:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error adding attendance:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to add attendance');
    }
  }
);

export const addTimetable = createAsyncThunk(
  'timetable/addTimetable',
  async ({ adminID, teacherId, className, section, subject, day, time, room }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post(`/timetable/${adminID}`, {
        teacherId,
        class: className,
        section,
        subject,
        day,
        time,
        room,
      });
      console.log('Timetable entry added:', response.data);
      dispatch(getTeacherTimetable({ adminID, teacherId }));
      return response.data.data;
    } catch (error) {
      console.error('Error adding timetable:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to add timetable');
    }
  }
);

const timetableSlice = createSlice({
  name: 'timetable',
  initialState,
  reducers: {
    clearTimetableError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTeacherTimetable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTeacherTimetable.fulfilled, (state, action) => {
        console.log('Timetable fetched:', action.payload);
        state.timetable = action.payload;
        state.loading = false;
      })
      .addCase(getTeacherTimetable.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(addAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAttendance.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addAttendance.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(addTimetable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTimetable.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addTimetable.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { clearTimetableError } = timetableSlice.actions;
export default timetableSlice.reducer;