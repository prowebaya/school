import { createSlice } from '@reduxjs/toolkit';

const houseSlice = createSlice({
  name: 'house',
  initialState: {
    houses: [],
    newHouse: { name: '', description: '', class: '' },
    search: '',
    loading: false,
    error: null,
    status: 'idle',
  },
  reducers: {
    fetchHousesRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.status = 'pending';
    },
    fetchHousesSuccess: (state, action) => {
      console.log('fetchHousesSuccess payload:', JSON.stringify(action.payload, null, 2));
      state.houses = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
      state.error = null;
      state.status = 'succeeded';
    },
    fetchHousesError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = 'failed';
      console.error('Error in house slice:', action.payload);
    },
    createHouseRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.status = 'pending';
    },
    createHouseSuccess: (state, action) => {
      state.houses.push(action.payload);
      state.newHouse = { name: '', description: '', class: '' };
      state.loading = false;
      state.error = null;
      state.status = 'succeeded';
    },
    createHouseError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = 'failed';
      console.error('Error in house slice:', action.payload);
    },
    deleteHouseRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.status = 'pending';
    },
    deleteHouseSuccess: (state, action) => {
      state.houses = state.houses.filter((house) => house._id !== action.payload);
      state.loading = false;
      state.error = null;
      state.status = 'succeeded';
    },
    deleteHouseError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = 'failed';
      console.error('Error in house slice:', action.payload);
    },
    setNewHouse: (state, action) => {
      state.newHouse = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    resetHouse: (state) => {
      state.houses = [];
      state.newHouse = { name: '', description: '', class: '' };
      state.search = '';
      state.loading = false;
      state.error = null;
      state.status = 'idle';
    },
  },
});

export const {
  fetchHousesRequest,
  fetchHousesSuccess,
  fetchHousesError,
  createHouseRequest,
  createHouseSuccess,
  createHouseError,
  deleteHouseRequest,
  deleteHouseSuccess,
  deleteHouseError,
  setNewHouse,
  setSearch,
  resetHouse,
} = houseSlice.actions;

export default houseSlice.reducer;